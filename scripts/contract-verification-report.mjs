import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function rejectSymlink(location) {
  try {
    if (fs.lstatSync(location).isSymbolicLink()) {
      throw new Error('BLOCKED: contract verification report output must not be a symlink');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

/** Replace evidence without following symlinks or truncating hardlinked source files. */
export function writeContractVerificationReport(rootDir, report) {
  const reportsDir = path.join(rootDir, 'reports');
  const reportDir = path.join(reportsDir, 'reality');
  const reportPath = path.join(reportDir, 'contract-verification.json');
  rejectSymlink(reportsDir);
  rejectSymlink(reportDir);
  fs.mkdirSync(reportDir, { recursive: true });
  rejectSymlink(reportsDir);
  rejectSymlink(reportDir);
  rejectSymlink(reportPath);
  const tempPath = path.join(reportDir,
    `.contract-verification.${process.pid}.${crypto.randomBytes(16).toString('hex')}.tmp`);
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL |
    (fs.constants.O_NOFOLLOW || 0);
  let created = false;
  try {
    const fd = fs.openSync(tempPath, flags, 0o600);
    created = true;
    try {
      fs.writeFileSync(fd, JSON.stringify(report, null, 2), 'utf8');
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    rejectSymlink(reportsDir);
    rejectSymlink(reportDir);
    rejectSymlink(reportPath);
    fs.renameSync(tempPath, reportPath);
    created = false;
  } finally {
    if (created) fs.rmSync(tempPath, { force: true });
  }
  return reportPath;
}

/** Clear any previously successful current-run claim before RPC/manifest validation. */
export function markContractVerificationUnverified(rootDir, now = new Date()) {
  return writeContractVerificationReport(rootDir, {
    status: 'BLOCKED_CURRENT_RUN_UNVERIFIED',
    chainId: 421614,
    network: 'Arbitrum Sepolia',
    checkedAt: now.toISOString(),
    contractsCount: 0,
    allContractsVerified: false,
    results: [],
    limitations: 'This invocation has not completed on-chain bytecode checks. Previous reports are historical evidence, not current verification.'
  });
}
