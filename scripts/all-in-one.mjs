#!/usr/bin/env node
/**
 * ==============================================================================
 * QARBI Protocol // All-In-One Single-Click Complete Launcher
 * Arbitrum Open House Singapore // QuickNode Automation & Server Launch
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, execSync, spawn } from 'child_process';
import crypto from 'crypto';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const COUPON_CODE = 'ARBOHSGP';
const QUICKNODE_CHECKOUT_URL = `https://www.quicknode.com/pricing?coupon=${COUPON_CODE}&cycle=monthly`;
const APP_URL = 'http://localhost:3000';
const DEFAULT_RPC = 'https://sepolia-rollup.arbitrum.io/rpc';

console.log(`\n=====================================================================`);
console.log(`🚀 QARBI PROTOCOL // ALL-IN-ONE AUTOMATED LAUNCHER`);
console.log(`=====================================================================`);
console.log(`🎫 QuickNode Coupon : ${COUPON_CODE} (3 Months Free Build Plan - $147 Value)`);
console.log(`🌐 Target Chain     : Arbitrum Sepolia Testnet (Chain ID: 421614)\n`);

// 1. Copy coupon code to system clipboard
try {
  if (process.platform === 'win32') {
    execSync(`powershell.exe -NoProfile -Command "Set-Clipboard -Value '${COUPON_CODE}'"`);
  } else if (process.platform === 'darwin') {
    const proc = exec('pbcopy');
    proc.stdin.write(COUPON_CODE);
    proc.stdin.end();
  } else {
    const proc = exec('xclip -selection clipboard || xsel --clipboard --input');
    proc.stdin.write(COUPON_CODE);
    proc.stdin.end();
  }
  console.log(`✅ [1/4] Coupon Code "${COUPON_CODE}" copied to your clipboard!`);
} catch (e) {
  console.log(`📋 [1/4] Coupon Code: ${COUPON_CODE}`);
}

// 2. Setup .env file
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');
let envContent = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, 'utf8')
  : (fs.existsSync(envExamplePath) ? fs.readFileSync(envExamplePath, 'utf8') : '');

const streamSecret = crypto.randomBytes(24).toString('hex');
const upsert = (txt, k, v) => {
  const re = new RegExp(`^${k}=.*$`, 'm');
  return re.test(txt) ? txt.replace(re, `${k}="${v}"`) : `${txt.trim()}\n${k}="${v}"\n`;
};

envContent = upsert(envContent, 'PORT', '3000');
envContent = upsert(envContent, 'APP_URL', APP_URL);
envContent = upsert(envContent, 'QUICKNODE_RPC_URL', DEFAULT_RPC);
envContent = upsert(envContent, 'QUICKNODE_ARBITRUM_RPC', DEFAULT_RPC);
envContent = upsert(envContent, 'ARBITRUM_SEPOLIA_RPC', DEFAULT_RPC);
if (!envContent.includes('QUICKNODE_STREAM_SECRET') || envContent.includes('your_quicknode_stream_hmac_secret')) {
  envContent = upsert(envContent, 'QUICKNODE_STREAM_SECRET', streamSecret);
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log(`✅ [2/4] Project .env configured automatically with QuickNode settings.`);

// Helper to open browser tabs
function openUrl(url) {
  try {
    if (process.platform === 'win32') {
      exec(`start "" "${url}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${url}"`);
    } else {
      exec(`xdg-open "${url}"`);
    }
  } catch (e) {}
}

async function main() {
  // Check if server is already active or needs to be started
  let isAlreadyRunning = false;
  try {
    const checkRes = await fetch(`${APP_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (checkRes.ok) isAlreadyRunning = true;
  } catch {}

  if (isAlreadyRunning) {
    console.log(`✅ [3/4] QARBI Protocol Server is already running & healthy on ${APP_URL}!`);
    console.log(`✅ [4/4] Opening QARBI Web App and QuickNode Portal in your browser...\n`);
    openUrl(QUICKNODE_CHECKOUT_URL);
    openUrl(APP_URL);
    console.log(`=====================================================================`);
    console.log(`🎉 READY! App is running at: ${APP_URL}`);
    console.log(`👉 Just press Ctrl+V in the QuickNode checkout to paste coupon: ${COUPON_CODE}`);
    console.log(`=====================================================================\n`);
    process.exit(0);
  } else {
    console.log(`✅ [3/4] Opening QuickNode Build Plan Checkout in your browser...`);
    openUrl(QUICKNODE_CHECKOUT_URL);

    setTimeout(() => {
      console.log(`✅ [4/4] Opening QARBI Web App in your browser (${APP_URL})...\n`);
      openUrl(APP_URL);
    }, 2000);

    console.log(`=====================================================================`);
    console.log(`⚡ STARTING QARBI PROTOCOL SERVER...`);
    console.log(`=====================================================================`);
    console.log(`👉 Just press Ctrl+V in the QuickNode checkout to paste your coupon: ${COUPON_CODE}`);
    console.log(`👉 Choose MONTHLY billing on the Build plan for the coupon to apply!`);
    console.log(`👉 When your QuickNode endpoint is ready, paste it in the UI popup.\n`);

    // Start the server with tsx
    const tsxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(tsxCmd, ['tsx', 'server.ts'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code) => {
      process.exit(code || 0);
    });
  }
}

main();
