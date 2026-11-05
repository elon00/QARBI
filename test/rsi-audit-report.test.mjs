import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { markRsiAuditUnverified, writeRsiAuditReport } from '../scripts/rsi-audit-report.mjs';

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
    'rsi-audit-outcome.mjs', 'validate-rsi-audit.mjs', 'rsi-bounded-command.mjs',
    'git-verification-source-guard.mjs']) {
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
  assert.match(run.stderr, /BLOCKED: unable to verify source worktree integrity/);
  const current = JSON.parse(fs.readFileSync(report, 'utf8'));
  assert.equal(current.status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
  assert.equal(Object.hasOwn(current, 'resultDigest'), false);
});

test('report output symlink cannot overwrite a verification source', t => {
  if (process.platform === 'win32') return t.skip('symlink privileges are not guaranteed on Windows');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const reportDir = path.join(root, 'reality');
  fs.mkdirSync(reportDir);
  const source = path.join(root, 'verification-source.mjs');
  fs.writeFileSync(source, 'export const safe = true;\n');
  fs.symlinkSync(source, path.join(reportDir, 'RAVEN_REA_RSI_AUDIT.json'));
  assert.throws(() => markRsiAuditUnverified(root), /BLOCKED/);
  assert.equal(fs.readFileSync(source, 'utf8'), 'export const safe = true;\n');
});

test('report directory symlink cannot redirect evidence outside checkout', t => {
  if (process.platform === 'win32') return t.skip('symlink privileges are not guaranteed on Windows');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-report-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-outside-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.symlinkSync(outside, path.join(root, 'reality'), 'dir');
  assert.throws(() => markRsiAuditUnverified(root), /BLOCKED/);
  assert.equal(fs.existsSync(path.join(outside, 'RAVEN_REA_RSI_AUDIT.json')), false);
});

test('final successful audit writer also rejects a symlink destination', t => {
  if (process.platform === 'win32') return t.skip('symlink privileges are not guaranteed on Windows');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const reportDir = path.join(root, 'reality');
  fs.mkdirSync(reportDir);
  const source = path.join(root, 'verification-source.mjs');
  fs.writeFileSync(source, 'export const safe = true;\n');
  fs.symlinkSync(source, path.join(reportDir, 'RAVEN_REA_RSI_AUDIT.json'));
  assert.throws(() => writeRsiAuditReport(root, { status: 'REVIEW_REQUIRED_NOT_ADOPTED' }), /BLOCKED/);
  assert.equal(fs.readFileSync(source, 'utf8'), 'export const safe = true;\n');
});


test('initial RSI invalidation does not overwrite a hardlinked verification source', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-hardlink-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const reportDir = path.join(root, 'reality');
  fs.mkdirSync(reportDir);
  const source = path.join(root, 'verification-source.mjs');
  const original = 'export const protectedSource = true;\\n';
  fs.writeFileSync(source, original);
  const report = path.join(reportDir, 'RAVEN_REA_RSI_AUDIT.json');
  try { fs.linkSync(source, report); } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip(`hardlinks unavailable: ${error.code}`);
    throw error;
  }
  markRsiAuditUnverified(root);
  assert.equal(fs.readFileSync(source, 'utf8'), original);
  assert.equal(JSON.parse(fs.readFileSync(report, 'utf8')).status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
  assert.equal(fs.readdirSync(reportDir).filter(name => name.endsWith('.tmp')).length, 0);
});

test('final RSI audit write does not overwrite a hardlinked verification source', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-rsi-hardlink-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const reportDir = path.join(root, 'reality');
  fs.mkdirSync(reportDir);
  const source = path.join(root, 'verification-source.mjs');
  const original = 'export const protectedSource = true;\\n';
  fs.writeFileSync(source, original);
  const report = path.join(reportDir, 'RAVEN_REA_RSI_AUDIT.json');
  try { fs.linkSync(source, report); } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip(`hardlinks unavailable: ${error.code}`);
    throw error;
  }
  writeRsiAuditReport(root, { status: 'REVIEW_REQUIRED_NOT_ADOPTED' });
  assert.equal(fs.readFileSync(source, 'utf8'), original);
  assert.equal(JSON.parse(fs.readFileSync(report, 'utf8')).status, 'REVIEW_REQUIRED_NOT_ADOPTED');
  assert.equal(fs.readdirSync(reportDir).filter(name => name.endsWith('.tmp')).length, 0);
});
