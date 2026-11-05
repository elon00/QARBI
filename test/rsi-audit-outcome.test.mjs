import test from 'node:test';
import assert from 'node:assert/strict';
import { rsiAuditOutcome } from '../scripts/rsi-audit-outcome.mjs';
import { REQUIRED_RSI_CHECKS } from '../scripts/validate-rsi-audit.mjs';

const good = () => ({
  truthCheckPassed: true,
  candidateAdopted: false,
  validationResults: Object.fromEntries(REQUIRED_RSI_CHECKS.map(key => [key, true]))
});

test('complete local checks produce review-only, not certified, status', () => {
  assert.deepEqual(rsiAuditOutcome(good()), {status:'REVIEW_REQUIRED_NOT_ADOPTED',exitCode:0});
});

test('failed truth or failed checks are explicitly blocked', () => {
  const truthFailed = {...good(),truthCheckPassed:false};
  const checksFailed = good(); checksFailed.validationResults.dependencyAudit=false;
  for (const evidence of [truthFailed,checksFailed]) {
    assert.deepEqual(rsiAuditOutcome(evidence), {status:'BLOCKED_CURRENT_RUN_UNVERIFIED',exitCode:1});
  }
});

test('empty, partial, fabricated, nonboolean or adopted results fail closed', () => {
  const partial=good(); delete partial.validationResults.dependencyAudit;
  const extra=good(); extra.validationResults.externalRavenVerified=true;
  const stringCheck=good(); stringCheck.validationResults.typecheck='true';
  for (const evidence of [{...good(),validationResults:{}},partial,extra,stringCheck,
    {...good(),candidateAdopted:true},{...good(),validationResults:null}]) {
    assert.deepEqual(rsiAuditOutcome(evidence), {status:'BLOCKED_CURRENT_RUN_UNVERIFIED',exitCode:1});
  }
});
