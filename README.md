# 🚌 Sistema Urbana PE - Desafio Técnico FullStack

Sistema completo de gerenciamento de usuários e cartões de ônibus desenvolvido para o **Desafio Técnico da vaga FullStack da Urbanape PE**.

## 📋 Visão Geral

Este projeto é uma aplicação full-stack para gerenciamento de usuários e cartões de transporte público, desenvolvida com arquitetura escalável e código organizado.

### 🎯 Funcionalidades Principais

- ✅ **Autenticação JWT** com controle de acesso por roles (ADMIN/USER)
- ✅ **CRUD completo** de usuários e cartões
- ✅ **Geração automática** de números de cartão usando algoritmo Luhn
- ✅ **Soft Delete** para preservar integridade dos dados
- ✅ **Paginação** em todas as listagens
- ✅ **Interface responsiva** (mobile-first)
- ✅ **Documentação Swagger/OpenAPI** completa
- ✅ **Docker Compose** para orquestração completa
- ✅ **Migrações de banco** com Flyway

## 🏗️ Arquitetura do Projeto

O projeto é dividido em dois módulos principais:

```
desafio-tecnico-urbana-pe/
├── api-urbanape/          # Backend (Spring Boot)
├── app-urbanape/          # Frontend (Angular)
├── docker-compose.yml    # Orquestração Docker
├── nginx/                 # Configuração Nginx
└── README.md             # Este arquivo
```

### Backend (`api-urbanape/`)
- **Framework**: Spring Boot 4.0.2
- **Linguagem**: Java 21
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (Auth0)
- **Arquitetura**: Domain-Driven Design (DDD)
- **Documentação**: Swagger/OpenAPI

### Frontend (`app-urbanape/`)
- **Framework**: Angular 20.3.0
- **Linguagem**: TypeScript 5.9.2
- **Estilização**: Tailwind CSS 4.1.18
- **Estado**: RxJS
- **Design**: Responsivo e moderno

## 🚀 Início Rápido

### Opção 1: Docker Compose (Recomendado)

A forma mais fácil de executar todo o sistema:

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone <url-do-repositorio>
cd desafio-tecnico-urbana-pe

# 2. Configure as variáveis de ambiente (OBRIGATÓRIO)
cp .env.example .env
# Edite o .env com suas configurações

# 3. Execute com Docker Compose
docker-compose up -d

# 4. Acesse a aplicação
# Frontend: http://localhost:8000
# API: http://localhost:8000/api
# Swagger: http://localhost:8080/swagger-ui.html
```

> **⚠️ IMPORTANTE**: O arquivo `.env` é obrigatório. O docker-compose não funcionará sem ele. Todas as variáveis devem estar definidas.

Para mais detalhes sobre Docker, consulte [DOCKER.md](./DOCKER.md).

### Opção 2: Execução Manual

#### Pré-requisitos
- Java 21+
- Node.js 18+ (recomendado 20+)
- PostgreSQL 12+
- Maven 3.6+

#### Passo a Passo

1. **Configurar o Banco de Dados**

```sql
CREATE DATABASE urbana_pe;
CREATE USER urbana_pe WITH PASSWORD 'P7D5RYGWAT';
GRANT ALL PRIVILEGES ON DATABASE urbana_pe TO urbana_pe;
```

2. **Configurar e Executar a API**

```bash
cd api-urbanape

# Configurar variáveis de ambiente (ou usar application.properties)
# Criar arquivo .env ou configurar application.properties

# Executar
./mvnw spring-boot:run
# ou
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

3. **Configurar e Executar o Frontend**

```bash
cd app-urbanape

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start
# ou
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

## 🔐 Credenciais de Acesso

A aplicação cria automaticamente usuários de exemplo na primeira execução:

### Administrador
- **Email**: `zeninguem@admin.urbanape.com`
- **Senha**: `admin123`
- **Permissões**: Acesso completo ao sistema

### Usuários Comuns
- **Email**: `joao@user.urbanape.com` / **Senha**: `user123@#`
- **Email**: `maria@user.urbanape.com` / **Senha**: `user123@#`
- **Email**: `pedro@user.urbanape.com` / **Senha**: `user123@#`
- ... (e mais 25 usuários de exemplo)

