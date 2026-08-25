# Gerência Azul Pitanga

Sistema web de gestão de projetos para um escritório de arquitetura e interiores, desenvolvido para **substituir o Notion** como ferramenta de acompanhamento interno de projetos, fases, tarefas, horas trabalhadas, clientes, fornecedores, reuniões e cronograma.

O sistema é de **uso estritamente interno da equipe do escritório** — não existe portal ou login para o cliente final; clientes e fornecedores são apenas cadastros vinculados aos projetos.

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack tecnológica](#stack-tecnológica)
- [Arquitetura e estrutura de pastas](#arquitetura-e-estrutura-de-pastas)
- [Modelo de dados](#modelo-de-dados)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Rotas da API](#rotas-da-api)
- [Requisitos do sistema](#requisitos-do-sistema)
- [Agentes de IA do projeto](#agentes-de-ia-do-projeto)
- [Notas conhecidas](#notas-conhecidas)

## Funcionalidades

- **Gestão de projetos**: cadastro de projetos por tipo (residencial, interiores, comercial, efêmero), com cliente, responsável, status de ciclo de vida e cálculo automático de andamento a partir das fases.
- **Fases do projeto**: cada projeto é dividido em fases com status próprio (não iniciada, em andamento, concluída) e datas previstas/realizadas.
- **Kanban de tarefas**: tarefas com responsável, prioridade e prazo, organizadas nas colunas *Não iniciado → Em andamento → Em revisão → Concluído*, com visão integrada à página do projeto (sem navegação extra).
- **Controle de horas**: cronômetro por fase, com apontamento de início/fim e duração, para relatórios internos de horas por projeto.
- **Reuniões e atas**: registro de reuniões vinculadas a um projeto, com participantes e ata.
- **Clientes e fornecedores**: cadastro de dados e documentos de clientes, e de fornecedores por categoria vinculados a cada projeto.
- **Cronograma**: marcos do projeto com data prevista/realizada, associados ou não a uma fase.
- **Notificações**: lembretes de prazos de projeto, tarefa, reunião ou marco.

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | HTML, CSS e JavaScript puro, servido via Nginx |
| Backend | Python 3.11 + Flask 3, organizado em blueprints, servido via Gunicorn |
| ORM | SQLAlchemy 2 (+ PyMySQL como driver) |
| Banco de dados | MySQL 8.0 |
| Infraestrutura | Docker e Docker Compose |

## Arquitetura e estrutura de pastas

```
.
├── docker-compose.yaml       # orquestra frontend, backend e banco
├── .env.example               # variáveis de ambiente do banco/backend
├── frontend/                  # HTML, CSS e JS servidos via Nginx (porta 8080)
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── Dockerfile
├── backend/                   # API Flask (porta 8000)
│   ├── wsgi.py                 # cria a app Flask e registra os blueprints
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── database.py         # engine SQLAlchemy + sessão
│       ├── models.py           # modelos ORM
│       ├── constants.py        # valores válidos dos ENUMs do schema
│       ├── seed.py             # popula o banco com dados fictícios de demonstração
│       └── blueprints/
│           ├── projetos.py     # CRUD de projetos + visão consolidada
│           ├── fases.py        # CRUD de fases de projeto
│           └── tarefas.py      # CRUD de tarefas + kanban + reordenação
├── db/
│   └── init/
│       └── 001_schema.sql     # schema completo do MySQL (executado na 1ª subida)
├── docs/
│   └── REQUISITOS.md          # fonte única de verdade dos requisitos (RF/RNF)
├── .spec/agents/               # definição dos agentes de IA do projeto (Claude Code)
└── COMO_RODAR.md               # guia detalhado de instalação no Windows
```

O fluxo de dependência entre as camadas é: **banco de dados → backend → frontend**. O schema define a fonte de verdade dos dados; o backend expõe essa fonte via API REST; o frontend consome a API.

## Modelo de dados

Principais tabelas do schema (`db/init/001_schema.sql`), todas relacionadas por chave estrangeira:

- `usuarios` — equipe do escritório (uso estritamente interno)
- `clientes` — pessoa física ou jurídica, com dados e documentos
- `fornecedores` — contatos organizados por categoria
- `projetos` — projeto arquitetônico, vinculado a um cliente e a um responsável
- `projeto_fornecedores` — relação N:N entre projetos e fornecedores
- `fases_projeto` — fases de um projeto, com status e datas
- `marcos_cronograma` — marcos do cronograma, vinculados a um projeto e opcionalmente a uma fase
- `tarefas` — quadro kanban, vinculadas a projeto, fase e responsável
- `apontamentos_horas` — registros do cronômetro, vinculados a projeto/fase/tarefa/usuário
- `reunioes` e `reuniao_participantes` — atas e participantes
- `documentos` — arquivos vinculados a um projeto
- `notificacoes` — lembretes por usuário

## Como rodar o projeto

Pré-requisitos: **Docker** e **Docker Compose** instalados (veja o guia detalhado para Windows em [`COMO_RODAR.md`](./COMO_RODAR.md)).

```bash
# 1. Clonar o repositório
git clone https://github.com/fnanna/Projeto-de-Engenharia-de-Software.git
cd Projeto-de-Engenharia-de-Software

# 2. Subir a stack (frontend + backend + banco)
docker compose up -d

# 3. Verificar se os containers estão de pé
docker compose ps
```

Você deve ver os containers `pes_frontend`, `pes_backend` e `pes_mysql` com status `Up` (o `pes_mysql` fica `healthy` após alguns segundos).

Acesse:
- **Frontend:** http://localhost:8080
- **Backend (health check):** http://localhost:8000/ e http://localhost:8000/health/db

Para popular o banco com dados fictícios de demonstração (4 projetos, um de cada tipo):

```bash
docker exec -it pes_backend python -m app.seed
```

Para acessar o banco diretamente:

```bash
docker exec -it pes_mysql mysql -u pes_user -ppes_password pes_db -e "SHOW TABLES;"
```

Para parar os containers:

```bash
docker compose down       # mantém os dados
docker compose down -v    # apaga os dados do banco (reset completo)
```

### Credenciais do banco (ambiente de desenvolvimento)

| Campo | Valor |
|---|---|
| Host | localhost |
| Porta | 3307 (mapeada para 3306 no container) |
| Banco | pes_db |
| Usuário | pes_user |
| Senha | pes_password |
| Root | root / root_password |

> Essas credenciais são apenas para desenvolvimento local — não usar em produção.

## Rotas da API

Base URL local: `http://localhost:8000`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Health check simples do backend |
| GET | `/health/db` | Health check da conexão com o banco |
| GET | `/projetos` | Lista projetos |
| POST | `/projetos` | Cria projeto |
| GET | `/projetos/<id>` | Detalhe de um projeto |
| PATCH | `/projetos/<id>` | Atualiza projeto |
| DELETE | `/projetos/<id>` | Remove projeto |
| GET | `/projetos/<id>/visao` | Visão consolidada do projeto (fases + andamento) |
| GET | `/fases` | Lista fases (filtrável por projeto) |
| POST | `/fases` | Cria fase |
| PATCH | `/fases/<id>` | Atualiza fase |
| DELETE | `/fases/<id>` | Remove fase |
| GET | `/tarefas` | Lista tarefas (filtros: `projeto_id`, `status`, `responsavel_id`) |
| GET | `/tarefas/kanban` | Tarefas agrupadas por coluna do kanban |
| POST | `/tarefas` | Cria tarefa |
| PATCH | `/tarefas/<id>` | Atualiza tarefa (edição ágil) |
| PATCH | `/tarefas/reordenar` | Reordena tarefas no kanban |
| DELETE | `/tarefas/<id>` | Remove tarefa |

## Requisitos do sistema

O documento [`docs/REQUISITOS.md`](./docs/REQUISITOS.md) é a fonte única de verdade dos requisitos funcionais (RF01–RF13) e não funcionais (RNF01–RNF09) do sistema. Alguns pontos centrais:

- **RNF04**: uso estritamente interno — não há papel de "cliente" com login.
- **RNF06**: o backend e o schema toleram edições concorrentes (campo `atualizado_em` para detecção de conflitos).
- **RNF08**: o sistema deve permitir a migração total do fluxo atual do Notion.
- **RNF09**: kanban e resumo de horas devem aparecer integrados à página do projeto, sem troca de tela.

## Agentes de IA do projeto

O projeto foi desenvolvido com apoio de **subagentes do Claude Code** (`.spec/agents/`), cada um responsável por uma camada:

| Agente | Responsabilidade | Pasta principal |
|---|---|---|
| `database-sql` | Modelagem, migrations e seed do banco MySQL | `db/init/` |
| `backend-flask` | Rotas, regras de negócio e integração com o MySQL | `backend/` |
| `frontend-react` | Telas e componentes que consomem a API Flask | `frontend/` |

Fluxo recomendado para novas funcionalidades: `database-sql` → `backend-flask` → `frontend-react`, sempre consultando `docs/REQUISITOS.md` como referência.

## Notas conhecidas

- O `frontend/Dockerfile` está preparado para buildar uma aplicação **React** (`npm install && npm run build`), mas o frontend atual é **HTML/CSS/JS estático** (sem `package.json`). Esse ponto precisa ser alinhado antes de builds em produção — no ambiente de desenvolvimento local os arquivos estáticos já funcionam diretamente.
- O schema do banco (`001_schema.sql`) já contempla `clientes`, `fornecedores`, `apontamentos_horas`, `reunioes`, `documentos` e `notificacoes`, mas os blueprints do backend implementados até o momento cobrem apenas `projetos`, `fases` e `tarefas` — os demais módulos ainda precisam de endpoints REST.
