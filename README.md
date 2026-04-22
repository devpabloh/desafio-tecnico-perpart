# GovPE Management System (Desafio Tecnico Full-Stack)

Sistema full-stack para gestao de usuarios, categorias, produtos, auditoria e relatorios, com autenticacao JWT, perfis ADMIN/USER e frontend em Next.js.

## 1) Stack do projeto

- Backend: NestJS 11, Prisma 7, PostgreSQL, JWT, Zod, Jest
- Frontend: Next.js 16 (App Router), TypeScript, Tailwind v4, GOVBR DS (`@govbr-ds/core` e `@govbr-ds/react-components`)
- Infra: Docker Compose (frontend + backend + postgres)

## 2) Estrutura do repositorio

```text
.
├── backend/
├── frontend/
├── docker-compose.yml
├── .env.example
└── AGENTS.md
```

Importante: `backend/` e `frontend/` sao projetos Node independentes (nao existe workspace no root).

---

## 3) Requisitos

- Node.js 20+ (recomendado 22)
- npm 10+
- Docker Desktop

---

## 4) Variaveis de ambiente

### 4.1 Root (Docker Compose)

Crie `.env` no root com base em `.env.example`:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=govpe
JWT_SECRET=sua_chave_jwt_forte
```

### 4.2 Backend local (sem docker para API)

Crie `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/govpe?schema=public"
JWT_SECRET=sua_chave_jwt_forte
PORT=3333
```

### 4.3 Frontend local

Crie `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3334
```

Se a API estiver rodando local fora do docker na porta `3333`, ajuste para `http://localhost:3333`.

---

## 5) Execucao com Docker (recomendado)

No root:

```bash
docker compose up --build
```

Depois aplique migrations no backend (obrigatorio):

```bash
docker compose exec backend npx prisma migrate deploy
```

Opcional (bootstrap de admin inicial):

```bash
docker compose exec backend npx ts-node ./prisma/seed.ts
```

### URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3334`
- Swagger: `http://localhost:3334/docs`
- Postgres host: `localhost:5433`

---

## 6) Execucao local (sem docker para API/frontend)

### 6.1 Subir apenas banco pelo docker

```bash
docker compose up -d db_postgresql
```

### 6.2 Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### 6.3 Frontend

```bash
cd frontend
npm install
npm run dev
```

Observacao: se `3000` estiver ocupado, o Next usa `3001`. O backend ja permite CORS para `3000` e `3001`.

---

## 7) Comandos uteis

### Backend

```bash
cd backend
npm run build
npm run lint          # usa --fix e pode alterar arquivos
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run dev
npm run lint
npm run build
```

---

## 8) Endpoints principais da API

### Auth

- `POST /auth/login`

### Users (ADMIN)

- `POST /users`
- `GET /users?page=&query=`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /users/:id/avatar`

### Categories (JWT)

- `POST /categories`
- `GET /categories?page=&query=`
- `GET /categories/:id`
- `PATCH /categories/:id` (owner ou ADMIN)
- `DELETE /categories/:id` (owner ou ADMIN)

### Products (JWT)

- `POST /products`
- `GET /products?page=&query=&categoryId=`
- `GET /products/:id`
- `PATCH /products/:id` (owner ou ADMIN)
- `DELETE /products/:id` (owner ou ADMIN)
- `POST /products/:id/upload`
- `POST /products/:id/favorite`
- `DELETE /products/:id/favorite`
- `GET /products/me/favorites`

### Reports (ADMIN)

- `GET /reports/audits?userId=&resource=&action=&from=&to=&page=`

---

## 9) Funcionalidades do desafio e status atual

### 9.1 Requisitos funcionais

- [x] Autenticacao JWT
- [x] Rotas protegidas
- [x] CRUD de Usuarios (backend)
- [x] CRUD de Categorias (backend)
- [x] CRUD de Produtos (backend)
- [x] Upload em Usuarios e Produtos
- [x] Perfil ADMIN para gestao de usuarios
- [x] Favoritos de produtos
- [x] Auditoria de acoes (interceptor global)
- [x] Relatorio de auditoria por filtros (endpoint ADMIN)
- [x] Mensageria/eventos para interacao em produtos

### 9.2 Frontend

- [x] Login com JWT
- [x] Dashboard com shell responsivo (header/sidebar/footer)
- [x] Tela de produtos com busca e paginacao basica
- [x] Tela de categorias com busca, listagem e criacao
- [x] Tela de usuarios (restricao visual para ADMIN)
- [x] Tela de auditoria
- [x] Tela de relatorios
- [x] Modais de criacao no dashboard (usuario e produto)

### 9.3 Infra e docs

- [x] Docker compose com backend + frontend + postgres
- [x] Swagger em `/docs`
- [x] README com passo a passo de execucao

---

## 10) Regras de negocio implementadas

- Usuario comum nao pode alterar/deletar recursos de outro usuario (produtos/categorias)
- ADMIN pode gerenciar usuarios
- Favoritar produto proprio e bloqueado
- Auditoria registra acao, recurso, usuario e timestamp para requests autenticados nao-GET

---

## 11) Pontos de atencao conhecidos

- Prisma 7 usa adapter (`@prisma/adapter-pg`), sem `url` no `schema.prisma`
- `docker compose up` nao aplica migration automaticamente; execute `prisma migrate deploy`
- Arquivo do modulo de notificacoes tem nome com typo no repo: `backend/src/modules/notifications/notificarions.module.ts`
- E2E atual ainda esta no template (`backend/test/app.e2e-spec.ts`)

---

## 12) Credenciais de teste (exemplo)

Se usar seed padrao:

- Email: `pabloadmin@example.com`
- Senha: `admin123`

---

## 13) Entrega

1. Subir projeto completo no GitHub
2. Validar README e comandos
3. Enviar link do repositorio para avaliacao
