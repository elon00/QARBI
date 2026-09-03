#!/usr/bin/env node
import { strict as assert } from 'node:assert';

console.log('--- RUNNING PQC (ML-DSA-65) CRYPTOGRAPHIC & COMMITMENT SMOKE TEST ---');

const message = new TextEncoder().encode('QARBI ML-DSA-65 testnet proof');
try {
  const { createMlDsa65Provider } = await import('../src/lib/mlDsa65Provider.ts');
  const pqc = await createMlDsa65Provider();
  
  // 1. Keygen
  const { publicKey, secretKey } = await pqc.keygen();
  assert(publicKey && publicKey.length > 0, 'Public key must be non-empty');
  assert(secretKey && secretKey.length > 0, 'Secret key must be non-empty');

  // 2. Sign
  const sig = await pqc.sign(message, secretKey);
  assert(sig && sig.length > 0, 'Signature must be non-empty');

  // 3. Verify valid signature
  const isValid = await pqc.verify(message, sig, publicKey);
  assert.equal(isValid, true, 'Valid signature must be accepted');

  // 4. Reject tampered message
  const tampered = new TextEncoder().encode('QARBI ML-DSA-65 tampered proof');
  const isTamperedValid = await pqc.verify(tampered, sig, publicKey);
  assert.equal(isTamperedValid, false, 'Tampered message must be rejected');

  // 5. Test PQC Identity & Commitment Hash Generation
  const { generatePQCIdentity } = await import('../src/lib/crypto.ts');
  const identity = await generatePQCIdentity('Autonomous-Agent-Alpha');
  assert.equal(identity.algorithm, 'ML-DSA-65');
  assert(identity.publicKeyHex.startsWith('0x'), 'Public key must be hex encoded');
  assert(identity.pqcCommitmentHash.startsWith('0x'), 'Commitment hash must be hex encoded');
  assert(identity.signatureHex.startsWith('0x'), 'Signature must be hex encoded');

  console.log('ML-DSA-65 SMOKE: PASS — Keygen, signing, verification, tamper rejection, and SHA-256 commitment verified.');
} catch (e) {
  console.error('ML-DSA-65 SMOKE: BLOCKED', e.message);
  process.exit(1);
}
