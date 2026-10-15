import fs from 'node:fs';

const files = [
  'README.md',
  'server.ts',
  'netlify/functions/api.mts',
  'src/components/WhitepaperViewer.tsx',
  'src/components/ArbitrumExplorer.tsx',
  'src/components/AgentSpawner.tsx',
  'src/components/AgentTerminal.tsx',
  'src/components/TaskMarketplace.tsx',
  'src/components/SecurityEnclave.tsx',
  'src/components/ConwayVisualizer.tsx',
];

const forbidden = [
  /89\.4% (?:Gas )?Savings/i,
  /gasSavedStylus:\s*["']89\.4%/i,
  /No valid PRIVATE_KEY.*Generated temporary deployer wallet/i,
  /Enter Deployer Private Key/i,
  /cryptographic proofs of completion/i,
  /1952-byte public key commitments anchored on-chain/i,
  /Stylus.*yielding.*10x to 100x gas compression/i,
];

let failed = false;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const body = fs.readFileSync(file, 'utf8');
  for (const rule of forbidden) {
    if (rule.test(body)) {
      console.error(`TRUTH CHECK FAIL: ${file} matches unsupported claim ${rule}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('TRUTH CHECK PASS');


// Safety regression: deployer must not manufacture a success manifest or disclose keys.
const deploy = fs.readFileSync('scripts/deploy.js', 'utf8');
const legacy = JSON.parse(fs.readFileSync('src/contracts/deployedAddresses.json', 'utf8'));
if (/console\.log\([^\n]*(?:wallet\.privateKey|privateKey)/.test(deploy)) {
  console.error('TRUTH CHECK FAIL: deploy script exposes private key');
  process.exit(1);
}
if (/Wallet\.createRandom\(/.test(deploy)) {
  console.error('TRUTH CHECK FAIL: deploy script invents temporary signing wallet');
  process.exit(1);
}
if (Object.values(legacy.contracts || {}).some(c => c.verified === true)) {
  console.error('TRUTH CHECK FAIL: historical manifest asserts unproven verification');
  process.exit(1);
}
console.log('DEPLOYMENT TRUTH SAFETY CHECK PASS');
