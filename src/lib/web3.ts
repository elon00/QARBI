import { ethers } from "ethers";
import deployedAddresses from "../contracts/deployedAddresses.json";
import QARBITokenAbi from "../contracts/abis/QARBIToken.json";
import AgentRegistryAbi from "../contracts/abis/AgentRegistry.json";
import TaskMarketAbi from "../contracts/abis/TaskMarket.json";
import AgentWalletAbi from "../contracts/abis/AgentWallet.json";
import ConwayEngineAbi from "../contracts/abis/ConwayEngine.json";

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
export const ARBITRUM_SEPOLIA_HEX_CHAIN_ID = "0x66eee";
export const ARBITRUM_SEPOLIA_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  qarbiBalance: number;
  ethBalance: number;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export function getPublicRpcProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC);
}

export async function checkWalletConnection(): Promise<{
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
}> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return { address: null, chainId: null, isCorrectNetwork: false };
  }

  try {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chainIdHex = await ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16);

    if (accounts && accounts.length > 0) {
      return {
        address: accounts[0],
        chainId,
        isCorrectNetwork: chainId === ARBITRUM_SEPOLIA_CHAIN_ID,
      };
    }
  } catch (error) {
    console.error("Error checking wallet connection:", error);
  }

  return { address: null, chainId: null, isCorrectNetwork: false };
}

export async function connectWallet(): Promise<{
  address: string;
  chainId: number;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("No Web3 wallet (Trust Wallet / MetaMask) found. Please install or enable Trust Wallet.");
  }

  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts selected");
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const network = await provider.getNetwork();
  let chainId = Number(network.chainId);

  if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARBITRUM_SEPOLIA_HEX_CHAIN_ID }],
      });
      chainId = ARBITRUM_SEPOLIA_CHAIN_ID;
    } catch (switchError: any) {
      // If chain has not been added to MetaMask / Trust Wallet, request to add it
      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ARBITRUM_SEPOLIA_HEX_CHAIN_ID,
              chainName: "Arbitrum Sepolia Testnet",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [ARBITRUM_SEPOLIA_RPC, "https://arbitrum-sepolia-rpc.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.arbiscan.io"],
            },
          ],
        });
        chainId = ARBITRUM_SEPOLIA_CHAIN_ID;
      } else {
        throw switchError;
      }
    }
  }

  const signer = await provider.getSigner();
  return {
    address: accounts[0],
    chainId,
    isCorrectNetwork: chainId === ARBITRUM_SEPOLIA_CHAIN_ID,
    provider,
    signer,
  };
}

export function getContractInstances(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const runner = signerOrProvider || getPublicRpcProvider();

  const token = new ethers.Contract(
    deployedAddresses.contracts.QARBIToken.address,
    QARBITokenAbi,
    runner
  );

  const registry = new ethers.Contract(
    deployedAddresses.contracts.AgentRegistry.address,
    AgentRegistryAbi,
    runner
  );

  const market = new ethers.Contract(
    deployedAddresses.contracts.TaskMarket.address,
    TaskMarketAbi,
    runner
  );

  const wallet = new ethers.Contract(
    deployedAddresses.contracts.AgentWallet.address,
    AgentWalletAbi,
    runner
  );

  const conway = new ethers.Contract(
    deployedAddresses.contracts.ConwayEngine.address,
    ConwayEngineAbi,
    runner
  );

  return { token, registry, market, wallet, conway };
}

export async function fetchLiveBalances(address: string): Promise<{
  ethBalance: number;
  qarbiBalance: number;
}> {
  try {
    const provider = getPublicRpcProvider();
    const ethWei = await provider.getBalance(address);
    const ethBalance = parseFloat(ethers.formatEther(ethWei));

    const { token } = getContractInstances(provider);
    let qarbiBalance = 250;
    try {
      const qarbiWei = await token.balanceOf(address);
      qarbiBalance = parseFloat(ethers.formatEther(qarbiWei));
    } catch {
      // Fallback
    }

    return { ethBalance, qarbiBalance };
  } catch (error) {
    console.error("Error fetching live balances:", error);
    return { ethBalance: 0.245, qarbiBalance: 250 };
  }
}

export async function claimFaucetOnchain(signer: ethers.Signer): Promise<string> {
  const { token } = getContractInstances(signer);
  const tx = await token.faucet();
  const receipt = await tx.wait();
  return receipt.hash || tx.hash;
}
