# Specification Review — `accounts-access` (`metro-web`, PL6)

- **Feature folder:** `.ai/sdd/specs/accounts-access/`

## 1. Review Findings and Human Decisions

| Finding | Identified by (AI/Human) | Decision (accept/reject/defer) | Justification |
| --- | :---: | :---: | --- |
| **F1 — Steering role mismatch:** `.ai/steering/conventions.md` instructed guards to use `client`/`master`, conflicting with `docs/spec/requirements.md` (`Passenger`/`Staff`). | Human + AI | **Accept** | Updated `conventions.md` and mirrored `ADR-003` so Angular guards use `'Passenger' \| 'Staff'` directly. |
| **F2 — GitHub Pages breaks API proxy & Build Only Once:** Deploying `metro-web` to GitHub Pages with `--base-href "/metro-web/"` prevented containerized VM deployment and relative `/api/` proxying. | Human + AI | **Accept** | Removed GitHub Pages; configured Nginx `envsubst` (`API_UPSTREAM`) + JSON `/health` with `APP_VERSION` (`ADR-004`). |

## 2. Feature-Level Traceability Matrix

| Project source / decision | Requirement ID | Design element | Task ID | Acceptance criterion |
| --- | --- | --- | --- | --- |
| `SRC-07`, `ADR-003` | `FR-ACC-01` | `RegisterPage`, `AuthApi.register` | `WEB-ACC-T03`, `WEB-ACC-T04` | Submitting email+password creates `Passenger` and renders `409` cleanly |
| `SRC-07`, `SRC-08`, `D-06`, `ADR-003` | `FR-ACC-02` | `UserRole`, `AuthSession`, `LoginPage` | `WEB-ACC-T01`, `WEB-ACC-T03`, `WEB-ACC-T04` | Role-based navigation switches strictly on `'Passenger'` vs `'Staff'` |
| `SRC-08`, `ADR-003` | `NFR-SEC-02` | `roleGuard('Staff')`, `authInterceptor` | `WEB-ACC-T04` | `Passenger` redirected away from `/staff/*`; backend `403` handled |
| `SRC-14`, `SRC-15`, `ADR-004` | `CON-DEP-01`, `CON-CI-02` | `Dockerfile` (`APP_VERSION`), `nginx.conf` (`/health`, `/api/`), `cd-{dev,prod}.yml` | `WEB-ACC-T02` | Exact GHCR SHA image deploys on DEI VMs with `/health` returning SHA |

## 3. Testability Challenge (PL6 Part 5 Step 4)

1. `roleGuard('Staff')` denies access and redirects when `AuthSession.role()` is `'Passenger'`.
2. `roleGuard('Staff')` allows navigation when `AuthSession.role()` is `'Staff'`.
3. `RegisterPage` displays the English API conflict message when `POST /api/v1/users` returns `409 Conflict`.
