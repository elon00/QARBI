#!/usr/bin/env node
/**
 * ==============================================================================
 * QARBI Protocol // 1-Click QuickNode Automation Runner
 * Arbitrum Open House Singapore // Coupon: ARBOHSGP ($147 Free Build Plan)
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';
import crypto from 'crypto';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const COUPON_CODE = 'ARBOHSGP';
const QUICKNODE_CHECKOUT_URL = `https://www.quicknode.com/pricing?coupon=${COUPON_CODE}&cycle=monthly`;
const DEFAULT_FALLBACK_RPC = 'https://sepolia-rollup.arbitrum.io/rpc';

console.log(`\n=====================================================================`);
console.log(`⚡ QARBI PROTOCOL // 1-CLICK QUICKNODE ARBITRUM AUTOMATION`);
console.log(`=====================================================================`);
console.log(`🎫 Builder Coupon Code : ${COUPON_CODE} (Case-Sensitive)`);
console.log(`🎁 Benefit             : 3 Months Free QuickNode Build Plan ($147 Value)`);
console.log(`📍 Buildathon Track    : Arbitrum Open House Singapore\n`);

// 1. Copy coupon code to system clipboard automatically
function copyToClipboard(text) {
  try {
    if (process.platform === 'win32') {
      execSync(`powershell.exe -NoProfile -Command "Set-Clipboard -Value '${text}'"`);
      return true;
    } else if (process.platform === 'darwin') {
      const proc = exec('pbcopy');
      proc.stdin.write(text);
      proc.stdin.end();
      return true;
    } else {
      const proc = exec('xclip -selection clipboard || xsel --clipboard --input');
      proc.stdin.write(text);
      proc.stdin.end();
      return true;
    }
  } catch (err) {
    return false;
  }
}

const copied = copyToClipboard(COUPON_CODE);
if (copied) {
  console.log(`📋 [1/4] Coupon Code "${COUPON_CODE}" successfully copied to your clipboard!`);
} else {
  console.log(`📋 [1/4] Coupon Code: ${COUPON_CODE} (Copy it now)`);
}

// 2. Open QuickNode checkout page in default browser
function openBrowser(url) {
  try {
    if (process.platform === 'win32') {
      exec(`start "" "${url}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${url}"`);
    } else {
      exec(`xdg-open "${url}"`);
    }
    return true;
  } catch (err) {
    return false;
  }
}

console.log(`🌐 [2/4] Opening QuickNode Build Plan Checkout in your browser...`);
openBrowser(QUICKNODE_CHECKOUT_URL);
console.log(`    URL: ${QUICKNODE_CHECKOUT_URL}`);
console.log(`    ⚠️  REMINDER: In QuickNode checkout, select 'Monthly' billing so ${COUPON_CODE} applies!\n`);

// 3. Inspect arguments or existing .env for RPC configuration
const rpcArg = process.argv[2];
let targetRpcUrl = rpcArg;

const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else if (fs.existsSync(envExamplePath)) {
  envContent = fs.readFileSync(envExamplePath, 'utf8');
}

// Extract existing QuickNode RPC if already set
if (!targetRpcUrl) {
  const match = envContent.match(/QUICKNODE_ARBITRUM_RPC=["']?([^"'\r\n]+)["']?/);
  if (match && match[1] && !match[1].includes('<your-subdomain>')) {
    targetRpcUrl = match[1];
  }
}

if (!targetRpcUrl) {
  targetRpcUrl = DEFAULT_FALLBACK_RPC;
}

// 4. Benchmark RPC and measure latency
async function verifyAndBenchmarkRpc(rpcUrl) {
  console.log(`🔍 [3/4] Testing RPC Connection & Benchmarking Latency...`);
  console.log(`    Target: ${rpcUrl.replace(/\/([^\/]+)$/, '/****')}`);

  const start = Date.now();
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const [blockNumber, feeData] = await Promise.all([
      provider.getBlockNumber(),
      provider.getFeeData().catch(() => null)
    ]);
    const duration = Date.now() - start;

    console.log(`    ✅ Connection Verified!`);
    console.log(`    ⚡ Latency          : ${duration} ms`);
    console.log(`    📦 Latest Block     : #${blockNumber}`);
    if (feeData?.gasPrice) {
      console.log(`    ⛽ Gas Price        : ${ethers.formatUnits(feeData.gasPrice, 'gwei')} Gwei`);
    }
    return { ok: true, duration, blockNumber };
  } catch (err) {
    console.log(`    ⚠️  RPC connection warning: ${err.message}`);
    return { ok: false, duration: Date.now() - start, blockNumber: null };
  }
}

async function configureEnvironment() {
  await verifyAndBenchmarkRpc(targetRpcUrl);

  // Generate stream secret if missing
  const generatedStreamSecret = crypto.randomBytes(24).toString('hex');

  let updatedEnv = envContent;
  if (!updatedEnv) {
    updatedEnv = `# QARBI Protocol Environment\nPORT=3000\nAPP_URL="http://localhost:3000"\n`;
  }

  // Helper to upsert key
  function upsertEnv(content, key, value) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      return content.replace(regex, `${key}="${value}"`);
    } else {
      return content.trim() + `\n${key}="${value}"\n`;
    }
  }

  updatedEnv = upsertEnv(updatedEnv, 'QUICKNODE_RPC_URL', targetRpcUrl);
  updatedEnv = upsertEnv(updatedEnv, 'QUICKNODE_ARBITRUM_RPC', targetRpcUrl);
  updatedEnv = upsertEnv(updatedEnv, 'ARBITRUM_SEPOLIA_RPC', targetRpcUrl);
  if (!updatedEnv.includes('QUICKNODE_STREAM_SECRET') || updatedEnv.includes('your_quicknode_stream_hmac_secret')) {
    updatedEnv = upsertEnv(updatedEnv, 'QUICKNODE_STREAM_SECRET', generatedStreamSecret);
  }

  fs.writeFileSync(envPath, updatedEnv, 'utf8');
  console.log(`💾 [4/4] Project configuration written to .env successfully!`);
  console.log(`    ✓ QUICKNODE_ARBITRUM_RPC set`);
  console.log(`    ✓ QUICKNODE_STREAM_SECRET configured`);
  console.log(`    ✓ Ready for QuickNode Streams webhook at /api/webhooks/quicknode-stream\n`);

  console.log(`=====================================================================`);
  console.log(`🎉 1-CLICK AUTOMATION COMPLETE!`);
  console.log(`=====================================================================`);
  console.log(`Next Steps:`);
  console.log(`1. In your opened browser tab, paste your coupon: ${COUPON_CODE}`);
  console.log(`2. Copy your QuickNode Arbitrum Sepolia/One endpoint from the dashboard.`);
  console.log(`3. Re-run this script with your endpoint:`);
  console.log(`   npm run quicknode:setup <your-quicknode-endpoint-url>`);
  console.log(`   or paste it directly inside QARBI web UI (QuickNode Hub Modal).\n`);
}

configureEnvironment();
