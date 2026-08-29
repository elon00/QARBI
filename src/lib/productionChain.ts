import { ethers } from "ethers";
import deployedAddresses from "../contracts/deployedAddresses.json";
import AgentRegistryAbi from "../contracts/abis/AgentRegistry.json";
import QARBITokenAbi from "../contracts/abis/QARBIToken.json";
import TaskMarketAbi from "../contracts/abis/TaskMarket.json";
import ConwayEngineAbi from "../contracts/abis/ConwayEngine.json";
import AgentWalletAbi from "../contracts/abis/AgentWallet.json";

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
export const ARBITRUM_ONE_CHAIN_ID = 42161;
export const ARBITRUM_SEPOLIA_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

export const EXPLORER_BASE = "https://sepolia.arbiscan.io";

function assertAddress(address: string, name: string): void {
  if (!ethers.isAddress(address)) throw new Error(`Invalid ${name} contract address: ${address}`);
}

export function assertConfiguredTestnet(): void {
  const contracts = deployedAddresses.contracts;
  Object.entries(contracts).forEach(([name, value]) => assertAddress(value.address, name));
  if (Number(deployedAddresses.chainId) !== ARBITRUM_SEPOLIA_CHAIN_ID) {
    throw new Error(`Configured deployment is not Arbitrum Sepolia (421614).`);
  }
}

export function explorerTxUrl(txHash: string): string {
  return `${EXPLORER_BASE}/tx/${txHash}`;
}

export function explorerAddressUrl(address: string): string {
  return `${EXPLORER_BASE}/address/${address}`;
}

export async function requireSepolia(signer: ethers.Signer): Promise<void> {
  const network = await signer.provider?.getNetwork();
  if (!network || Number(network.chainId) !== ARBITRUM_SEPOLIA_CHAIN_ID) {
    throw new Error("Please switch your wallet to Arbitrum Sepolia (Chain ID 421614).");
  }
}

export function getProductionContracts(runner: ethers.Signer | ethers.Provider) {
  assertConfiguredTestnet();
  return {
    token: new ethers.Contract(deployedAddresses.contracts.QARBIToken.address, QARBITokenAbi, runner),
    registry: new ethers.Contract(deployedAddresses.contracts.AgentRegistry.address, AgentRegistryAbi, runner),
    market: new ethers.Contract(deployedAddresses.contracts.TaskMarket.address, TaskMarketAbi, runner),
    conway: new ethers.Contract(deployedAddresses.contracts.ConwayEngine.address, ConwayEngineAbi, runner),
    wallet: new ethers.Contract(deployedAddresses.contracts.AgentWallet.address, AgentWalletAbi, runner),
  };
}

export async function registerAgentOnchain(
  signer: ethers.Signer,
  params: {
    name: string;
    archetype: string;
    pqcCommitmentHash: string;
    delegatedSessionWallet?: string;
    metadataURI: string;
    singleTxLimit: bigint;
    dailyBudget: bigint;
  }
): Promise<{ txHash: string; receipt: ethers.TransactionReceipt; agentId: bigint }> {
  await requireSepolia(signer);
  const { registry } = getProductionContracts(signer);
  const session = params.delegatedSessionWallet && ethers.isAddress(params.delegatedSessionWallet)
    ? params.delegatedSessionWallet
    : ethers.ZeroAddress;

  const tx = await registry.registerAgent(
    params.name,
    params.archetype,
    params.pqcCommitmentHash,
    session,
    params.metadataURI,
    params.singleTxLimit,
    params.dailyBudget
  );
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Agent registration receipt was not returned.");

  const event = receipt.logs
    .map((log) => {
      try { return registry.interface.parseLog(log); } catch { return null; }
    })
    .find((parsed) => parsed?.name === "AgentRegistered");

  if (!event) throw new Error("AgentRegistered event not found in confirmed receipt.");
  return { txHash: receipt.hash, receipt, agentId: BigInt(event.args.agentId) };
}

export async function approveQarbi(
  signer: ethers.Signer,
  spender: string,
  amount: bigint
): Promise<ethers.TransactionReceipt> {
  await requireSepolia(signer);
  const { token } = getProductionContracts(signer);
  const tx = await token.approve(spender, amount);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Approval receipt was not returned.");
  return receipt;
}

export async function createTaskOnchain(
  signer: ethers.Signer,
  title: string,
  description: string,
  requiredArchetype: string,
  rewardAmount: bigint
): Promise<{ txHash: string; receipt: ethers.TransactionReceipt; taskId: bigint }> {
  await requireSepolia(signer);
  const { token, market } = getProductionContracts(signer);
  const marketAddress = await market.getAddress();
  await approveQarbi(signer, marketAddress, rewardAmount);
  const tx = await market.createTask(title, description, requiredArchetype, rewardAmount);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Task creation receipt was not returned.");
  const event = receipt.logs
    .map((log) => { try { return market.interface.parseLog(log); } catch { return null; } })
    .find((parsed) => parsed?.name === "TaskCreated");
  if (!event) throw new Error("TaskCreated event not found in confirmed receipt.");
  return { txHash: receipt.hash, receipt, taskId: BigInt(event.args.taskId) };
}

export async function claimTaskOnchain(
  signer: ethers.Signer,
  taskId: bigint,
  agentId: bigint
): Promise<ethers.TransactionReceipt> {
  await requireSepolia(signer);
  const { market } = getProductionContracts(signer);
  const tx = await market.claimTask(taskId, agentId);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Task claim receipt was not returned.");
  return receipt;
}

export async function settleTaskOnchain(
  signer: ethers.Signer,
  taskId: bigint,
  proofHash: string
): Promise<ethers.TransactionReceipt> {
  await requireSepolia(signer);
  const { market } = getProductionContracts(signer);
  const tx = await market.submitProofAndSettle(taskId, proofHash);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Settlement receipt was not returned.");
  return receipt;
}

export async function stepConwayOnchain(
  signer: ethers.Signer,
  livingGrid: bigint[]
): Promise<{ txHash: string; receipt: ethers.TransactionReceipt; result: readonly [bigint[], bigint, bigint, bigint] }> {
  await requireSepolia(signer);
  if (livingGrid.length !== 24) throw new Error("Conway grid must contain exactly 24 rows.");
  const { conway } = getProductionContracts(signer);
  const grid = livingGrid.map((v) => BigInt(v));
  const simulation = await conway.stepGrid.staticCall(grid);
  const tx = await conway.stepGrid(grid);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Conway receipt was not returned.");
  return { txHash: receipt.hash, receipt, result: simulation };
}
