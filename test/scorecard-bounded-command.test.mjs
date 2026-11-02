import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runRsiCommand } from '../scripts/rsi-bounded-command.mjs';

const scorecardSource = readFileSync(fileURLToPath(new URL('../scripts/reality-scorecard-v3.mjs', import.meta.url)), 'utf8');

test('scorecard uses the bounded command helper for every subprocess', () => {
  assert.match(scorecardSource, /import\s*\{\s*runRsiCommand\s+as\s+execSync\s*\}\s*from\s*['"]\.\/rsi-bounded-command\.mjs['"]/);
  assert.doesNotMatch(scorecardSource, /import\s*\{[^}]*\bexecSync\b[^}]*\}\s*from\s*['"]node:child_process['"]/);
  assert.match(scorecardSource, /execSync\(['"]node scripts\/raven-rea-rsi-runner\.mjs['"]/);
});

test('scorecard-style subprocess propagates nonzero exit codes', () => {
  assert.throws(() => runRsiCommand('node -e "process.exit(9)"', { timeoutMs: 1000, stdio: 'pipe' }));
});

test('scorecard-style stalled subprocess is terminated at deadline', () => {
  assert.throws(
    () => runRsiCommand('node -e "setTimeout(()=>{},2000)"', { timeoutMs: 80, stdio: 'pipe' }),
    error => error.code === 'ETIMEDOUT' || error.signal === 'SIGTERM'
  );
});
