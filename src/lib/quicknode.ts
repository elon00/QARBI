import { ethers } from "ethers";

export interface ChainConfig {
  id: string;
  name: string;
  chainId: number;
  hexChainId: string;
  type: "rollup" | "orbit" | "anytrust";
  publicRpc: string;
  defaultQuicknodeTemplate: string;
  explorerUrl: string;
  faucetUrl?: string;
  docsUrl: string;
  trackName: string;
  description: string;
}

export const QUICKNODE_SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  "arbitrum-sepolia": {
    id: "arbitrum-sepolia",
    name: "Arbitrum Sepolia Testnet",
    chainId: 421614,
    hexChainId: "0x66eee",
    type: "rollup",
    publicRpc: "https://sepolia-rollup.arbitrum.io/rpc",
    defaultQuicknodeTemplate: "https://<your-slug>.arbitrum-sepolia.quiknode.pro/<api-key>/",
    explorerUrl: "https://sepolia.arbiscan.io",
    faucetUrl: "https://faucet.quicknode.com/arbitrum/sepolia",
    docsUrl: "https://www.quicknode.com/docs/arbitrum",
    trackName: "Arbitrum Core Track",
    description: "Primary testing environment for Arbitrum Nitro rollups and Stylus Rust WASM contracts.",
  },
  "arbitrum-one": {
    id: "arbitrum-one",
    name: "Arbitrum One Mainnet",
    chainId: 42161,
    hexChainId: "0xa4b1",
    type: "rollup",
    publicRpc: "https://arb1.arbitrum.io/rpc",
    defaultQuicknodeTemplate: "https://<your-slug>.arbitrum-mainnet.quiknode.pro/<api-key>/",
    explorerUrl: "https://arbiscan.io",
    docsUrl: "https://www.quicknode.com/docs/arbitrum",
    trackName: "Arbitrum Core Track",
    description: "Flagship Arbitrum Nitro Layer-2 rollup with low fees and Ethereum L1 security inheritance.",
  },
  "arbitrum-nova": {
    id: "arbitrum-nova",
    name: "Arbitrum Nova",
    chainId: 42170,
    hexChainId: "0xa4ba",
    type: "anytrust",
    publicRpc: "https://nova.arbitrum.io/rpc",
    defaultQuicknodeTemplate: "https://<your-slug>.nova-mainnet.quiknode.pro/<api-key>/",
    explorerUrl: "https://nova.arbiscan.io",
    docsUrl: "https://www.quicknode.com/docs/arbitrum-nova",
    trackName: "Gaming & Social Track",
    description: "AnyTrust chain engineered for high-frequency microtransactions, gaming, and agent coordination.",
  },
  "robinhood-testnet": {
    id: "robinhood-testnet",
    name: "Robinhood Chain Testnet",
    chainId: 46630,
    hexChainId: "0xb626",
    type: "orbit",
    publicRpc: "https://rpc.testnet.robinhood.chain",
    defaultQuicknodeTemplate: "https://<your-slug>.robinhood-testnet.quiknode.pro/<api-key>/",
    explorerUrl: "https://explorer.testnet.robinhood.chain",
    faucetUrl: "https://faucet.quicknode.com/robinhood/testnet",
    docsUrl: "https://www.quicknode.com/docs/robinhood",
    trackName: "Robinhood Chain Track",
    description: "Arbitrum Orbit chain customized for consumer fintech, automated trading agents, and compliant asset transfers.",
  },
  "gravity-mainnet": {
    id: "gravity-mainnet",
    name: "Gravity Alpha Mainnet",
    chainId: 1625,
    hexChainId: "0x659",
    type: "orbit",
    publicRpc: "https://rpc.gravity.xyz",
    defaultQuicknodeTemplate: "https://<your-slug>.gravity-mainnet.quiknode.pro/<api-key>/",
    explorerUrl: "https://explorer.gravity.xyz",
    docsUrl: "https://www.quicknode.com/docs/gravity",
    trackName: "Gravity Orbit Track",
    description: "Arbitrum Nitro-powered settlement layer optimized for cross-chain execution and agent intent settlements.",
  },
};

export const QUICKNODE_CREDITS_COUPON = "ARBOHSGP";
export const QUICKNODE_TELEGRAM_SUPPORT = "@sensahill";
export const QUICKNODE_PRICING_URL = "https://www.quicknode.com/pricing";

export interface StreamEventPayload {
  id: string;
  eventType: "AGENT_REGISTERED" | "TASK_CREATED" | "TASK_SETTLED" | "CONWAY_STEP" | "X402_PAYMENT" | "CUSTOM_STREAM";
  blockNumber: number;
  txHash: string;
  sourceChain: string;
  timestamp: number;
  details: Record<string, any>;
  raw?: any;
}

/**
 * Benchmark RPC latency in milliseconds
 */
export async function measureRpcLatency(rpcUrl: string): Promise<{ latencyMs: number; blockNumber: number | null; ok: boolean; error?: string }> {
  const start = performance.now();
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const blockNumber = await Promise.race([
      provider.getBlockNumber(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("RPC Timeout (5000ms)")), 5000)),
    ]);
    const end = performance.now();
    return {
      latencyMs: Math.round(end - start),
      blockNumber,
      ok: true,
    };
  } catch (err: any) {
    const end = performance.now();
    return {
      latencyMs: Math.round(end - start),
      blockNumber: null,
      ok: false,
      error: err.message || "Failed to reach RPC endpoint",
    };
  }
}
