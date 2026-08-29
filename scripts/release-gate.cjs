const fs = require('fs');
const path = require('path');
const manifest = require('../src/contracts/deployedAddresses.json');

function assert(condition, message) {
  if (!condition) {
    console.error(`RELEASE GATE: FAIL — ${message}`);
    process.exitCode = 1;
  }
}

assert(manifest.network === 'Arbitrum Sepolia', 'Current release must explicitly identify testnet network.');
assert(Number(manifest.chainId) === 421614, 'Current release must use Arbitrum Sepolia chain id 421614.');
assert(fs.existsSync(path.join(__dirname, 'production-guard.cjs')), 'Production guard is missing.');
assert(fs.existsSync(path.join(__dirname, 'compile.js')), 'Contract compiler is missing.');

const knownLocalAddresses = new Set([\n  '0x5FbDB2315678afecb367f032d93F642f64180aa3'.toLowerCase(),\n  '0x0165878A594ca255338adfa4d48449f69242Eb8F'.toLowerCase()\n]);\n\nfor (const [name, item] of Object.entries(manifest.contracts || {})) {
  assert(/^0x[0-9a-fA-F]{40}$/.test(item.address), `${name} address is invalid.`);
  assert(typeof item.explorer === 'string' && item.explorer.includes(item.address), `${name} explorer link is invalid.`);\n  assert(!knownLocalAddresses.has(item.address.toLowerCase()), `${name} uses a known local-development address and cannot be released as Sepolia evidence.`);\n  assert(item.verified !== true || typeof item.deploymentTxHash === 'string', `${name} cannot be marked verified without a deployment transaction hash.`);
}

if (process.exitCode) process.exit(process.exitCode);
console.log('RELEASE GATE: PASS — configuration and evidence structure valid.');
console.log('NOTE: This gate does not certify cryptography, contract source verification, live E2E transactions, security audit, or mainnet readiness.');
