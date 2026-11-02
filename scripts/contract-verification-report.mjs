import fs from 'node:fs';
import path from 'node:path';

/** Clear any previously successful current-run claim before RPC/manifest validation. */
export function markContractVerificationUnverified(rootDir, now = new Date()) {
  const reportPath = path.join(rootDir, 'reports', 'reality', 'contract-verification.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({
    status: 'BLOCKED_CURRENT_RUN_UNVERIFIED',
    chainId: 421614,
    network: 'Arbitrum Sepolia',
    checkedAt: now.toISOString(),
    contractsCount: 0,
    allContractsVerified: false,
    results: [],
    limitations: 'This invocation has not completed on-chain bytecode checks. Previous reports are historical evidence, not current verification.'
  }, null, 2), 'utf8');
  return reportPath;
}
