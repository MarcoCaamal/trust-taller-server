# Repository Guidelines

## Architecture & Technical Decisions
- Monolito modular: la API se organiza por modulos bajo `src/modules/` y comparte infraestructura en `src/core/`.
- Multi-tenant: una sola base de datos compartida para todos los tenants con aislamiento logico por `tenant_id` en todas las entidades multi-tenant.

## Project Structure & Module Organization
- `src/` contains the API source code. Core infrastructure lives in `src/core/`, and feature modules live under `src/modules/` (e.g., `src/modules/auth`).
- `prisma/` holds the schema, migrations, and seed script (`prisma/seed.ts`).
- `tests/` contains unit and integration tests. Auth tests live in `tests/auth/`.
- `docs/` stores product and API documentation (e.g., `docs/PRD.md`, `docs/api/`).

## Build, Test, and Development Commands
- `pnpm dev` ejecuta el server en modo watch (TSX).
- `pnpm build` compila TypeScript a `dist/`.
- `pnpm start` ejecuta `dist/main.js`.
- `pnpm test` corre Jest (usa Postgres de pruebas via Docker).
- `pnpm prisma migrate dev -n <name>` crea migraciones locales.
- `pnpm prisma db seed` carga permisos/roles iniciales.

## Coding Style & Naming Conventions
- TypeScript con ES modules. Usa comillas dobles en TS cuando ya se usa en el archivo.
- Indentacion: 2 espacios.
- Nombres: `camelCase` para variables, `PascalCase` para clases, `kebab-case` para archivos cuando aplique.
- Validacion con Zod en middlewares y reglas de negocio en servicios.

## Testing Guidelines
- Framework: Jest + Supertest.
- Tests unitarios en `tests/auth/*.test.ts` y de integracion en `tests/auth/auth.integration.test.ts`.
- Para integracion se usa `docker-compose.test.yml` y `.env.testing`.
- Ejecuta un archivo especifico: `pnpm test -- tests/auth/auth.service.test.ts`.

## Commit & Pull Request Guidelines
- Commits con Conventional Commits (e.g., `feat(auth): add global roles`).
- PRs deben incluir: descripcion clara, pasos para probar, y cambios en esquemas si aplica.

## Security & Configuration Tips
- Variables requeridas en `.env.testing` y entorno local: `DATABASE_URL`, `JWT_SECRET`, `BASE_DOMAIN`, `PROBLEM_DOCS_BASE_URL`.
- No hardcodear secretos ni tokens en el repo.
