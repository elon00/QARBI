import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const L1_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';
const INBOX_ADDRESS = '0xaAe29B0366299461418F5324a79Afc425BE5ae21';
const INBOX_ABI = [
  'function depositEth() external payable returns (uint256)'
];

async function main() {
  console.log('--- Arbitrum Sepolia Official L1 Bridge Initiator ---');
  const l1Provider = new ethers.JsonRpcProvider(L1_RPC);

  const pk = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!pk) {
    throw new Error('No DEPLOYER_PRIVATE_KEY found in .env');
  }

  const walletL1 = new ethers.Wallet(pk, l1Provider);
  console.log(`Wallet Address: ${walletL1.address}`);

  const l1Bal = await l1Provider.getBalance(walletL1.address);
  console.log(`Current L1 Sepolia Balance: ${ethers.formatEther(l1Bal)} ETH`);

  // Deposit 0.035 ETH (more than enough to deploy all contracts 50 times over on Arbitrum L2)
  const depositAmount = ethers.parseEther('0.035');
  console.log(`Bridging ${ethers.formatEther(depositAmount)} ETH to Arbitrum Sepolia...`);

  const inbox = new ethers.Contract(INBOX_ADDRESS, INBOX_ABI, walletL1);

  // Estimate gas dynamically with 20% safety margin
  const estimatedGas = await inbox.depositEth.estimateGas({ value: depositAmount });
  const gasLimit = (estimatedGas * 120n) / 100n;
  console.log(`Estimated gas: ${estimatedGas.toString()}, using gasLimit: ${gasLimit.toString()}`);

  const tx = await inbox.depositEth({
    value: depositAmount,
    gasLimit: gasLimit
  });

  console.log(`\n✓ Transaction Broadcasted!`);
  console.log(`L1 Deposit Tx Hash: ${tx.hash}`);
  console.log(`View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);

  console.log('\nWaiting for block confirmation on Ethereum Sepolia...');
  const receipt = await tx.wait(1);
  console.log(`✓ Confirmed in L1 Block #${receipt.blockNumber}! Gas used: ${receipt.gasUsed.toString()}`);
  console.log('\n======================================================');
  console.log('🎉 0.035 ETH DEPOSIT TO ARBITRUM SEPOLIA INBOX SUCCESSFUL!');
  console.log('Arbitrum Rollup will auto-credit 0.035 ETH to:');
  console.log(`0xF34331FF53C4BDAA07793570aaad0084E7cE6DFD on Arbitrum Sepolia (L2)`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Bridge error:', err);
  process.exit(1);
});
