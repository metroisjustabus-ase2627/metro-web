#!/usr/bin/env node
// Record the HUMAN decision about the last AI output (the part hooks cannot capture).
//
//   node .ai/logs/tools/review.mjs accepted
//   node .ai/logs/tools/review.mjs modified "fixed wrong FK in migration, added test" #FR07
//   node .ai/logs/tools/review.mjs rejected "hallucinated MassTransit API"
//
// Optional flags: --minutes <n> (human time spent reviewing/fixing), --defects <n>
// The entry is linked to the last AI session seen by the logger.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const LOG_DIR = path.join(REPO_ROOT, '.ai', 'logs');
const DECISIONS = ['accepted', 'modified', 'rejected', 'deferred'];

const args = process.argv.slice(2);
const decision = (args.shift() || '').toLowerCase();
if (!DECISIONS.includes(decision)) {
  console.error(`Usage: review.mjs <${DECISIONS.join('|')}> ["note"] [#REQ-ID ...] [--minutes N] [--defects N]`);
  process.exit(1);
}

const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const v = Number(args[i + 1]);
  args.splice(i, 2);
  return Number.isFinite(v) ? v : undefined;
};
const minutes = flag('minutes');
const defects = flag('defects');
const refs = args.filter((a) => /^#[A-Z]{1,6}-?\d{1,4}$/.test(a)).map((a) => a.slice(1));
const note = args.filter((a) => !a.startsWith('#')).join(' ') || undefined;

let member = 'unknown';
try { member = execFileSync('git', ['config', 'user.name'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim(); } catch {}
let last = {};
try { last = JSON.parse(fs.readFileSync(path.join(LOG_DIR, '.state', 'last-session.json'), 'utf8')); } catch {}

const slug = (s) => String(s).normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'unknown';
const rec = {
  ts: new Date().toISOString(),
  member,
  tool: last.tool,
  event: 'review',
  session_id: last.session_id,
  decision,
  note,
  refs: refs.length ? refs : undefined,
  human_minutes: minutes,
  defects_found: defects,
};
const file = path.join(LOG_DIR, 'sessions', slug(member), `${rec.ts.slice(0, 10)}.jsonl`);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.appendFileSync(file, JSON.stringify(rec) + '\n');
console.log(`Logged review: ${decision}${last.session_id ? ` (session ${last.session_id})` : ' (no AI session found)'}`);
