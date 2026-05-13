# RDR

Minimal full-stack app: FastAPI + SQLAlchemy, Nuxt 3 + Tailwind, PostgreSQL 16, Docker Compose.

## Stack

- **Backend:** FastAPI + SQLAlchemy (`backend/`)
- **Frontend:** Nuxt 3 + Tailwind (`frontend/`)
- **Database:** PostgreSQL 16
- **Runtime:** Docker Compose (dev + prod profiles)

## API conventions

The browser calls the backend via **`/api/...`**. The `/api` prefix is stripped and requests are forwarded to the FastAPI service (`/` on the backend container).

- **Development:** a Nitro handler in `frontend/server/api/[...path].ts` proxies to `NUXT_API_PROXY_TARGET` (Compose sets this to `http://backend:8000`).
- **Production (Compose `prod` profile):** Nginx (`frontend/nginx.prod.conf`) proxies `/api/` to `http://backend:8000/`.

Example: `GET /api/health` → upstream `GET http://backend:8000/health`.

The dev image runs `pnpm exec nuxt dev ...` so CLI flags are not swallowed by an extra `--` (using `pnpm run dev -- --host ...` would break routing).

## Quick start

1. Copy environment template: `cp .env.example .env`
2. Start services (`.env.example` sets `COMPOSE_PROFILES=dev` so Nuxt dev starts with `docker compose up`):

   ```bash
   docker compose up --build
   ```

3. Open:

   - Frontend: http://localhost:3000
   - Backend docs: http://localhost:8000/docs
   - PostgreSQL (host): localhost:5433

**Production static frontend:** `docker compose --profile prod up --build` — Nginx serves the generated UI on http://localhost:8080 by default (`FRONTEND_PROD_PUBLISH_PORT`).

## Example endpoints

- `GET /` — API message
- `GET /health` — health check
- `GET /items/` — list items
- `POST /items/` — create item (`{"name": "..."}`)

## Notes

- With `CREATE_SCHEMA_ON_STARTUP=1`, tables are created from SQLAlchemy models on startup.
- Optional controlled DDL: `backend/migrations/001_init_schema.sql`.
- Compose uses fixed `container_name` values (`rdr-postgres`, etc.). Stop any other clone of this stack (for example a copy under `RDR.1`) before starting, or adjust names/ports in `.env`.