> **Nota**: Todos os usuários de exemplo recebem automaticamente 1-2 cartões aleatórios para demonstração.

## 📚 Documentação

### API
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs (JSON)**: `http://localhost:8080/v3/api-docs`
- **Postman Collection**: `api-urbanape/src/main/resources/static/API_Urbanape.postman_collection.json`

### READMEs Detalhados
- [README da API](./api-urbanape/README.md) - Documentação completa do backend
- [README do Frontend](./app-urbanape/README.md) - Documentação completa do frontend
- [DOCKER.md](./DOCKER.md) - Guia completo de Docker

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21** - Linguagem de programação
- **Spring Boot 4.0.2** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **PostgreSQL** - Banco de dados relacional
- **Flyway** - Migrações de banco de dados
- **JWT (Auth0)** - Tokens de autenticação
- **SpringDoc OpenAPI** - Documentação da API
- **Maven** - Gerenciamento de dependências
- **BCrypt** - Criptografia de senhas

### Frontend
- **Angular 20.3.0** - Framework principal
- **TypeScript 5.9.2** - Linguagem
- **Tailwind CSS 4.1.18** - Framework CSS utilitário
- **RxJS 7.8.0** - Programação reativa
- **Angular Router** - Roteamento
- **Angular Forms** - Formulários

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web e proxy reverso

## 📁 Estrutura do Projeto

```
desafio-tecnico-urbana-pe/
├── api-urbanape/                 # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/urbanape/api/
│   │   │   │   ├── domain/       # Domínios (DDD)
│   │   │   │   │   ├── auth/     # Autenticação
│   │   │   │   │   ├── users/    # Usuários
│   │   │   │   │   └── cards/    # Cartões
│   │   │   │   └── infra/        # Infraestrutura
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/  # Migrações Flyway
│   │   └── test/                 # Testes
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── app-urbanape/                 # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── guards/          # Guards de rota
│   │   │   ├── pages/           # Páginas
│   │   │   └── services/        # Serviços
│   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md
│
├── nginx/                        # Configuração Nginx
│   └── nginx.conf
│
├── docker-compose.yml            # Orquestração Docker
├── DOCKER.md                     # Guia Docker
└── README.md                     # Este arquivo
```

## 🎯 Funcionalidades Implementadas

### Autenticação e Autorização
- ✅ Login com JWT
- ✅ Controle de acesso por roles (ADMIN/USER)
- ✅ Proteção de rotas no frontend e backend
- ✅ Tokens com expiração de 2 horas

### Gerenciamento de Usuários
- ✅ Listagem paginada
- ✅ Criação de novos usuários (ADMIN)
- ✅ Edição de usuários
- ✅ Remoção de usuários (soft delete)
- ✅ Busca e filtros
- ✅ Visualização de detalhes

### Gerenciamento de Cartões
- ✅ Geração automática de número com algoritmo Luhn
- ✅ Listagem paginada
- ✅ Criação de cartões (ADMIN)
- ✅ Ativação/Inativação de cartões
- ✅ Remoção de cartões (soft delete)
- ✅ Filtro por usuário
- ✅ Visualização de cartões próprios (USER)

### Interface do Usuário
- ✅ Design responsivo (mobile-first)
- ✅ Interface moderna e intuitiva
- ✅ Modais de confirmação
- ✅ Feedback visual de ações
- ✅ Navegação por breadcrumbs
- ✅ Menu lateral responsivo

## 🧪 Testes

### Backend
```bash
cd api-urbanape
./mvnw test
```

### Frontend
```bash
cd app-urbanape
npm test
```

## 🔒 Segurança

