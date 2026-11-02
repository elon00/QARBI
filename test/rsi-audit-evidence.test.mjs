import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateRsiAuditEvidence, REQUIRED_RSI_CHECKS } from '../scripts/validate-rsi-audit.mjs';
import { rsiResultDigest } from '../scripts/rsi-result-integrity.mjs';

const COMMIT = 'a'.repeat(40);
const valid = () => {
  const now = Date.now();
  const evidenceStore = {
    timestamp: new Date(now).toISOString(), gitCommit: COMMIT, gitBranch: 'review',
    nodeVersion: 'v22.16.0', platform: 'linux', rpcConfigured: false,
    deployedManifestState: 'UNVERIFIED_TESTNET_RECORD', invariantsAuditTimestamp: now
  };
  const audit = {
    status: 'REVIEW_REQUIRED_NOT_ADOPTED', candidateAdopted: false, truthCheckPassed: true,
    baselineCommit: COMMIT, evidenceStore,
    evidenceHash: crypto.createHash('sha256').update(JSON.stringify(evidenceStore)).digest('hex'),
    evaluatedScore: 0.7,
    validationResults: Object.fromEntries(REQUIRED_RSI_CHECKS.map(key => [key, true])),
    durationMs: 42
  };
  audit.resultDigest = rsiResultDigest(audit);
  return audit;
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


test('rejects altered result fields even when input evidence hash remains unchanged', () => {
  const changedDuration = valid(); changedDuration.durationMs += 1;
  const changedChecks = valid(); changedChecks.validationResults.typecheck = false;
  const changedScore = valid(); changedScore.evaluatedScore = 0.5;
  const missingDigest = valid(); delete missingDigest.resultDigest;
  const invalidDuration = valid(); invalidDuration.durationMs = -1; invalidDuration.resultDigest = rsiResultDigest(invalidDuration);
  for (const audit of [changedDuration, changedChecks, changedScore, missingDigest, invalidDuration]) {
    assert.throws(() => validateRsiAuditEvidence(audit, COMMIT), /BLOCKED/);
  }
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

test('rejects malformed optional invocation challenges even with recomputed local digests', () => {
  // Standalone audits may omit a mission challenge; if present it must match
  // the runner's 32-character lowercase hexadecimal invocation format.
  assert.equal(validateRsiAuditEvidence(valid(), COMMIT), true);
  const canonical = valid();
  canonical.evidenceStore.invocationChallenge = 'ab'.repeat(16);
  canonical.evidenceHash = crypto.createHash('sha256').update(JSON.stringify(canonical.evidenceStore)).digest('hex');
  canonical.resultDigest = rsiResultDigest(canonical);
  assert.equal(validateRsiAuditEvidence(canonical, COMMIT), true);
  for (const malformed of ['', 'AB'.repeat(16), 'x'.repeat(32), 42, null]) {
    const audit = valid();
    audit.evidenceStore.invocationChallenge = malformed;
    audit.evidenceHash = crypto.createHash('sha256').update(JSON.stringify(audit.evidenceStore)).digest('hex');
    audit.resultDigest = rsiResultDigest(audit);
    assert.throws(() => validateRsiAuditEvidence(audit, COMMIT), /BLOCKED/);
  }
});

test('rejects unrecognized certification and external-runtime fields even with valid local digests', () => {
  const extraAuditClaim = valid();
  extraAuditClaim.productionCertified = true;
  assert.throws(() => validateRsiAuditEvidence(extraAuditClaim, COMMIT), /BLOCKED/);

  const extraStoreClaim = valid();
  extraStoreClaim.evidenceStore.externalRavenVerified = true;
  extraStoreClaim.evidenceHash = crypto.createHash('sha256')
    .update(JSON.stringify(extraStoreClaim.evidenceStore)).digest('hex');
  extraStoreClaim.resultDigest = rsiResultDigest(extraStoreClaim);
  assert.throws(() => validateRsiAuditEvidence(extraStoreClaim, COMMIT), /BLOCKED/);

  // Preserve canonical evidence generated by the bounded local runner.
  assert.equal(validateRsiAuditEvidence(valid(), COMMIT), true);
});
