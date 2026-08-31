#!/usr/bin/env node
const { spawnSync } = require('child_process');

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

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

for (const [name, args] of phases) {
  console.log('\n' + '='.repeat(72));
  console.log('ONE-CLICK PHASE: ' + name);
  console.log('='.repeat(72));

  // shell:false keeps command arguments out of a shell and avoids DEP0190.
  const result = spawnSync(npmCommand, args, { stdio: 'inherit', shell: false });
  if (result.error) {
    console.error('ONE-CLICK: FAIL — unable to start npm:', result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error('\nONE-CLICK: FAIL at ' + name);
    process.exit(result.status || 1);
  }
}

console.log('\nONE-CLICK: PASS — all applicable local evidence gates passed');
console.log('Truthfulness rule: this command never fabricates keys, funds, deployments, PQC proofs, blockchain receipts, or production claims.');
