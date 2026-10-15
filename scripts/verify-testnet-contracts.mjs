#!/usr/bin/env node
// Fail-closed, read-only verification of QARBI deployment manifest.
// Never accepts a 'verified' flag as proof; requires live on-chain runtime code.
import { readFileSync } from 'node:fs';
import { ethers } from 'ethers';
const rpc = process.env.QUICKNODE_ARBITRUM_SEPOLIA_RPC || process.env.ARBITRUM_SEPOLIA_RPC;
if (!rpc) { console.error('BLOCKED: Provide a private HTTPS Arbitrum Sepolia RPC endpoint'); process.exit(2); }
let endpoint;
try { endpoint = new URL(rpc); } catch { console.error('BLOCKED: invalid RPC'); process.exit(2); }
if (endpoint.protocol !== 'https:') { console.error('BLOCKED: HTTPS required'); process.exit(2); }
const manifest = JSON.parse(readFileSync('src/contracts/deployedAddresses.json','utf8'));
if (manifest.chainId !== 421614 || !manifest.contracts) { console.error('BLOCKED: wrong network or manifest'); process.exit(2); }
const provider = new ethers.JsonRpcProvider(rpc, 421614, { staticNetwork: false });
try {
  const network = await provider.getNetwork();
  if (network.chainId !== 421614n) throw Error('wrong network');
  const results = [];
  for (const [name, c] of Object.entries(manifest.contracts)) {
    if (!ethers.isAddress(c.address.toLowerCase())) throw Error(name + ': invalid address');
    const checksummed = ethers.getAddress(c.address.toLowerCase());
    const code = await provider.getCode(checksummed);
    results.push({name,address:checksummed,codePresent:code !== '0x',codeKeccak256:code !== '0x' ? ethers.keccak256(code) : null});
  }
  const all = results.every(x=>x.codePresent);
  console.log(JSON.stringify({status:all?'PARTIAL_ONCHAIN_CODE_PRESENT':'BLOCKED_MISSING_RUNTIME_CODE',chainId:421614,checkedAt:new Date().toISOString(),results,limitations:'Runtime code presence does not prove original deployment receipts, verified source, constructor arguments, authorization, audit, or mainnet readiness'},null,2));
  if (!all) process.exitCode=1;
} catch(e) { console.error('BLOCKED: '+e.message); process.exitCode=1; } finally { provider.destroy(); }
