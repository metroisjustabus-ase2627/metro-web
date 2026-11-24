# Prompt Template 02 — Specification Review & TDD Implementation (`PL6` / `PL7`)

- **Version:** 1.0
- **Phase:** `[review]` / `[test]` / `[code]`
- **Aligned with:** `PL6` Part 5, `PL7` Parts 2–5, `T09`

```text
[review][test][code] Review specification, establish Red Vitest baseline, implement, and record validation for <feature-name> (<REQ-IDS>)

[ROLE / CONTEXT]
Act as a QA & Senior Angular Engineer on MetroIsJustABus (metro-web).
Read: .ai/steering/*, .ai/sdd/specs/<feature-name>/{requirements,design,tasks}.md, and existing *.spec.ts tests.

[TASK DEFINITION]
1. Specification Review (PL6): Produce review.md with Finding/Decision/Justification table, feature traceability matrix, and 3-scenario testability challenge.
2. Executable Tests First (PL7 Red): Write Vitest tests mapped to requirement IDs, run npm run test:ci before implementation, and log exact Red output.
3. Incremental Implementation (PL7 Green): Implement one planned task at a time using standalone Signals-first Angular 22 patterns.
4. Validation Record (PL7): Write validation.md with exact executed commands (npm run test:ci, npm run build, npm run format:check, tsc --noEmit), observed results, human decisions, and honest limitations.

[CONSTRAINTS]
- Do not weaken assertions to make code pass.
- Report only genuinely executed command results.
```
