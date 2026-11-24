# ADR-004 — DEI Virtual Machine Deployment (No GitHub Pages) and CI / CD / CDE Separation

- **Status:** Accepted (mirrored from `metro-core/docs/adr/ADR-004-vm-deployment-and-ci-cde-cd-separation.md`)
- **Date:** 2026-11-24
- **Traces to:** `CON-DEP-01`, `CON-DEP-02`, `CON-DEP-03`, `CON-DEP-04`, `CON-CI-01`, `CON-CI-02`, `CON-CI-03`, `CON-CI-04`, `NFR-OBS-01`

## Decision Summary

1. **GitHub Pages is removed.** `metro-web` is packaged once in CI as an immutable Nginx Docker image (`ghcr.io/metroisjustabus-ase2627/metro-web:<commit-sha>`) with `APP_VERSION=<commit-sha>` served at `GET /health` and runtime `API_UPSTREAM` proxying (`/api/`).
2. **Pipelines are split by responsibility (`T03`):**
   - `ci.yml`: Continuous Integration (build, unit tests + coverage, Prettier, strict TypeScript, blocking `npm audit`, Gitleaks secret scan, immutable GHCR image).
   - `cd-dev.yml`: Continuous Deployment to the DEI Development VM (auto-triggered after green CI on `main`, pulls exact `<commit-sha>`, validates `/health` + SHA, auto-rolls back on failure).
   - `cd-prod.yml`: Continuous Delivery to the DEI Production VM (`workflow_dispatch` behind GitHub `production` environment manual approval gate, promotes exact same `<commit-sha>`, validates `/health` + SHA, auto-rolls back on failure).
