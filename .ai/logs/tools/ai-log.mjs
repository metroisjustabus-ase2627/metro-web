#!/usr/bin/env node
// AI interaction logger for MetroIsJustABus.
//
// Called automatically by the agent hooks of Cursor (.cursor/hooks.json) and
// VS Code / GitHub Copilot (.github/hooks/ai-log.json). It reads the hook
// payload from stdin and appends one JSON line per event to
//   .ai/logs/sessions/<member>/<YYYY-MM-DD>.jsonl
// Full conversation transcripts (when the tool provides one) are copied to
//   .ai/logs/transcripts/<tool>/<session_id>.<ext>
//
// Usage (from a hook): node .ai/logs/tools/ai-log.mjs <tool>
//   <tool> = claude | cursor | copilot
//
// The logger must never block or break the agent: every error is swallowed
// and the process always exits 0 with a neutral JSON answer.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const TOOL = (process.argv[2] || 'unknown').toLowerCase();
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const LOG_DIR = path.join(REPO_ROOT, '.ai', 'logs');
const STATE_DIR = path.join(LOG_DIR, '.state'); // local only, git-ignored
const MAX_TEXT = 20000; // chars kept per prompt/response
const MAX_TRANSCRIPT_BYTES = 5 * 1024 * 1024;

// Event names differ per tool; normalise them.
const EVENT_MAP = {
  // Cursor
  beforeSubmitPrompt: 'prompt',
  afterAgentResponse: 'response',
  afterFileEdit: 'file_edit',
  stop: 'stop',
  // VS Code / Copilot / Claude Code
  UserPromptSubmit: 'prompt',
  userPromptSubmitted: 'prompt',
  PostToolUse: 'tool_use',
  postToolUse: 'tool_use',
  Stop: 'stop',
  SessionStart: 'session_start',
  sessionStart: 'session_start',
};

function answer(kind) {
  // Claude Code adds UserPromptSubmit stdout to the model context: print nothing.
  if (TOOL === 'claude') return;
  // Cursor's beforeSubmitPrompt requires {"continue": true}; the others accept {}.
  process.stdout.write(kind === 'prompt' ? '{"continue":true}' : '{}');
}

function readStdin(timeoutMs = 3000) {
  return new Promise((resolve) => {
    let data = '';
    const done = () => resolve(data);
    const timer = setTimeout(done, timeoutMs);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => { clearTimeout(timer); done(); });
    process.stdin.on('error', () => { clearTimeout(timer); done(); });
  });
}

function gitUser() {
  try {
    return execFileSync('git', ['config', 'user.name'], { cwd: REPO_ROOT, encoding: 'utf8', timeout: 2000 }).trim();
  } catch {
    return process.env.GIT_AUTHOR_NAME || process.env.USERNAME || process.env.USER || 'unknown';
  }
}

function gitHead() {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8', timeout: 2000 }).trim();
  } catch {
    return null;
  }
}

const slug = (s) => String(s).normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'unknown';

// Mask obvious secrets before anything is written to disk.
function redact(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/(-----BEGIN [A-Z ]*PRIVATE KEY-----)[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----)/g, '$1[REDACTED]$2')
    .replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})\b/g, '[REDACTED]')
    .replace(/((?:password|passwd|pwd|secret|api[_-]?key|token|jwt[_-]?key)["']?\s*[:=]\s*["']?)([^\s"',;]{4,})/gi, '$1[REDACTED]');
}

const clip = (t) => (typeof t === 'string' && t.length > MAX_TEXT ? t.slice(0, MAX_TEXT) + `… [truncated ${t.length - MAX_TEXT} chars]` : t);

