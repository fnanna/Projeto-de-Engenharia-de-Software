"""
Blueprint de Fases do Projeto.
Cobre: RF01 (andamento por fase); serve de base para RF13 (cronograma).
"""
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import FaseProjeto, Projeto
from app.constants import STATUS_FASE

fases_bp = Blueprint("fases", __name__, url_prefix="/fases")


@fases_bp.get("")
def listar_fases():
    db = SessionLocal()
    try:
        query = db.query(FaseProjeto)

        projeto_id = request.args.get("projeto_id", type=int)
        if projeto_id:
            query = query.filter(FaseProjeto.projeto_id == projeto_id)

        fases = query.order_by(FaseProjeto.projeto_id, FaseProjeto.ordem).all()
        return jsonify([f.to_dict() for f in fases])
    finally:
        db.close()


@fases_bp.post("")
def criar_fase():
    dados = request.get_json(silent=True) or {}

    if not dados.get("projeto_id") or not dados.get("nome"):
        return jsonify({"erro": "Campos obrigatórios: projeto_id, nome"}), 400

    status = dados.get("status", "nao_iniciada")
    if status not in STATUS_FASE:
        return jsonify({"erro": f"status inválido. Use um de: {sorted(STATUS_FASE)}"}), 400

    db = SessionLocal()
    try:
        projeto = db.get(Projeto, dados["projeto_id"])
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        fase = FaseProjeto(
            projeto_id=dados["projeto_id"],
            nome=dados["nome"],
            ordem=dados.get("ordem", 0),
            status=status,
            data_inicio_prevista=dados.get("data_inicio_prevista"),
            data_fim_prevista=dados.get("data_fim_prevista"),
        )
        db.add(fase)
        db.commit()
        db.refresh(fase)
        return jsonify(fase.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível criar a fase", "detalhe": str(e)}), 500
    finally:
        db.close()


@fases_bp.patch("/<int:fase_id>")
def atualizar_fase(fase_id):
    """Atualização de status/andamento da fase (RF01) — PATCH parcial."""
    dados = request.get_json(silent=True) or {}
    db = SessionLocal()
    try:
        fase = db.get(FaseProjeto, fase_id)
        if not fase:
            return jsonify({"erro": "Fase não encontrada"}), 404

        atualizado_em_recebido = dados.get("atualizado_em")
        if atualizado_em_recebido and fase.atualizado_em and \
                atualizado_em_recebido != fase.atualizado_em.isoformat():
            return jsonify({"erro": "Conflito: a fase foi modificada por outra pessoa"}), 409

        if "status" in dados and dados["status"] not in STATUS_FASE:
            return jsonify({"erro": f"status inválido. Use um de: {sorted(STATUS_FASE)}"}), 400

        campos_editaveis = [
            "nome", "ordem", "status",
            "data_inicio_prevista", "data_fim_prevista", "data_fim_real",
        ]
        for campo in campos_editaveis:
            if campo in dados:
                setattr(fase, campo, dados[campo])

        db.commit()
        db.refresh(fase)
        return jsonify(fase.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível atualizar a fase", "detalhe": str(e)}), 500
    finally:
        db.close()


@fases_bp.delete("/<int:fase_id>")
def excluir_fase(fase_id):
    db = SessionLocal()
    try:
        fase = db.get(FaseProjeto, fase_id)
        if not fase:
            return jsonify({"erro": "Fase não encontrada"}), 404
        db.delete(fase)
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível excluir a fase", "detalhe": str(e)}), 500
    finally:
        db.close()
