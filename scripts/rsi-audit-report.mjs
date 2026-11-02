import fs from 'node:fs';
import path from 'node:path';

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
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC |
    (fs.constants.O_NOFOLLOW || 0);
  const fd = fs.openSync(reportPath, flags, 0o600);
  try {
    fs.writeFileSync(fd, JSON.stringify(record, null, 2), 'utf8');
  } finally {
    fs.closeSync(fd);
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
