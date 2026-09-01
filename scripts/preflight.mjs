#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import process from 'node:process';

function fail(message) {
  console.error('PREFLIGHT: FAIL — ' + message);
  process.exit(1);
}

const major = Number(process.versions.node.split('.')[0]);
if (!Number.isFinite(major) || major < 20) fail('Node.js 20+ is required; found ' + process.version);
console.log('PREFLIGHT: Node.js', process.version, 'PASS');

try {
  execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });
  const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
  if (status) {
    console.warn('PREFLIGHT: WARN — working tree has uncommitted changes.');
  } else {
    console.log('PREFLIGHT: clean Git working tree PASS');
  }
} catch {
  console.warn('PREFLIGHT: WARN — Git status unavailable; continuing.');
}

console.log('PREFLIGHT: PASS — runtime and repository checks completed');
