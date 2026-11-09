#!/usr/bin/env node
// One-time setup per clone: enables the git hook that links commits to AI sessions.
//   node .ai/logs/tools/setup.mjs

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: REPO_ROOT, stdio: 'inherit' });
const user = execFileSync('git', ['config', 'user.name'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
console.log(`OK: git hooks enabled (.githooks). Logs will be written under .ai/logs/sessions/ as "${user}".`);
console.log("Claude Code: hooks load from .claude/settings.json (restart Claude Code / reload VS Code once).");
