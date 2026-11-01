import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const gate = fileURLToPath(new URL('../scripts/release-attestation-gate.mjs', import.meta.url));
function runWithManifest(manifest) {
  const dir = mkdtempSync(join(tmpdir(), 'qarbi-attestation-negative-'));
  try {
    if (manifest !== undefined) {
      mkdirSync(join(dir, 'release-evidence'));
      writeFileSync(join(dir, 'release-evidence', 'readiness.json'), JSON.stringify(manifest));
    }
    return spawnSync(process.execPath, [gate], { cwd: dir, encoding: 'utf8', timeout: 5000 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
test('fail closed if evidence manifest is missing', () => {
  const result = runWithManifest();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKED/);
});
test('fail closed on incomplete evidence and no release authorization', () => {
  const result = runWithManifest({ domains: { build: { status: 'verified', evidence_url: 'https://example.org/a', verified_at: '2026-01-01', verifier: 'test-fixture' } }, mainnet_authorized: false });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKED/);
});
test('reject invalid evidence URL even when status says verified', () => {
  const domains = Object.fromEntries(
    ['build','tests','security','contracts','e2e','pqc','wallet','operations','governance','market']
      .map(name => [name, { status: 'verified', evidence_url: 'javascript:alert(1)', verified_at: '2026-01-01', verifier: 'test-fixture' }])
  );
  const result = runWithManifest({ domains, mainnet_authorized: true, release_blockers: [] });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKED/);
});

 
// These are synthetic schema fixtures, not independent evidence or release authorization.
const completeAttestationFixture = () => ({
  domains: Object.fromEntries(
    ['build','tests','security','contracts','e2e','pqc','wallet','operations','governance','market']
      .map(name => [name, { status: 'verified', evidence_url: 'https://example.org/fixture', verified_at: '2026-11-01', verifier: 'test-fixture' }])
  ),
  mainnet_authorized: true
});
test('rejects missing release blocker inventory even with ten verified-looking domains', () => {
  const result = runWithManifest(completeAttestationFixture());
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKED/);
});
test('rejects malformed release blocker inventories instead of treating them as empty', () => {
  for (const release_blockers of [null, {}, 0, false, '']) {
    const result = runWithManifest({ ...completeAttestationFixture(), release_blockers });
    assert.equal(result.status, 1, `accepted malformed blocker inventory ${JSON.stringify(release_blockers)}`);
    assert.match(result.stderr, /BLOCKED/);
  }
});
test('still rejects a nonempty blocker inventory', () => {
  const result = runWithManifest({ ...completeAttestationFixture(), release_blockers: ['independent audit missing'] });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKED/);
});
test('accepts empty blocker array for schema validation only (not release certification)', () => {
  const result = runWithManifest({ ...completeAttestationFixture(), release_blockers: [] });
  assert.equal(result.status, 0);
});
