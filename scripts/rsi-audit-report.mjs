import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function assertNotSymlink(location) {
  try {
    if (fs.lstatSync(location).isSymbolicLink()) {
      throw new Error('BLOCKED: REA/RSI audit output must not be a symlink');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

/** Write current-run evidence without following an output-file symlink. */
export function writeRsiAuditReport(rootDir, record) {
  const reportDir = path.join(rootDir, 'reality');
  const reportPath = path.join(reportDir, 'RAVEN_REA_RSI_AUDIT.json');
  // Generated evidence is outside the source-integrity pathspec. Never let an
  // output symlink redirect a report write into verification source or elsewhere.
  assertNotSymlink(reportDir);
  fs.mkdirSync(reportDir, { recursive: true });
  assertNotSymlink(reportDir);
  assertNotSymlink(reportPath);
  // Never truncate an existing report inode: it may be a hardlink to source.
  // Write a private, exclusively created file and replace the directory entry.
  const tempPath = path.join(reportDir,
    `.RAVEN_REA_RSI_AUDIT.${process.pid}.${crypto.randomBytes(16).toString('hex')}.tmp`);
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL |
    (fs.constants.O_NOFOLLOW || 0);
  let tempCreated = false;
  try {
    const fd = fs.openSync(tempPath, flags, 0o600);
    tempCreated = true;
    try {
      fs.writeFileSync(fd, JSON.stringify(record, null, 2), 'utf8');
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    assertNotSymlink(reportDir);
    assertNotSymlink(reportPath);
    fs.renameSync(tempPath, reportPath);
    tempCreated = false;
  } finally {
    if (tempCreated) fs.rmSync(tempPath, { force: true });
  }
  return reportPath;
}

/** Invalidate any earlier successful RSI audit before a new run can fail. */
export function markRsiAuditUnverified(rootDir) {
  return writeRsiAuditReport(rootDir, {
    status: 'BLOCKED_CURRENT_RUN_UNVERIFIED',
    candidateAdopted: false,
    reason: 'New REA/RSI invocation started; checks have not completed',
    initializedAt: new Date().toISOString()
  });
}
