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

test('rejects an HTTPS prefix without a valid host or with embedded credentials', () => {
  for (const evidence_url of ['https://', 'https://user:secret@example.org/fixture']) {
    const manifest = completeAttestationFixture();
    manifest.release_blockers = [];
    manifest.domains.build.evidence_url = evidence_url;
    const result = runWithManifest(manifest);
    assert.equal(result.status, 1, `accepted unsafe evidence URL ${evidence_url}`);
    assert.match(result.stderr, /BLOCKED/);
  }
});

test('rejects impossible future verification timestamps', () => {
  const manifest = completeAttestationFixture();
  manifest.release_blockers = [];
  manifest.domains.security.verified_at = '2099-01-01T00:00:00Z';
  const result = runWithManifest(manifest);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOCKED/);
});

test('schema-complete fixtures must not be labeled as a 100/100 attested score', () => {
  const result = runWithManifest({ ...completeAttestationFixture(), release_blockers: [] });
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout, /attested score|100\/100/i);
  assert.match(result.stdout, /NOT CERTIFIED/i);
});

test('rejects impossible or ambiguous release evidence dates', () => {
  for (const verified_at of ['2026-02-30', '2026-11-31', '0', '2026-13-01']) {
    const manifest = completeAttestationFixture();
    manifest.release_blockers = [];
    manifest.domains.security.verified_at = verified_at;
    const result = runWithManifest(manifest);
    assert.equal(result.status, 1, `accepted invalid verification date ${verified_at}`);
    assert.match(result.stderr, /BLOCKED/);
  }
});

test('rejects malformed RFC3339 release evidence times and offsets', () => {
  for (const verified_at of ['2026-11-01T25:00:00Z', '2026-11-01T12:61:00Z', '2026-11-01T12:00:00+25:00']) {
    const manifest = completeAttestationFixture();
    manifest.release_blockers = [];
    manifest.domains.security.verified_at = verified_at;
    const result = runWithManifest(manifest);
    assert.equal(result.status, 1, `accepted invalid verification timestamp ${verified_at}`);
    assert.match(result.stderr, /BLOCKED/);
  }
});

test('accepts valid RFC3339 timestamps with UTC or numeric offset for schema checks only', () => {
  for (const verified_at of ['2026-11-01T12:34:56Z', '2026-11-01T18:04:56+05:30']) {
    const manifest = completeAttestationFixture();
    manifest.release_blockers = [];
    manifest.domains.security.verified_at = verified_at;
    const result = runWithManifest(manifest);
    assert.equal(result.status, 0, `rejected valid timestamp ${verified_at}: ${result.stderr}`);
    assert.match(result.stdout, /NOT CERTIFIED/);
  }
});
