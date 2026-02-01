# App Urbanape - Frontend

Frontend desenvolvido para o **Desafio Técnico da vaga FullStack da Urbanape PE**. Interface web moderna e responsiva para gerenciamento de usuários e cartões de ônibus.

> 📖 **Documentação Completa**: Consulte o [README principal](../README.md) para visão geral do projeto completo.

## 📋 Sobre o Projeto

Aplicação Angular que consome a API Urbanape, fornecendo uma interface completa para:

- Autenticação de usuários
- Gerenciamento de usuários (CRUD)
- Gerenciamento de cartões de ônibus (CRUD)
- Controle de acesso baseado em roles (ADMIN/USER)
- Visualização de dados pessoais e cartões

## 🛠️ Tecnologias

- **Angular 20.3.0** - Framework principal
- **TypeScript 5.9.2** - Linguagem
- **Tailwind CSS 4.1.18** - Framework CSS utilitário
- **RxJS 7.8.0** - Programação reativa
- **Angular Router** - Roteamento
- **Angular Forms** - Formulários reativos

## 📦 Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm ou yarn
- Angular CLI 20.3.10+
- API Urbanape rodando em `http://localhost:8080`

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar URL da API

A URL da API está configurada em `src/app/services/ApiService.ts`:

```typescript
const BASE_URL = 'http://localhost:8080';
```

Se a API estiver em outro endereço, altere esta constante.

### 3. Executar em Desenvolvimento

```bash
npm start
# ou
ng serve
```

A aplicação estará disponível em: `http://localhost:4200`

### 4. Build para Produção

```bash
npm run build
# ou
ng build
```

Os arquivos compilados estarão em `dist/`.

## 📁 Estrutura do Projeto

