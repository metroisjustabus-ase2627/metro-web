# ADR-003 — Canonical Roles (`Passenger` / `Staff`) Across Spec, API, JWT, and Database

- **Status:** Accepted (mirrored from `metro-core/docs/adr/ADR-003-canonical-roles-and-authorization.md`)
- **Date:** 2026-11-24
- **Traces to:** `FR-ACC-01`, `FR-ACC-02`, `FR-ACC-03`, `NFR-SEC-02`, `D-06`, `CON-PRC-04`

## Decision Summary

Both `metro-core` and `metro-web` use the single canonical role vocabulary defined in `docs/spec/requirements.md`:
- **`Passenger`** (replaces legacy `client` / informal `user`)
- **`Staff`** (replaces legacy `master` / informal `admin`)

`metro-core` enforces these values via `UserRoles`, FluentValidation, ASP.NET Core policies (`Staff`, `Passenger`, `Authenticated`), and PostgreSQL constraint `CK_User_Role ("Role" IN ('Passenger', 'Staff'))`. `metro-web` route guards and UI components must read and check `Passenger` and `Staff` directly with no translation layer.
