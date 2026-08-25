"""
Modelos SQLAlchemy — mapeiam as tabelas já criadas por db/init/001_schema.sql.
Não criam/alteram tabelas (o schema é a fonte de verdade); servem apenas
para leitura/escrita via ORM.
"""
from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime, TIMESTAMP, Boolean,
    ForeignKey, func
)
from sqlalchemy.orm import relationship
from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    nome = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    senha_hash = Column(String(255), nullable=False)
    cargo = Column(String(80))
    ativo = Column(Boolean, nullable=False, default=True)
    criado_em = Column(TIMESTAMP, server_default=func.now())
    atualizado_em = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True)
    nome = Column(String(150), nullable=False)
    tipo_pessoa = Column(String(20), nullable=False, default="fisica")
    cpf_cnpj = Column(String(20))
    email = Column(String(150))
    telefone = Column(String(30))
    endereco = Column(String(255))
    criado_em = Column(TIMESTAMP, server_default=func.now())
    atualizado_em = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    responsavel_id = Column(Integer, ForeignKey("usuarios.id"))
    titulo = Column(String(200), nullable=False)
    tipo = Column(String(20), nullable=False)  # residencial | interiores | comercial | efemera
    descricao = Column(Text)
    status = Column(String(20), nullable=False, default="orcamento")
    data_inicio = Column(Date)
    data_prevista_entrega = Column(Date)
    data_entrega = Column(Date)
    criado_em = Column(TIMESTAMP, server_default=func.now())
    atualizado_em = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    fases = relationship("FaseProjeto", back_populates="projeto", cascade="all, delete-orphan")
    tarefas = relationship("Tarefa", back_populates="projeto", cascade="all, delete-orphan")
    cliente = relationship("Cliente")
    responsavel = relationship("Usuario")

    def to_dict(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "responsavel_id": self.responsavel_id,
            "titulo": self.titulo,
            "tipo": self.tipo,
            "descricao": self.descricao,
            "status": self.status,
            "data_inicio": self.data_inicio.isoformat() if self.data_inicio else None,
            "data_prevista_entrega": self.data_prevista_entrega.isoformat() if self.data_prevista_entrega else None,
            "data_entrega": self.data_entrega.isoformat() if self.data_entrega else None,
            "atualizado_em": self.atualizado_em.isoformat() if self.atualizado_em else None,
        }


class FaseProjeto(Base):
    __tablename__ = "fases_projeto"

    id = Column(Integer, primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)
    nome = Column(String(120), nullable=False)
    ordem = Column(Integer, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="nao_iniciada")
    data_inicio_prevista = Column(Date)
    data_fim_prevista = Column(Date)
    data_fim_real = Column(Date)
    atualizado_em = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    projeto = relationship("Projeto", back_populates="fases")
    tarefas = relationship("Tarefa", back_populates="fase")

    def to_dict(self):
        return {
            "id": self.id,
            "projeto_id": self.projeto_id,
            "nome": self.nome,
            "ordem": self.ordem,
            "status": self.status,
            "data_inicio_prevista": self.data_inicio_prevista.isoformat() if self.data_inicio_prevista else None,
            "data_fim_prevista": self.data_fim_prevista.isoformat() if self.data_fim_prevista else None,
            "data_fim_real": self.data_fim_real.isoformat() if self.data_fim_real else None,
            "atualizado_em": self.atualizado_em.isoformat() if self.atualizado_em else None,
        }


class Tarefa(Base):
    __tablename__ = "tarefas"

    id = Column(Integer, primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)
    fase_id = Column(Integer, ForeignKey("fases_projeto.id"))
    responsavel_id = Column(Integer, ForeignKey("usuarios.id"))
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text)
    status = Column(String(20), nullable=False, default="a_fazer")
    # a_fazer | em_andamento | em_revisao | concluida
    prioridade = Column(String(10), nullable=False, default="media")
    prazo = Column(Date)
    ordem_kanban = Column(Integer, nullable=False, default=0)
    criado_em = Column(TIMESTAMP, server_default=func.now())
    atualizado_em = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    projeto = relationship("Projeto", back_populates="tarefas")
    fase = relationship("FaseProjeto", back_populates="tarefas")
    responsavel = relationship("Usuario")

    def to_dict(self):
        return {
            "id": self.id,
            "projeto_id": self.projeto_id,
            "fase_id": self.fase_id,
            "responsavel_id": self.responsavel_id,
            "titulo": self.titulo,
            "descricao": self.descricao,
            "status": self.status,
            "prioridade": self.prioridade,
            "prazo": self.prazo.isoformat() if self.prazo else None,
            "ordem_kanban": self.ordem_kanban,
            "atualizado_em": self.atualizado_em.isoformat() if self.atualizado_em else None,
        }