```
app-urbanape/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── breadcrumb/
│   │   │   ├── confirm-modal/
│   │   │   ├── header/
│   │   │   └── menu/
│   │   ├── guards/              # Guards de rota
│   │   │   ├── admin.guard.ts
│   │   │   └── user.guard.ts
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── auth/            # Login
│   │   │   └── layout/
│   │   │       ├── admin/       # Páginas administrativas
│   │   │       │   ├── cards/
│   │   │       │   ├── dashboard/
│   │   │       │   ├── edit-user/
│   │   │       │   ├── register/
│   │   │       │   └── users/
│   │   │       ├── layout/      # Layout principal
│   │   │       ├── myaccount/  # Minha conta
│   │   │       └── mycards/     # Meus cartões
│   │   ├── services/            # Serviços
│   │   │   ├── ApiService.ts    # Serviço de comunicação com API
│   │   │   └── api.types.ts     # Tipos TypeScript
│   │   ├── app.config.ts        # Configuração da aplicação
│   │   ├── app.routes.ts        # Rotas
│   │   └── app.ts               # Componente raiz
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## 🔐 Autenticação e Rotas

### Rotas Públicas

- `/login` - Página de login

### Rotas Protegidas

Todas as rotas abaixo requerem autenticação:

#### Para Administradores (ADMIN)
- `/admin/dashboard` - Dashboard administrativo
- `/admin/users` - Lista de usuários
- `/admin/users/edit/:id` - Editar usuário
- `/admin/register` - Cadastrar novo usuário
- `/admin/cards` - Lista de cartões

#### Para Usuários Comuns (USER)
- `/admin/myaccount` - Minha conta
- `/admin/mycards` - Meus cartões

### Guards

- **userGuard**: Verifica se o usuário está autenticado
- **adminGuard**: Verifica se o usuário tem role ADMIN

## 🎨 Funcionalidades

### Autenticação
- Login com email e senha
- Armazenamento de token JWT no localStorage
- Redirecionamento automático baseado em role
- Logout

### Gerenciamento de Usuários (Admin)
- Listagem paginada de usuários
- Visualização de detalhes
- Criação de novos usuários
- Edição de usuários existentes
- Remoção de usuários (com confirmação)
- Gerenciamento de cartões do usuário na tela de edição

### Gerenciamento de Cartões (Admin)
- Listagem paginada de todos os cartões
- Filtro por usuário
- Criação de novos cartões
- Ativação/Inativação de cartões
- Remoção de cartões (com confirmação)

### Área do Usuário
- Visualização de dados pessoais
- Visualização de cartões próprios
- Interface responsiva e moderna

## 🎯 Componentes Principais

### ApiService
Serviço centralizado para comunicação com a API:
- Gerenciamento de token JWT
- Métodos para todas as operações CRUD
- Tratamento de erros
- Tipagem TypeScript completa

### Guards
- Proteção de rotas baseada em autenticação e roles
- Redirecionamento automático para login quando necessário

### Componentes Reutilizáveis
- **ConfirmModal**: Modal de confirmação para ações destrutivas
- **Breadcrumb**: Navegação hierárquica
- **Header**: Cabeçalho da aplicação
- **Menu**: Menu lateral de navegação

## 🎨 Design

O projeto utiliza **Tailwind CSS** para estilização, proporcionando:

- Design responsivo (mobile-first)
- Interface moderna e limpa
- Componentes reutilizáveis
- Customização fácil via classes utilitárias

## 🔧 Configurações

### Porta de Desenvolvimento

Para alterar a porta padrão (4200):

```bash
ng serve --port 4300
```

Ou configure em `angular.json`.

### Variáveis de Ambiente

Para diferentes ambientes (dev, prod), crie arquivos de ambiente:

```
src/environments/
├── environment.ts        # Desenvolvimento
└── environment.prod.ts  # Produção
```

## 🧪 Testes

Para executar os testes:

```bash
npm test
# ou
ng test
```

## 📱 Responsividade

A aplicação é totalmente responsiva, funcionando em:

- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🔄 Integração com API

### Configuração da URL Base

A URL base da API está definida em `src/app/services/ApiService.ts`:

```typescript
const BASE_URL = 'http://localhost:8080';
```

### Headers Automáticos

O serviço automaticamente adiciona:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (quando autenticado)

### Tratamento de Erros

Todos os métodos do `ApiService` incluem tratamento de erros e podem ser combinados com operadores RxJS para tratamento customizado.

## 🚀 Build e Deploy

### Build de Desenvolvimento

```bash
ng build
```

### Build de Produção

```bash
ng build --configuration production
```

### Deploy

Os arquivos em `dist/app-urbanape/` podem ser servidos por qualquer servidor web estático (Nginx, Apache, etc.) ou plataformas como:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm test` | Executa testes unitários |
| `ng generate component` | Gera novo componente |

## 🔒 Segurança

- Tokens JWT armazenados no localStorage
- Validação de rotas no frontend e backend
- Proteção contra acesso não autorizado
- Sanitização de inputs

## 🐛 Troubleshooting

### Erro de CORS

Se encontrar erros de CORS, verifique se a API está configurada para aceitar requisições do frontend.

### Token Expirado

O token JWT expira em 2 horas. Faça login novamente se necessário.

### Erro 401 (Unauthorized)

Verifique se:
- O token está sendo enviado corretamente
- O token não expirou
- O usuário tem permissão para acessar o recurso

## 🚀 Próximos Passos (Melhorias Futuras)

- [ ] Implementar refresh token
- [ ] Adicionar loading states globais
- [ ] Implementar notificações toast
- [ ] Adicionar validação de formulários mais robusta
- [ ] Implementar testes E2E
- [ ] Adicionar internacionalização (i18n)
- [ ] Implementar dark mode

## 📄 Licença

Este projeto foi desenvolvido para o Desafio Técnico da Urbanape PE.

## 👨‍💻 Desenvolvido por

Desenvolvido como parte do processo seletivo para a vaga FullStack da Urbanape PE.

---

**Nota**: Este projeto consome a API Urbanape e fornece uma interface completa e moderna para gerenciamento de usuários e cartões de ônibus.
