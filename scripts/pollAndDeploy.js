import { ethers } from 'ethers';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';
const provider = new ethers.JsonRpcProvider(RPC_URL);
const targetAddress = '0xF34331FF53C4BDAA07793570aaad0084E7cE6DFD';

console.log(`Polling Arbitrum Sepolia for deposit to ${targetAddress}...`);

async function poll() {
  try {
    const bal = await provider.getBalance(targetAddress);
    const eth = ethers.formatEther(bal);
    console.log(`[${new Date().toLocaleTimeString()}] Arbitrum Sepolia Balance: ${eth} ETH`);

    if (bal > 0n) {
      console.log('\n🎉 FUNDS ARRIVED ON ARBITRUM SEPOLIA! Triggering full deployment...\n');
      const deployProcess = spawn('node', ['scripts/deploy.js'], {
        cwd: rootDir,
        stdio: 'inherit'
      });

      deployProcess.on('exit', (code) => {
        console.log(`Deployment process finished with code ${code}`);
        process.exit(code || 0);
      });
      return;
    }
  } catch (err) {
    console.error('Polling error:', err.message);
  }

  // Poll again in 20 seconds
  setTimeout(poll, 20000);
}

poll();
