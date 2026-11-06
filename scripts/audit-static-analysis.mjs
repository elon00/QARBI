#!/usr/bin/env node
/**
 * QARBI limited heuristic static source scan.
 * Checks six regular-expression patterns across five Solidity source files
 * and measures compiled deployed runtime bytecode against EIP-170.
 * This is not an AST analyzer, independent security audit, formal verification,
 * proof of access control, or on-chain source-to-bytecode equivalence.
 */

import fs from 'node:fs';
import path from 'node:path';
import { summarizeStaticAudit } from './static-audit-verdict.mjs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contractsDir = path.join(rootDir, 'contracts');
const buildDir = path.join(rootDir, 'build', 'contracts');

console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║   QARBI PROTOCOL — LIMITED HEURISTIC STATIC SECURITY PATTERN SCAN   ║');
console.log('║   "Six regex checks • Not AST analysis, formal verification, or an audit"   ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

const contracts = [
  'QARBIToken.sol',
  'AgentRegistry.sol',
  'TaskMarket.sol',
  'ConwayEngine.sol',
  'AgentWallet.sol'
];

const vulnerabilityRules = [
  {
    id: 'SEC-01',
    name: 'tx.origin Phishing Vulnerability',
    severity: 'CRITICAL',
    check: (code) => /\btx\.origin\b/.test(code),
    remediation: 'Use msg.sender for authorization instead of tx.origin.'
  },
  {
    id: 'SEC-02',
    name: 'Selfdestruct / Suicide Hazard',
    severity: 'CRITICAL',
    check: (code) => /\bselfdestruct\b|\bsuicide\b/.test(code),
    remediation: 'Selfdestruct is deprecated (EIP-6780) and dangerous.'
  },
  {
    id: 'SEC-03',
    name: 'Untrusted Delegatecall Injection',
    severity: 'HIGH',
    check: (code) => /\.delegatecall\s*\(/.test(code),
    remediation: 'Avoid delegatecall to arbitrary or non-constant addresses.'
  },
  {
    id: 'SEC-04',
    name: 'Unchecked Low-Level Send/Call Value',
    severity: 'HIGH',
    check: (code) => {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/\.call\s*\{[^}]*value:/.test(line) || /\.send\s*\(/.test(line)) {
          const context = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join(' ');
          if (!context.includes('bool') && !context.includes('require')) {
            return true;
          }
        }
      }
      return false;
    },
    remediation: 'Always check return value of low-level calls.'
  },
  {
    id: 'SEC-05',
    name: 'Assembly Inline Memory Corruption Hazard',
    severity: 'MEDIUM',
    check: (code) => /assembly\s*\{[^}]*mstore\s*\(\s*0x40/.test(code),
    remediation: 'Ensure free memory pointer updates are strictly verified.'
  },
  {
    id: 'SEC-06',
    name: 'Floating Pragma Version Warning',
    severity: 'LOW',
    check: (code) => /pragma\s+solidity\s+>=/.test(code),
    remediation: 'Lock pragma to specific compiler version (e.g. ^0.8.24).'
  }
];

const auditResults = [];
let totalIssues = 0;

for (const c of contracts) {
  const filePath = path.join(contractsDir, c);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Contract file not found: ${c}`);
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, 'utf8');
  const artifactPath = path.join(buildDir, c.replace('.sol', '.json'));
  let bytecodeSize = 0;
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    // EIP-170 limits deployed runtime code, never creation bytecode.
    const hex = artifact.deployedBytecode;
    if (typeof hex === 'string' && /^0x(?:[0-9a-fA-F]{2})+$/.test(hex)) {
      bytecodeSize = (hex.length - 2) / 2;
    }
  }

  const contractIssues = [];
  for (const rule of vulnerabilityRules) {
    if (rule.check(code)) {
      contractIssues.push(rule);
      totalIssues++;
    }
  }

  // EIP-170 runtime code limit is 24,576 bytes inclusive.
  const isEip170Compliant = bytecodeSize > 0 && bytecodeSize <= 24576;
  const reentrancyGuarded = /ReentrancyGuard|nonReentrant/.test(code);
  const ownableSecured = /Ownable|onlyOwner|onlyAdmin/.test(code);

  auditResults.push({
    contract: c,
    bytecodeSizeBytes: bytecodeSize,
    eip170Compliant: isEip170Compliant,
    reentrancyProtected: null,
    reentrancyPatternPresent: reentrancyGuarded,
    accessControlVerified: null,
    accessControlPatternPresent: ownableSecured,
    vulnerabilitiesFound: contractIssues.length,
    issues: contractIssues
  });

  const padName = c.padEnd(18, ' ');
  const statusStr = contractIssues.length === 0 ? '🟢 CLEAN (0 Issues)' : `🔴 ${contractIssues.length} ISSUES`;
  console.log(`  ${padName} | Size: ${String(bytecodeSize).padStart(5, ' ')} B | EIP-170: ${isEip170Compliant ? 'PASS' : 'BLOCKED'} | Patterns: ${statusStr}`);
}

const verdict = summarizeStaticAudit(auditResults, contracts.length);
const auditPassed = verdict.passed;

const report = {
  analyzer: 'QARBI Limited Static Pattern Scan v1.1',
  evaluatedAt: new Date().toISOString(),
  contractsAudited: contracts.length,
  totalVulnerabilitiesFound: totalIssues,
  status: verdict.status,
  results: auditResults,
  standardCompliance: verdict.standardCompliance,
  limitations: verdict.limitations
};

const reportsDir = path.join(rootDir, 'reports', 'reality');
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(path.join(reportsDir, 'static-analysis-report.json'), JSON.stringify(report, null, 2));

console.log('\n══════════════════════════════════════════════════════════════════════════');
console.log(`  CONTRACTS AUDITED          : ${contracts.length} / ${contracts.length}`);
console.log(`  HEURISTIC PATTERN FINDINGS : ${totalIssues}`);
console.log(`  EIP-170 LIMITS COMPLIANCE  : ${auditResults.filter(r => r.eip170Compliant).length} / ${contracts.length} contracts (limit <= 24,576 B)`);
console.log(`  LIMITED STATIC AUDIT STATUS: ${verdict.status}`);
console.log('  SCOPE: six heuristic patterns and artifact size only; independent audit NOT verified');
console.log(`  ARTIFACT WRITTEN           : reports/reality/static-analysis-report.json`);
console.log('══════════════════════════════════════════════════════════════════════════\n');

if (!auditPassed) {
  process.exit(1);
}
