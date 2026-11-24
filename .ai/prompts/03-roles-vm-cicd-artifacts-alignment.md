# Prompt Template 03 — Canonical Roles, DEI VM Deployment, CI/CD/CDE Separation & SDD Artifacts

- **Version:** 1.0
- **Date:** 2026-11-24
- **Phase:** `[spec]` `[design]` `[ci]` `[deploy]`
- **Traces to:** `FR-ACC-02`, `CON-CI-01`, `CON-CI-02`, `CON-CI-04`, `CON-DEP-01`, `CON-DEP-02`, `CON-DEP-03`, `CON-DEP-05`, `CON-ARC-05`, `CON-PRC-02`, `CON-PRC-04`

```text
[spec][ci][deploy] Align metro-web steering roles, migrate from GitHub Pages to DEI VM deployment, split CI/CD/CDE workflows, and establish SDD/ADR artifacts

[ROLE / CONTEXT]
Act as a Senior Frontend Architect and DevOps Engineer on MetroIsJustABus (metro-web).
Read AGENTS.md, .ai/steering/*, docs/spec/requirements.md, and docs/adr/*.

[TASK DEFINITION]
1. Align .ai/steering/conventions.md and docs/adr/ADR-003* to canonical Passenger/Staff roles matching metro-core.
2. Remove GitHub Pages deployment completely from workflows and README.md.
3. Update Dockerfile and nginx.conf so one immutable GHCR Nginx image (Build Only Once) exposes GET /health JSON with APP_VERSION=<commit-sha> and proxies /api/ via runtime API_UPSTREAM.
4. Add docker-compose.dev.yml and docker-compose.prod.yml and split pipelines into ci.yml (CI), cd-dev.yml (CD to DEI Dev VM with health+SHA check and rollback), and cd-prod.yml (CDE to DEI Prod VM behind manual approval gate).
5. Create .ai/sdd/specs/accounts-access/ (PL6/PL7), docs/adr/ADR-003..005, reusable .ai/prompts/ templates, and .ai/logs/ summary evidence.

[CONSTRAINTS]
- Zero GitHub Pages jobs, permissions, or references remaining.
- Never rebuild the Angular bundle during Dev or Prod deployment.
- Keep Prettier, strict TypeScript, Vitest, and production npm audit passing cleanly.

[SUCCESS CRITERIA]
npm run build, npm run test:ci, npm run format:check, npx tsc --noEmit, npm audit --omit=dev --audit-level=high, and docker compose config all succeed with exit code 0.
```
