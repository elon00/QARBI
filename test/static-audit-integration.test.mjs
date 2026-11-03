import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const names = ['QARBIToken','AgentRegistry','TaskMarket','ConwayEngine','AgentWallet'];
const script = fileURLToPath(new URL('../scripts/audit-static-analysis.mjs', import.meta.url));
const helper = fileURLToPath(new URL('../scripts/static-audit-verdict.mjs', import.meta.url));

function runFixture({ artifacts = true, oversize = false, finding = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'qarbi-static-audit-'));
  try {
    for (const dir of ['scripts', 'contracts', 'build/contracts']) mkdirSync(join(root, dir), { recursive: true });
    writeFileSync(join(root, 'package.json'), '{"type":"module"}');
    copyFileSync(script, join(root, 'scripts', 'audit-static-analysis.mjs'));
    copyFileSync(helper, join(root, 'scripts', 'static-audit-verdict.mjs'));
    for (const name of names) {
      const source = `pragma solidity ^0.8.24; contract ${name} { ${finding && name === names[0] ? 'function bad() public view returns (address) { return tx.origin; }' : ''} }`;
      writeFileSync(join(root, 'contracts', `${name}.sol`), source);
      if (artifacts) writeFileSync(join(root, 'build', 'contracts', `${name}.json`), JSON.stringify({
        deployedBytecode: name === names[0] && oversize ? `0x${'00'.repeat(24577)}` : '0x6000'
      }));
    }
    const result = spawnSync(process.execPath, [join(root, 'scripts', 'audit-static-analysis.mjs')], { cwd: root, encoding: 'utf8', timeout: 10000 });
    const report = JSON.parse(readFileSync(join(root, 'reports', 'reality', 'static-analysis-report.json'), 'utf8'));
    return { result, report };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('missing compiled artifacts block static audit despite zero regex findings', () => {
  const { result, report } = runFixture({ artifacts: false });
  assert.notEqual(result.status, 0);
  assert.equal(report.status, 'BLOCKED_BYTECODE_SIZE_UNVERIFIED_OR_EXCEEDED');
  assert.equal(report.standardCompliance.eip170SizeLimits, false);
});

test('oversized EIP-170 runtime code blocks static audit', () => {
  const { result, report } = runFixture({ oversize: true });
  assert.notEqual(result.status, 0);
  assert.equal(report.status, 'BLOCKED_BYTECODE_SIZE_UNVERIFIED_OR_EXCEEDED');
});

test('clean fixture only passes limited patterns and does not claim independent audit', () => {
  const { result, report } = runFixture();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(report.status, 'PASS_LIMITED_STATIC_PATTERN_CHECKS');
  assert.equal(report.standardCompliance.accessControlEnforced, null);
  assert.match(report.limitations, /independent security audit/);
});

test('detected source pattern fails even with valid bytecode', () => {
  const { result, report } = runFixture({ finding: true });
  assert.notEqual(result.status, 0);
  assert.equal(report.status, 'FAIL_STATIC_PATTERNS_DETECTED');
  assert.equal(report.totalVulnerabilitiesFound, 1);
});
