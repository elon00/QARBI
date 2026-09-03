#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [
  ['Arbitrum Sepolia configuration', ['src/contracts/deployedAddresses.json','scripts/deploy.js','scripts/verify-testnet-deployment.js']],
  ['Five Solidity contracts', ['contracts/QARBIToken.sol','contracts/AgentRegistry.sol','contracts/TaskMarket.sol','contracts/ConwayEngine.sol','contracts/AgentWallet.sol']],
  ['Wallet integration & EIP-1193 tests', ['src/lib/web3.ts','src/components/Header.tsx','src/components/WalletQrCard.tsx','scripts/wallet-provider-test.mjs']],
  ['PQC provider/gates & ML-DSA-65', ['src/lib/mlDsa65Provider.ts','src/lib/pqcProvider.ts','scripts/pqc-provider-gate.js','scripts/pqc-truthfulness-gate.js','scripts/pqc-boundary-gate.js','scripts/ml-dsa65-smoke.mjs']],
  ['Stylus Rust Engine & WASM target', ['crates/conway-stylus/Cargo.toml','crates/conway-stylus/src/conway_core.rs','crates/conway-stylus/src/lib.rs']],
  ['Security gates & Invariants', ['scripts/taskmarket-security-gate.js']],
  ['Production build pipeline', ['vite.config.ts','scripts/one-click.cjs','scripts/qmoosa-master-finish.mjs']],
  ['Deployment & Reality reporting', ['netlify.toml','scripts/reality-report.mjs']],
  ['Legal & Regulatory Compliance (Indian SC & International)', ['COMPLIANCE_AND_LEGAL_FRAMEWORK.md','RULEBOOK.md','.rules/blockchain_legal_framework.md','scripts/legal-compliance-gate.js']],
];

let failures = 0;
console.log('--- REQUIREMENT CLASSIFICATION & TRACEABILITY MATRIX ---');
for (const [label, files] of checks) {
  const missing = files.filter(f => !fs.existsSync(path.join(root, f)));
  if (missing.length) {
    console.log(`❌ FAIL ${label}: missing ${missing.join(', ')}`);
    failures++;
  } else {
    console.log(`✅ PASS ${label}`);
  }
}
console.log('\nRequirement audit scope: repository-presence & structural-evidence checks. External services, live browser extension interactions, third-party approvals, and independent audits require separate external evidence.');
process.exitCode = failures ? 1 : 0;
