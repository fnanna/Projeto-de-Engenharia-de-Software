"""
Blueprint de Clientes e Documentos.
Cobre: RF11 (armazenar informações e documentos dos clientes vinculados
a cada projeto).
"""
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import Cliente, Documento, Projeto
from app.constants import TIPO_PESSOA_CLIENTE

clientes_bp = Blueprint("clientes", __name__, url_prefix="/clientes")
documentos_bp = Blueprint("documentos", __name__, url_prefix="/documentos")


def _cliente_to_dict(c):
    return {
        "id": c.id,
        "nome": c.nome,
        "tipo_pessoa": c.tipo_pessoa,
        "cpf_cnpj": c.cpf_cnpj,
        "email": c.email,
        "telefone": c.telefone,
        "endereco": c.endereco,
    }


# --- Clientes ---

@clientes_bp.get("")
def listar_clientes():
    db = SessionLocal()
    try:
        query = db.query(Cliente)
        busca = request.args.get("busca")
        if busca:
            query = query.filter(Cliente.nome.ilike(f"%{busca}%"))
        clientes = query.order_by(Cliente.nome).all()
        return jsonify([_cliente_to_dict(c) for c in clientes])
    finally:
        db.close()


@clientes_bp.post("")
def criar_cliente():
    dados = request.get_json(silent=True) or {}
    if not dados.get("nome"):
        return jsonify({"erro": "Campo obrigatório: nome"}), 400

    tipo_pessoa = dados.get("tipo_pessoa", "fisica")
    if tipo_pessoa not in TIPO_PESSOA_CLIENTE:
        return jsonify({"erro": f"tipo_pessoa inválido. Use um de: {sorted(TIPO_PESSOA_CLIENTE)}"}), 400

    db = SessionLocal()
    try:
        cliente = Cliente(
            nome=dados["nome"],
            tipo_pessoa=tipo_pessoa,
            cpf_cnpj=dados.get("cpf_cnpj"),
            email=dados.get("email"),
            telefone=dados.get("telefone"),
            endereco=dados.get("endereco"),
        )
        db.add(cliente)
        db.commit()
        db.refresh(cliente)
        return jsonify(_cliente_to_dict(cliente)), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível criar o cliente", "detalhe": str(e)}), 500
    finally:
        db.close()


@clientes_bp.get("/<int:cliente_id>")
def obter_cliente(cliente_id):
    db = SessionLocal()
    try:
        cliente = db.get(Cliente, cliente_id)
        if not cliente:
            return jsonify({"erro": "Cliente não encontrado"}), 404
        return jsonify(_cliente_to_dict(cliente))
    finally:
        db.close()


@clientes_bp.patch("/<int:cliente_id>")
def atualizar_cliente(cliente_id):
    dados = request.get_json(silent=True) or {}
    db = SessionLocal()
    try:
        cliente = db.get(Cliente, cliente_id)
        if not cliente:
            return jsonify({"erro": "Cliente não encontrado"}), 404

        if "tipo_pessoa" in dados and dados["tipo_pessoa"] not in TIPO_PESSOA_CLIENTE:
            return jsonify({"erro": f"tipo_pessoa inválido. Use um de: {sorted(TIPO_PESSOA_CLIENTE)}"}), 400

        campos_editaveis = ["nome", "tipo_pessoa", "cpf_cnpj", "email", "telefone", "endereco"]
        for campo in campos_editaveis:
            if campo in dados:
                setattr(cliente, campo, dados[campo])

        db.commit()
        db.refresh(cliente)
        return jsonify(_cliente_to_dict(cliente))
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível atualizar o cliente", "detalhe": str(e)}), 500
    finally:
        db.close()


@clientes_bp.delete("/<int:cliente_id>")
def excluir_cliente(cliente_id):
    db = SessionLocal()
    try:
        cliente = db.get(Cliente, cliente_id)
        if not cliente:
            return jsonify({"erro": "Cliente não encontrado"}), 404
        db.delete(cliente)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        # FK RESTRICT em projetos.cliente_id: cliente com projeto vinculado não pode ser excluído
        return jsonify({
            "erro": "Não foi possível excluir. Verifique se há projetos vinculados a este cliente.",
            "detalhe": str(e),
        }), 409
    finally:
        db.close()


# --- Documentos (vinculados a um projeto — RF11) ---

@documentos_bp.get("")
def listar_documentos():
    projeto_id = request.args.get("projeto_id", type=int)
    if not projeto_id:
        return jsonify({"erro": "Informe projeto_id"}), 400

    db = SessionLocal()
    try:
        documentos = (
            db.query(Documento)
            .filter(Documento.projeto_id == projeto_id)
            .order_by(Documento.criado_em.desc())
            .all()
        )
        return jsonify([d.to_dict() for d in documentos])
    finally:
        db.close()


@documentos_bp.post("")
def registrar_documento():
    """
    Registra a referência de um documento (nome + URL/caminho onde está
    armazenado, ex.: link da nuvem já usada pelo escritório) — RF11 não
    exige upload de arquivo binário aqui, apenas o vínculo com o projeto.
    """
    dados = request.get_json(silent=True) or {}
    obrigatorios = ["projeto_id", "nome_arquivo", "caminho_ou_url"]
    faltando = [c for c in obrigatorios if not dados.get(c)]
    if faltando:
        return jsonify({"erro": f"Campos obrigatórios ausentes: {', '.join(faltando)}"}), 400

    db = SessionLocal()
    try:
        projeto = db.get(Projeto, dados["projeto_id"])
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        documento = Documento(
            projeto_id=dados["projeto_id"],
            nome_arquivo=dados["nome_arquivo"],
            caminho_ou_url=dados["caminho_ou_url"],
            tipo=dados.get("tipo"),
            enviado_por=dados.get("enviado_por"),
        )
        db.add(documento)
        db.commit()
        db.refresh(documento)
        return jsonify(documento.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível registrar o documento", "detalhe": str(e)}), 500
    finally:
        db.close()


@documentos_bp.delete("/<int:documento_id>")
def excluir_documento(documento_id):
    db = SessionLocal()
    try:
        documento = db.get(Documento, documento_id)
        if not documento:
            return jsonify({"erro": "Documento não encontrado"}), 404
        db.delete(documento)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível excluir o documento", "detalhe": str(e)}), 500
    finally:
        db.close()