// Optional conventions inside a prompt:
//   [phase:test]  or  [test]  at the start  -> phase
//   #FR07 #NFR05 #TASK-3 #D-07                -> refs (traceability)
function parseTags(prompt) {
  if (typeof prompt !== 'string') return {};
  const phases = ['req', 'design', 'code', 'test', 'ci', 'deploy', 'doc', 'review', 'debug', 'spec'];
  const m = prompt.match(/^\s*\[(?:phase:)?([a-z]+)\]/i);
  const phase = m && phases.includes(m[1].toLowerCase()) ? m[1].toLowerCase() : undefined;
  const refs = [...new Set((prompt.match(/#[A-Z]{1,6}-?\d{1,4}\b/g) || []).map((r) => r.slice(1)))];
  return { phase, refs: refs.length ? refs : undefined };
}

function copyTranscript(transcriptPath, sessionId) {
  try {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
    const { size } = fs.statSync(transcriptPath);
    if (size > MAX_TRANSCRIPT_BYTES) return `skipped (${size} bytes)`;
    const ext = path.extname(transcriptPath) || '.json';
    const dest = path.join(LOG_DIR, 'transcripts', slug(TOOL), `${slug(sessionId || 'session')}${ext}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, redact(fs.readFileSync(transcriptPath, 'utf8')));
    return path.relative(REPO_ROOT, dest).split(path.sep).join('/');
  } catch {
    return null;
  }
}

// Claude Code transcripts are JSONL; read the model and the cumulative token usage.
function transcriptStats(transcriptPath) {
  try {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) return {};
    let model, input = 0, output = 0, cacheRead = 0, turns = 0;
    for (const line of fs.readFileSync(transcriptPath, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const m = o.message;
      if (!m || m.role !== 'assistant') continue;
      if (m.model) model = m.model;
      const u = m.usage || {};
      input += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0);
      cacheRead += u.cache_read_input_tokens || 0;
      output += u.output_tokens || 0;
      turns += 1;
    }
    return { model, tokens: turns ? { input, cache_read: cacheRead, output, assistant_messages: turns } : undefined };
  } catch {
    return {};
  }
}

function toRel(p) {
  if (!p || typeof p !== 'string') return p;
  const rel = path.relative(REPO_ROOT, p);
  return (rel && !rel.startsWith('..') ? rel : p).split(path.sep).join('/');
}

async function main() {
  const raw = await readStdin();
  let payload = {};
  try { payload = raw.trim() ? JSON.parse(raw) : {}; } catch { payload = { unparsed: raw.slice(0, 2000) }; }

  const hookEvent = payload.hook_event_name || payload.hookEventName || process.argv[3] || 'unknown';
  const kind = EVENT_MAP[hookEvent] || hookEvent;
  const sessionId = payload.conversation_id || payload.session_id || payload.sessionId || null;
  if (kind === 'unknown' && !sessionId) return kind; // empty or unreadable payload: nothing to log
  const member = gitUser();

  const rec = {
    ts: new Date().toISOString(),
    member,
    tool: TOOL,
    event: kind,
    session_id: sessionId,
    generation_id: payload.generation_id || undefined,
    model: payload.model || undefined,
    tool_version: payload.cursor_version || undefined,
    git_head: gitHead(),
  };

  if (kind === 'prompt') {
    const prompt = payload.prompt ?? '';
    Object.assign(rec, parseTags(prompt));
    rec.prompt = clip(redact(prompt));
    rec.prompt_chars = prompt.length;
    if (Array.isArray(payload.attachments) && payload.attachments.length) {
      rec.attachments = payload.attachments.map((a) => toRel(a.file_path || a.filePath || a.path || a.type || String(a)));
    }
  } else if (kind === 'response') {
    rec.response = clip(redact(payload.text ?? ''));
    rec.response_chars = (payload.text ?? '').length;
  } else if (kind === 'file_edit') {
    rec.file = toRel(payload.file_path);
    rec.edits = Array.isArray(payload.edits) ? payload.edits.length : undefined;
  } else if (kind === 'tool_use') {
    rec.tool_name = payload.tool_name || payload.toolName;
    const input = payload.tool_input || payload.toolArgs || {};
    const file = input.filePath || input.file_path || input.notebook_path || input.path;
    if (file) rec.file = toRel(file);
    if (typeof input.command === 'string') rec.command = clip(redact(input.command)).slice(0, 1000);
  } else if (kind === 'stop') {
    rec.status = payload.status || payload.reason || undefined;
    rec.loop_count = payload.loop_count;
    const stats = transcriptStats(payload.transcript_path);
    if (stats.model && !rec.model) rec.model = stats.model;
    rec.tokens = stats.tokens;
    rec.transcript = copyTranscript(payload.transcript_path, sessionId);
  }

  // Drop undefined keys to keep the log compact.
  const line = JSON.stringify(rec, (k, v) => (v === undefined ? undefined : v));
  const file = path.join(LOG_DIR, 'sessions', slug(member), `${rec.ts.slice(0, 10)}.jsonl`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, line + '\n');

  // Remember the last session, so the git hook can link the next commit to it.
  if (sessionId) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(path.join(STATE_DIR, 'last-session.json'), JSON.stringify({ tool: TOOL, session_id: sessionId, ts: rec.ts }));
  }
  return kind;
}

let kind = 'unknown';
main()
  .then((k) => { kind = k; })
  .catch(() => {})
  .finally(() => { answer(kind); process.exit(0); });
