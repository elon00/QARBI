#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

if (process.platform === 'win32') {
  const nodeDir = path.dirname(process.execPath);
  const parts = (process.env.PATH || '').split(path.delimiter);
  if (!parts.some((p) => p.replace(/\\/g, '/').toLowerCase() === nodeDir.replace(/\\/g, '/').toLowerCase())) {
    process.env.PATH = nodeDir + path.delimiter + (process.env.PATH || '');
  }
}

const mode = process.argv[2] || 'dev';
const phases = [
  ['Dependency reproducibility', ['ci']],
  ['Typecheck', ['run', 'typecheck']],
  ['PQC reality gate', ['run', 'pqc:real']],
  ['Security gate', ['run', 'security:taskmarket']],
  ['Contract compile', ['run', 'contracts:compile']],
  ['Production guard', ['run', 'production:guard']],
  ...(mode === 'release' ? [['Release evidence gate', ['run', 'release:gate']]] : []),
  ['Production build', ['run', 'build']],
];

function npmInvocation(args) {
  if (process.env.npm_execpath) return [process.execPath, [process.env.npm_execpath, ...args]];
  if (process.platform === 'win32') return [process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args]];
  return ['npm', args];
}

function run(label, args) {
  console.log('\n' + '='.repeat(72));
  console.log('ONE-CLICK PHASE: ' + label);
  console.log('='.repeat(72));
  const [command, commandArgs] = npmInvocation(args);
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', shell: false, env: process.env });
  if (result.error) {
    console.error('ONE-CLICK: FAIL at ' + label + ' — ' + result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error('ONE-CLICK: STOPPED at ' + label + '. Later phases were not run.');
    process.exit(result.status || 1);
  }
}

for (const [name, args] of phases) run(name, args);
console.log('\nONE-CLICK: PASS — all applicable local evidence gates passed');
console.log('Truthfulness rule: this command never fabricates keys, funds, deployments, PQC proofs, blockchain receipts, or production claims.');
