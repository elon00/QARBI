import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const buildDir = path.join(rootDir, 'build', 'contracts');
const addressesFile = path.join(rootDir, 'src', 'contracts', 'deployedAddresses.json');

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc';
const CHAIN_ID = 421614;

async function main() {
  console.log(`Connecting to Arbitrum Sepolia (Chain ID: ${CHAIN_ID}) at ${RPC_URL}...`);
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
    throw new Error('Missing valid DEPLOYER_PRIVATE_KEY/PRIVATE_KEY. Refusing to generate an ephemeral deployer wallet.');
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID) {
    throw new Error(`Wrong network: expected chain ${CHAIN_ID}, got ${network.chainId}`);
  }
  console.log(`Deployer address loaded from .env: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  const balanceEth = ethers.formatEther(balance);
  console.log(`Deployer balance on Arbitrum Sepolia: ${balanceEth} ETH`);

  if (balance === 0n) {
    throw new Error(
      `Deployer ${wallet.address} has 0 Arbitrum Sepolia ETH. Fund this wallet and rerun deployment. No addresses or verification claims were written.`
    );
  }

  console.log(`Deploying smart contracts to Arbitrum Sepolia with wallet ${wallet.address}...`);

  function loadArtifact(name) {
    const filePath = path.join(buildDir, `${name}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  const tokenArtifact = loadArtifact('QARBIToken');
  const registryArtifact = loadArtifact('AgentRegistry');
  const marketArtifact = loadArtifact('TaskMarket');
  const conwayArtifact = loadArtifact('ConwayEngine');
  const walletArtifact = loadArtifact('AgentWallet');

  // 1. Deploy QARBIToken
  console.log('1/5 Deploying QARBIToken (10,000,000 initial supply)...');
  const TokenFactory = new ethers.ContractFactory(tokenArtifact.abi, tokenArtifact.bytecode, wallet);
  const tokenContract = await TokenFactory.deploy(10000000n);
  await tokenContract.waitForDeployment();
  const tokenAddress = await tokenContract.getAddress();
  const tokenDeploymentTxHash = tokenContract.deploymentTransaction()?.hash ?? null;
  console.log(`✓ QARBIToken deployed at: ${tokenAddress}`);

  // 2. Deploy AgentRegistry
  console.log('2/5 Deploying AgentRegistry...');
  const RegistryFactory = new ethers.ContractFactory(registryArtifact.abi, registryArtifact.bytecode, wallet);
  const registryContract = await RegistryFactory.deploy();
  await registryContract.waitForDeployment();
  const registryAddress = await registryContract.getAddress();
  const registryDeploymentTxHash = registryContract.deploymentTransaction()?.hash ?? null;
  console.log(`✓ AgentRegistry deployed at: ${registryAddress}`);

  // 3. Deploy TaskMarket
  console.log('3/5 Deploying TaskMarket...');
  const MarketFactory = new ethers.ContractFactory(marketArtifact.abi, marketArtifact.bytecode, wallet);
  const marketContract = await MarketFactory.deploy(tokenAddress, registryAddress);
  await marketContract.waitForDeployment();
  const marketAddress = await marketContract.getAddress();
  const marketDeploymentTxHash = marketContract.deploymentTransaction()?.hash ?? null;
  console.log(`✓ TaskMarket deployed at: ${marketAddress}`);

  // Set TaskMarket address in AgentRegistry
  console.log('Linking TaskMarket to AgentRegistry authorization...');
  const txAuth = await registryContract.setTaskMarketAddress(marketAddress);
  await txAuth.wait();

  // 4. Deploy ConwayEngine
  console.log('4/5 Deploying ConwayEngine...');
  const ConwayFactory = new ethers.ContractFactory(conwayArtifact.abi, conwayArtifact.bytecode, wallet);
  const conwayContract = await ConwayFactory.deploy();
  await conwayContract.waitForDeployment();
  const conwayAddress = await conwayContract.getAddress();
  const conwayDeploymentTxHash = conwayContract.deploymentTransaction()?.hash ?? null;
  console.log(`✓ ConwayEngine deployed at: ${conwayAddress}`);

  // 5. Deploy AgentWallet
  console.log('5/5 Deploying AgentWallet...');
  const WalletFactory = new ethers.ContractFactory(walletArtifact.abi, walletArtifact.bytecode, wallet);
  const walletContract = await WalletFactory.deploy(
    wallet.address,
    wallet.address,
    ethers.parseEther('50'),
    ethers.parseEther('250')
  );
  await walletContract.waitForDeployment();
  const walletAddress = await walletContract.getAddress();
  const walletDeploymentTxHash = walletContract.deploymentTransaction()?.hash ?? null;
  console.log(`✓ AgentWallet deployed at: ${walletAddress}`);

  const deployedAddresses = {
    network: "Arbitrum Sepolia",
    chainId: CHAIN_ID,
    rpcUrl: RPC_URL,
    explorerUrl: "https://sepolia.arbiscan.io",
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    deploymentEvidence: "Contract addresses require explorer verification before verified=true",
    contracts: {
      QARBIToken: {
        address: tokenAddress,
        name: "QARBIToken.sol",
        symbol: "QARBI",
        decimals: 18,
        verified: false,
        deploymentTxHash: tokenDeploymentTxHash,
        explorer: `https://sepolia.arbiscan.io/address/${tokenAddress}`
      },
      AgentRegistry: {
        address: registryAddress,
        name: "AgentRegistry.sol",
        verified: false,
        deploymentTxHash: registryDeploymentTxHash,
        explorer: `https://sepolia.arbiscan.io/address/${registryAddress}`
      },
      TaskMarket: {
        address: marketAddress,
        name: "TaskMarket.sol",
        verified: false,
        deploymentTxHash: marketDeploymentTxHash,
        explorer: `https://sepolia.arbiscan.io/address/${marketAddress}`
      },
      ConwayEngine: {
        address: conwayAddress,
        name: "ConwayEngine.sol",
        verified: false,
        deploymentTxHash: conwayDeploymentTxHash,
        explorer: `https://sepolia.arbiscan.io/address/${conwayAddress}`
      },
      AgentWallet: {
        address: walletAddress,
        name: "AgentWallet.sol",
        verified: false,
        deploymentTxHash: walletDeploymentTxHash,
        explorer: `https://sepolia.arbiscan.io/address/${walletAddress}`
      }
    }
  };

  fs.writeFileSync(addressesFile, JSON.stringify(deployedAddresses, null, 2));
  console.log(`\n🎉 Full deployment to Arbitrum Sepolia succeeded!`);
  console.log(`Manifest saved to: ${addressesFile}`);
}

main().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
