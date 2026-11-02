#!/usr/bin/env node
/**
 * QARBI Protocol — Master Mission Verification Runner (Chapter 23)
 * 
 * Invocation: npm run mission:verify
 * 
 * Executes bounded verification stages; external evidence is not implied:
 *  1. Repository Hygiene & Git Integrity
 *  2. Runtime Environment & Toolchain
 *  3. Dependency & Supply-Chain Integrity
 *  4. Solidity Smart Contract Compilation (solc 0.8.24 viaIR)
 *  5. Strict TypeScript Typecheck (tsc --noEmit)
 *  6. NIST FIPS 204/203 & RFC 5869 Cryptographic KATs
 *  7. Quantum QUBO & PQC Inter-Agent Channel Suite
 *  8. Smart Contract Security & 6-Tier Invariant Suite
 *  9. Truth-Claim & Secret-Exposure Safety Guards
 * 10. Bounded Raven RSI + REA Verification Engine
 * 11. Production Client & Server Bundler
 * 12. Arbitrum Sepolia & QuickNode Reality Check (Fail-Closed)
 * 
 * Writes comprehensive report to: reports/reality/mission-report.json
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { missionExitCode } from './mission-status.mjs';
import { verifiedRsiStageDetails } from './mission-rsi-stage.mjs';
import { assertCleanVerificationSources } from './git-verification-source-guard.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const startTime = Date.now();
console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║       QARBI PROTOCOL — EVIDENCE-FIRST MASTER MISSION VERIFICATION RUNNER     ║');
console.log('║   "Production Ready != CI Green • Reality Before Claims • Mainnet Locked" ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

const stages = [];

function runStage(id, name, fn) {
  const t0 = Date.now();
  process.stdout.write(`▶ [STAGE ${id}/14] ${name}... `);
  try {
    const details = fn();
    const duration = Date.now() - t0;
    console.log(`✅ PASS (${duration}ms)`);
    stages.push({ id, name, status: 'PASS', durationMs: duration, details });
    return true;
  } catch (err) {
    const duration = Date.now() - t0;
    const isBlocked = err.message && err.message.includes('BLOCKED');
    const status = isBlocked ? 'BLOCKED' : 'FAILED';
    console.log(`${isBlocked ? '🔒 BLOCKED' : '❌ FAILED'} (${duration}ms)\n    Reason: ${err.message}`);
    stages.push({ id, name, status, durationMs: duration, error: err.message });
    return false;
  }
}

// STAGE 1: Repository Validation
runStage('01', 'Repository Validation & Git Integrity', () => {
  assertCleanVerificationSources(rootDir);
  const commit = execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim();
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir }).toString().trim();
  return { commit, branch };
});

// STAGE 2: Environment Checks
runStage('02', 'Runtime Environment & Toolchain Integrity', () => {
  const nodeVer = process.version;
  const major = parseInt(nodeVer.slice(1).split('.')[0], 10);
  if (major < 20) throw new Error(`Node.js version >= 20 required, got ${nodeVer}`);
  return { nodeVersion: nodeVer, platform: process.platform };
});

// STAGE 3: Dependency Inventory
runStage('03', 'Dependency Lockfile Presence and Hash', () => {
  const pkgLock = path.join(rootDir, 'package-lock.json');
  if (!fs.existsSync(pkgLock)) throw new Error('Missing package-lock.json');
  const lockHash = crypto.createHash('sha256').update(fs.readFileSync(pkgLock)).digest('hex');
  return { packageLockSha256: lockHash };
});

// STAGE 4: Contract Compilation
runStage('04', 'Solidity Contract Compilation (solc 0.8.24 viaIR)', () => {
  execSync('npm run compile:contracts', { cwd: rootDir, stdio: 'pipe' });
  const buildDir = path.join(rootDir, 'build', 'contracts');
  const contracts = ['AgentRegistry', 'AgentWallet', 'ConwayEngine', 'QARBIToken', 'TaskMarket'];
  for (const c of contracts) {
    if (!fs.existsSync(path.join(buildDir, `${c}.json`))) throw new Error(`Missing artifact: ${c}`);
  }
  return { compiledContractsCount: 5 };
});

// STAGE 5: Strict TypeScript Typecheck
runStage('05', 'Strict TypeScript Typecheck (tsc --noEmit)', () => {
  execSync('npm run typecheck', { cwd: rootDir, stdio: 'pipe' });
  return { errors: 0 };
});

// STAGE 6: NIST FIPS 203/204 & RFC 5869 Vectors
runStage('06', 'NIST FIPS 203/204 & RFC 5869 Cryptographic KATs', () => {
  execSync('npm run test:nist', { cwd: rootDir, stdio: 'pipe' });
  return { standard: 'NIST FIPS 204 ML-DSA-65 / FIPS 203 ML-KEM-768' };
});

// STAGE 7: Quantum QUBO & PQC Channel Suite
runStage('07', 'Quantum Portfolio Optimization & PQC Inter-Agent Channel', () => {
  execSync('npm run test:quantum', { cwd: rootDir, stdio: 'pipe' });
  return { algorithms: ['QUBO-Markowitz', 'SQA', 'bSB', 'PQC-Channel'] };
});

// STAGE 8: 6-Tier Smart Contract Invariants
runStage('08', 'Smart Contract Security & 6-Tier Invariant Suite', () => {
  execSync('npm run test:contracts', { cwd: rootDir, stdio: 'pipe' });
  return { tiersVerified: 6 };
});

// STAGE 9: Truth-Claim & Secret-Exposure Guards
runStage('09', 'Deployment Truth & Secret-Exposure Safety Guards', () => {
  execSync('node scripts/check-truth.mjs', { cwd: rootDir, stdio: 'pipe' });
  return { violations: 0 };
});

// STAGE 10: Raven RSI + REA Bounded Automation
runStage('10', 'Raven RSI + REA Bounded Agentic Verification Engine', () => {
  const invocationChallenge = crypto.randomBytes(16).toString('hex');
  execSync('npm run gate:rsi', {
    cwd: rootDir, stdio: 'pipe',
    env: { ...process.env, QARBI_RSI_RUN_CHALLENGE: invocationChallenge }
  });
  const rsiAudit = JSON.parse(fs.readFileSync(path.join(rootDir, 'reality', 'RAVEN_REA_RSI_AUDIT.json'), 'utf8'));
  const expectedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  return verifiedRsiStageDetails(rsiAudit, expectedCommit, invocationChallenge);
});

// STAGE 11: Production Bundler
runStage('11', 'Production Distribution Bundler (Vite + esbuild)', () => {
  execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
  const dist = path.join(rootDir, 'dist');
  if (!fs.existsSync(dist) || !fs.existsSync(path.join(dist, 'server.cjs')) || !fs.existsSync(path.join(dist, 'index.html'))) {
    throw new Error('Dist build bundle incomplete');
  }
  return { distReady: true };
});

// STAGE 12: x402 Autonomous Commerce & QuickNode Streams
runStage('12', 'x402 Autonomous Commerce & QuickNode Streams Verification', () => {
  execSync('npm run test:x402', { cwd: rootDir, stdio: 'pipe' });
  return { bazaarDiscovery: 'PASS', challenge402: 'PASS', streamFilter: 'PASS', hmacWebhookAuth: 'PASS' };
});

// STAGE 13: Static Security & AST Vulnerability Audit
runStage('13', 'Automated Static Security & AST Vulnerability Audit', () => {
  execSync('npm run audit:static', { cwd: rootDir, stdio: 'pipe' });
  return { staticAuditCommand: 'PASS', independentAudit: false };
});

// STAGE 14: Live Provider Reality Check
runStage('14', 'Arbitrum Sepolia Live RPC Chain ID Check', () => {
  const rpcUrl = process.env.QUICKNODE_ARBITRUM_SEPOLIA_RPC || process.env.ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc';
  // Verify the actual JSON-RPC response, not merely the presence of a configured URL.
  // The URL may contain credentials: pass it via environment, never print it.
  const check = `
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    fetch(process.env.QARBI_RPC_VERIFY_URL, {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_chainId',params:[]}),
      signal: controller.signal
    }).then(async response => {
      if (!response.ok) throw Error('HTTP ' + response.status);
      const payload = await response.json();
      const { assertArbitrumSepoliaChainIdResponse } = await import('./scripts/rpc-chain-id-evidence.mjs');
      process.stdout.write(assertArbitrumSepoliaChainIdResponse(payload));
    }).catch(error => {
      console.error('RPC verification failed:', error.message);
      process.exitCode = 1;
    }).finally(() => clearTimeout(timer));
  `;
  let chainId;
  try {
    chainId = requireRpcCheck(check, rpcUrl);
  } catch {
    throw new Error('BLOCKED: Arbitrum Sepolia RPC response not verified');
  }
  if (chainId !== '0x66eee') throw new Error('BLOCKED: incorrect Arbitrum Sepolia chain ID');
  return { verifiedChainId: 421614, rpcResponded: true, deploymentVerified: false };
});

function requireRpcCheck(check, rpcUrl) {
  return execFileSync(process.execPath, ['-e', check], {
    cwd: rootDir,
    env: { ...process.env, QARBI_RPC_VERIFY_URL: rpcUrl },
    encoding: 'utf8',
    timeout: 10000,
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

const totalDuration = Date.now() - startTime;
const passedCount = stages.filter(s => s.status === 'PASS').length;

// Conservative readiness score; never infer 100/100 from local checks.
// Engineering checks are not production or market certification.
// Release-dependent points remain zero until independent live-chain and security evidence is reviewed.
const engineeringPassed = ['04','05','06','07','08','09','11','12','13']
  .every(id => stages.some(stage => stage.id === id && stage.status === 'PASS'));
const scorecard = {
  reproducibleEngineering: {
    max: 20, earned: engineeringPassed ? 20 : 0,
    reason: engineeringPassed ? 'Required local engineering stages passed in this run' : 'One or more required engineering stages failed'
  },
  independentSecurityAudit: { max: 20, earned: 0, reason: 'Independent security audit not validated by this runner' },
  onChainContractAndE2E: { max: 20, earned: 0, reason: 'Deployment receipts and end-to-end on-chain events not verified by this runner' },
  operationsAndGovernance: { max: 20, earned: 0, reason: 'Production operational controls and approvals not independently verified' },
  marketAndCompliance: { max: 20, earned: 0, reason: 'Market/customer and jurisdiction-specific legal readiness not independently verified' }
};

let totalEarned = 0;
let totalMax = 0;
for (const k of Object.keys(scorecard)) {
  totalEarned += scorecard[k].earned;
  totalMax += scorecard[k].max;
}

const report = {
  missionReportVersion: '1.0.0',
  evaluatedAt: new Date().toISOString(),
  commitSha: execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim(),
  branch: execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir }).toString().trim(),
  durationMs: totalDuration,
  stagesResult: {
    total: stages.length,
    passed: passedCount,
    failed: stages.filter(s => s.status === 'FAILED').length,
    blocked: stages.filter(s => s.status === 'BLOCKED').length,
    stages
  },
  chapter22Scorecard: {
    totalMax,
    totalEarned,
    percentage: Math.round((totalEarned / totalMax) * 100),
    breakdown: scorecard
  },
  releaseControls: {
    productionCertified: false,
    mainnetStatus: 'LOCKED_FAIL_CLOSED',
    law: 'Production ready != CI green; Mainnet strictly locked until all required reality gates pass'
  }
};

const reportPath = path.join(rootDir, 'reports', 'reality', 'mission-report.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log('\n══════════════════════════════════════════════════════════════════════════');
console.log(`  MISSION STAGES PASSED      : ${passedCount} / ${stages.length}`);
console.log(`  EVIDENCE-BASED READINESS   : ${totalEarned} / ${totalMax} (${report.chapter22Scorecard.percentage}/100; NOT CERTIFIED)`);
console.log(`  PRODUCTION CERTIFICATION   : 🔴 NOT CERTIFIED (Fail-Closed)`);
console.log(`  MAINNET DEPLOYMENT STATUS  : 🔒 LOCKED_FAIL_CLOSED`);
console.log(`  AUDIT REPORT PERSISTED     : reports/reality/mission-report.json`);
console.log('══════════════════════════════════════════════════════════════════════════\n');

// A written report is not a successful verification when any stage failed or was blocked.
// Preserve the evidence artifact, then return a nonzero status to CI and callers.
process.exitCode = missionExitCode(stages);
if (process.exitCode !== 0) {
  console.error('MISSION VERIFICATION FAILED OR BLOCKED: see reports/reality/mission-report.json');
}