- ✅ Senhas criptografadas com BCrypt
- ✅ Tokens JWT com expiração
- ✅ Validação de entrada (Bean Validation)
- ✅ Soft Delete para preservar dados
- ✅ Proteção contra SQL Injection (JPA)
- ✅ CORS configurado
- ✅ Validação de roles no backend e frontend

## 📊 Padrões e Boas Práticas

### Arquitetura
- ✅ **Domain-Driven Design (DDD)** - Separação por bounded contexts
- ✅ **Repository Pattern** - Abstração da camada de dados
- ✅ **Service Layer Pattern** - Lógica de negócio isolada
- ✅ **DTO Pattern** - Transferência de dados entre camadas
- ✅ **Exception Handler Pattern** - Tratamento global de exceções

### Código
- ✅ Código limpo e bem documentado
- ✅ Separação de responsabilidades
- ✅ Reutilização de componentes
- ✅ TypeScript com tipagem forte
- ✅ Tratamento de erros robusto

## 🚀 Deploy

### Docker Compose (Produção)
```bash
docker-compose up -d
```

### Manual
1. Build do backend: `mvn clean package`
2. Build do frontend: `npm run build`
3. Deploy dos arquivos gerados

## 📝 Requisitos do Desafio

Este projeto atende aos seguintes requisitos do desafio técnico:

- ✅ API REST completa
- ✅ Frontend moderno e responsivo
- ✅ Autenticação JWT
- ✅ Controle de acesso por roles
- ✅ CRUD completo de usuários e cartões
- ✅ Geração de número de cartão com algoritmo Luhn
- ✅ Soft Delete
- ✅ Paginação
- ✅ Documentação Swagger
- ✅ Migrações com Flyway
- ✅ Estrutura preparada para microserviços
- ✅ Docker e Docker Compose
- ✅ Testes unitários
- ✅ Código limpo e bem organizado

## 🎓 Destaques Técnicos

### Backend
- Arquitetura DDD com separação clara de domínios
- Uso de NativeQuery para consultas complexas
- Validação robusta com Bean Validation
- Tratamento global de exceções
- Documentação OpenAPI completa
- Migrações versionadas com Flyway

### Frontend
- Componentes standalone do Angular
- Guards para proteção de rotas
- Serviços reutilizáveis
- Design responsivo com Tailwind CSS
- Tratamento de erros e loading states
- Interface intuitiva e moderna

### DevOps
- Dockerização completa
- Docker Compose para orquestração
- Nginx como proxy reverso
- Configuração via variáveis de ambiente
- Builds otimizados (multi-stage)

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte os READMEs específicos:
   - [API](./api-urbanape/README.md)
   - [Frontend](./app-urbanape/README.md)
   - [Docker](./DOCKER.md)

2. Verifique a documentação Swagger: `http://localhost:8080/swagger-ui.html`

3. Consulte a collection do Postman: `api-urbanape/src/main/resources/static/API_Urbanape.postman_collection.json`

## 🎯 Próximos Passos (Melhorias Futuras)

- [ ] Implementar refresh token
- [ ] Adicionar cache (Redis)
- [ ] Implementar rate limiting
- [ ] Adicionar logs estruturados
- [ ] Configurar CI/CD
- [ ] Separar em microserviços
- [ ] Implementar testes E2E
- [ ] Adicionar internacionalização (i18n)
- [ ] Implementar dark mode

## 📄 Licença

Este projeto foi desenvolvido para o **Desafio Técnico da Urbanape PE** como parte do processo seletivo para a vaga FullStack.

## 👨‍💻 Desenvolvido por

Projeto desenvolvido para o Desafio Técnico da Urbanape PE.

---

**Versão**: 1.0.0  
**Data**: 2025  
**Status**: ✅ Completo e funcional

---

> 💡 **Dica**: Comece pela documentação Swagger para entender todos os endpoints disponíveis, ou use a collection do Postman para testar rapidamente a API.
