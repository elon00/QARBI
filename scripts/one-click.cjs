#!/usr/bin/env node
const { spawnSync } = require('child_process');

const mode = process.argv[2] || 'dev';
const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
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

function run(label, args) {
  console.log('\n' + '='.repeat(72));
  console.log('ONE-CLICK PHASE: ' + label);
  console.log('='.repeat(72));

  let result;
  if (isWindows) {
    // Git Bash launches this Node process directly; spawning npm.cmd directly
    // avoids the npm.cmd/command-shell EINVAL issue seen with nested shell calls.
    result = spawnSync(npmCommand, args, { stdio: 'inherit', shell: false });
  } else {
    result = spawnSync(npmCommand, args, { stdio: 'inherit', shell: false });
  }

  if (result.error) {
    console.error('ONE-CLICK: FAIL — unable to start npm:', result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error('\nONE-CLICK: FAIL at ' + label);
    process.exit(result.status || 1);
  }
}

for (const [name, args] of phases) run(name, args);

console.log('\nONE-CLICK: PASS — all applicable local evidence gates passed');
console.log('Truthfulness rule: this command never fabricates keys, funds, deployments, PQC proofs, blockchain receipts, or production claims.');
