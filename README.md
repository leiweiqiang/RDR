# RDR

Minimal full-stack app: FastAPI + SQLAlchemy, Nuxt 3 + Tailwind, PostgreSQL 16, Docker Compose.

## Stack

- **Backend:** FastAPI + SQLAlchemy (`backend/`)
- **Frontend:** Nuxt 3 + Tailwind (`frontend/`)
- **Database:** PostgreSQL 16
- **Runtime:** Docker Compose (dev + prod profiles)

## Host ports

Published ports are driven by **`.env`** (copy from `.env.example`). Defaults match `docker-compose.yml` (`${VAR:-default}`).

| Service | Variable | Default (host → container) |
| --- | --- | --- |
| Nuxt dev (profile `dev`) | `FRONTEND_PUBLISH_PORT` | **3108** → 3000 |
| FastAPI (direct on host) | `BACKEND_PUBLISH_PORT` | **8108** → 8000 |
| PostgreSQL | `POSTGRES_PUBLISH_PORT` | **5433** → 5432 |
| Nginx static (profile `prod`) | `FRONTEND_PROD_PUBLISH_PORT` | **8188** → 80 |

If you change a value in `.env`, use that port in the URLs below instead of the default.

## API conventions

The browser calls the backend via **`/api/...`**. The `/api` prefix is stripped and requests are forwarded to the FastAPI service (`/` on the backend container).

- **Development:** a Nitro handler in `frontend/server/api/[...path].ts` proxies to `NUXT_API_PROXY_TARGET` (Compose sets this to `http://backend:8000`).
- **Production (Compose `prod` profile):** Nginx (`frontend/nginx.prod.conf.template`) proxies `/api/` to `NUXT_API_PROXY_TARGET` (same strip rule as dev).

Example: `GET /api/v1/categories?per_page=100` with `NUXT_API_PROXY_TARGET=https://54.177.12.118/rdr-backend/api` → upstream `GET https://54.177.12.118/rdr-backend/api/v1/categories?per_page=100`.

The dev image runs `pnpm exec nuxt dev ...` so CLI flags are not swallowed by an extra `--` (using `pnpm run dev -- --host ...` would break routing).

## Quick start

1. Copy environment template: `cp .env.example .env`
2. Start services (`.env.example` sets `COMPOSE_PROFILES=dev` so a plain `docker compose up` also starts Nuxt, or pass the profile explicitly):

   ```bash
   docker compose --profile dev up -d --build
   ```

   Or run `./build.sh` (same as above; loads `frontend/.env`).

3. Open (defaults from the table above; replace the port if you overrode it in `.env`):

   - Frontend: http://localhost:3108
   - API docs (via frontend proxy): http://localhost:3108/api/docs
   - FastAPI only (host): http://localhost:8108/docs
   - PostgreSQL (host): localhost:5433

   The backend sets `API_ROOT_PATH=/api` in Compose so Swagger loads `/api/openapi.json` through the same proxy. For interactive docs on the published backend port only, run the backend with `API_ROOT_PATH` unset.

**Production static frontend** (recommended for public URLs like `rdr.tcl-research.us`): ensure API env vars are in `frontend/.env`, then:

```bash
./build-prod.sh
# or: docker compose --env-file frontend/.env --profile prod up -d --build
```

Nginx serves the generated UI on http://localhost:8188 by default (`FRONTEND_PROD_PUBLISH_PORT`).

Use **`build.sh` / profile `dev`** only for local development (`localhost`). Do not expose the Nuxt dev server (`buildId: "dev"`) on a public domain — client-side API calls and Vite HMR are unreliable behind HTTPS reverse proxies.

## Example endpoints

- `GET /` — API message
- `GET /health` — health check
- `GET /items/` — list items
- `POST /items/` — create item (`{"name": "..."}`)

## Notes

- With `CREATE_SCHEMA_ON_STARTUP=1`, tables are created from SQLAlchemy models on startup.
- Optional controlled DDL: `backend/migrations/001_init_schema.sql`.
- Compose uses fixed `container_name` values (`rdr-postgres`, etc.). Stop any other clone of this stack (for example a copy under `RDR.1`) before starting, or adjust names/ports in `.env`.
