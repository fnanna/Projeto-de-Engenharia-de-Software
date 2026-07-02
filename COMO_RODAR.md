# Como rodar o projeto (Windows)

Este guia explica como instalar o Docker e subir a stack do projeto
(front-end + MySQL) no Windows, usando o Git Bash.

## 1. Instalar o Docker Desktop

Abra o **PowerShell como Administrador** e rode:

```bash
winget install Docker.DockerDesktop
```

Se preferir, baixe manualmente em:
https://www.docker.com/products/docker-desktop/

## 2. Instalar o WSL (obrigatório para o Docker no Windows)

Ainda no PowerShell como Administrador:

```bash
wsl --install
```

Depois disso, **reinicie o computador**.

## 3. Abrir o Docker Desktop

Procure "Docker Desktop" no menu Iniciar e abra.
Aceite os termos de uso se pedir.

Espere o status no canto inferior esquerdo mudar de
"Engine starting" para "Engine running" (ícone da baleia parado).

## 4. Verificar a instalação

Abra um **novo** terminal Git Bash e rode:

```bash
docker --version
docker compose version
```

Se aparecer o número da versão, está tudo certo.

## 5. Clonar o repositório

```bash
git clone https://github.com/fnanna/Projeto-de-Engenharia-de-Software.git
cd Projeto-de-Engenharia-de-Software
```

## 6. Subir a stack

```bash
docker compose up -d
```

Na primeira vez, o Docker vai baixar as imagens do Nginx e do MySQL
(pode levar alguns minutos).

## 7. Verificar se os containers estão rodando

```bash
docker compose ps
```

Você deve ver os containers `pes_frontend` e `pes_mysql` com status `Up`
(o `pes_mysql` deve mostrar `healthy` depois de alguns segundos).

## 8. Acessar o front-end

Abra no navegador:
http://localhost:8080

## 9. Acessar o banco de dados (opcional, para testes)

```bash
docker exec -it pes_mysql mysql -u pes_user -ppes_password pes_db -e "SHOW TABLES;"
```

## 10. Parar os containers

```bash
docker compose down
```

Para também apagar os dados do banco (reset completo):

```bash
docker compose down -v
```

## Credenciais do banco (ambiente de desenvolvimento)

| Campo    | Valor         |
|----------|---------------|
| Host     | localhost     |
| Porta    | 3306          |
| Banco    | pes_db        |
| Usuário  | pes_user      |
| Senha    | pes_password  |
| Root     | root / root_password |

> ⚠️ Essas credenciais são apenas para desenvolvimento local.
> Não usar em produção.

## Estrutura de pastas
.
├── docker-compose.yaml
├── frontend/          # HTML, CSS e JS do front-end
└── db/
└── init/           # Scripts .sql executados na primeira subida do MySQL

## Próximos passos

- Definir a stack de backend e adicionar o serviço correspondente
  no `docker-compose.yaml`.
- Adicionar um arquivo `.env` para não deixar credenciais fixas no compose.
