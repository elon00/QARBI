import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build', 'contracts');

const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';
const provider = new ethers.JsonRpcProvider(RPC_URL);

function loadArtifact(name) {
  const filePath = path.join(buildDir, `${name}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function main() {
  console.log('--- Arbitrum Sepolia Live Gas & Fee Preflight ---');
  const feeData = await provider.getFeeData();
  const gasPriceGwei = ethers.formatUnits(feeData.gasPrice || 100000000n, 'gwei');
  console.log(`Current Base/Gas Price: ${gasPriceGwei} Gwei`);

  const deployer = '0xF34331FF53C4BDAA07793570aaad0084E7cE6DFD';
  const balance = await provider.getBalance(deployer);
  console.log(`Deployer Address: ${deployer}`);
  console.log(`Deployer Current Balance: ${ethers.formatEther(balance)} ETH\n`);

  const dummyWallet = new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890123', provider);

  const tokenArt = loadArtifact('QARBIToken');
  const regArt = loadArtifact('AgentRegistry');
  const marketArt = loadArtifact('TaskMarket');
  const conwayArt = loadArtifact('ConwayEngine');
  const walletArt = loadArtifact('AgentWallet');

  const txs = [];

  // 1. QARBIToken deployment
  const tokenFactory = new ethers.ContractFactory(tokenArt.abi, tokenArt.bytecode, dummyWallet);
  const tokenDeployTx = await tokenFactory.getDeployTransaction(10000000n);
  const tokenGas = await provider.estimateGas(tokenDeployTx);
  txs.push({ name: '1. Deploy QARBIToken.sol', gas: tokenGas });

  // 2. AgentRegistry deployment
  const regFactory = new ethers.ContractFactory(regArt.abi, regArt.bytecode, dummyWallet);
  const regDeployTx = await regFactory.getDeployTransaction();
  const regGas = await provider.estimateGas(regDeployTx);
  txs.push({ name: '2. Deploy AgentRegistry.sol', gas: regGas });

  // 3. TaskMarket deployment (with placeholder addresses)
  const marketFactory = new ethers.ContractFactory(marketArt.abi, marketArt.bytecode, dummyWallet);
  const marketDeployTx = await marketFactory.getDeployTransaction(deployer, deployer);
  const marketGas = await provider.estimateGas(marketDeployTx);
  txs.push({ name: '3. Deploy TaskMarket.sol', gas: marketGas });

  // 4. setTaskMarketAddress on AgentRegistry
  const regContract = new ethers.Contract(deployer, regArt.abi, dummyWallet);
  const setTaskMarketData = regContract.interface.encodeFunctionData('setTaskMarketAddress', [deployer]);
  // estimate transaction
  const setTaskMarketGas = 45000n; // typical SSTORE call on Arbitrum
  txs.push({ name: '4. Call setTaskMarketAddress()', gas: setTaskMarketGas });

  // 5. ConwayEngine deployment
  const conwayFactory = new ethers.ContractFactory(conwayArt.abi, conwayArt.bytecode, dummyWallet);
  const conwayDeployTx = await conwayFactory.getDeployTransaction();
  const conwayGas = await provider.estimateGas(conwayDeployTx);
  txs.push({ name: '5. Deploy ConwayEngine.sol', gas: conwayGas });

  // 6. AgentWallet deployment
  const walletFactory = new ethers.ContractFactory(walletArt.abi, walletArt.bytecode, dummyWallet);
  const walletDeployTx = await walletFactory.getDeployTransaction(
    deployer,
    deployer,
    ethers.parseEther('50'),
    ethers.parseEther('250')
  );
  const walletGas = await provider.estimateGas(walletDeployTx);
  txs.push({ name: '6. Deploy AgentWallet.sol', gas: walletGas });

  let totalGas = 0n;
  console.log('Transaction Preflight Breakdown:');
  for (const tx of txs) {
    const costWei = tx.gas * (feeData.gasPrice || 100000000n);
    console.log(`- ${tx.name}: ~${tx.gas.toLocaleString()} gas (~${ethers.formatEther(costWei)} ETH)`);
    totalGas += tx.gas;
  }

  const totalCostWei = totalGas * (feeData.gasPrice || 100000000n);
  console.log(`\nTOTAL ESTIMATED GAS FOR ALL 6 TRANSACTIONS: ${totalGas.toLocaleString()} gas`);
  console.log(`TOTAL ESTIMATED ETH AT CURRENT FEES: ${ethers.formatEther(totalCostWei)} ETH`);
  console.log(`RECOMMENDED FUNDING BUFFER: 0.005 ETH to 0.01 ETH`);
}

main().catch(console.error);
