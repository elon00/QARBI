#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import dotenv from 'dotenv';
import { JsonRpcProvider, Wallet, formatEther } from 'ethers';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(label, args) {
  console.log('\n' + '='.repeat(72));
  console.log('MASTER FINISH: ' + label);
  console.log('='.repeat(72));
  const r = spawnSync(npmCommand, args, { stdio: 'inherit', shell: false });
  if (r.error) {
    console.error('MASTER FINISH: FAIL — unable to start npm:', r.error.message);
    process.exit(1);
  }
  if (r.status !== 0) process.exit(r.status || 1);
}

dotenv.config({ quiet: true });

const rpc = process.env.ARBITRUM_SEPOLIA_RPC || process.env.ARBITRUM_SEPOLIA_RPC_URL;
const key = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;

if (!rpc || !/^https?:\/\//.test(rpc)) {
  console.error('MASTER FINISH: FAIL — missing valid Arbitrum Sepolia RPC URL.');
  process.exit(1);
}
if (!/^0x[0-9a-fA-F]{64}$/.test(key || '')) {
  console.error('MASTER FINISH: FAIL — missing valid deployer private key.');
  process.exit(1);
}

run('Dependency reproducibility', ['ci']);
run('Full repository test gates', ['test']);
run('Release evidence gates', ['run', 'oneclick:release']);

console.log('\nMASTER FINISH: checking Arbitrum Sepolia deployer funding...');
const provider = new JsonRpcProvider(rpc);
const wallet = new Wallet(key);
const network = await provider.getNetwork();
if (Number(network.chainId) !== 421614) {
  console.error('MASTER FINISH: FAIL — RPC is not Arbitrum Sepolia (421614).');
  process.exit(1);
}
const balance = await provider.getBalance(wallet.address);
console.log('Deployer:', wallet.address);
console.log('Arbitrum Sepolia balance:', formatEther(balance), 'ETH');

if (balance === 0n) {
  console.error('\nMASTER FINISH: BLOCKED — all local quality gates passed, but deployment cannot be paid for because this deployer has 0 Arbitrum Sepolia ETH.');
  process.exit(2);
}

run('Testnet deployment', ['run', 'deploy:testnet']);
run('Deployment verification', ['run', 'verify:testnet']);

console.log('\nMASTER FINISH: PASS — quality gates, deployment, and verification completed successfully.');
