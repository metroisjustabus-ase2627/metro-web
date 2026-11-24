# Claude Code instructions

@AGENTS.md

## AI usage logging (course requirement CON-PRC-02)

- Every prompt, edit and command in this repository is logged automatically to `.ai/logs/` by the hooks in `.claude/settings.json`. Do not disable or edit them.
- Never write secrets in prompts, code or commits; configuration secrets come from environment variables.
- When you finish a task, end your reply with one line reminding the user to record the review (omit `#` in PowerShell because `#` starts a comment):
  `node .ai/logs/tools/review.mjs <accepted|modified|rejected> "note" <REQ-ID> --minutes <N> --defects <N>`
- Requirement IDs follow the v2 specification (FR-xxx-nn, NFR-xxx-nn, CON-xxx-nn). Reference them in commit messages, e.g. `feat(validation): reject expired tickets (FR-VAL-03)`.
