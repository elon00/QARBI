#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [
  ['Arbitrum Sepolia configuration', ['src/contracts/deployedAddresses.json','scripts/deploy.js','scripts/verify-testnet-deployment.js']],
  ['Five Solidity contracts', ['contracts/QARBIToken.sol','contracts/AgentRegistry.sol','contracts/TaskMarket.sol','contracts/ConwayEngine.sol','contracts/AgentWallet.sol']],
  ['Wallet integration', ['src/lib/web3.ts','src/components/Header.tsx','src/components/WalletQrCard.tsx']],
  ['PQC provider/gates', ['src/lib/mlDsa65Provider.ts','src/lib/pqcProvider.ts','scripts/pqc-provider-gate.js','scripts/pqc-truthfulness-gate.js','scripts/pqc-boundary-gate.js']],
  ['Security gate', ['scripts/taskmarket-security-gate.js']],
  ['Production build pipeline', ['vite.config.ts','scripts/one-click.cjs','scripts/master-finish.mjs']],
  ['Netlify configuration', ['netlify.toml']],
  ['Compliance & truth baseline', ['compliance/LEGAL-TRUTH-BASELINE.md','compliance/CLAIMS-REGISTRY.json','compliance/JURISDICTION-MATRIX.md','scripts/compliance-gate.mjs']],
];
let failures=0;
for(const [label, files] of checks){
  const missing=files.filter(f=>!fs.existsSync(path.join(root,f)));
  if(missing.length){ console.log(`FAIL ${label}: missing ${missing.join(', ')}`); failures++; }
  else console.log(`PASS ${label}`);
}
console.log('\nRequirement audit scope: repository-presence checks only. External services, browser extensions, third-party approvals, independent audits, and live user actions require separate evidence.');
process.exitCode=failures?1:0;
