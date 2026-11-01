import test from 'node:test';
import assert from 'node:assert/strict';
import { missionExitCode } from '../scripts/mission-status.mjs';

test('all stages passing returns a successful exit code', () => {
  assert.equal(missionExitCode([{status:'PASS'}, {status:'PASS'}]), 0);
});

test('failed or blocked stages cause a nonzero exit code', () => {
  for (const status of ['FAILED', 'BLOCKED', 'SKIP', 'PARTIAL']) {
    assert.equal(missionExitCode([{status:'PASS'}, {status}]), 1, status);
  }
});

test('missing, malformed or empty stage evidence fails closed', () => {
  for (const stages of [[], null, undefined, {}, [null], [{}]]) {
    assert.equal(missionExitCode(stages), 1);
  }
});
