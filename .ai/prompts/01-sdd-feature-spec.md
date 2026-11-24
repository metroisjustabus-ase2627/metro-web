# Prompt Template 01 — Feature SDD Specification (`PL6`)

- **Version:** 1.0
- **Phase:** `[spec]` / `[design]`
- **Aligned with:** ISO/IEC/IEEE 29148 (`T06`/`T07`), SDD (`T04B`, `PL6`)

```text
[spec] Create reviewed SDD feature specification for <feature-name> (<REQ-IDS>)

[ROLE / CONTEXT]
Act as a senior Angular 22 software engineer applying Specification-Driven Development (SDD) on MetroIsJustABus (metro-web).
Read first: AGENTS.md, .ai/steering/*, docs/spec/requirements.md, and docs/adr/*.

[TASK DEFINITION]
Create .ai/sdd/specs/<feature-name>/ containing:
1. requirements.md — bounded UI scope, EARS requirements with Origin tags (S/D/T), Given/When/Then acceptance scenarios, error/degraded states, and open questions.
2. design.md — standalone components, Angular Signals state, HttpClient/httpResource contracts against metro-core /api/v1/*, route guards, and error handling.
3. tasks.md — ordered atomic implementation and Vitest/Playwright validation tasks with unique IDs, requirement traceability, and verifiable completion criteria.

[CONSTRAINTS]
- metro-web is a client only: no domain rules, no RabbitMQ/PostgreSQL access.
- Canonical roles are strictly Passenger and Staff (ADR-003).
- Do not implement code until the specification review (review.md) is approved by a human.

[OUTPUT FORMAT]
Structured Markdown files under .ai/sdd/specs/<feature-name>/.

[SUCCESS CRITERIA]
Every UI flow traces to a requirement ID in docs/spec/requirements.md and specifies observable loading, empty, success, and failure states.
```
