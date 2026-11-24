# Validation — `accounts-access` and VM CI/CD Baseline (`metro-web`, PL7)

- **Feature folder:** `.ai/sdd/specs/accounts-access/`
- **Date:** 2026-11-24

## Scope and Traceability

| Requirement / Constraint | Task | Code Location | Verification | Final Result |
| --- | --- | --- | --- | :---: |
| `FR-ACC-02`, `CON-PRC-04` | `WEB-ACC-T01` | `.ai/steering/conventions.md`, `docs/adr/ADR-003*` | Steering & ADR inspection (`Passenger`/`Staff` only) | **Pass** |
| `CON-DEP-01`, `CON-DEP-02`, `CON-CI-02`, `ADR-004` | `WEB-ACC-T02` | `Dockerfile`, `nginx.conf`, `docker-compose.{dev,prod}.yml`, `.github/workflows/{ci,cd-dev,cd-prod}.yml` | Build, Vitest, Prettier, strict `tsc`, `docker compose config`, zero GitHub Pages grep | **Pass** |
| `FR-ACC-01`, `FR-ACC-02`, `NFR-SEC-02` (Angular UI) | `WEB-ACC-T03`, `WEB-ACC-T04` | `src/app/auth/` (not yet created) | Vitest unit tests + Playwright E2E | **Not run (pending implementation)** |

## Execution Evidence

Working directory: `metro-web` repository root (Node 22, Angular 22.2.1).

- **Build:** `npm run build` → `Application bundle generation complete` (`BUILD_EXIT=0`).
- **Unit tests & coverage:** `npm run test:ci` → `Test Files 1 passed (1), Tests 2 passed (2)`, v8 coverage `100% Stmts / 100% Branch / 100% Funcs / 100% Lines` (`TEST_EXIT=0`).
- **Formatting:** `npm run format:check` → `All matched files use Prettier code style!` (`FMT_EXIT=0`).
- **Type check:** `npx tsc --noEmit -p tsconfig.app.json` → exit code `0`.
- **Docker Compose validation:** `docker compose -f docker-compose.{yml,dev.yml,prod.yml} config -q` → all exit code `0`.
- **GitHub Pages removal check:** grep for `github-pages|deploy-pages|configure-pages|github.io` outside ADR/prompt history → **0 matches**.

## AI Assistance and Human Decisions

- **Tool/model:** Antigravity agent following `.ai/prompts/03-roles-vm-cicd-artifacts-alignment.md`.
- **Human decisions:** Removed GitHub Pages deployment completely in favor of DEI Virtual Machines (`ADR-004`), baked `APP_VERSION` into Nginx `GET /health` JSON, and switched `/api/` upstream configuration to runtime `envsubst` to enforce Build Only Once (`T03`).

## Limitations and Reflection

- Angular authentication UI screens (`WEB-ACC-T03`, `WEB-ACC-T04`) are specified in PL6 (`requirements.md`, `design.md`, `tasks.md`, `review.md`) and ready for TDD implementation in the next sprint.
- Runtime Docker container smoke test requires starting Docker Desktop locally or deploying to the DEI Development VM once provisioned.
