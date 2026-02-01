# API Urbanape - Backend

API REST desenvolvida para o **Desafio Técnico da vaga FullStack da Urbanape PE**. Sistema de gerenciamento de usuários e cartões de ônibus com autenticação JWT e controle de permissões.

> 📖 **Documentação Completa**: Consulte o [README principal](../README.md) para visão geral do projeto completo.

## 📋 Sobre o Projeto

Esta API permite o cadastro e gerenciamento de usuários e seus cartões de ônibus, com funcionalidades de autenticação, autorização por roles (ADMIN/USER) e operações CRUD completas.

### Funcionalidades

- ✅ Autenticação JWT
- ✅ Controle de acesso por roles (ADMIN/USER)
- ✅ CRUD de Usuários
- ✅ CRUD de Cartões de Ônibus
- ✅ Geração automática de número de cartão com algoritmo Luhn
- ✅ Soft Delete (exclusão lógica)
- ✅ Paginação em todas as listagens
- ✅ Documentação Swagger/OpenAPI
- ✅ Migrações de banco com Flyway

## 🛠️ Tecnologias

- **Java 21**
- **Spring Boot 4.0.2**
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **PostgreSQL** - Banco de dados relacional
- **Flyway** - Migrações de banco de dados
- **JWT (Auth0)** - Tokens de autenticação
- **SpringDoc OpenAPI** - Documentação da API
- **Maven** - Gerenciamento de dependências

## 📦 Pré-requisitos

- Java 21 ou superior
- Maven 3.6+
- PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, VS Code) - opcional

## 🚀 Como Executar

### 1. Configurar o Banco de Dados

Crie o banco de dados PostgreSQL:

```sql
CREATE DATABASE urbana_pe;
CREATE USER urbana_pe WITH PASSWORD 'P7D5RYGWAT';
GRANT ALL PRIVILEGES ON DATABASE urbana_pe TO urbana_pe;
```

Ou execute o script `clean_database.sql` se precisar limpar o banco:

```bash
psql -U postgres -d urbana_pe -f clean_database.sql
```

### 2. Configurar a Aplicação

As configurações estão em `src/main/resources/application.properties`:

```properties
# Banco de dados
spring.datasource.url=jdbc:postgresql://localhost:5432/urbana_pe
spring.datasource.username=urbana_pe
spring.datasource.password=P7D5RYGWAT

# JWT Secret (recomendado alterar em produção)
api.security.token.secret=YZNZTUVZSGOLMKDAYFXLASRGZQVVGPEI
```

### 3. Executar a Aplicação

#### Opção 1: Maven Wrapper

```bash
./mvnw spring-boot:run
```

#### Opção 2: Maven

```bash
mvn spring-boot:run
```

#### Opção 3: IDE

Execute a classe `ApiUrbanapeApplication.java`

### 4. Acessar a Aplicação

- **API Base URL**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs (JSON)**: `http://localhost:8080/v3/api-docs`

### 5. Dados de Exemplo

A aplicação cria automaticamente usuários e cartões de exemplo na primeira execução para facilitar testes e demonstração:

**Credenciais de Acesso:**

- **Administrador:**
  - Email: `zeninguem@admin.urbanape.com`
  - Senha: `admin123`

- **Usuários (exemplos):**
  - Email: `joao@user.urbanape.com` / Senha: `user123@#`
  - Email: `maria@user.urbanape.com` / Senha: `user123@#`
  - Email: `pedro@user.urbanape.com` / Senha: `user123@#`
  - ... (e mais 25 usuários de exemplo)

Todos os usuários de exemplo recebem automaticamente 1-2 cartões aleatórios (Comum, Estudante ou Trabalhador) para demonstração.

> **Nota:** Estes dados são criados apenas para fins de demonstração do desafio técnico. Em produção, os dados devem ser criados através da API ou scripts de migração.

## 📁 Estrutura do Projeto

```
api-urbanape/
├── src/
│   ├── main/
│   │   ├── java/com/urbanape/api/
│   │   │   ├── domain/
│   │   │   │   ├── auth/          # Domínio de Autenticação
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── dtos/
│   │   │   │   │   └── services/
│   │   │   │   ├── cards/         # Domínio de Cartões
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── dtos/
│   │   │   │   │   ├── entities/
│   │   │   │   │   ├── repositories/
│   │   │   │   │   └── services/
│   │   │   │   └── users/         # Domínio de Usuários
│   │   │   │       ├── controllers/
│   │   │   │       ├── dtos/
│   │   │   │       ├── entities/
│   │   │   │       ├── exceptions/
│   │   │   │       ├── repositories/
│   │   │   │       └── services/
│   │   │   └── infra/             # Infraestrutura
│   │   │       ├── configuration/
│   │   │       ├── dtos/
│   │   │       └── exceptions/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── db/migration/      # Migrações Flyway
│   │       └── static/
│   └── test/
└── pom.xml
```

