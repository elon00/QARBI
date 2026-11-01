import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateRsiAuditEvidence, REQUIRED_RSI_CHECKS } from '../scripts/validate-rsi-audit.mjs';

const COMMIT = 'a'.repeat(40);
const valid = () => {
  const evidenceStore = {
    timestamp: '2026-11-01T00:00:00.000Z', gitCommit: COMMIT, gitBranch: 'review',
    nodeVersion: 'v22.16.0', platform: 'linux', rpcConfigured: false,
    deployedManifestState: 'UNVERIFIED_TESTNET_RECORD', invariantsAuditTimestamp: 1793491200000
  };
  return {
    status: 'REVIEW_REQUIRED_NOT_ADOPTED', candidateAdopted: false, truthCheckPassed: true,
    baselineCommit: COMMIT, evidenceStore,
    evidenceHash: crypto.createHash('sha256').update(JSON.stringify(evidenceStore)).digest('hex'),
    evaluatedScore: 0.7,
    validationResults: Object.fromEntries(REQUIRED_RSI_CHECKS.map(key => [key, true]))
  };
};

test('accepts complete, commit-bound local evidence without certifying production', () => {
  assert.equal(validateRsiAuditEvidence(valid(), COMMIT), true);
});

test('rejects absent, malformed, incomplete and fabricated check sets', () => {
  for (const audit of [null, {}, [], { ...valid(), validationResults: null },
    { ...valid(), validationResults: [] },
    { ...valid(), validationResults: { ...valid().validationResults, extra: true } },
    { ...valid(), validationResults: { ...valid().validationResults, dependencyAudit: false } },
    { ...valid(), validationResults: { ...valid().validationResults, dependencyAudit: 'true' } },
    { ...valid(), validationResults: Object.fromEntries(REQUIRED_RSI_CHECKS.slice(1).map(k => [k, true]).concat([['fabricated', true]])) }
  ]) assert.throws(() => validateRsiAuditEvidence(audit, COMMIT), /BLOCKED/);
});

test('rejects adoption, truth failures, invalid status and stale or forged commit evidence', () => {
  for (const audit of [
    { ...valid(), candidateAdopted: true },
    { ...valid(), truthCheckPassed: false },
    { ...valid(), status: 'PASS' },
    { ...valid(), baselineCommit: 'c'.repeat(40) },
    { ...valid(), evidenceHash: 'not-a-hash' },
    { ...valid(), evaluatedScore: 1 },
    { ...valid(), evaluatedScore: '0.7' }
  ]) assert.throws(() => validateRsiAuditEvidence(audit, COMMIT), /BLOCKED/);
  assert.throws(() => validateRsiAuditEvidence(valid(), 'd'.repeat(40)), /BLOCKED/);
});


test('rejects tampered or missing evidence preimage and inconsistent score', () => {
  const changed = valid();
  changed.evidenceStore.rpcConfigured = true;
  const wrongCommit = valid();
  wrongCommit.evidenceStore.gitCommit = 'c'.repeat(40);
  for (const audit of [changed, wrongCommit, { ...valid(), evidenceStore: null },
    { ...valid(), evidenceHash: 'b'.repeat(64) },
    { ...valid(), evaluatedScore: 0.1 }]) {
    assert.throws(() => validateRsiAuditEvidence(audit, COMMIT), /BLOCKED/);
  }
});
