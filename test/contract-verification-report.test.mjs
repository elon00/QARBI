import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, linkSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { markContractVerificationUnverified, writeContractVerificationReport } from '../scripts/contract-verification-report.mjs';

function withTempRoot(fn) {
  const root = mkdtempSync(join(tmpdir(), 'qarbi-contract-report-'));
  try { fn(root); } finally { rmSync(root, { recursive: true, force: true }); }
}

test('a stale successful verification cannot survive a new invocation', () => withTempRoot(root => {
  const dir = join(root, 'reports', 'reality');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'contract-verification.json'), JSON.stringify({ status: 'VERIFIED_ON_CHAIN_RUNTIME_CODE', allContractsVerified: true, checkedAt: '2026-10-16T14:13:13Z' }));
  markContractVerificationUnverified(root, new Date('2026-11-02T02:30:00Z'));
  const current = JSON.parse(readFileSync(join(dir, 'contract-verification.json'), 'utf8'));
  assert.equal(current.status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
  assert.equal(current.allContractsVerified, false);
  assert.equal(current.contractsCount, 0);
  assert.deepEqual(current.results, []);
  assert.equal(current.checkedAt, '2026-11-02T02:30:00.000Z');
}));

test('a new invocation begins blocked even without an earlier report', () => withTempRoot(root => {
  const output = markContractVerificationUnverified(root);
  const report = JSON.parse(readFileSync(output, 'utf8'));
  assert.equal(report.status, 'BLOCKED_CURRENT_RUN_UNVERIFIED');
  assert.equal(report.allContractsVerified, false);
  assert.equal(report.chainId, 421614);
}));

test('hardlinked preflight report cannot overwrite source', () => withTempRoot(root => {
  const dir = join(root, 'reports', 'reality');
  mkdirSync(dir, { recursive: true });
  const source = join(root, 'protected.mjs');
  const original = 'export const trusted = true;\n';
  writeFileSync(source, original);
  linkSync(source, join(dir, 'contract-verification.json'));
  markContractVerificationUnverified(root);
  assert.equal(readFileSync(source, 'utf8'), original);
}));

test('symlinked preflight report cannot redirect source write', () => withTempRoot(root => {
  if (process.platform === 'win32') return;
  const dir = join(root, 'reports', 'reality');
  mkdirSync(dir, { recursive: true });
  const source = join(root, 'protected.mjs');
  writeFileSync(source, 'safe\n');
  symlinkSync(source, join(dir, 'contract-verification.json'));
  assert.throws(() => markContractVerificationUnverified(root), /BLOCKED/);
  assert.equal(readFileSync(source, 'utf8'), 'safe\n');
}));

test('symlinked reports parent directory cannot redirect evidence', () => withTempRoot(root => {
  if (process.platform === 'win32') return;
  const outside = mkdtempSync(join(tmpdir(), 'qarbi-report-outside-'));
  try {
    symlinkSync(outside, join(root, 'reports'), 'dir');
    assert.throws(() => markContractVerificationUnverified(root), /BLOCKED/);
  } finally { rmSync(outside, { recursive: true, force: true }); }
}));

test('symlinked reality directory cannot redirect evidence', () => withTempRoot(root => {
  if (process.platform === 'win32') return;
  const outside = mkdtempSync(join(tmpdir(), 'qarbi-report-outside-'));
  try {
    mkdirSync(join(root, 'reports'));
    symlinkSync(outside, join(root, 'reports', 'reality'), 'dir');
    assert.throws(() => markContractVerificationUnverified(root), /BLOCKED/);
  } finally { rmSync(outside, { recursive: true, force: true }); }
}));

test('final verified report replaces preflight evidence atomically', () => withTempRoot(root => {
  const reportPath = markContractVerificationUnverified(root);
  assert.equal(writeContractVerificationReport(root, { status: 'VERIFIED_ON_CHAIN_RUNTIME_CODE', allContractsVerified: true }), reportPath);
  assert.deepEqual(JSON.parse(readFileSync(reportPath, 'utf8')), { status: 'VERIFIED_ON_CHAIN_RUNTIME_CODE', allContractsVerified: true });
}));

test('hardlinked final report cannot overwrite protected source', () => withTempRoot(root => {
  const dir = join(root, 'reports', 'reality');
  mkdirSync(dir, { recursive: true });
  const source = join(root, 'protected.mjs');
  writeFileSync(source, 'export const trusted = true;\n');
  linkSync(source, join(dir, 'contract-verification.json'));
  writeContractVerificationReport(root, { status: 'VERIFIED_ON_CHAIN_RUNTIME_CODE' });
  assert.equal(readFileSync(source, 'utf8'), 'export const trusted = true;\n');
}));
