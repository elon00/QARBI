import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
