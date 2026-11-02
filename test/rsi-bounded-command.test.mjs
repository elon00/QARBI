import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runRsiCommand, MAX_RSI_COMMAND_TIMEOUT_MS } from '../scripts/rsi-bounded-command.mjs';

test('bounded command can execute a local tool without network or signer access', () => {
  assert.match(runRsiCommand('node --version', { encoding: 'utf8' }), /^v\d+\./);
});

test('hung subprocess fails closed at the specified deadline', () => {
  assert.throws(
    () => runRsiCommand('node -e "setTimeout(()=>{},1000)"', { timeoutMs: 75, stdio: 'pipe' }),
    error => error.code === 'ETIMEDOUT' || error.signal === 'SIGTERM'
  );
});

test('nonzero subprocess exits propagate to the caller', () => {
  assert.throws(() => runRsiCommand('node -e "process.exit(7)"', { timeoutMs: 1000, stdio: 'pipe' }));
});

test('invalid or unbounded deadlines are rejected', () => {
  for (const timeoutMs of [0, -1, NaN, Infinity, 1.5, MAX_RSI_COMMAND_TIMEOUT_MS + 1]) {
    assert.throws(() => runRsiCommand('node --version', { timeoutMs }), /BLOCKED/);
  }
});

test('REA/RSI runner routes subprocesses through the bounded wrapper', () => {
  const runner = readFileSync(fileURLToPath(new URL('../scripts/raven-rea-rsi-runner.mjs', import.meta.url)), 'utf8');
  assert.doesNotMatch(runner, /\bexecSync\s*\(/);
  assert.match(runner, /runRsiCommand\('npm audit --audit-level=high'/);
});
