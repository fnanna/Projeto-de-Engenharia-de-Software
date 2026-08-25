"""
Blueprint de Reuniões e Atas.
Cobre: RF09 (registrar atas e informações de reuniões associadas a projetos).
"""
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import Reuniao, Projeto, Usuario

reunioes_bp = Blueprint("reunioes", __name__, url_prefix="/reunioes")


@reunioes_bp.get("")
def listar_reunioes():
    db = SessionLocal()
    try:
        query = db.query(Reuniao)
        projeto_id = request.args.get("projeto_id", type=int)
        if projeto_id:
            query = query.filter(Reuniao.projeto_id == projeto_id)
        reunioes = query.order_by(Reuniao.data_hora.desc()).all()
        return jsonify([r.to_dict() for r in reunioes])
    finally:
        db.close()


@reunioes_bp.post("")
def criar_reuniao():
    dados = request.get_json(silent=True) or {}

    obrigatorios = ["projeto_id", "titulo", "data_hora"]
    faltando = [c for c in obrigatorios if not dados.get(c)]
    if faltando:
        return jsonify({"erro": f"Campos obrigatórios ausentes: {', '.join(faltando)}"}), 400

    db = SessionLocal()
    try:
        projeto = db.get(Projeto, dados["projeto_id"])
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        reuniao = Reuniao(
            projeto_id=dados["projeto_id"],
            titulo=dados["titulo"],
            data_hora=dados["data_hora"],
            ata=dados.get("ata"),
            criado_por=dados.get("criado_por"),
        )

        participantes_ids = dados.get("participantes_ids", [])
        if participantes_ids:
            reuniao.participantes = (
                db.query(Usuario).filter(Usuario.id.in_(participantes_ids)).all()
            )

        db.add(reuniao)
        db.commit()
        db.refresh(reuniao)
        return jsonify(reuniao.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível criar a reunião", "detalhe": str(e)}), 500
    finally:
        db.close()


@reunioes_bp.get("/<int:reuniao_id>")
def obter_reuniao(reuniao_id):
    db = SessionLocal()
    try:
        reuniao = db.get(Reuniao, reuniao_id)
        if not reuniao:
            return jsonify({"erro": "Reunião não encontrada"}), 404
        return jsonify(reuniao.to_dict())
    finally:
        db.close()


@reunioes_bp.patch("/<int:reuniao_id>")
def atualizar_reuniao(reuniao_id):
    """Usado principalmente para editar a ata depois que a reunião acontece."""
    dados = request.get_json(silent=True) or {}
    db = SessionLocal()
    try:
        reuniao = db.get(Reuniao, reuniao_id)
        if not reuniao:
            return jsonify({"erro": "Reunião não encontrada"}), 404

        campos_editaveis = ["titulo", "data_hora", "ata"]
        for campo in campos_editaveis:
            if campo in dados:
                setattr(reuniao, campo, dados[campo])

        if "participantes_ids" in dados:
            reuniao.participantes = (
                db.query(Usuario).filter(Usuario.id.in_(dados["participantes_ids"])).all()
            )

        db.commit()
        db.refresh(reuniao)
        return jsonify(reuniao.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível atualizar a reunião", "detalhe": str(e)}), 500
    finally:
        db.close()


@reunioes_bp.delete("/<int:reuniao_id>")
def excluir_reuniao(reuniao_id):
    db = SessionLocal()
    try:
        reuniao = db.get(Reuniao, reuniao_id)
        if not reuniao:
            return jsonify({"erro": "Reunião não encontrada"}), 404
        db.delete(reuniao)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível excluir a reunião", "detalhe": str(e)}), 500
    finally:
        db.close()
