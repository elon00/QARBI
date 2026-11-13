import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envFile = path.join(rootDir, '.env');

dotenv.config({ path: envFile });

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc';
const provider = new ethers.JsonRpcProvider(RPC_URL);

let privateKey = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
let wallet;

if (privateKey && privateKey.startsWith('0x') && privateKey.length === 66) {
  wallet = new ethers.Wallet(privateKey, provider);
  console.log(`DEPLOYER_ADDRESS: ${wallet.address}`);
} else {
  wallet = ethers.Wallet.createRandom().connect(provider);
  let envContent = '';
  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8');
  }
  if (!envContent.includes('DEPLOYER_PRIVATE_KEY')) {
    envContent += `\nDEPLOYER_PRIVATE_KEY="${wallet.privateKey}"\n`;
    fs.writeFileSync(envFile, envContent);
  }
  console.log(`DEPLOYER_ADDRESS: ${wallet.address}`);
}

async function check() {
  const balance = await provider.getBalance(wallet.address);
  console.log(`CURRENT_BALANCE: ${ethers.formatEther(balance)} ETH`);
}

check();
