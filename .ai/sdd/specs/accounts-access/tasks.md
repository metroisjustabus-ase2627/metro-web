# Implementation and Validation Tasks — `accounts-access` (`metro-web`)

- **Feature folder:** `.ai/sdd/specs/accounts-access/`
- **Traces to:** `FR-ACC-01`, `FR-ACC-02`, `NFR-SEC-02`, `ADR-003`, `ADR-004`

| Task ID | Description | Requirement(s) | Area / Files | Depends On | Verifiable Completion Condition | Status |
| --- | --- | --- | --- | --- | --- | :---: |
| `WEB-ACC-T01` | Align steering conventions and ADR-003 to canonical `Passenger`/`Staff` roles | `FR-ACC-02`, `CON-PRC-04` | `.ai/steering/conventions.md`, `docs/adr/ADR-003*` | — | 0 legacy `master`/`client` role strings in steering/docs | Done |
| `WEB-ACC-T02` | Configure Nginx `/api/` proxy (`API_UPSTREAM`) and `/health` JSON with `APP_VERSION` for VM deployment (remove GitHub Pages) | `CON-DEP-01..02`, `CON-CI-02`, `ADR-004` | `Dockerfile`, `nginx.conf`, `docker-compose.{dev,prod}.yml`, `.github/workflows/*` | — | Compose config valid; CI builds & tests pass; 0 GitHub Pages refs | Done |
| `WEB-ACC-T03` | Implement `UserRole` (`'Passenger' \| 'Staff'`), `AuthSession`, `AuthApi`, `authInterceptor`, and `provideHttpClient` | `FR-ACC-01`, `FR-ACC-02` | `src/app/auth/`, `src/app/app.config.ts` | `WEB-ACC-T01` | Vitest unit tests verify token attachment and role parsing | Pending |
| `WEB-ACC-T04` | Implement standalone `LoginPage`, `RegisterPage`, and `roleGuard('Staff')` with Vitest unit tests | `FR-ACC-01`, `FR-ACC-02`, `NFR-SEC-02` | `src/app/auth/`, `src/app/app.routes.ts` | `WEB-ACC-T03` | Vitest tests verify `Passenger` blocked from `/staff/*` and `401`/`409` UI error handling | Pending |
