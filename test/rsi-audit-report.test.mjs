import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { markRsiAuditUnverified } from '../scripts/rsi-audit-report.mjs';

test('a new RSI invocation invalidates a previous successful audit before validation', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const report = path.join(root, 'reality', 'RAVEN_REA_RSI_AUDIT.json');
  fs.mkdirSync(path.dirname(report), { recursive: true });
  fs.writeFileSync(report, JSON.stringify({ status: 'REVIEW_REQUIRED_NOT_ADOPTED',
    resultDigest: 'a'.repeat(64), truthCheckPassed: true }));
  assert.equal(markRsiAuditUnverified(root), report);
  const current = JSON.parse(fs.readFileSync(report, 'utf8'));
  assert.equal(current.status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
  assert.equal(current.candidateAdopted, false);
  assert.equal(Object.hasOwn(current, 'resultDigest'), false);
  assert.equal(Object.hasOwn(current, 'truthCheckPassed'), false);
});

test('repeated initialization remains blocked, never reuses earlier result', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  markRsiAuditUnverified(root);
  markRsiAuditUnverified(root);
  const current = JSON.parse(fs.readFileSync(path.join(root, 'reality', 'RAVEN_REA_RSI_AUDIT.json'), 'utf8'));
  assert.equal(current.status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
});

test('runner startup failure leaves the current report blocked rather than reusing prior success', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-runner-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const scripts = path.join(root, 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  for (const name of ['raven-rea-rsi-runner.mjs', 'rsi-audit-report.mjs', 'rsi-result-integrity.mjs',
    'rsi-audit-outcome.mjs', 'validate-rsi-audit.mjs']) {
    fs.copyFileSync(path.join(import.meta.dirname, '..', 'scripts', name), path.join(scripts, name));
  }
  const report = path.join(root, 'reality', 'RAVEN_REA_RSI_AUDIT.json');
  fs.mkdirSync(path.dirname(report), { recursive: true });
  fs.writeFileSync(report, JSON.stringify({ status: 'REVIEW_REQUIRED_NOT_ADOPTED',
    resultDigest: 'b'.repeat(64), truthCheckPassed: true }));
  // No Git repository exists in this temp root, so git rev-parse must fail early.
  const run = spawnSync(process.execPath, [path.join(scripts, 'raven-rea-rsi-runner.mjs')], {
    cwd: root, encoding: 'utf8', timeout: 10000
  });
  assert.notEqual(run.status, 0);
  const current = JSON.parse(fs.readFileSync(report, 'utf8'));
  assert.equal(current.status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
  assert.equal(Object.hasOwn(current, 'resultDigest'), false);
});
