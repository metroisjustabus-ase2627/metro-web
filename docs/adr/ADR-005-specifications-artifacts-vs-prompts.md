# ADR-005 — Engineering Specifications and Artifacts vs. Prompts and Audit Logs

- **Status:** Accepted (mirrored from `metro-core/docs/adr/ADR-005-specifications-artifacts-vs-prompts.md`)
- **Date:** 2026-11-24
- **Traces to:** `CON-PRC-01`, `CON-PRC-02`, `CON-PRC-03`, `CON-PRC-04`, `T04B`, `T06`, `PL5`–`PL7`

## Decision Summary

- **Prompts are NOT engineering specifications or deliverables** (`T04B` slide 13).
- Authoritative engineering artifacts live in `docs/spec/`, `.ai/steering/`, `.ai/sdd/specs/<feature>/` (`requirements.md`, `design.md`, `tasks.md`, `review.md`, `validation.md`), `docs/adr/`, and requirement-linked executable tests.
- `.ai/prompts/` stores clean, versioned, reusable ISO 29148 prompt templates (`T06` slide 34 — process tooling only).
- `.ai/logs/` stores raw interaction logs and the aggregated `summary.md` metrics (`CON-PRC-02` — empirical measurement evidence only).