# ---------------------------------------------------------------------------
# COLE ESTE BLOCO NO FINAL DO app/models.py JÁ EXISTENTE (o da Iza).
# É 100% aditivo: não altera Usuario, Cliente, Projeto, FaseProjeto ou Tarefa.
# Cobre: RF07/RF08 (horas), RF09 (reuniões), RF11 (documentos), RF12 (fornecedores).
# ---------------------------------------------------------------------------
from sqlalchemy import Table

# --- Tabelas de associação N:N puras (sem colunas extras) ---

projeto_fornecedores = Table(
    "projeto_fornecedores",
    Base.metadata,
    Column("projeto_id", Integer, ForeignKey("projetos.id"), primary_key=True),
    Column("fornecedor_id", Integer, ForeignKey("fornecedores.id"), primary_key=True),
)

reuniao_participantes = Table(
    "reuniao_participantes",
    Base.metadata,
    Column("reuniao_id", Integer, ForeignKey("reunioes.id"), primary_key=True),
    Column("usuario_id", Integer, ForeignKey("usuarios.id"), primary_key=True),
)


class Fornecedor(Base):
    __tablename__ = "fornecedores"

    id = Column(Integer, primary_key=True)
    nome = Column(String(150), nullable=False)
    categoria = Column(String(100))
    contato_nome = Column(String(150))
    telefone = Column(String(30))
    email = Column(String(150))
    observacoes = Column(Text)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    # unidirecional: não exige alterar a classe Projeto
    projetos = relationship("Projeto", secondary=projeto_fornecedores)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "categoria": self.categoria,
            "contato_nome": self.contato_nome,
            "telefone": self.telefone,
            "email": self.email,
            "observacoes": self.observacoes,
        }


class Reuniao(Base):
    __tablename__ = "reunioes"

    id = Column(Integer, primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)
    titulo = Column(String(200), nullable=False)
    data_hora = Column(DateTime, nullable=False)
    ata = Column(Text)
    criado_por = Column(Integer, ForeignKey("usuarios.id"))
    criado_em = Column(TIMESTAMP, server_default=func.now())

    projeto = relationship("Projeto")
    criador = relationship("Usuario", foreign_keys=[criado_por])
    participantes = relationship("Usuario", secondary=reuniao_participantes)

    def to_dict(self, incluir_participantes=True):
        dados = {
            "id": self.id,
            "projeto_id": self.projeto_id,
            "titulo": self.titulo,
            "data_hora": self.data_hora.isoformat() if self.data_hora else None,
            "ata": self.ata,
            "criado_por": self.criado_por,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }
        if incluir_participantes:
            dados["participantes"] = [{"id": u.id, "nome": u.nome} for u in self.participantes]
        return dados


class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)
    nome_arquivo = Column(String(255), nullable=False)
    caminho_ou_url = Column(String(500), nullable=False)
    tipo = Column(String(80))
    enviado_por = Column(Integer, ForeignKey("usuarios.id"))
    criado_em = Column(TIMESTAMP, server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "projeto_id": self.projeto_id,
            "nome_arquivo": self.nome_arquivo,
            "caminho_ou_url": self.caminho_ou_url,
            "tipo": self.tipo,
            "enviado_por": self.enviado_por,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }


class ApontamentoHoras(Base):
    __tablename__ = "apontamentos_horas"

    id = Column(Integer, primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)
    fase_id = Column(Integer, ForeignKey("fases_projeto.id"))
    tarefa_id = Column(Integer, ForeignKey("tarefas.id"))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    inicio = Column(DateTime, nullable=False)
    fim = Column(DateTime)
    duracao_segundos = Column(Integer)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "projeto_id": self.projeto_id,
            "fase_id": self.fase_id,
            "tarefa_id": self.tarefa_id,
            "usuario_id": self.usuario_id,
            "inicio": self.inicio.isoformat() if self.inicio else None,
            "fim": self.fim.isoformat() if self.fim else None,
            "duracao_segundos": self.duracao_segundos,
            "em_andamento": self.fim is None,
        }
