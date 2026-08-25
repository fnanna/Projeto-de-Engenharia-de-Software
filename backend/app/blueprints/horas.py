"""
Blueprint de Horas / Cronômetro.
Cobre: RF07 (registrar horas trabalhadas por fase com cronômetro integrado),
       RF08 (relatório de horas por projeto/fase para análise interna,
       não para precificação).
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.database import SessionLocal
from app.models import ApontamentoHoras, Projeto, FaseProjeto, Tarefa

horas_bp = Blueprint("horas", __name__, url_prefix="/horas")


@horas_bp.get("")
def listar_apontamentos():
    db = SessionLocal()
    try:
        query = db.query(ApontamentoHoras)

        projeto_id = request.args.get("projeto_id", type=int)
        if projeto_id:
            query = query.filter(ApontamentoHoras.projeto_id == projeto_id)

        fase_id = request.args.get("fase_id", type=int)
        if fase_id:
            query = query.filter(ApontamentoHoras.fase_id == fase_id)

        usuario_id = request.args.get("usuario_id", type=int)
        if usuario_id:
            query = query.filter(ApontamentoHoras.usuario_id == usuario_id)

        apontamentos = query.order_by(ApontamentoHoras.inicio.desc()).all()
        return jsonify([a.to_dict() for a in apontamentos])
    finally:
        db.close()


@horas_bp.get("/ativo")
def apontamento_ativo():
    """Verifica se o usuário já tem um cronômetro rodando (evita 2 timers simultâneos)."""
    usuario_id = request.args.get("usuario_id", type=int)
    if not usuario_id:
        return jsonify({"erro": "Informe usuario_id"}), 400

    db = SessionLocal()
    try:
        ativo = (
            db.query(ApontamentoHoras)
            .filter(ApontamentoHoras.usuario_id == usuario_id, ApontamentoHoras.fim.is_(None))
            .first()
        )
        return jsonify(ativo.to_dict() if ativo else None)
    finally:
        db.close()


@horas_bp.post("/iniciar")
def iniciar_cronometro():
    """RF07: inicia contagem de horas por fase/projeto."""
    dados = request.get_json(silent=True) or {}

    obrigatorios = ["projeto_id", "usuario_id"]
    faltando = [c for c in obrigatorios if not dados.get(c)]
    if faltando:
        return jsonify({"erro": f"Campos obrigatórios ausentes: {', '.join(faltando)}"}), 400

    db = SessionLocal()
    try:
        projeto = db.get(Projeto, dados["projeto_id"])
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        if dados.get("fase_id") and not db.get(FaseProjeto, dados["fase_id"]):
            return jsonify({"erro": "Fase não encontrada"}), 404

        if dados.get("tarefa_id") and not db.get(Tarefa, dados["tarefa_id"]):
            return jsonify({"erro": "Tarefa não encontrada"}), 404

        # Regra de negócio: um usuário não pode ter dois cronômetros abertos ao mesmo tempo
        aberto = (
            db.query(ApontamentoHoras)
            .filter(
                ApontamentoHoras.usuario_id == dados["usuario_id"],
                ApontamentoHoras.fim.is_(None),
            )
            .first()
        )
        if aberto:
            return jsonify({
                "erro": "Já existe um cronômetro em andamento para este usuário",
                "apontamento_ativo": aberto.to_dict(),
            }), 409

        apontamento = ApontamentoHoras(
            projeto_id=dados["projeto_id"],
            fase_id=dados.get("fase_id"),
            tarefa_id=dados.get("tarefa_id"),
            usuario_id=dados["usuario_id"],
            inicio=datetime.utcnow(),
        )
        db.add(apontamento)
        db.commit()
        db.refresh(apontamento)
        return jsonify(apontamento.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível iniciar o cronômetro", "detalhe": str(e)}), 500
    finally:
        db.close()


@horas_bp.post("/<int:apontamento_id>/parar")
def parar_cronometro(apontamento_id):
    """RF07: encerra a contagem e calcula a duração em segundos."""
    db = SessionLocal()
    try:
        apontamento = db.get(ApontamentoHoras, apontamento_id)
        if not apontamento:
            return jsonify({"erro": "Apontamento não encontrado"}), 404
        if apontamento.fim is not None:
            return jsonify({"erro": "Este cronômetro já foi encerrado"}), 400

        apontamento.fim = datetime.utcnow()
        apontamento.duracao_segundos = int((apontamento.fim - apontamento.inicio).total_seconds())
        db.commit()
        db.refresh(apontamento)
        return jsonify(apontamento.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"erro": "Não foi possível parar o cronômetro", "detalhe": str(e)}), 500
    finally:
        db.close()


@horas_bp.get("/relatorio")
def relatorio_horas():
    """
    RF08: relatório de horas agregado por projeto e por fase, para análise
    interna da equipe — não deve ser usado como base de precificação ao cliente.
    """
    projeto_id = request.args.get("projeto_id", type=int)
    if not projeto_id:
        return jsonify({"erro": "Informe projeto_id"}), 400

    db = SessionLocal()
    try:
        projeto = db.get(Projeto, projeto_id)
        if not projeto:
            return jsonify({"erro": "Projeto não encontrado"}), 404

        apontamentos = (
            db.query(ApontamentoHoras)
            .filter(ApontamentoHoras.projeto_id == projeto_id, ApontamentoHoras.fim.isnot(None))
            .all()
        )

        por_fase = {}
        total_segundos = 0
        for a in apontamentos:
            chave = a.fase_id or "sem_fase"
            por_fase[chave] = por_fase.get(chave, 0) + (a.duracao_segundos or 0)
            total_segundos += a.duracao_segundos or 0

        return jsonify({
            "projeto_id": projeto_id,
            "aviso": "Uso interno para análise de produtividade — não utilizar para precificação ao cliente.",
            "total_horas": round(total_segundos / 3600, 2),
            "por_fase": {
                str(fase_id): round(segundos / 3600, 2)
                for fase_id, segundos in por_fase.items()
            },
        })
    finally:
        db.close()
