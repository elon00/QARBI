import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateRsiAuditEvidence, REQUIRED_RSI_CHECKS } from '../scripts/validate-rsi-audit.mjs';
import { rsiResultDigest } from '../scripts/rsi-result-integrity.mjs';

const COMMIT = 'a'.repeat(40);
const NOW = Date.parse('2026-11-02T05:00:00.000Z');

function fixture(elapsedMs = 1000, durationMs = 900) {
  const startedAt = NOW - elapsedMs;
  const evidenceStore = {
    timestamp: new Date(startedAt).toISOString(),
    gitCommit: COMMIT,
    gitBranch: 'review',
    nodeVersion: 'v22.16.0',
    platform: 'linux',
    rpcConfigured: false,
    deployedManifestState: 'UNVERIFIED_TESTNET_RECORD',
    invariantsAuditTimestamp: startedAt
  };
  const audit = {
    status: 'REVIEW_REQUIRED_NOT_ADOPTED',
    candidateAdopted: false,
    truthCheckPassed: true,
    baselineCommit: COMMIT,
    evidenceStore,
    evidenceHash: crypto.createHash('sha256').update(JSON.stringify(evidenceStore)).digest('hex'),
    evaluatedScore: 0.7,
    validationResults: Object.fromEntries(REQUIRED_RSI_CHECKS.map(key => [key, true])),
    durationMs
  };
  audit.resultDigest = rsiResultDigest(audit);
  return audit;
}

test('accepts a duration consistent with elapsed wall time', () => {
  assert.equal(validateRsiAuditEvidence(fixture(), COMMIT, NOW), true);
});

test('rejects impossible duration despite a recomputed result digest', () => {
  assert.throws(() => validateRsiAuditEvidence(fixture(1000, 300000), COMMIT, NOW), /BLOCKED/);
});

test('rejects extreme safe-integer duration despite a recomputed result digest', () => {
  assert.throws(() => validateRsiAuditEvidence(fixture(1000, Number.MAX_SAFE_INTEGER), COMMIT, NOW), /BLOCKED/);
});
