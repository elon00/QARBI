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
  console.log(`Connecting to Arbitrum Sepolia (Chain ID: ${CHAIN_ID})...`);
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // No signer or zero-balance fallback: a manifest is never proof of deployment.
  const network = await provider.getNetwork();
  if (network.chainId !== BigInt(CHAIN_ID)) throw new Error(`Wrong network: expected ${CHAIN_ID}, got ${network.chainId}`);
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!privateKey || !/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error('BLOCKED: DEPLOYER_PRIVATE_KEY is required; no wallet generated or address manifest fabricated');
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);
  if (balance === 0n) throw new Error('BLOCKED: deployer has zero testnet ETH; no manifest was written');
  console.log(`Validated testnet deployer ${wallet.address} (funded)`);

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
  console.log(`✓ QARBIToken deployed at: ${tokenAddress}`);

  // 2. Deploy AgentRegistry
  console.log('2/5 Deploying AgentRegistry...');
  const RegistryFactory = new ethers.ContractFactory(registryArtifact.abi, registryArtifact.bytecode, wallet);
  const registryContract = await RegistryFactory.deploy();
  await registryContract.waitForDeployment();
  const registryAddress = await registryContract.getAddress();
  console.log(`✓ AgentRegistry deployed at: ${registryAddress}`);

  // 3. Deploy TaskMarket
  console.log('3/5 Deploying TaskMarket...');
  const MarketFactory = new ethers.ContractFactory(marketArtifact.abi, marketArtifact.bytecode, wallet);
  const marketContract = await MarketFactory.deploy(tokenAddress, registryAddress);
  await marketContract.waitForDeployment();
  const marketAddress = await marketContract.getAddress();
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
  console.log(`✓ AgentWallet deployed at: ${walletAddress}`);

  const deployedAddresses = {
    network: "Arbitrum Sepolia",
    chainId: CHAIN_ID,
    rpcProvider: 'configured externally; credentials intentionally omitted',
    explorerUrl: "https://sepolia.arbiscan.io",
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      QARBIToken: {
        address: tokenAddress,
        name: "QARBIToken.sol",
        symbol: "QARBI",
        decimals: 18,
        verified: false,
        explorer: `https://sepolia.arbiscan.io/address/${tokenAddress}`
      },
      AgentRegistry: {
        address: registryAddress,
        name: "AgentRegistry.sol",
        verified: false,
        explorer: `https://sepolia.arbiscan.io/address/${registryAddress}`
      },
      TaskMarket: {
        address: marketAddress,
        name: "TaskMarket.sol",
        verified: false,
        explorer: `https://sepolia.arbiscan.io/address/${marketAddress}`
      },
      ConwayEngine: {
        address: conwayAddress,
        name: "ConwayEngine.sol",
        verified: false,
        explorer: `https://sepolia.arbiscan.io/address/${conwayAddress}`
      },
      AgentWallet: {
        address: walletAddress,
        name: "AgentWallet.sol",
        verified: false,
        explorer: `https://sepolia.arbiscan.io/address/${walletAddress}`
      }
    }
  };

  // Successful mining alone is not independent explorer source-code verification.
  // Confirm runtime code at every recorded address before creating the manifest.
  for (const [name, entry] of Object.entries(deployedAddresses.contracts)) {
    const code = await provider.getCode(entry.address);
    if (code === '0x') throw new Error(`BLOCKED: no runtime bytecode for ${name}`);
  }
  fs.writeFileSync(addressesFile, JSON.stringify(deployedAddresses, null, 2));
  console.log(`\n🎉 Full deployment to Arbitrum Sepolia succeeded!`);
  console.log(`Manifest saved to: ${addressesFile}`);
}

main().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
