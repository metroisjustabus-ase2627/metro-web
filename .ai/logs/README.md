# AI interaction logs

Evidence of how LLMs and agents were used (project statement: "Development Evidence and Metrics"; lecture T6: record every prompt iteration, prompt version control).

## What is captured automatically

| Tool | Config | Events logged |
|---|---|---|
| Claude Code (VS Code extension or CLI) | `.claude/settings.json` | prompt, files edited and commands run, end of turn with model, token usage and full transcript |

The logger also understands Cursor and Copilot hook payloads (`ai-log.mjs cursor|copilot`) if the team adds those tools later.

Every event is appended to `sessions/<member>/<YYYY-MM-DD>.jsonl` (one file per person per day, so there are no merge conflicts). Transcripts, when the tool provides them, are copied to `transcripts/<tool>/<session>.*`. Obvious secrets (keys, passwords, tokens) are masked before writing.

Requirements: Node.js on PATH. Nothing else.

## One-time setup (each team member, each repo)

```bash
node .ai/logs/tools/setup.mjs   # links commits to AI sessions (git hook)
```

Then reload VS Code (or restart Claude Code) once so the hooks are loaded. Check with `/hooks` inside Claude Code.

## What you still do by hand (10 seconds)

Hooks cannot know whether the output was good. After each significant AI task, record the human decision:

```bash
node .ai/logs/tools/review.mjs accepted
node .ai/logs/tools/review.mjs modified "wrong cascade delete, fixed + test" FR-VAL-01 --minutes 15 --defects 1
```

Write requirement IDs without `#` (or quote them): in PowerShell an unquoted `#` starts a comment and the rest of the line is lost.

```bash
node .ai/logs/tools/review.mjs rejected "invented RabbitMQ API"
```

## Prompt conventions (optional, but they make the metrics useful)

- Start the prompt with a phase tag: `[req]`, `[spec]`, `[design]`, `[code]`, `[test]`, `[ci]`, `[deploy]`, `[doc]`, `[debug]`, `[review]`.
- Mention requirement / task IDs with `#`: `#FR07`, `#NFR-AV-01`, `#TASK-3`.

Example: `[code] Implement ticket validation handler #FR07 following .ai/sdd/specs/ticket-validation/tasks.md TASK-2`

## Commits

With the git hook enabled, commits made within 2 h of an AI session get a trailer, e.g. `AI-Session: claude:3f2a…`. Delete it if the commit had no AI help.

## Metrics

```bash
node .ai/logs/tools/report.mjs   # writes .ai/logs/summary.md
```

Sessions, prompts, iterations per session, files edited by agents, token usage, accepted / modified / rejected rates, human time, defects found, breakdown by member, tool, model, phase and requirement.
