import test from 'node:test';
import assert from 'node:assert/strict';
import { requireRsiRunChallenge } from '../scripts/rsi-run-challenge.mjs';
const challenge = 'ab'.repeat(16);
const evidence = () => ({ evidenceStore: { invocationChallenge: challenge } });
test('accepts evidence bound to this invocation', () => assert.equal(requireRsiRunChallenge(evidence(), challenge), true));
test('rejects replay from a different invocation on the same commit', () => assert.throws(() => requireRsiRunChallenge(evidence(), 'cd'.repeat(16)), /BLOCKED/));
test('rejects absent challenge and missing evidence', () => {
  for (const candidate of [undefined, '', 'invalid', 'AB'.repeat(16)]) {
    assert.throws(() => requireRsiRunChallenge(evidence(), candidate), /BLOCKED/);
  }
  for (const candidate of [null, {}, { evidenceStore: {} }]) {
    assert.throws(() => requireRsiRunChallenge(candidate, challenge), /BLOCKED/);
  }
});
test('rejects non-string challenge values', () => {
  assert.throws(() => requireRsiRunChallenge(evidence(), 42), /BLOCKED/);
});
