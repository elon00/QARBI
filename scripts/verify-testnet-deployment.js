import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'src/contracts/deployedAddresses.json');
const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc';
const CHAIN_ID = 421614;

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const provider = new ethers.JsonRpcProvider(RPC_URL);
const network = await provider.getNetwork();
if (Number(network.chainId) !== CHAIN_ID) throw new Error(`Wrong network: expected ${CHAIN_ID}, got ${network.chainId}`);

let failures = 0;
for (const [name, item] of Object.entries(manifest.contracts || {})) {
  if (!item.address || !ethers.isAddress(item.address)) {
    console.error(`FAIL ${name}: missing valid address`);
    failures++; continue;
  }
  const code = await provider.getCode(item.address);
  if (code === '0x') {
    console.error(`FAIL ${name}: no deployed bytecode at ${item.address}`);
    failures++; continue;
  }
  if (!item.deploymentTxHash || !ethers.isHexString(item.deploymentTxHash, 32)) {
    console.error(`FAIL ${name}: missing valid deployment transaction hash`);
    failures++; continue;
  }
  const receipt = await provider.getTransactionReceipt(item.deploymentTxHash);
  if (!receipt || receipt.status !== 1 || receipt.contractAddress?.toLowerCase() !== item.address.toLowerCase()) {
    console.error(`FAIL ${name}: deployment receipt does not prove this contract address`);
    failures++; continue;
  }
  console.log(`PASS ${name}: bytecode + successful deployment receipt verified`);
}
if (failures) process.exit(1);
console.log('TESTNET DEPLOYMENT EVIDENCE: PASS');
