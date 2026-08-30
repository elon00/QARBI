#!/usr/bin/env node
import { execSync } from 'node:child_process';

const run = (cmd) => {
  console.log('\n>>>', cmd);
  execSync(cmd, { stdio: 'inherit' });
};

try {
  // One-command recovery for a clean checkout. This intentionally regenerates
  // the lockfile from package.json instead of hand-editing cryptographic deps.
  run('npm install --package-lock-only');
  run('npm ci');
  run('npm run pqc:provider-gate');
  run('npm run pqc:boundary');
  run('npm run pqc:gate');
  run('npm run security:taskmarket');
  run('npm run pqc:smoke');
  console.log('\nMAGIC FIX: PASS');
} catch (error) {
  console.error('\nMAGIC FIX: FAIL — stop here and fix the first real failing command.');
  process.exit(1);
}
