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

export type WalletType = "metamask" | "trust";

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  providerInfo?: { rdns?: string; name?: string };
};

function isTrustProvider(provider: Eip1193Provider | null | undefined): boolean {
  return Boolean(
    provider?.isTrust ||
      provider?.isTrustWallet ||
      provider?.providerInfo?.rdns === "com.trustwallet.app"
  );
}

function isMetaMaskProvider(provider: Eip1193Provider | null | undefined): boolean {
  return Boolean(provider?.isMetaMask) && !isTrustProvider(provider);
}

function addUniqueProvider(list: Eip1193Provider[], provider: Eip1193Provider | null | undefined) {
  if (provider && !list.includes(provider)) list.push(provider);
}

async function getWalletProviders(): Promise<Eip1193Provider[]> {
  if (typeof window === "undefined") return [];

  const win = window as Window & typeof globalThis & {
    ethereum?: Eip1193Provider & { providers?: Eip1193Provider[] };
    trustwallet?: { ethereum?: Eip1193Provider };
  };

  const providers: Eip1193Provider[] = [];

  if (Array.isArray(win.ethereum?.providers)) {
    win.ethereum.providers.forEach((provider) => addUniqueProvider(providers, provider));
  } else {
    addUniqueProvider(providers, win.ethereum);
  }
  addUniqueProvider(providers, win.trustwallet?.ethereum);

  const discovered: Eip1193Provider[] = [];
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{
      provider?: Eip1193Provider;
      info?: { rdns?: string; name?: string };
    }>).detail;
    if (detail?.provider) {
      detail.provider.providerInfo = detail.info;
      addUniqueProvider(discovered, detail.provider);
    }
  };

  window.addEventListener("eip6963:announceProvider", handler);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  await new Promise((resolve) => window.setTimeout(resolve, 400));
  window.removeEventListener("eip6963:announceProvider", handler);

  discovered.forEach((provider) => addUniqueProvider(providers, provider));
  return providers;
}

async function getInjectedProvider(walletType: WalletType): Promise<Eip1193Provider | null> {
  const providers = await getWalletProviders();

  if (walletType === "trust") {
    return providers.find(isTrustProvider) || null;
  }

  return providers.find(isMetaMaskProvider) || null;
}

export function getPublicRpcProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC);
}

export async function checkWalletConnection(): Promise<{
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
}> {
  // Do not probe with eth_requestAccounts during page load. Only inspect a
  // previously authorized MetaMask account to avoid triggering extension UI.
  const ethereum = await getInjectedProvider("metamask");
  if (!ethereum) return { address: null, chainId: null, isCorrectNetwork: false };

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chainIdHex = await ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(String(chainIdHex), 16);
    return accounts?.length
      ? { address: accounts[0], chainId, isCorrectNetwork: chainId === ARBITRUM_SEPOLIA_CHAIN_ID }
      : { address: null, chainId: null, isCorrectNetwork: false };
  } catch (error) {
    console.warn("Silent wallet check failed:", error);
    return { address: null, chainId: null, isCorrectNetwork: false };
  }
}

export async function connectWallet(walletType: WalletType = "metamask"): Promise<{
  address: string;
  chainId: number;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}> {
  const ethereum = await getInjectedProvider(walletType);
  const label = walletType === "metamask" ? "MetaMask" : "Trust Wallet";

  if (!ethereum) {
    throw new Error(
      `${label} was not detected. Install, unlock, and enable the ${label} extension, then reload this page.`
    );
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts?.length) throw new Error(`No account was selected in ${label}`);

    const provider = new ethers.BrowserProvider(ethereum, "any");
    let chainId = Number((await provider.getNetwork()).chainId);

    if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARBITRUM_SEPOLIA_HEX_CHAIN_ID }],
        });
      } catch (switchError: any) {
        if (
          switchError?.code === 4902 ||
          /unrecognized chain|chain not added/i.test(String(switchError?.message || ""))
        ) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ARBITRUM_SEPOLIA_HEX_CHAIN_ID,
                chainName: "Arbitrum Sepolia",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: [ARBITRUM_SEPOLIA_RPC],
                blockExplorerUrls: ["https://sepolia.arbiscan.io"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
      chainId = Number((await provider.getNetwork()).chainId);
    }

    if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
      throw new Error(`Please switch ${label} to Arbitrum Sepolia (Chain ID ${ARBITRUM_SEPOLIA_CHAIN_ID}).`);
    }

    const signer = await provider.getSigner();
    return {
      address: accounts[0],
      chainId,
      isCorrectNetwork: true,
      provider,
      signer,
    };
  } catch (error: any) {
    console.error(`${label} connection error:`, error);
    throw new Error(error?.message || `Failed to connect ${label}`);
  }
}

export function getContractInstances(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const runner = signerOrProvider || getPublicRpcProvider();
  return {
    token: new ethers.Contract(deployedAddresses.contracts.QARBIToken.address, QARBITokenAbi, runner),
    registry: new ethers.Contract(deployedAddresses.contracts.AgentRegistry.address, AgentRegistryAbi, runner),
    market: new ethers.Contract(deployedAddresses.contracts.TaskMarket.address, TaskMarketAbi, runner),
    wallet: new ethers.Contract(deployedAddresses.contracts.AgentWallet.address, AgentWalletAbi, runner),
    conway: new ethers.Contract(deployedAddresses.contracts.ConwayEngine.address, ConwayEngineAbi, runner),
  };
}

export async function fetchLiveBalances(address: string): Promise<{ ethBalance: number; qarbiBalance: number }> {
  try {
    const provider = getPublicRpcProvider();
    const ethBalance = parseFloat(ethers.formatEther(await provider.getBalance(address)));
    const { token } = getContractInstances(provider);
    let qarbiBalance = 0;
    try {
      qarbiBalance = parseFloat(ethers.formatEther(await token.balanceOf(address)));
    } catch {
      // Leave balance at 0 when the token contract is unavailable.
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
