#!/usr/bin/env node
// Aggregate all AI logs into .ai/logs/summary.md (metrics for milestones and final report).
//   node .ai/logs/tools/report.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SESSIONS = path.join(REPO_ROOT, '.ai', 'logs', 'sessions');

const records = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.jsonl')) {
      for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
        if (!line.trim()) continue;
        try { records.push(JSON.parse(line)); } catch {}
      }
    }
  }
};
walk(SESSIONS);

const count = (arr, key) => arr.reduce((m, r) => ((m[r[key] ?? '—'] = (m[r[key] ?? '—'] || 0) + 1), m), {});
const table = (title, obj, col = 'Count') =>
  `### ${title}\n\n| ${title} | ${col} |\n|---|---|\n` +
  Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n') + '\n';

// The model and token usage arrive with the 'stop' event (Claude Code): attach them per session.
const sessionInfo = {};
for (const r of records.filter((x) => x.event === 'stop')) {
  const k = `${r.tool}:${r.session_id}`;
  const s = (sessionInfo[k] ||= {});
  if (r.model) s.model = r.model;
  if (r.tokens && (!s.tokens || r.tokens.output >= s.tokens.output)) s.tokens = r.tokens; // cumulative: keep the largest
}
const prompts = records
  .filter((r) => r.event === 'prompt')
  .map((p) => ({ ...p, model: p.model || sessionInfo[`${p.tool}:${p.session_id}`]?.model }));
const tok = Object.values(sessionInfo).reduce(
  (a, s) => ({ input: a.input + (s.tokens?.input || 0), cache: a.cache + (s.tokens?.cache_read || 0), output: a.output + (s.tokens?.output || 0) }),
  { input: 0, cache: 0, output: 0 });
const reviews = records.filter((r) => r.event === 'review');
const edits = records.filter((r) => r.event === 'file_edit' || (r.event === 'tool_use' && r.file));
const sessions = new Set(records.filter((r) => r.session_id).map((r) => `${r.tool}:${r.session_id}`));

const perSession = {};
for (const p of prompts) perSession[`${p.tool}:${p.session_id}`] = (perSession[`${p.tool}:${p.session_id}`] || 0) + 1;
const iters = Object.values(perSession);
const avgIter = iters.length ? (iters.reduce((a, b) => a + b, 0) / iters.length).toFixed(1) : '0';

const refs = {};
for (const r of [...prompts, ...reviews]) for (const ref of r.refs || []) refs[ref] = (refs[ref] || 0) + 1;

const decisions = count(reviews, 'decision');
const reviewed = reviews.length;
const pct = (k) => (reviewed ? `${Math.round(((decisions[k] || 0) / reviewed) * 100)}%` : '—');
const humanMin = reviews.reduce((a, r) => a + (r.human_minutes || 0), 0);
const defects = reviews.reduce((a, r) => a + (r.defects_found || 0), 0);

const byDay = count(prompts.map((p) => ({ day: p.ts.slice(0, 10) })), 'day');

const out = `# AI usage summary

Generated ${new Date().toISOString()} from \`.ai/logs/sessions/\`. Do not edit by hand: run \`node .ai/logs/tools/report.mjs\`.

## Overview

| Metric | Value |
|---|---|
| Sessions | ${sessions.size} |
| Prompts | ${prompts.length} |
| Avg prompts per session (iterations) | ${avgIter} |
| Files edited by agents (events) | ${edits.length} |
| Human reviews recorded | ${reviewed} |
| Accepted / Modified / Rejected | ${pct('accepted')} / ${pct('modified')} / ${pct('rejected')} |
| Human review/fix time (min) | ${humanMin} |
| Defects found in AI output | ${defects} |
| Tokens: input / cache read / output | ${tok.input} / ${tok.cache} / ${tok.output} |

${table('Member', count(prompts, 'member'), 'Prompts')}
${table('Tool', count(prompts, 'tool'), 'Prompts')}
${table('Model', count(prompts, 'model'), 'Prompts')}
${table('Phase', count(prompts, 'phase'), 'Prompts')}
${table('Requirement / task ref', refs, 'Mentions')}
${table('Day', byDay, 'Prompts')}`;

fs.writeFileSync(path.join(REPO_ROOT, '.ai', 'logs', 'summary.md'), out);
console.log(`summary.md written: ${prompts.length} prompts, ${sessions.size} sessions, ${reviewed} reviews.`);
