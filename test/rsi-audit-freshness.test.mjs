import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateRsiAuditEvidence, REQUIRED_RSI_CHECKS, MAX_RSI_EVIDENCE_AGE_MS, MAX_RSI_CLOCK_SKEW_MS } from '../scripts/validate-rsi-audit.mjs';
import { rsiResultDigest } from '../scripts/rsi-result-integrity.mjs';
const COMMIT = 'a'.repeat(40);
const NOW = Date.parse('2026-11-01T18:00:00.000Z');
function evidence(when=NOW, captured=when) {
 const evidenceStore={timestamp:new Date(when).toISOString(),gitCommit:COMMIT,gitBranch:'review',nodeVersion:'v22.16.0',platform:'linux',rpcConfigured:false,deployedManifestState:'UNVERIFIED_TESTNET_RECORD',invariantsAuditTimestamp:captured};
 const audit = {status:'REVIEW_REQUIRED_NOT_ADOPTED',candidateAdopted:false,truthCheckPassed:true,baselineCommit:COMMIT,evidenceStore,evidenceHash:crypto.createHash('sha256').update(JSON.stringify(evidenceStore)).digest('hex'),evaluatedScore:0.7,validationResults:Object.fromEntries(REQUIRED_RSI_CHECKS.map(x=>[x,true])),durationMs:42};
 audit.resultDigest=rsiResultDigest(audit);
 return audit;
}
test('fresh, internally consistent evidence accepted',()=>assert.equal(validateRsiAuditEvidence(evidence(),COMMIT,NOW),true));
test('same-commit replay of stale but rehashed evidence rejected',()=>assert.throws(()=>validateRsiAuditEvidence(evidence(NOW-MAX_RSI_EVIDENCE_AGE_MS-1),COMMIT,NOW),/BLOCKED/));
test('future dated but rehashed evidence rejected',()=>assert.throws(()=>validateRsiAuditEvidence(evidence(NOW+MAX_RSI_CLOCK_SKEW_MS+1),COMMIT,NOW),/BLOCKED/));
test('inconsistent dual timestamps rejected despite valid hash',()=>assert.throws(()=>validateRsiAuditEvidence(evidence(NOW,NOW-61000),COMMIT,NOW),/BLOCKED/));
test('future invariant timestamp rejected despite valid hash',()=>assert.throws(()=>validateRsiAuditEvidence(evidence(NOW+120000,NOW+120001),COMMIT,NOW),/BLOCKED/));
test('invalid evaluation clock rejected',()=>assert.throws(()=>validateRsiAuditEvidence(evidence(),COMMIT,NaN),/BLOCKED/));

function rehashTimestamp(audit, timestamp) {
 audit.evidenceStore.timestamp = timestamp;
 audit.evidenceHash = crypto.createHash('sha256').update(JSON.stringify(audit.evidenceStore)).digest('hex');
 audit.resultDigest = rsiResultDigest(audit);
 return audit;
}
test('rejects ambiguous timezone-free timestamps despite matching local hashes', () => {
 const audit = rehashTimestamp(evidence(), '2026-11-01T18:00:00');
 assert.throws(() => validateRsiAuditEvidence(audit, COMMIT, NOW), /BLOCKED/);
});
test('rejects impossible calendar dates normalized by Date.parse despite matching hashes', () => {
 const march2 = Date.parse('2026-03-02T18:00:00.000Z');
 const audit = rehashTimestamp(evidence(march2), '2026-02-30T18:00:00.000Z');
 assert.throws(() => validateRsiAuditEvidence(audit, COMMIT, march2), /BLOCKED/);
});
