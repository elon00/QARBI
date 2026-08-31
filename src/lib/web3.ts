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

// Fallback safety for BroadcastChannel in restricted/sandboxed browser environments
if (typeof window !== "undefined") {
  if (typeof (window as any).BroadcastChannel === "undefined") {
    try {
      (window as any).BroadcastChannel = class {
        name: string;
        onmessage: any = null;
        constructor(name: string) {
          this.name = name;
        }
        postMessage() {}
        close() {}
      };
    } catch {
      // Ignore
    }
  }
}

export type WalletType = "metamask" | "trust";

function getWalletProviders(): any[] {
  if (typeof window === "undefined") return [];
  const win = window as any;
  const providers = win.ethereum?.providers?.length ? [...win.ethereum.providers] : win.ethereum ? [win.ethereum] : [];
  if (win.trustwallet?.ethereum && !providers.includes(win.trustwallet.ethereum)) providers.push(win.trustwallet.ethereum);
  return providers;
}

export function getInjectedProvider(walletType: WalletType = "metamask"): any {
  const providers = getWalletProviders();
  const selected = walletType === "metamask"
    ? providers.find((p: any) => p.isMetaMask && !p.isTrust && !p.isTrustWallet)
    : providers.find((p: any) => p.isTrust || p.isTrustWallet);
  return selected || null;
}

export function getPublicRpcProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC);
}

export async function checkWalletConnection(): Promise<{
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
}> {
  const ethereum = getInjectedProvider();
  if (!ethereum) {
    return { address: null, chainId: null, isCorrectNetwork: false };
  }

  try {
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
    console.warn("Silent check of wallet connection:", error);
  }

  return { address: null, chainId: null, isCorrectNetwork: false };
}

export async function connectWallet(walletType: WalletType = "metamask"): Promise<{
  address: string;
  chainId: number;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}> {
  const ethereum = getInjectedProvider(walletType);
  if (!ethereum) {
    const label = walletType === "metamask" ? "MetaMask" : "Trust Wallet";
    throw new Error(`${label} was not detected. Open/activate ${label} and try again.`);
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts selected in wallet");
    }

    const provider = new ethers.BrowserProvider(ethereum, "any");
    let network = await provider.getNetwork();
    let chainId = Number(network.chainId);

    if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARBITRUM_SEPOLIA_HEX_CHAIN_ID }],
        });
        chainId = ARBITRUM_SEPOLIA_CHAIN_ID;
      } catch (switchError: any) {
        if (switchError.code === 4902 || switchError.message?.includes("Unrecognized chain")) {
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
          console.warn("Chain switch error ignored:", switchError);
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
  } catch (error: any) {
    console.error("Connect wallet error:", error);
    throw new Error(error.message || "Failed to connect wallet");
  }
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
    return { ethBalance: 0, qarbiBalance: 0 };
  }
}

export async function claimFaucetOnchain(signer: ethers.Signer): Promise<string> {
  const { token } = getContractInstances(signer);
  const tx = await token.faucet();
  const receipt = await tx.wait();
  return receipt.hash || tx.hash;
}
