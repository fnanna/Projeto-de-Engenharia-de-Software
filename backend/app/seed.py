"""
Popula o banco com dados fictícios para demonstração:
um projeto de cada tipo (residencial, interiores, comercial, efemera),
cada um com um cliente, um responsável, ao menos uma fase e uma tarefa.

Uso (dentro do container ou com DB_HOST=localhost local):
    python -m app.seed
"""
from datetime import date, timedelta

from app.database import SessionLocal, engine, Base
from app.models import Usuario, Cliente, Projeto, FaseProjeto, Tarefa

# Garante que as tabelas existem (não substitui o 001_schema.sql,
# só é inofensivo caso já existam — create_all ignora tabelas já criadas).
Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        if db.query(Projeto).count() > 0:
            print("Seed abortado: já existem projetos no banco.")
            return

        # --- usuários ---
        ana = Usuario(nome="Ana Souza", email="ana@atelie.com", senha_hash="dev", cargo="Arquiteta")
        mapu = Usuario(nome="Mapu", email="mapu@atelie.com", senha_hash="dev", cargo="Coordenador")
        db.add_all([ana, mapu])
        db.flush()  # garante IDs antes de usar como FK

        # --- clientes ---
        cliente_residencial = Cliente(nome="Fam. Ribeiro", tipo_pessoa="fisica", email="ribeiro@email.com")
        cliente_interiores = Cliente(nome="Joana Prado", tipo_pessoa="fisica", email="joana@email.com")
        cliente_comercial = Cliente(nome="Café Raiz Ltda", tipo_pessoa="juridica", email="contato@caferaiz.com")
        cliente_efemera = Cliente(nome="Feira de Design SP", tipo_pessoa="juridica", email="contato@feiradesign.com")
        db.add_all([cliente_residencial, cliente_interiores, cliente_comercial, cliente_efemera])
        db.flush()

        hoje = date.today()

        projetos_config = [
            {
                "titulo": "Residência Ribeiro",
                "tipo": "residencial",
                "cliente": cliente_residencial,
                "fase_nome": "Estudo preliminar",
                "tarefa_titulo": "Levantamento de medidas in loco",
            },
            {
                "titulo": "Apê Joana — Interiores",
                "tipo": "interiores",
                "cliente": cliente_interiores,
                "fase_nome": "Definição de conceito",
                "tarefa_titulo": "Moodboard de referências",
            },
            {
                "titulo": "Café Raiz — Loja Centro",
                "tipo": "comercial",
                "cliente": cliente_comercial,
                "fase_nome": "Projeto executivo",
                "tarefa_titulo": "Detalhar balcão e iluminação",
            },
            {
                "titulo": "Estande Feira de Design SP",
                "tipo": "efemera",
                "cliente": cliente_efemera,
                "fase_nome": "Montagem",
                "tarefa_titulo": "Especificar material do estande",
            },
        ]

        for i, cfg in enumerate(projetos_config):
            projeto = Projeto(
                cliente_id=cfg["cliente"].id,
                responsavel_id=ana.id,
                titulo=cfg["titulo"],
                tipo=cfg["tipo"],
                descricao=f"Projeto de demonstração ({cfg['tipo']}).",
                status="em_andamento",
                data_inicio=hoje - timedelta(days=10),
                data_prevista_entrega=hoje + timedelta(days=30),
            )
            db.add(projeto)
            db.flush()

            fase = FaseProjeto(
                projeto_id=projeto.id,
                nome=cfg["fase_nome"],
                ordem=1,
                status="em_andamento",
                data_inicio_prevista=hoje - timedelta(days=5),
                data_fim_prevista=hoje + timedelta(days=10),
            )
            db.add(fase)
            db.flush()

            tarefa = Tarefa(
                projeto_id=projeto.id,
                fase_id=fase.id,
                responsavel_id=mapu.id if i % 2 == 0 else ana.id,
                titulo=cfg["tarefa_titulo"],
                status="a_fazer",
                prioridade="media",
                prazo=hoje + timedelta(days=7),
                ordem_kanban=0,
            )
            db.add(tarefa)

        db.commit()
        print("Seed concluído: 4 projetos (um de cada tipo) criados com sucesso.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
