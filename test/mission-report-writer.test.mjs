import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { writeMissionReport } from '../scripts/mission-report-writer.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-mission-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test('writes a valid mission report and safely replaces previous evidence', t => {
  const root = fixture(t);
  const reportPath = path.join(root, 'reports', 'reality', 'mission-report.json');
  assert.equal(writeMissionReport(root, { stagesResult: { failed: 1 } }), reportPath);
  assert.equal(writeMissionReport(root, { stagesResult: { blocked: 2 } }), reportPath);
  assert.deepEqual(JSON.parse(fs.readFileSync(reportPath, 'utf8')),
    { stagesResult: { blocked: 2 } });
  assert.equal(fs.readdirSync(path.dirname(reportPath)).filter(n => n.endsWith('.tmp')).length, 0);
});

test('hardlinked report cannot overwrite protected source', t => {
  const root = fixture(t);
  const dir = path.join(root, 'reports', 'reality');
  fs.mkdirSync(dir, { recursive: true });
  const source = path.join(root, 'protected-source.mjs');
  const original = 'export const trusted = true;\n';
  fs.writeFileSync(source, original);
  const reportPath = path.join(dir, 'mission-report.json');
  try { fs.linkSync(source, reportPath); } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip('hardlinks unavailable');
    throw error;
  }
  writeMissionReport(root, { stagesResult: { failed: 0 } });
  assert.equal(fs.readFileSync(source, 'utf8'), original);
  assert.equal(JSON.parse(fs.readFileSync(reportPath, 'utf8')).stagesResult.failed, 0);
});

test('symlinked mission report cannot redirect writes', t => {
  if (process.platform === 'win32') return t.skip('symlink privileges are not guaranteed on Windows');
  const root = fixture(t);
  const dir = path.join(root, 'reports', 'reality');
  fs.mkdirSync(dir, { recursive: true });
  const source = path.join(root, 'protected-source.mjs');
  fs.writeFileSync(source, 'safe\n');
  fs.symlinkSync(source, path.join(dir, 'mission-report.json'));
  assert.throws(() => writeMissionReport(root, { status: 'PASS' }), /BLOCKED/);
  assert.equal(fs.readFileSync(source, 'utf8'), 'safe\n');
});

test('symlinked reports parent directory cannot redirect evidence', t => {
  if (process.platform === 'win32') return t.skip('symlink privileges are not guaranteed on Windows');
  const root = fixture(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-mission-outside-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.symlinkSync(outside, path.join(root, 'reports'), 'dir');
  assert.throws(() => writeMissionReport(root, { status: 'PASS' }), /BLOCKED/);
  assert.equal(fs.existsSync(path.join(outside, 'reality', 'mission-report.json')), false);
});

test('symlinked reality report directory cannot redirect evidence', t => {
  if (process.platform === 'win32') return t.skip('symlink privileges are not guaranteed on Windows');
  const root = fixture(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'qarbi-mission-outside-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'reports'));
  fs.symlinkSync(outside, path.join(root, 'reports', 'reality'), 'dir');
  assert.throws(() => writeMissionReport(root, { status: 'PASS' }), /BLOCKED/);
  assert.equal(fs.existsSync(path.join(outside, 'mission-report.json')), false);
});
