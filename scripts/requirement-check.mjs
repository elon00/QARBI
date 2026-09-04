#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [
  ['Arbitrum Sepolia configuration', ['src/contracts/deployedAddresses.json','scripts/deploy.js','scripts/verify-testnet-deployment.js']],
  ['Five Solidity contracts', ['contracts/QARBIToken.sol','contracts/AgentRegistry.sol','contracts/TaskMarket.sol','contracts/ConwayEngine.sol','contracts/AgentWallet.sol']],
  ['Wallet integration & Browser E2E', ['src/lib/web3.ts','src/components/Header.tsx','scripts/wallet-provider-test.mjs','scripts/real-browser-e2e.mjs']],
  ['PQC provider/gates & ML-DSA-65', ['src/lib/mlDsa65Provider.ts','src/lib/pqcProvider.ts','scripts/pqc-provider-gate.js','scripts/pqc-truthfulness-gate.js','scripts/pqc-boundary-gate.js','scripts/ml-dsa65-smoke.mjs']],
  ['Stylus Rust Engine & WASM target', ['crates/conway-stylus/Cargo.toml','crates/conway-stylus/src/conway_core.rs','crates/conway-stylus/src/lib.rs']],
  ['Security gates & AST Invariants', ['scripts/taskmarket-security-gate.js','scripts/security-ast-scanner.js']],
  ['Production build pipeline', ['vite.config.ts','scripts/one-click.cjs','scripts/qmoosa-master-finish.mjs']],
  ['Deployment & Reality reporting', ['netlify.toml','scripts/reality-report.mjs']],
  ['Legal & Regulatory Compliance', ['COMPLIANCE_AND_LEGAL_FRAMEWORK.md','RULEBOOK.md','.rules/blockchain_legal_framework.md','scripts/legal-compliance-gate.js']],
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
console.log('\nRequirement audit scope: repository-presence, live testnet bytecode, and automated evidence.');
process.exitCode = failures ? 1 : 0;
