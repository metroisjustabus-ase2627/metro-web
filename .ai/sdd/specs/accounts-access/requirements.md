# Feature Specification — `accounts-access` (`metro-web`)

- **Feature folder:** `.ai/sdd/specs/accounts-access/`
- **Parent system spec:** `docs/spec/requirements.md` v2 (`FR-ACC-01`, `FR-ACC-02`, `FR-ACC-03`, `NFR-SEC-02`)
- **Related ADRs:** `docs/adr/ADR-003-canonical-roles-and-authorization.md`, `docs/adr/ADR-005-specifications-artifacts-vs-prompts.md`
- **Status:** Reviewed (PL6 — UI implementation pending)

## 1. Scope

Frontend authentication, registration, session state (Angular Signals), HTTP Bearer token interceptor, and role-based route guards (`Passenger` vs. `Staff`) consuming `metro-core` `/api/v1/login` and `/api/v1/users`.

## 2. Requirements (EARS)

| ID | Statement | Source | Origin | Pri |
| --- | --- | --- | :---: | :---: |
| `FR-ACC-01` | The web app shall provide a registration form accepting e-mail and password (optional display name) and submitting to `POST /api/v1/users`, showing API validation/conflict errors cleanly. | SRC-07 | S | Must |
| `FR-ACC-02` | The web app shall provide a login screen (`POST /api/v1/login`), store session state via Signals, and expose role-specific navigation for `Passenger` and `Staff` using the exact role claim returned by `metro-core`. | SRC-07, SRC-08 | D + T (D-06, ADR-003) | Must |
| `NFR-SEC-02` | Route guards shall redirect unauthenticated users to `/login` and block `Passenger` users from `/staff/*` routes, while treating `metro-core` `401`/`403` responses as authoritative. | SRC-08 | D | Must |

## 3. Acceptance Scenarios

```gherkin
Scenario: WEB-ACC-S1 — Role guard uses canonical Staff role (FR-ACC-02, ADR-003)
  Given an authenticated session with role "Passenger"
  When the user navigates to "/staff/network"
  Then the route guard denies navigation and redirects to the passenger home screen

Scenario: WEB-ACC-S2 — Login error does not expose stack traces (FR-ACC-02)
  Given invalid credentials submitted on "/login"
  When metro-core returns 401 Unauthorized
  Then the UI displays a clear English error message without leaking raw HTTP internals
```
