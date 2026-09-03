#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const manifestPath=path.join(root,'src/contracts/deployedAddresses.json');
let manifest=null; try{manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));}catch{}
const required=['QARBIToken','AgentRegistry','TaskMarket','ConwayEngine','AgentWallet'];
const deployed=!!manifest?.contracts && required.every(n=>manifest.contracts?.[n]?.address && manifest.contracts?.[n]?.deploymentTxHash);
const stylusEvidence=fs.existsSync(path.join(root,'Cargo.toml')) || fs.existsSync(path.join(root,'stylus')) || fs.existsSync(path.join(root,'crates/conway-stylus/Cargo.toml'));
console.log('\nQARBI REALITY REPORT');
console.log('Automatable repository/deployment pipeline: PASS (when upstream stages pass)');
console.log('Required deployed contracts manifest complete:', deployed?'PASS':'FAIL');
console.log('Stylus/Rust implementation evidence:', stylusEvidence?'PRESENT':'NOT FOUND');
console.log('Browser MetaMask/Trust Wallet E2E:', 'REQUIRES REAL BROWSER EVIDENCE');
console.log('Independent security audit:', 'REQUIRES EXTERNAL AUDIT EVIDENCE');
console.log('No claim of 100% unless all mandatory evidence is present.');
