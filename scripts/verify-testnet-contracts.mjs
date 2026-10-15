#!/usr/bin/env node
/**
 * QARBI Protocol — Arbitrum Sepolia Contract Runtime Bytecode Verification
 * 
 * Fail-closed, zero-mock, read-only verification of QARBI deployment manifest.
 * Never accepts claims or flags as proof; queries the live Arbitrum Sepolia JSON-RPC
 * directly for real EVM runtime bytecode at each contract address.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rpc = process.env.QUICKNODE_ARBITRUM_SEPOLIA_RPC || 
            process.env.QUICKNODE_RPC_URL || 
            process.env.ARBITRUM_SEPOLIA_RPC || 
            process.argv[2] || 
            'https://sepolia-rollup.arbitrum.io/rpc';

let endpoint;
try {
  endpoint = new URL(rpc);
} catch {
  console.error('❌ BLOCKED: Invalid RPC URL provided');
  process.exit(2);
}

if (endpoint.protocol !== 'https:') {
  console.error('❌ BLOCKED: HTTPS endpoint required for secure verification');
  process.exit(2);
}

const manifestPath = path.join(rootDir, 'src', 'contracts', 'deployedAddresses.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

if (manifest.chainId !== 421614 || !manifest.contracts) {
  console.error('❌ BLOCKED: Invalid manifest or network is not Arbitrum Sepolia (421614)');
  process.exit(2);
}

const maskedRpc = rpc.replace(/quiknode\.pro\/[a-zA-Z0-9_-]+/, 'quiknode.pro/****');
console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║   QARBI PROTOCOL — ARBITRUM SEPOLIA ON-CHAIN BYTECODE VERIFICATION       ║');
console.log('║   "Code on chain is reality; claims without bytecode are rejected."      ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');
console.log(`🌐 Target Network : Arbitrum Sepolia (Chain ID: ${manifest.chainId})`);
console.log(`📡 RPC Endpoint   : ${maskedRpc}`);
console.log(`👤 Deployer Wallet: ${manifest.deployer || 'Not specified'}\n`);

const provider = new ethers.JsonRpcProvider(rpc, 421614, { staticNetwork: false });

try {
  const network = await provider.getNetwork();
  if (network.chainId !== 421614n) {
    throw new Error(`Connected network chainId ${network.chainId} does not match expected 421614n`);
  }

  const blockNumber = await provider.getBlockNumber();
  console.log(`📦 Latest Block   : #${blockNumber}\n`);

  const results = [];
  console.log('----------------------------------------------------------------------');
  console.log(' Contract Name   | Address                                    | Code Size | Status');
  console.log('----------------------------------------------------------------------');

  for (const [name, c] of Object.entries(manifest.contracts)) {
    if (!ethers.isAddress(c.address.toLowerCase())) {
      throw new Error(`${name}: invalid Ethereum address format (${c.address})`);
    }
    const checksummed = ethers.getAddress(c.address.toLowerCase());
    const code = await provider.getCode(checksummed);
    const codePresent = code !== '0x' && code.length > 2;
    const bytecodeBytes = codePresent ? (code.length - 2) / 2 : 0;
    const keccak = codePresent ? ethers.keccak256(code) : null;

    const padName = name.padEnd(16, ' ');
    const statusStr = codePresent ? `✅ PRESENT (${bytecodeBytes} B)` : '❌ EMPTY (0x)';
    console.log(` ${padName}| ${checksummed} | ${String(bytecodeBytes).padStart(5, ' ')} B   | ${codePresent ? '✅ VERIFIED' : '❌ MISSING'}`);

    results.push({
      name,
      address: checksummed,
      codePresent,
      bytecodeBytes,
      codeKeccak256: keccak,
      explorer: `https://sepolia.arbiscan.io/address/${checksummed}`
    });
  }
  console.log('----------------------------------------------------------------------\n');

  const allPresent = results.every(x => x.codePresent);

  const verificationArtifact = {
    status: allPresent ? 'VERIFIED_ON_CHAIN_RUNTIME_CODE' : 'BLOCKED_MISSING_RUNTIME_CODE',
    chainId: 421614,
    network: 'Arbitrum Sepolia',
    blockNumber,
    checkedAt: new Date().toISOString(),
    rpcUsed: maskedRpc,
    deployer: manifest.deployer,
    contractsCount: results.length,
    allContractsVerified: allPresent,
    results,
    limitations: 'Live on-chain bytecode presence confirms deployment. Arbiscan source-code verification and external audits remain independent steps.'
  };

  const reportsDir = path.join(rootDir, 'reports', 'reality');
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(path.join(reportsDir, 'contract-verification.json'), JSON.stringify(verificationArtifact, null, 2));

  if (allPresent) {
    console.log('🎉 SUCCESS: All 5 QARBI smart contracts have verified live bytecode on Arbitrum Sepolia!');
    console.log('📁 Verification report written to: reports/reality/contract-verification.json\n');
  } else {
    console.error('⚠️ FAILURE: One or more contracts are missing on-chain bytecode.');
    process.exitCode = 1;
  }
} catch (e) {
  console.error('❌ BLOCKED: ' + e.message);
  process.exitCode = 1;
} finally {
  provider.destroy();
}
