#!/usr/bin/env node
// Read-only, live Arbitrum Sepolia QuickNode RPC reality gate.
// Usage: QUICKNODE_ARBITRUM_SEPOLIA_RPC=https://... node scripts/quicknode-reality-gate.mjs
const endpoint = process.env.QUICKNODE_ARBITRUM_SEPOLIA_RPC;
if (!endpoint) {
  console.error("BLOCKED: QUICKNODE_ARBITRUM_SEPOLIA_RPC is not configured");
  process.exit(2);
}
let url;
try { url = new URL(endpoint); } catch { console.error("BLOCKED: invalid RPC URL"); process.exit(2); }
if (url.protocol !== "https:") {
  console.error("BLOCKED: RPC endpoint must use HTTPS");
  process.exit(2);
}
async function rpc(method, params = []) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error(method + ": HTTP " + response.status);
  const body = await response.json();
  if (body.error || typeof body.result !== "string") throw new Error(method + ": invalid RPC response");
  return body.result;
}
try {
  const chainId = await rpc("eth_chainId");
  if (chainId.toLowerCase() !== "0x66eee") throw new Error("Wrong chain ID: " + chainId);
  const height = await rpc("eth_blockNumber");
  const blockNumber = BigInt(height);
  if (blockNumber <= 0n) throw new Error("No positive block height");
  const blockHex = "0x" + blockNumber.toString(16);
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "eth_getBlockByNumber", params: [blockHex, false] }),
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error("Block fetch HTTP " + response.status);
  const body = await response.json();
  if (body.error || !body.result || body.result.number !== blockHex || !/^0x[0-9a-f]{64}$/i.test(body.result.hash || "")) {
    throw new Error("Block evidence invalid");
  }
  console.log(JSON.stringify({
    status: "VERIFIED_RPC_READ_ONLY",
    network: "Arbitrum Sepolia",
    chainId: Number(BigInt(chainId)),
    blockNumber: blockNumber.toString(),
    blockHash: body.result.hash,
    verifiedAt: new Date().toISOString(),
    limitations: "Does not prove deployment, live contracts, Stream delivery, or production readiness"
  }, null, 2));
} catch (error) {
  console.error("BLOCKED: " + error.message);
  process.exit(1);
}
