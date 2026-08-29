#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cryptoPath = path.resolve(__dirname, '../src/lib/crypto.ts');
const source = fs.readFileSync(cryptoPath, 'utf8');

const forbiddenProductionClaims = [
  'algorithm: "ML-DSA-65"',
  'implements ML-DSA-65',
];

let failures = 0;
for (const claim of forbiddenProductionClaims) {
  if (source.includes(claim)) {
    console.error('FAIL: unsupported production PQC claim:', claim);
    failures++;
  }
}
if (!source.includes('UNVERIFIED-PQC-COMMITMENT')) {
  console.error('FAIL: crypto adapter must explicitly identify placeholder status until real ML-DSA integration exists');
  failures++;
}
if (failures) process.exit(1);
console.log('PQC TRUTHFULNESS GATE: PASS');
console.log('Current status: placeholder adapter explicitly marked unverified; production ML-DSA remains a separate implementation gate.');
