# Trust Taller Server

![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-ISC-green)

## Espanol

### Que hace el proyecto
API REST para Trust Taller, un SaaS multi-tenant para talleres de motos. La arquitectura es un monolito modular con aislamiento logico por `tenant_id`.

### Por que es util
- Registro y gestion de ordenes con evidencia y seguimiento.
- Transparencia para el cliente con link publico y timeline.
- Base tecnica para operar multiples talleres con aislamiento de datos.

### Como empezar

**Requisitos**
- Node.js 18+ (recomendado 20+)
- pnpm 10+
- PostgreSQL (local o Docker)

**Instalacion**
```bash
pnpm install
```

**Configuracion (.env)**
Variables requeridas:
- `DATABASE_URL`
- `JWT_SECRET`
- `BASE_DOMAIN`
- `PROBLEM_DOCS_BASE_URL`

Opcionales:
- `CORS_ORIGINS` lista separada por comas

Ejemplo:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/trust_taller
JWT_SECRET=dev-secret
BASE_DOMAIN=trust-taller.com
PROBLEM_DOCS_BASE_URL=https://docs.trust-taller.com/errors
CORS_ORIGINS=https://app.trust-taller.com,https://admin.trust-taller.com
```

**Migraciones y seed**
```bash
pnpm prisma migrate dev -n init
pnpm prisma db seed
```

**Correr en desarrollo**
```bash
pnpm dev
```

**Uso rapido**
```bash
curl http://localhost:3000/health
```

### Donde obtener ayuda
- PRD y decisiones: `docs/PRD.md`
- Errores en formato Problem Details: `docs/api/problem-details.md`
- Coleccion HTTP de auth: `docs/api/auth/auth.http`

### Quien mantiene y contribuye
- Maintainer: Marco C. (ver `docs/PRD.md`)
- Contribuciones: abre un issue o PR, usa Conventional Commits y ejecuta `pnpm test` antes de enviar.

---

## English

### What the project does
REST API for Trust Taller, a multi-tenant SaaS for motorcycle workshops. Architecture is a modular monolith with logical isolation by `tenant_id`.

### Why it is useful
- Order tracking with evidence and status timeline.
- Customer transparency through a public link.
- Shared database multi-tenant foundation with strict data isolation.

### How to get started

**Requirements**
- Node.js 18+ (recommended 20+)
- pnpm 10+
- PostgreSQL (local or Docker)

**Install**
```bash
pnpm install
```

**Configuration (.env)**
Required:
- `DATABASE_URL`
- `JWT_SECRET`
- `BASE_DOMAIN`
- `PROBLEM_DOCS_BASE_URL`

Optional:
- `CORS_ORIGINS` comma-separated list

Example:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/trust_taller
JWT_SECRET=dev-secret
BASE_DOMAIN=trust-taller.com
PROBLEM_DOCS_BASE_URL=https://docs.trust-taller.com/errors
CORS_ORIGINS=https://app.trust-taller.com,https://admin.trust-taller.com
```

**Migrations and seed**
```bash
pnpm prisma migrate dev -n init
pnpm prisma db seed
```

**Run in development**
```bash
pnpm dev
```

**Quick usage**
```bash
curl http://localhost:3000/health
```

### Where to get help
- PRD and decisions: `docs/PRD.md`
- Problem Details format: `docs/api/problem-details.md`
- Auth HTTP collection: `docs/api/auth/auth.http`

### Who maintains and contributes
- Maintainer: Marco C. (see `docs/PRD.md`)
- Contributions: open an issue or PR, use Conventional Commits, and run `pnpm test` before submitting.
