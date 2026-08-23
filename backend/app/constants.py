"""Valores válidos dos campos ENUM do schema (db/init/001_schema.sql)."""

TIPOS_PROJETO = {"residencial", "interiores", "comercial", "efemera"}
STATUS_PROJETO = {"orcamento", "em_andamento", "em_aprovacao", "concluido", "cancelado"}
STATUS_FASE = {"nao_iniciada", "em_andamento", "concluida"}
STATUS_TAREFA = {"a_fazer", "em_andamento", "em_revisao", "concluida"}
PRIORIDADE_TAREFA = {"baixa", "media", "alta"}
