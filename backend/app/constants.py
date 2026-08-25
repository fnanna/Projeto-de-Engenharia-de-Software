"""Valores válidos dos campos ENUM do schema (db/init/001_schema.sql)."""

TIPOS_PROJETO = {"residencial", "interiores", "comercial", "efemera"}
STATUS_PROJETO = {"orcamento", "em_andamento", "em_aprovacao", "concluido", "cancelado"}
STATUS_FASE = {"nao_iniciada", "em_andamento", "concluida"}
STATUS_TAREFA = {"a_fazer", "em_andamento", "em_revisao", "concluida"}
PRIORIDADE_TAREFA = {"baixa", "media", "alta"}
# Adicione esta linha ao app/constants.py (se TIPO_PESSOA_CLIENTE já existir lá, ignore este arquivo)
TIPO_PESSOA_CLIENTE = {"fisica", "juridica"}