### Arquitetura

O projeto segue **Domain-Driven Design (DDD)** com separação por bounded contexts:

- **auth**: Autenticação e autorização
- **users**: Gerenciamento de usuários
- **cards**: Gerenciamento de cartões

Cada domínio possui suas próprias camadas (Controllers, Services, Repositories, Entities, DTOs), facilitando a futura separação em microserviços.

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

### Endpoints Públicos

- `POST /api/v1/auth/login` - Login
- `GET /swagger-ui/**` - Documentação Swagger

### Endpoints Protegidos

- **ADMIN**: Requer role `ADMIN`
- **USER**: Requer autenticação (qualquer role)

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|------------|
| POST | `/api/v1/auth/login` | Login e obtenção de token | Público |
| POST | `/api/v1/auth/register` | Registro de novo usuário | ADMIN |

### Usuários

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/v1/admin/users` | Listar todos os usuários (paginado) | ADMIN |
| GET | `/api/v1/admin/users/{id}` | Buscar usuário por ID | ADMIN |
| GET | `/api/v1/users/me` | Buscar usuário logado | USER |
| PATCH | `/api/v1/admin/users/{id}` | Atualizar usuário | ADMIN |
| DELETE | `/api/v1/admin/users` | Remover usuário(s) | ADMIN |

### Cartões

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/v1/admin/cards` | Listar todos os cartões (paginado) | ADMIN |
| GET | `/api/v1/admin/cards/{id}` | Buscar cartão por ID | ADMIN |
| GET | `/api/v1/cards/me` | Listar cartões do usuário logado | USER |
| GET | `/api/v1/cards/me/{id}` | Buscar cartão do usuário logado | USER |
| POST | `/api/v1/admin/cards` | Criar novo cartão | ADMIN |
| PATCH | `/api/v1/admin/cards/{id}` | Atualizar cartão (inclui ativar/inativar) | ADMIN |
| DELETE | `/api/v1/admin/cards` | Remover cartão(s) | ADMIN |

### Parâmetros de Paginação

Para endpoints que retornam listas, use os parâmetros:

- `page`: Número da página (inicia em 0)
- `size`: Tamanho da página (padrão: 20)
- `sort`: Ordenação (ex: `id,asc` ou `name,desc`)

Exemplo:
```
GET /api/v1/admin/users?page=0&size=10&sort=id,asc
```

## 🧪 Testes

Para executar os testes:

```bash
./mvnw test
```

## 📚 Documentação

### Swagger UI

Acesse a documentação interativa da API em:
```
http://localhost:8080/swagger-ui.html
```

### Postman Collection

Uma collection do Postman está disponível em:
```
src/main/resources/static/API_Urbanape.postman_collection.json
```

## 🔧 Configurações Avançadas

### Alterar Porta

Edite `application.properties`:

```properties
server.port=8081
```

### Logs SQL

Para ver as queries SQL executadas:

```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### CORS

O CORS está configurado para aceitar requisições de qualquer origem. Para produção, ajuste em `SecurityConfiguration.java`.

## 🏗️ Padrões de Design Implementados

- **Repository Pattern**: Abstração da camada de dados
- **Service Layer Pattern**: Lógica de negócio isolada
- **DTO Pattern**: Transferência de dados entre camadas
- **Filter Pattern**: Autenticação via JWT Filter
- **Exception Handler Pattern**: Tratamento global de exceções

## 📝 Migrações de Banco

As migrações são gerenciadas pelo Flyway e estão em `src/main/resources/db/migration/`:

- `V1__create_users_table.sql` - Criação da tabela de usuários
- `V2__create_cards_table.sql` - Criação da tabela de cartões
- `V3__create_card_number_sequence.sql` - Sequência para números de cartão

## 🔒 Segurança

- Senhas criptografadas com BCrypt
- Tokens JWT com expiração de 2 horas
- Validação de entrada com Bean Validation
- Soft Delete para preservar integridade dos dados
- Proteção contra SQL Injection (JPA)

## 🚀 Próximos Passos (Melhorias Futuras)

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar cache (Redis)
- [ ] Implementar rate limiting
- [ ] Adicionar logs estruturados
- [ ] Configurar CI/CD
- [ ] Separar em microserviços (estrutura já preparada)

## 📄 Licença

Este projeto foi desenvolvido para o Desafio Técnico da Urbanape PE.

## 👨‍💻 Desenvolvido por

Desenvolvido como parte do processo seletivo para a vaga FullStack da Urbanape PE.

---

**Nota**: Este projeto segue os requisitos do desafio técnico, incluindo estrutura preparada para microserviços, uso de DTOs, padrões de design, NativeQuery, Swagger, migrações com Flyway, e muito mais.
