# Agent Notes (Repo Root)

## Structure That Matters
- This repo has **two independent Node projects** (no root workspace scripts): `backend/` (NestJS + Prisma) and `frontend/` (Next.js 16 App Router).
- Root `README.md` is a placeholder; treat `package.json`, Prisma files, and Docker config as source of truth.
- Frontend has its own instruction file at `frontend/AGENTS.md`; read it before editing Next.js code.
- Backend entrypoint wiring is in `backend/src/app.module.ts` (currently imports `AuthModule`, `UsersModule`, `ProductsModule`, `CategoriesModule`, `NotificationsModule`, `ReportsModule`).
- Notifications module file is misspelled in repo (`backend/src/modules/notifications/notificarions.module.ts`); imports use that exact filename.

## Setup / Run (Exact)
- Backend first-time setup: `cd backend && npm install`.
- Frontend first-time setup: `cd frontend && npm install`.
- Start backend locally: `cd backend && npm run start:dev`.
- Start frontend locally: `cd frontend && npm run dev`.
- Full stack via Docker: fill root `.env` from `.env.example`, then run `docker compose up --build` from repo root.
- Backend API is exposed on host port `3334` in Compose (`3334:3333`).

## Backend-Specific Gotchas
- Prisma is v7 with driver adapters: keep `datasource db { provider = "postgresql" }` in `schema.prisma`, keep connection in `backend/prisma.config.ts`, and instantiate Prisma with `@prisma/adapter-pg` (see `backend/src/infra/database/prisma/prisma.service.ts`).
- There are no npm scripts for Prisma tasks; use CLI directly from `backend/` (`npx prisma generate`, `npx prisma migrate dev` for local, `npx prisma migrate deploy` in containerized runs).
- Compose does not run migrations automatically; after `docker compose up`, run `docker compose exec backend npx prisma migrate deploy`.
- Initial admin bootstrap is manual via `backend/prisma/seed.ts` (`docker compose exec backend npx ts-node ./prisma/seed.ts`).
- Production start script is `node dist/src/main.js` (`backend/package.json`); if you change TS outDir/rootDir, update this script too.
- `backend/src/main.ts` uses `process.env.PORT ?? 3000`; align `PORT` with Compose internal port (`3333`) to avoid port mapping confusion.
- RBAC order matters when stacking guards: use `@UseGuards(JwtAuthGuard, RolesGuard)` (not the reverse), or `RolesGuard` receives no `request.user` and returns 403.
- CORS must include frontend dev ports (`3000` and `3001`) for browser logins; missing CORS shows preflight failures from `/auth/login`.
- Product creation connects categories by ID; invalid/nonexistent category IDs throw Prisma `P2025` unless validated in service.

## Verification Shortcuts
- Backend lint: `cd backend && npm run lint` (**uses `--fix` and will modify files**).
- Backend tests: `cd backend && npm run test`; e2e: `cd backend && npm run test:e2e`.
- Frontend lint: `cd frontend && npm run lint`.
- Frontend build/typecheck: `cd frontend && npm run build`.
- Frontend has no test runner configured in `package.json`; use lint/build as primary checks.
- Current e2e file is still template-level (`backend/test/app.e2e-spec.ts`) and does not validate real module routes.

## Conventions Worth Preserving
- Backend formatting/lint style is single quotes + trailing commas (`backend/.prettierrc`) with TypeScript ESLint type-aware config.
- Backend uses repository abstractions with Prisma implementations (`repositories/*` + `repositories/prisma/*`); follow that pattern when adding data access.
- Avoid `import type` for classes injected via Nest DI constructors; type-only imports drop runtime metadata and cause `UnknownDependenciesException`.
- Frontend dashboard pages are wrapped by `frontend/app/dashboard/layout.tsx` and `frontend/components/dashboard/dashboard-shell.tsx`; keep new dashboard pages inside this layout instead of duplicating nav/header/footer.
- Frontend auth state is client-side (`localStorage` keys `auth_token` and `auth_user`) via `frontend/lib/auth.ts`; guarded dashboard pages rely on these keys.
