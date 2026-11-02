import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runRsiCommand } from '../scripts/rsi-bounded-command.mjs';

const missionSource = readFileSync(fileURLToPath(new URL('../scripts/mission-verify.mjs', import.meta.url)), 'utf8');

test('mission runner uses the existing bounded subprocess helper, not direct execSync', () => {
  assert.match(missionSource, /import\s*\{\s*runRsiCommand\s+as\s+execSync\s*\}\s*from\s*['"]\.\/rsi-bounded-command\.mjs['"]/);
  assert.doesNotMatch(missionSource, /import\s*\{[^}]*\bexecSync\b[^}]*\}\s*from\s*['"]node:child_process['"]/);
  assert.match(missionSource, /execSync\(['"]npm run gate:rsi['"]/);
});

test('mission-style subprocess returns command output without network or signers', () => {
  assert.match(runRsiCommand('node --version', { encoding: 'utf8' }), /^v\d+\./);
});

test('mission-style stalled subprocess is terminated by its deadline', () => {
  assert.throws(() => runRsiCommand('node -e "setTimeout(()=>{},2000)"', { timeoutMs: 80, stdio: 'pipe' }),
    error => error.code === 'ETIMEDOUT' || error.signal === 'SIGTERM');
});

test('mission-style failing subprocess propagates nonzero exit', () => {
  assert.throws(() => runRsiCommand('node -e "process.exit(7)"', { timeoutMs: 1000, stdio: 'pipe' }));
});
