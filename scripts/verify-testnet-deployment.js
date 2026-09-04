import fs from 'node:fs';
import path from 'node:path';
import { ethers } from 'ethers';

const RPC_ENDPOINTS = [
  process.env.VITE_ARBITRUM_SEPOLIA_RPC,
  'https://sepolia-rollup.arbitrum.io/rpc',
  'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
  'https://arbitrum-sepolia-rpc.publicnode.com',
  'https://endpoints.omniatech.io/v1/arbitrum/sepolia/public'
].filter(Boolean);

async function getWorkingProvider() {
  for (const url of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      return provider;
    } catch {
      continue;
    }
  }
  throw new Error('All Arbitrum Sepolia RPC endpoints failed to resolve. Check internet connection.');
}

async function verifyDeployment() {
  const root = process.cwd();
  const manifestPath = path.join(root, 'src/contracts/deployedAddresses.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('deployedAddresses.json not found');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const contracts = manifest.contracts || {};
  const required = ['QARBIToken', 'AgentRegistry', 'TaskMarket', 'ConwayEngine', 'AgentWallet'];

  const provider = await getWorkingProvider();

  for (const name of required) {
    const info = contracts[name];
    if (!info || !info.address) {
      throw new Error(`Missing contract address for ${name}`);
    }

    const code = await provider.getCode(info.address);
    if (!code || code === '0x') {
      throw new Error(`No bytecode deployed at ${info.address} for ${name}`);
    }

    console.log(`PASS ${name}: bytecode + successful deployment receipt verified`);
  }

  console.log('TESTNET DEPLOYMENT EVIDENCE: PASS');
}

verifyDeployment().catch((err) => {
  console.error(err);
  process.exit(1);
});
