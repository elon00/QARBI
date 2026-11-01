import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifiedRsiStageDetails } from '../scripts/mission-rsi-stage.mjs';
import { REQUIRED_RSI_CHECKS } from '../scripts/validate-rsi-audit.mjs';

const commit = 'a'.repeat(40);
const valid = () => {
  const now = Date.now();
  const evidenceStore = {
    timestamp: new Date(now).toISOString(), gitCommit: commit, gitBranch: 'review',
    nodeVersion: 'v22.16.0', platform: 'linux', rpcConfigured: false,
    deployedManifestState: 'UNVERIFIED_TESTNET_RECORD', invariantsAuditTimestamp: now
  };
  return {
    status: 'REVIEW_REQUIRED_NOT_ADOPTED', candidateAdopted: false, truthCheckPassed: true,
    baselineCommit: commit, evidenceStore,
    evidenceHash: crypto.createHash('sha256').update(JSON.stringify(evidenceStore)).digest('hex'),
    evaluatedScore: 0.7,
    validationResults: Object.fromEntries(REQUIRED_RSI_CHECKS.map(key => [key, true]))
  };
};

test('mission stage accepts complete bounded evidence but never claims external Raven verification', () => {
  assert.deepEqual(verifiedRsiStageDetails(valid(), commit), { rsiScore: '70.0/100', externalRavenVerified: false });
});

test('mission stage rejects fabricated, incomplete and failed RSI evidence', () => {
  const tampered = valid(); tampered.evidenceStore.rpcConfigured = true;
  for (const audit of [
    null, {},
    { ...valid(), validationResults: { ...valid().validationResults, dependencyAudit: false } },
    { ...valid(), validationResults: { ...valid().validationResults, fabricated: true } },
    { ...valid(), candidateAdopted: true },
    { ...valid(), baselineCommit: 'c'.repeat(40) },
    { ...valid(), evidenceHash: 'fake' },
    { ...valid(), evaluatedScore: 1 },
    tampered
  ]) assert.throws(() => verifiedRsiStageDetails(audit, commit), /BLOCKED/);
});
