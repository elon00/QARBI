#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const stages = [
  ['DISCOVER', ['run', 'preflight']],
  ['CLASSIFY', ['run', 'requirement:check']],
  ['AUDIT', ['run', 'oneclick:release']],
  ['FIX', ['run', 'magic:fix']],
  ['TEST', ['run', 'test']],
  ['VERIFY', ['run', 'verify:testnet']],
  ['DEPLOY', ['run', 'finish:all']],
  ['REPORT', ['run', 'reality:report']],
];

function npmInvocation(args) {
  if (process.env.npm_execpath) return [process.execPath, [process.env.npm_execpath, ...args]];
  if (process.platform === 'win32') return [process.env.ComSpec || 'cmd.exe', ['/d', '/c', 'npm.cmd', ...args]];
  return ['npm', args];
}

function run(label, args) {
  console.log(`\n${'='.repeat(72)}\nQMOOSA MASTER: ${label}\n${'='.repeat(72)}`);
  const [command, commandArgs] = npmInvocation(args);
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', shell: false, windowsHide: false });
  if (result.error) {
    console.error(`QMOOSA MASTER: FAIL at ${label}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`QMOOSA MASTER: FAIL at ${label}`);
    process.exit(result.status || 1);
  }
}

for (const [label, args] of stages) {
  // FIX is advisory: deterministic low-risk fixes may be unavailable in a local checkout.
  if (label === 'FIX') {
    const [command, commandArgs] = npmInvocation(args);
    const result = spawnSync(command, commandArgs, { stdio: 'inherit', shell: false, windowsHide: false });
    if (result.error || result.status !== 0) console.warn('QMOOSA MASTER: FIX stage did not complete; continuing without claiming a fix.');
    continue;
  }
  run(label, args);
}

console.log('\nQMOOSA MASTER: PASS — orchestration completed with evidence-gated stages.');
