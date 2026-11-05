import test from 'node:test';
import assert from 'node:assert/strict';
import { rsiResultDigest } from '../scripts/rsi-result-integrity.mjs';

const fixture = () => ({
  baselineCommit: 'a'.repeat(40),
  evidenceHash: 'b'.repeat(64),
  validationResults: { typecheck: true, dependencyAudit: true },
  truthCheckPassed: true,
  evaluatedScore: 0.7,
  candidateAdopted: false,
  status: 'REVIEW_REQUIRED_NOT_ADOPTED',
  durationMs: 42
});

test('result digest stable for identical audit fields', () => {
  assert.equal(rsiResultDigest(fixture()), rsiResultDigest(fixture()));
});

test('result digest changes if a failed check is replaced with PASS', () => {
  const audit = fixture();
  audit.validationResults.typecheck = false;
  const before = rsiResultDigest(audit);
  audit.validationResults.typecheck = true;
  assert.notEqual(before, rsiResultDigest(audit));
});

test('result digest binds score, truth status and elapsed time', () => {
  const audit = fixture();
  const baseline = rsiResultDigest(audit);
  for (const [key, value] of [
    ['evaluatedScore', 1], ['truthCheckPassed', false],
    ['durationMs', -1], ['candidateAdopted', true]
  ]) {
    assert.notEqual(baseline, rsiResultDigest({ ...audit, [key]: value }));
  }
});
