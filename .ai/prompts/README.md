# Reusable Prompt Templates (Prompt Version Control — Lecture T06)

> **Important distinction (`T04B` slide 13, `ADR-005`):**
> **Prompts are NOT engineering specifications or deliverables.**
> These files are version-controlled, ISO/IEC/IEEE 29148-structured **process templates** used to invoke LLMs/agents reproducibly (`T06` slide 34).
>
> Authoritative engineering artifacts live in `docs/spec/requirements.md`, `.ai/steering/`, `.ai/sdd/specs/<feature>/`, `docs/adr/`, and requirement-tagged executable tests.

## Templates

| File | Lifecycle Phase | Purpose |
| --- | --- | --- |
| `01-sdd-feature-spec.md` | Specify & Plan (`PL6`) | Draft feature `requirements.md`, `design.md`, and `tasks.md` grounded in steering and `docs/spec/requirements.md` |
| `02-sdd-review-and-tdd.md` | Review & Validate (`PL6`/`PL7`) | Run AI specification review (`review.md`), generate Red-baseline tests, and record executable verification (`validation.md`) |
| `03-roles-vm-cicd-artifacts-alignment.md` | Refactor / Governance | Structured alignment prompt for canonical roles, DEI VM deployment (replacing GitHub Pages), CI/CD/CDE workflow separation, and SDD/ADR artifacts |
