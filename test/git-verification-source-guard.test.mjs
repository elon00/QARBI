import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { assertCleanVerificationSources } from '../scripts/git-verification-source-guard.mjs';

function git(root, ...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-source-guard-'));
  git(root, 'init', '-q');
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.mkdirSync(path.join(root, 'reality'));
  fs.writeFileSync(path.join(root, 'scripts', 'runner.mjs'), 'export const verified = true;\n');
  fs.writeFileSync(path.join(root, 'reality', 'RAVEN_REA_RSI_AUDIT.json'), '{}\n');
  git(root, 'add', '.');
  git(root, '-c', 'user.name=QARBI Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture');
  return root;
}

test('clean source inputs pass while generated evidence changes are excluded', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'reality', 'RAVEN_REA_RSI_AUDIT.json'), '{"status":"BLOCKED"}\n');
  assert.equal(assertCleanVerificationSources(root), true);
});

test('modified tracked runner source fails closed', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.appendFileSync(path.join(root, 'scripts', 'runner.mjs'), '// altered\n');
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});

test('staged source changes and untracked source files fail closed', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.appendFileSync(path.join(root, 'scripts', 'runner.mjs'), '// staged\n');
  git(root, 'add', 'scripts/runner.mjs');
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
  git(root, 'reset', '-q', '--hard', 'HEAD');
  fs.writeFileSync(path.join(root, 'scripts', 'shadow.mjs'), 'export default true;\n');
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});

test('non-repository input fails closed', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-no-git-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});

test('modified tracked TypeScript build configuration fails closed', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'tsconfig.json'), '{}\n');
  git(root, 'add', 'tsconfig.json');
  git(root, '-c', 'user.name=QARBI Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'add config');
  fs.writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"strict":false}}\n');
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});

test('ignored executable source cannot bypass verification', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, '.gitignore'), 'scripts/*.local.mjs\n');
  git(root, 'add', '.gitignore');
  git(root, '-c', 'user.name=QARBI Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'add ignore');
  fs.writeFileSync(path.join(root, 'scripts', 'shadow.local.mjs'), 'export default true;\n');
  assert.equal(git(root, 'check-ignore', 'scripts/shadow.local.mjs').trim(), 'scripts/shadow.local.mjs');
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});


test('frontend and deployment inputs cannot bypass source integrity', async t => {
  for (const [file, modified] of [
    ['index.html', '<html><body>tampered</body></html>\n'],
    ['netlify/functions/api.mts', 'export const handler = () => false;\n'],
    ['public/.well-known/x402.json', '{"version":"tampered"}\n'],
    ['README.md', '# Unverified claim\n']
  ]) {
    await t.test(file, subtest => {
      const root = fixture();
      subtest.after(() => fs.rmSync(root, { recursive: true, force: true }));
      const absolute = path.join(root, file);
      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      fs.writeFileSync(absolute, 'original\n');
      git(root, 'add', file);
      git(root, '-c', 'user.name=QARBI Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'track production input');
      fs.writeFileSync(absolute, modified);
      assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
    });
  }
});

test('assume-unchanged index flag cannot hide modified verification source', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'scripts', 'runner.mjs'), 'export const verified = false;\n');
  git(root, 'update-index', '--assume-unchanged', 'scripts/runner.mjs');
  assert.equal(git(root, 'status', '--porcelain=v1', '--', 'scripts').trim(), '');
  assert.match(git(root, 'ls-files', '-v', '--', 'scripts/runner.mjs'), /^h /);
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});

test('skip-worktree index flag cannot hide modified verification source', t => {
  const root = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'scripts', 'runner.mjs'), 'export const verified = false;\n');
  git(root, 'update-index', '--skip-worktree', 'scripts/runner.mjs');
  assert.equal(git(root, 'status', '--porcelain=v1', '--', 'scripts').trim(), '');
  assert.match(git(root, 'ls-files', '-v', '--', 'scripts/runner.mjs'), /^S /);
  assert.throws(() => assertCleanVerificationSources(root), /BLOCKED/);
});
