# Docker Setup - Urbana PE

Este projeto utiliza Docker e Docker Compose para orquestrar todos os serviços.

## Estrutura

- **db**: Banco de dados PostgreSQL
- **api**: API Spring Boot (porta 8080)
- **app**: Frontend Angular com Nginx (porta 80)
- **nginx**: Nginx principal fazendo proxy reverso (porta 8000)

## Pré-requisitos

- Docker
- Docker Compose

## Configuração

**⚠️ IMPORTANTE**: É obrigatório criar um arquivo `.env` na raiz do projeto antes de executar o docker-compose.

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

```bash
# Banco de Dados
DB_NAME=urbana_pe
DB_USERNAME=urbana_pe
DB_PASSWORD=sua_senha_segura_aqui

# API
API_PORT=8080
JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false
FLYWAY_ENABLED=true
JWT_SECRET=seu_jwt_secret_seguro_aqui

# Frontend
APP_PORT=80

# Nginx
NGINX_PORT=8000

# Banco de Dados
DB_PORT=5432
```

> **Nota**: Se alguma variável não estiver definida no `.env`, o docker-compose falhará ao iniciar. Todas as variáveis são obrigatórias.

## Uso

### Iniciar todos os serviços

```bash
docker-compose up -d
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f api
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f nginx
```

### Parar os serviços

```bash
docker-compose down
```

### Parar e remover volumes (limpar banco de dados)

```bash
docker-compose down -v
```

### Rebuild das imagens

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Acessos

- **Frontend**: http://localhost:8000
- **API**: http://localhost:8000/api (via nginx) ou http://localhost:8080 (direto)
- **Banco de Dados**: localhost:5432 (ou porta configurada no .env)

## Estrutura de Rede

O nginx principal (porta 8000) faz proxy reverso:
- `/api/*` → API Spring Boot (porta 8080)
- `/*` → Frontend Angular (porta 80 do container app)

## Troubleshooting

### Verificar se os containers estão rodando

```bash
docker-compose ps
```

### Acessar o container

```bash
docker-compose exec api sh
docker-compose exec app sh
docker-compose exec db psql -U urbana_pe -d urbana_pe
```

### Limpar tudo e recomeçar

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```
