# Agentes de IA do projeto Gerência Azul Pitanga

Esta pasta define **subagentes do Claude Code**: assistentes de IA especializados, cada um com contexto, ferramentas e responsabilidades próprias, que o Claude Code aciona automaticamente (ou sob comando) conforme a tarefa pedida.

## Como usar

1. Instale o [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) e rode `claude` na raiz deste repositório.
2. Os agentes em `.claude/agents/` já são carregados automaticamente na sessão (reinicie o Claude Code se editar algum arquivo aqui).
3. Você pode deixar o Claude Code delegar sozinho ("crie a tela de listagem de projetos") ou chamar o agente explicitamente:
   - `Use o agente frontend-react para criar a tela de listagem de projetos`
   - `Use o agente backend-flask para criar o endpoint de cadastro de clientes`
   - `Use o agente database-sql para modelar a tabela de tarefas`
4. Para editar um agente interativamente, use o comando `/agents` dentro do Claude Code.

## Agentes disponíveis

| Agente | Responsabilidade | Pasta principal |
|---|---|---|
| `frontend-react` | Telas e componentes React que consomem a API Flask | `frontend/` |
| `backend-flask` | Rotas, regras de negócio e integração com o MySQL | `backend/` |
| `database-sql` | Modelagem, migrations e seed do banco MySQL | `db/init/` |

## Fluxo recomendado

Como as três camadas são interdependentes, a ordem sugerida para novas funcionalidades é:

1. **`database-sql`** define/ajusta as tabelas necessárias.
2. **`backend-flask`** implementa os endpoints sobre esse schema.
3. **`frontend-react`** consome os endpoints e monta a tela.

> Observação: o domínio de negócio (clientes, projetos arquitetônicos, tarefas, documentos) foi inferido a partir da descrição do projeto ("Gerência Azul Pitanga — gestão de processos de projetos arquitetônicos e necessidades internas do escritório"). Os links do Notion citados na documentação (participantes, informações do cliente, artefatos do projeto) não puderam ser acessados automaticamente por exigirem login. Recomendamos colar os requisitos relevantes desses documentos diretamente no chat ou em arquivos deste repositório para que os agentes refinem o modelo de dados e as regras de negócio com precisão.
