"""
Blueprint de Tarefas / Kanban.
Cobre: RF02 (atribuição de responsável), RF03 (visão kanban por status),
       RF04 (múltiplas tarefas simultâneas por usuário), RF05 (edição ágil via PATCH).
"""
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import Tarefa, Projeto
from app.constants import STATUS_TAREFA, PRIORIDADE_TAREFA

tarefas_bp = Blueprint("tarefas", __name__, url_prefix="/tarefas")


@tarefas_bp.get("")
def listar_tarefas():
    """
    Listagem geral de tarefas, com filtros por projeto_id, status e
    responsavel_id (RF04: múltiplas tarefas simultâneas por usuário).
    """
    db = SessionLocal()
    try:
        query = db.query(Tarefa)

        projeto_id = request.args.get("projeto_id", type=int)
        if projeto_id:
            query = query.filter(Tarefa.projeto_id == projeto_id)

        status = request.args.get("status")
        if status:
            query = query.filter(Tarefa.status == status)

        responsavel_id = request.args.get("responsavel_id", type=int)
        if responsavel_id:
            query = query.filter(Tarefa.responsavel_id == responsavel_id)

        tarefas = query.order_by(Tarefa.ordem_kanban).all()
        return jsonify([t.to_dict() for t in tarefas])
    finally:
        db.close()


@tarefas_bp.get("/kanban")
def kanban_por_projeto():
    """RF03: visão kanban das tarefas de um projeto, agrupada por status."""
    projeto_id = request.args.get("projeto_id", type=int)
    if not projeto_id:
        return jsonify({"erro": "Informe projeto_id"}), 400

    db = SessionLocal()
    try:
        tarefas = (
            db.query(Tarefa)
            .filter(Tarefa.projeto_id == projeto_id)
            .order_by(Tarefa.ordem_kanban)
            .all()
        )
        kanban = {s: [] for s in STATUS_TAREFA}
        for t in tarefas:
            kanban.setdefault(t.status, []).append(t.to_dict())
        return jsonify(kanban)
    finally:
        db.close()


@tarefas_bp.post("")
def criar_tarefa():
    dados = request.get_json(silent=True) or {}

    if not dados.get("projeto_id") or not dados.get("titulo"):
        return jsonify({"erro": "Campos obrigatórios: projeto_id, titulo"}), 400

    status = dados.get("status", "a_fazer")
    if status not in STATUS_TAREFA:
        return jsonify({"erro": f"status inválido. Use um de: {sorted(STATUS_TAREFA)}"}), 400

    prioridade = dados.get("prioridade", "media")
    if prioridade not in PRIORIDADE_TAREFA:
        return jsonify({"erro": f"prioridade inválida. Use um de: {sorted(PRIORIDADE_TAREFA)}"}), 400

    db = SessionLocal()
    try:
        projeto = db.get(Projeto, dados["projeto_id"])
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        tarefa = Tarefa(
            projeto_id=dados["projeto_id"],
            fase_id=dados.get("fase_id"),
            responsavel_id=dados.get("responsavel_id"),
            titulo=dados["titulo"],
            descricao=dados.get("descricao"),
            status=status,
            prioridade=prioridade,
            prazo=dados.get("prazo"),
            ordem_kanban=dados.get("ordem_kanban", 0),
        )
        db.add(tarefa)
        db.commit()
        db.refresh(tarefa)
        return jsonify(tarefa.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível criar a tarefa", "detalhe": str(e)}), 500
    finally:
        db.close()


@tarefas_bp.patch("/<int:tarefa_id>")
def atualizar_tarefa(tarefa_id):
    """RF05: edição ágil e parcial — usada tanto para editar campos quanto
    para mover o card entre colunas do kanban (mudando 'status')."""
    dados = request.get_json(silent=True) or {}
    db = SessionLocal()
    try:
        tarefa = db.get(Tarefa, tarefa_id)
        if not tarefa:
            return jsonify({"erro": "Tarefa não encontrada"}), 404

        atualizado_em_recebido = dados.get("atualizado_em")
        if atualizado_em_recebido and tarefa.atualizado_em and \
                atualizado_em_recebido != tarefa.atualizado_em.isoformat():
            return jsonify({"erro": "Conflito: a tarefa foi modificada por outra pessoa"}), 409

        if "status" in dados and dados["status"] not in STATUS_TAREFA:
            return jsonify({"erro": f"status inválido. Use um de: {sorted(STATUS_TAREFA)}"}), 400
        if "prioridade" in dados and dados["prioridade"] not in PRIORIDADE_TAREFA:
            return jsonify({"erro": f"prioridade inválida. Use um de: {sorted(PRIORIDADE_TAREFA)}"}), 400

        campos_editaveis = [
            "titulo", "descricao", "status", "prioridade", "prazo",
            "fase_id", "responsavel_id", "ordem_kanban",
        ]
        for campo in campos_editaveis:
            if campo in dados:
                setattr(tarefa, campo, dados[campo])

        db.commit()
        db.refresh(tarefa)
        return jsonify(tarefa.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível atualizar a tarefa", "detalhe": str(e)}), 500
    finally:
        db.close()


@tarefas_bp.patch("/reordenar")
def reordenar_tarefas():
    """
    Reordenação em lote para drag-and-drop do kanban.
    Espera: {"itens": [{"id": 1, "ordem_kanban": 0, "status": "em_andamento"}, ...]}
    """
    dados = request.get_json(silent=True) or {}
    itens = dados.get("itens", [])
    if not itens:
        return jsonify({"erro": "Envie 'itens' com ao menos um {id, ordem_kanban}"}), 400

    db = SessionLocal()
    try:
        for item in itens:
            tarefa = db.get(Tarefa, item.get("id"))
            if not tarefa:
                continue
            if "ordem_kanban" in item:
                tarefa.ordem_kanban = item["ordem_kanban"]
            if "status" in item and item["status"] in STATUS_TAREFA:
                tarefa.status = item["status"]
        db.commit()
        return jsonify({"atualizado": len(itens)})
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível reordenar as tarefas", "detalhe": str(e)}), 500
    finally:
        db.close()


@tarefas_bp.delete("/<int:tarefa_id>")
def excluir_tarefa(tarefa_id):
    db = SessionLocal()
    try:
        tarefa = db.get(Tarefa, tarefa_id)
        if not tarefa:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        db.delete(tarefa)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível excluir a tarefa", "detalhe": str(e)}), 500
    finally:
        db.close()