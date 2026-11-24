# Feature Design — `accounts-access` (`metro-web`)

- **Feature folder:** `.ai/sdd/specs/accounts-access/`
- **Traces to:** `FR-ACC-01`, `FR-ACC-02`, `FR-ACC-03`, `NFR-SEC-02`, `ADR-003`, `ADR-004`

## 1. Angular 22 Architecture (`.ai/steering/conventions.md`)

- **API transport (`ADR-004` Build Only Once):** All API requests target relative path `/api/v1/...`, proxied by Nginx (`API_UPSTREAM`) in containers and `proxy.conf.json` in `ng serve` — zero environment-specific rebuilds.
- **Canonical role type:** `export type UserRole = 'Passenger' | 'Staff';` (strict union matching `metro-core` `UserRoles` and PostgreSQL `CK_User_Role`).
- **Core services & interceptors (under `src/app/auth/`):**
  - `AuthSession` (Signals: `user`, `role`, `isAuthenticated`, `isStaff`).
  - `AuthApi` (`HttpClient` calls to `POST /api/v1/login`, `POST /api/v1/login/refresh`, `POST /api/v1/login/logout`, `POST /api/v1/users`, `GET /api/v1/users/me`).
  - `authInterceptor`: attaches `Authorization: Bearer <token>` and handles `401` refresh/logout.
  - Functional route guards: `authGuard` and `roleGuard('Staff')`.
- **Standalone screens:** `LoginPage`, `RegisterPage`, and role-aware top navigation bar.
