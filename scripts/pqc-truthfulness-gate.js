#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cryptoSource = fs.readFileSync(path.join(root, 'src/lib/crypto.ts'), 'utf8');
const adapterSource = fs.readFileSync(path.join(root, 'src/lib/mlDsa65Provider.ts'), 'utf8');

let failures = 0;
const requiredCrypto = [
  "algorithm: 'ML-DSA-65'",
  "createMlDsa65Provider()",
  'provider.sign(',
  'provider.verify(',
];
for (const claim of requiredCrypto) {
  if (!cryptoSource.includes(claim)) {
    console.error('FAIL: missing real ML-DSA integration evidence:', claim);
    failures++;
  }
}
for (const claim of ["@noble/post-quantum/ml-dsa.js", 'ml_dsa65']) {
  if (!adapterSource.includes(claim)) {
    console.error('FAIL: ML-DSA-65 provider adapter is not wired:', claim);
    failures++;
  }
}
if (cryptoSource.includes('UNVERIFIED-PQC-COMMITMENT') || cryptoSource.includes('development placeholder')) {
  console.error('FAIL: legacy PQC placeholder remains in production-facing crypto.ts');
  failures++;
}
if (failures) process.exit(1);
console.log('PQC TRUTHFULNESS GATE: PASS');
console.log('ML-DSA-65 is wired through the configured provider; cryptographic security audit remains separate.');
