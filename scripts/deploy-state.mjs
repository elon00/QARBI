#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { JsonRpcProvider, Wallet, formatEther, isAddress } from 'ethers';

dotenv.config({ quiet: true });

if (process.platform === 'win32') {
  const nodeDir = path.dirname(process.execPath);
  const parts = (process.env.PATH || '').split(path.delimiter);
  if (!parts.some((p) => p.replace(/\\/g, '/').toLowerCase() === nodeDir.replace(/\\/g, '/').toLowerCase())) {
    process.env.PATH = nodeDir + path.delimiter + (process.env.PATH || '');
  }
}

function npmInvocation(args) {
  if (process.env.npm_execpath) return [process.execPath, [process.env.npm_execpath, ...args]];
  if (process.platform === 'win32') return [process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args]];
  return ['npm', args];
}

function run(label, args) {
  console.log(`\n${'='.repeat(72)}\nDEPLOY STATE: ${label}\n${'='.repeat(72)}`);
  const [command, commandArgs] = npmInvocation(args);
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', shell: false, windowsHide: false, env: process.env });
  if (result.error) {
    console.error(`DEPLOY STATE: STOPPED at ${label} — ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

function loadManifest() {
  const manifestPath = path.resolve('src/contracts/deployedAddresses.json');
  try { return JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
  catch { return null; }
}

async function deploymentIsVerifiable(provider, manifest) {
  if (!manifest?.contracts) return false;
  const required = ['QARBIToken', 'AgentRegistry', 'TaskMarket', 'ConwayEngine', 'AgentWallet'];
  if (!required.every((name) => manifest.contracts[name])) return false;
  for (const name of required) {
    const item = manifest.contracts[name];
    if (!item?.address || !isAddress(item.address)) return false;
    if (!/^0x[0-9a-fA-F]{64}$/.test(item.deploymentTxHash || '')) return false;
    const code = await provider.getCode(item.address);
    if (code === '0x') return false;
    const receipt = await provider.getTransactionReceipt(item.deploymentTxHash);
    if (!receipt || receipt.status !== 1 || receipt.contractAddress?.toLowerCase() !== item.address.toLowerCase()) return false;
  }
  return true;
}

const rpc = process.env.ARBITRUM_SEPOLIA_RPC || process.env.ARBITRUM_SEPOLIA_RPC_URL;
const key = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
if (!rpc || !/^https?:\/\//.test(rpc)) { console.error('DEPLOY STATE: missing valid Arbitrum Sepolia RPC URL.'); process.exit(1); }
if (!/^0x[0-9a-fA-F]{64}$/.test(key || '')) { console.error('DEPLOY STATE: missing valid deployer private key.'); process.exit(1); }

const provider = new JsonRpcProvider(rpc);
const wallet = new Wallet(key, provider);
const network = await provider.getNetwork();
if (Number(network.chainId) !== 421614) { console.error('DEPLOY STATE: RPC is not Arbitrum Sepolia (421614).'); process.exit(1); }
const balance = await provider.getBalance(wallet.address);
console.log('Deployer:', wallet.address);
console.log('Arbitrum Sepolia balance:', formatEther(balance), 'ETH');
if (balance === 0n) { console.error('DEPLOY STATE: BLOCKED — deployer has 0 Arbitrum Sepolia ETH.'); process.exit(2); }

const manifest = loadManifest();
if (await deploymentIsVerifiable(provider, manifest)) {
  console.log('DEPLOY STATE: existing verified deployment found — SKIP redeployment.');
} else {
  console.log('DEPLOY STATE: no reusable deployment found — deploy exactly once.');
  run('Testnet deployment', ['run', 'deploy:testnet']);
}

run('Final deployment verification', ['run', 'verify:testnet']);
console.log('\nDEPLOY STATE: PASS');
