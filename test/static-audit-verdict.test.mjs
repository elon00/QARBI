import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeStaticAudit } from '../scripts/static-audit-verdict.mjs';

const valid = () => Array.from({length:5}, (_,i) => ({
  contract: `C${i}.sol`, bytecodeSizeBytes: 100, eip170Compliant: true,
  vulnerabilitiesFound: 0, issues: []
}));

test('five valid artifacts produce only a limited-pattern PASS', () => {
  const v = summarizeStaticAudit(valid());
  assert.equal(v.passed, true);
  assert.equal(v.status, 'PASS_LIMITED_STATIC_PATTERN_CHECKS');
  assert.equal(v.standardCompliance.eip170SizeLimits, true);
  assert.equal(v.standardCompliance.accessControlEnforced, null);
});

test('missing or zero-byte artifacts block a passing verdict', () => {
  const results = valid(); results[0].bytecodeSizeBytes = 0; results[0].eip170Compliant = false;
  const v = summarizeStaticAudit(results);
  assert.equal(v.passed, false);
  assert.equal(v.standardCompliance.eip170SizeLimits, false);
  assert.equal(v.status, 'BLOCKED_BYTECODE_SIZE_UNVERIFIED_OR_EXCEEDED');
});

test('EIP-170 allows 24576 bytes but rejects 24577', () => {
  const results = valid(); results[0].bytecodeSizeBytes = 24576; results[0].eip170Compliant = true;
  assert.equal(summarizeStaticAudit(results).passed, true);
  results[0].bytecodeSizeBytes = 24577; results[0].eip170Compliant = false;
  assert.equal(summarizeStaticAudit(results).passed, false);
});

test('a detected vulnerability fails despite valid bytecode', () => {
  const results = valid(); results[0].issues = [{id:'SEC-01'}]; results[0].vulnerabilitiesFound = 1;
  const v = summarizeStaticAudit(results);
  assert.equal(v.passed, false);
  assert.equal(v.issuesFound, 1);
  assert.equal(v.status, 'FAIL_STATIC_PATTERNS_DETECTED');
});

test('incomplete or inconsistent scan results fail closed', () => {
  assert.throws(() => summarizeStaticAudit([]), /BLOCKED/);
  const results = valid(); results[0].vulnerabilitiesFound = 1;
  assert.throws(() => summarizeStaticAudit(results), /BLOCKED/);
});
