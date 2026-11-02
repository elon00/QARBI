import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { markContractVerificationUnverified } from '../scripts/contract-verification-report.mjs';

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
