#!/usr/bin/env node
/**
 * QARBI Protocol — QuickNode & Arbitrum Sepolia Reality Gate
 * 
 * Usage:
 *   node scripts/quicknode-reality-gate.mjs [OPTIONAL_QUICKNODE_URL]
 *   npm run gate:quicknode
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read existing .env if present
const envPath = path.join(rootDir, '.env');
let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

// 2. Discover endpoint from CLI arg, environment variable, or .env file
const cliArg = process.argv[2]?.trim();
let endpoint = cliArg || process.env.QUICKNODE_ARBITRUM_SEPOLIA_RPC || process.env.QUICKNODE_RPC_URL;

if (!endpoint && envContent) {
  const match = envContent.match(/(?:QUICKNODE_ARBITRUM_SEPOLIA_RPC|QUICKNODE_ARBITRUM_RPC|QUICKNODE_RPC_URL)=["']?([^"'\r\n]+)["']?/);
  if (match && match[1] && !match[1].includes('<your-subdomain>')) {
    endpoint = match[1].trim();
  }
}

// If user passed a new endpoint as argument, automatically save it to .env
if (cliArg && cliArg.startsWith('http')) {
  try {
    const upsert = (txt, k, v) => {
      const re = new RegExp(`^${k}=.*$`, 'm');
      return re.test(txt) ? txt.replace(re, `${k}="${v}"`) : `${txt.trim()}\n${k}="${v}"\n`;
    };
    envContent = upsert(envContent, 'QUICKNODE_ARBITRUM_SEPOLIA_RPC', cliArg);
    envContent = upsert(envContent, 'QUICKNODE_ARBITRUM_RPC', cliArg);
    envContent = upsert(envContent, 'QUICKNODE_RPC_URL', cliArg);
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`💾 Saved QuickNode endpoint to .env automatically.`);
  } catch {}
}

const isPrivateQuickNode = Boolean(endpoint && endpoint.includes('quiknode.pro'));
const targetUrl = endpoint || 'https://sepolia-rollup.arbitrum.io/rpc';

let url;
try {
  url = new URL(targetUrl);
} catch {
  console.error('BLOCKED: Invalid RPC URL: ' + targetUrl);
  process.exit(2);
}

if (url.protocol !== 'https:') {
  console.error('BLOCKED: RPC endpoint must use HTTPS');
  process.exit(2);
}

async function rpc(method, params = []) {
  const t0 = Date.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(12000)
  });
  const latency = Date.now() - t0;
  if (!response.ok) throw new Error(method + ': HTTP ' + response.status);
  const body = await response.json();
  if (body.error || typeof body.result !== 'string') throw new Error(method + ': invalid RPC response');
  return { result: body.result, latency };
}

try {
  console.log(`\n=====================================================================`);
  console.log(`⚡ QARBI PROTOCOL // QUICKNODE ARBITRUM REALITY GATE`);
  console.log(`=====================================================================`);
  console.log(`🌐 Provider Endpoint : ${targetUrl.replace(/\/([^\/]{4,})$/, '/****')}`);
  console.log(`🔒 Type              : ${isPrivateQuickNode ? 'Private QuickNode Endpoint (Ultra Low-Latency)' : 'Public Arbitrum Sepolia Fallback'}\n`);

  const { result: chainId, latency: latencyChain } = await rpc('eth_chainId');
  if (chainId.toLowerCase() !== '0x66eee') {
    throw new Error('Wrong chain ID: ' + chainId + ' (expected Arbitrum Sepolia 0x66eee / 421614)');
  }

  const { result: height, latency: latencyBlock } = await rpc('eth_blockNumber');
  const blockNumber = BigInt(height);
  if (blockNumber <= 0n) throw new Error('No positive block height received');

  const blockHex = '0x' + blockNumber.toString(16);
  const t0 = Date.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_getBlockByNumber', params: [blockHex, false] }),
    signal: AbortSignal.timeout(12000)
  });
  const latencyArchive = Date.now() - t0;
  if (!response.ok) throw new Error('Block fetch HTTP ' + response.status);
  const body = await response.json();
  if (body.error || !body.result || body.result.number !== blockHex || !/^0x[0-9a-f]{64}$/i.test(body.result.hash || '')) {
    throw new Error('Block evidence invalid');
  }

  const averageLatency = Math.round((latencyChain + latencyBlock + latencyArchive) / 3);

  const verdict = {
    status: isPrivateQuickNode ? 'VERIFIED_QUICKNODE_PRIVATE_RPC' : 'VERIFIED_PUBLIC_SEPOLIA_RPC',
    providerType: isPrivateQuickNode ? 'QuickNode Private Accelerated Endpoint' : 'Public Arbitrum Sepolia Rollup',
    network: 'Arbitrum Sepolia',
    chainId: Number(BigInt(chainId)),
    blockNumber: blockNumber.toString(),
    blockHash: body.result.hash,
    latencyBenchmarkMs: `${averageLatency} ms`,
    isPrivateQuickNode,
    verifiedAt: new Date().toISOString(),
    gateScore: isPrivateQuickNode ? 100 : 60,
    note: isPrivateQuickNode
      ? '✅ QuickNode Private RPC fully verified with live block evidence and low latency.'
      : 'ℹ️ Public Sepolia RPC verified. To earn +3 points for Private QuickNode, pass your private URL: npm run gate:quicknode <YOUR_QUICKNODE_URL>'
  };

  console.log(JSON.stringify(verdict, null, 2));
  console.log(`\n=====================================================================`);
  console.log(`🏆 REALITY GATE RESULT: ${verdict.status} (${verdict.latencyBenchmarkMs})`);
  console.log(`=====================================================================\n`);
} catch (error) {
  console.error('❌ BLOCKED: ' + error.message);
  process.exit(1);
}
