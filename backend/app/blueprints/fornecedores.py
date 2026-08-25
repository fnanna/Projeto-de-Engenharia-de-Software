"""
Blueprint de Fornecedores.
Cobre: RF12 (manter cadastro de contatos de fornecedores organizados por projeto).
"""
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import Fornecedor, Projeto, projeto_fornecedores

fornecedores_bp = Blueprint("fornecedores", __name__, url_prefix="/fornecedores")


@fornecedores_bp.get("")
def listar_fornecedores():
    """Sem projeto_id: lista geral (com filtro opcional por categoria).
    Com projeto_id: só os fornecedores vinculados àquele projeto (RF12)."""
    db = SessionLocal()
    try:
        projeto_id = request.args.get("projeto_id", type=int)
        query = db.query(Fornecedor)

        if projeto_id:
            projeto = db.get(Projeto, projeto_id)
            if not projeto:
                return jsonify({"erro": "Projeto não encontrado"}), 404
            query = query.join(
                projeto_fornecedores,
                projeto_fornecedores.c.fornecedor_id == Fornecedor.id,
            ).filter(projeto_fornecedores.c.projeto_id == projeto_id)
        else:
            categoria = request.args.get("categoria")
            if categoria:
                query = query.filter(Fornecedor.categoria == categoria)

        fornecedores = query.order_by(Fornecedor.nome).all()
        return jsonify([f.to_dict() for f in fornecedores])
    finally:
        db.close()


@fornecedores_bp.post("")
def criar_fornecedor():
    dados = request.get_json(silent=True) or {}
    if not dados.get("nome"):
        return jsonify({"erro": "Campo obrigatório: nome"}), 400

    db = SessionLocal()
    try:
        fornecedor = Fornecedor(
            nome=dados["nome"],
            categoria=dados.get("categoria"),
            contato_nome=dados.get("contato_nome"),
            telefone=dados.get("telefone"),
            email=dados.get("email"),
            observacoes=dados.get("observacoes"),
        )
        db.add(fornecedor)
        db.commit()
        db.refresh(fornecedor)
        return jsonify(fornecedor.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível criar o fornecedor", "detalhe": str(e)}), 500
    finally:
        db.close()


@fornecedores_bp.get("/<int:fornecedor_id>")
def obter_fornecedor(fornecedor_id):
    db = SessionLocal()
    try:
        fornecedor = db.get(Fornecedor, fornecedor_id)
        if not fornecedor:
            return jsonify({"erro": "Fornecedor não encontrado"}), 404
        return jsonify(fornecedor.to_dict())
    finally:
        db.close()


@fornecedores_bp.patch("/<int:fornecedor_id>")
def atualizar_fornecedor(fornecedor_id):
    dados = request.get_json(silent=True) or {}
    db = SessionLocal()
    try:
        fornecedor = db.get(Fornecedor, fornecedor_id)
        if not fornecedor:
            return jsonify({"erro": "Fornecedor não encontrado"}), 404

        campos_editaveis = ["nome", "categoria", "contato_nome", "telefone", "email", "observacoes"]
        for campo in campos_editaveis:
            if campo in dados:
                setattr(fornecedor, campo, dados[campo])

        db.commit()
        db.refresh(fornecedor)
        return jsonify(fornecedor.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível atualizar o fornecedor", "detalhe": str(e)}), 500
    finally:
        db.close()


@fornecedores_bp.delete("/<int:fornecedor_id>")
def excluir_fornecedor(fornecedor_id):
    db = SessionLocal()
    try:
        fornecedor = db.get(Fornecedor, fornecedor_id)
        if not fornecedor:
            return jsonify({"erro": "Fornecedor não encontrado"}), 404
        db.delete(fornecedor)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível excluir o fornecedor", "detalhe": str(e)}), 500
    finally:
        db.close()


@fornecedores_bp.post("/<int:fornecedor_id>/projetos/<int:projeto_id>")
def vincular_projeto(fornecedor_id, projeto_id):
    """RF12: organiza fornecedores por projeto."""
    db = SessionLocal()
    try:
        fornecedor = db.get(Fornecedor, fornecedor_id)
        projeto = db.get(Projeto, projeto_id)
        if not fornecedor or not projeto:
            return jsonify({"erro": "Fornecedor ou projeto não encontrado"}), 404

        ja_vinculado = db.execute(
            projeto_fornecedores.select().where(
                projeto_fornecedores.c.fornecedor_id == fornecedor_id,
                projeto_fornecedores.c.projeto_id == projeto_id,
            )
        ).first()
        if ja_vinculado:
            return jsonify({"mensagem": "Fornecedor já vinculado a este projeto"}), 200

        db.execute(
            projeto_fornecedores.insert().values(
                fornecedor_id=fornecedor_id, projeto_id=projeto_id
            )
        )
        db.commit()
        return jsonify({"mensagem": "Fornecedor vinculado ao projeto"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível vincular", "detalhe": str(e)}), 500
    finally:
        db.close()


@fornecedores_bp.delete("/<int:fornecedor_id>/projetos/<int:projeto_id>")
def desvincular_projeto(fornecedor_id, projeto_id):
    db = SessionLocal()
    try:
        db.execute(
            projeto_fornecedores.delete().where(
                projeto_fornecedores.c.fornecedor_id == fornecedor_id,
                projeto_fornecedores.c.projeto_id == projeto_id,
            )
        )
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível desvincular", "detalhe": str(e)}), 500
    finally:
        db.close()
