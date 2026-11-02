import fs from 'node:fs';
import path from 'node:path';

/** Invalidate any earlier successful RSI audit before a new run can fail. */
export function markRsiAuditUnverified(rootDir) {
  const reportPath = path.join(rootDir, 'reality', 'RAVEN_REA_RSI_AUDIT.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({
    status: 'BLOCKED_CURRENT_RUN_UNVERIFIED',
    candidateAdopted: false,
    reason: 'New REA/RSI invocation started; checks have not completed',
    initializedAt: new Date().toISOString()
  }, null, 2), 'utf8');
  return reportPath;
}
