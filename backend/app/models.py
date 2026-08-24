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
