#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';

if (process.platform === 'win32') {
  const nodeDir = path.dirname(process.execPath);
  const parts = (process.env.PATH || '').split(path.delimiter);
  if (!parts.some((p) => p.replace(/\\/g, '/').toLowerCase() === nodeDir.replace(/\\/g, '/').toLowerCase())) {
    process.env.PATH = nodeDir + path.delimiter + (process.env.PATH || '');
  }
}

const stages = [
  ['DISCOVER', ['run', 'preflight']],
  ['CLASSIFY', ['run', 'requirement:check']],
  ['AUDIT', ['run', 'oneclick:release']],
  ['FIX', ['run', 'magic:fix']],
  ['TEST', ['run', 'test']],
  ['VERIFY', ['run', 'verify:testnet']],
  ['DEPLOY', ['run', 'deploy:state']],
  ['REPORT', ['run', 'reality:report']],
];

function npmInvocation(args) {
  if (process.env.npm_execpath) return [process.execPath, [process.env.npm_execpath, ...args]];
  if (process.platform === 'win32') return [process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args]];
  return ['npm', args];
}

function run(label, args) {
  console.log(`\n${'='.repeat(72)}\nQMOOSA MASTER: ${label}\n${'='.repeat(72)}`);
  const [command, commandArgs] = npmInvocation(args);
  const result = spawnSync(command, commandArgs, {
    stdio: 'inherit',
    shell: false,
    windowsHide: false,
    env: process.env,
  });
  if (result.error) {
    console.error(`QMOOSA MASTER: STOPPED at ${label} — ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`QMOOSA MASTER: STOPPED at ${label}`);
    process.exit(result.status || 1);
  }
}

for (const [label, args] of stages) {
  // FIX is advisory: deterministic low-risk fixes may be unavailable in a local checkout.
  if (label === 'FIX') {
    const [command, commandArgs] = npmInvocation(args);
    const result = spawnSync(command, commandArgs, {
      stdio: 'inherit',
      shell: false,
      windowsHide: false,
      env: process.env,
    });
    if (result.error || result.status !== 0) {
      console.warn('QMOOSA MASTER: FIX stage did not complete; continuing without claiming a fix.');
    }
    continue;
  }
  run(label, args);
}

console.log('\nQMOOSA MASTER: PASS — orchestration completed with evidence-gated stages.');
