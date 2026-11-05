import test from 'node:test';
import assert from 'node:assert/strict';
import { missionExitCode, REQUIRED_MISSION_STAGE_IDS } from '../scripts/mission-status.mjs';

const passingStages = () => REQUIRED_MISSION_STAGE_IDS.map(id => ({ id, status: 'PASS' }));

test('all fourteen required stages passing returns a successful exit code', () => {
  assert.equal(missionExitCode(passingStages()), 0);
});

test('failed or blocked required stages cause a nonzero exit code', () => {
  for (const status of ['FAILED', 'BLOCKED', 'SKIP', 'PARTIAL']) {
    const stages = passingStages();
    stages[7].status = status;
    assert.equal(missionExitCode(stages), 1, status);
  }
});

test('missing, malformed or empty stage evidence fails closed', () => {
  for (const stages of [[], null, undefined, {}, [null], [{}]]) {
    assert.equal(missionExitCode(stages), 1);
  }
});

test('incomplete, duplicate, unexpected or reordered stage IDs fail closed', () => {
  const missing = passingStages().slice(0, -1);
  const duplicate = passingStages(); duplicate[13] = { id: '13', status: 'PASS' };
  const unexpected = passingStages(); unexpected[13] = { id: '99', status: 'PASS' };
  const reordered = passingStages(); [reordered[0], reordered[1]] = [reordered[1], reordered[0]];
  const noId = passingStages(); delete noId[2].id;
  for (const stages of [missing, duplicate, unexpected, reordered, noId]) {
    assert.equal(missionExitCode(stages), 1);
  }
});
