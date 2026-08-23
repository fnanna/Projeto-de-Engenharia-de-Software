"""
Blueprint de Projetos.
Cobre: RF01 (cadastro e acompanhamento de projetos com fases e andamento),
       RF06 (categorização por tipo).
"""
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import Projeto, FaseProjeto, Tarefa
from app.constants import TIPOS_PROJETO, STATUS_PROJETO

projetos_bp = Blueprint("projetos", __name__, url_prefix="/projetos")


def _calcular_andamento(fases):
    """Percentual simples de andamento com base em fases concluídas (RF01)."""
    if not fases:
        return 0
    concluidas = sum(1 for f in fases if f.status == "concluida")
    return round((concluidas / len(fases)) * 100)


@projetos_bp.get("")
def listar_projetos():
    db = SessionLocal()
    try:
        query = db.query(Projeto)

        status = request.args.get("status")
        if status:
            query = query.filter(Projeto.status == status)

        tipo = request.args.get("tipo")
        if tipo:
            query = query.filter(Projeto.tipo == tipo)

        # RNF05: paginação simples para evitar listagens grandes de uma vez
        page = max(int(request.args.get("page", 1)), 1)
        per_page = min(max(int(request.args.get("per_page", 20)), 1), 100)

        total = query.count()
        projetos = (
            query.order_by(Projeto.atualizado_em.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "items": [p.to_dict() for p in projetos],
        })
    finally:
        db.close()


@projetos_bp.post("")
def criar_projeto():
    dados = request.get_json(silent=True) or {}

    obrigatorios = ["cliente_id", "titulo", "tipo"]
    faltando = [campo for campo in obrigatorios if not dados.get(campo)]
    if faltando:
        return jsonify({"erro": f"Campos obrigatórios ausentes: {', '.join(faltando)}"}), 400

    if dados["tipo"] not in TIPOS_PROJETO:
        return jsonify({"erro": f"tipo inválido. Use um de: {sorted(TIPOS_PROJETO)}"}), 400

    status = dados.get("status", "orcamento")
    if status not in STATUS_PROJETO:
        return jsonify({"erro": f"status inválido. Use um de: {sorted(STATUS_PROJETO)}"}), 400

    db = SessionLocal()
    try:
        projeto = Projeto(
            cliente_id=dados["cliente_id"],
            responsavel_id=dados.get("responsavel_id"),
            titulo=dados["titulo"],
            tipo=dados["tipo"],
            descricao=dados.get("descricao"),
            status=status,
            data_inicio=dados.get("data_inicio"),
            data_prevista_entrega=dados.get("data_prevista_entrega"),
        )
        db.add(projeto)
        db.commit()
        db.refresh(projeto)
        return jsonify(projeto.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível criar o projeto", "detalhe": str(e)}), 500
    finally:
        db.close()


@projetos_bp.get("/<int:projeto_id>")
def obter_projeto(projeto_id):
    db = SessionLocal()
    try:
        projeto = db.get(Projeto, projeto_id)
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404
        return jsonify(projeto.to_dict())
    finally:
        db.close()


@projetos_bp.patch("/<int:projeto_id>")
def atualizar_projeto(projeto_id):
    dados = request.get_json(silent=True) or {}
    db = SessionLocal()
    try:
        projeto = db.get(Projeto, projeto_id)
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        # RNF06: detecção simples de conflito em edição concorrente
        atualizado_em_recebido = dados.get("atualizado_em")
        if atualizado_em_recebido and projeto.atualizado_em and \
                atualizado_em_recebido != projeto.atualizado_em.isoformat():
            return jsonify({"erro": "Conflito: o projeto foi modificado por outra pessoa"}), 409

        if "tipo" in dados and dados["tipo"] not in TIPOS_PROJETO:
            return jsonify({"erro": f"tipo inválido. Use um de: {sorted(TIPOS_PROJETO)}"}), 400
        if "status" in dados and dados["status"] not in STATUS_PROJETO:
            return jsonify({"erro": f"status inválido. Use um de: {sorted(STATUS_PROJETO)}"}), 400

        campos_editaveis = [
            "titulo", "tipo", "descricao", "status", "responsavel_id",
            "data_inicio", "data_prevista_entrega", "data_entrega",
        ]
        for campo in campos_editaveis:
            if campo in dados:
                setattr(projeto, campo, dados[campo])

        db.commit()
        db.refresh(projeto)
        return jsonify(projeto.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível atualizar o projeto", "detalhe": str(e)}), 500
    finally:
        db.close()


@projetos_bp.delete("/<int:projeto_id>")
def excluir_projeto(projeto_id):
    db = SessionLocal()
    try:
        projeto = db.get(Projeto, projeto_id)
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404
        db.delete(projeto)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível excluir o projeto", "detalhe": str(e)}), 500
    finally:
        db.close()


@projetos_bp.get("/<int:projeto_id>/visao")
def visao_projeto(projeto_id):
    """
    Endpoint 'visão do projeto' (RNF09): projeto + fases + tarefas (kanban)
    numa única chamada, para o frontend não precisar navegar entre rotas.
    """
    db = SessionLocal()
    try:
        projeto = db.get(Projeto, projeto_id)
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        fases = (
            db.query(FaseProjeto)
            .filter(FaseProjeto.projeto_id == projeto_id)
            .order_by(FaseProjeto.ordem)
            .all()
        )
        tarefas = (
            db.query(Tarefa)
            .filter(Tarefa.projeto_id == projeto_id)
            .order_by(Tarefa.ordem_kanban)
            .all()
        )

        kanban = {"a_fazer": [], "em_andamento": [], "em_revisao": [], "concluida": []}
        for t in tarefas:
            kanban.setdefault(t.status, []).append(t.to_dict())

        return jsonify({
            "projeto": projeto.to_dict(),
            "andamento_percentual": _calcular_andamento(fases),
            "fases": [f.to_dict() for f in fases],
            "kanban": kanban,
        })
    finally:
        db.close()