#!/usr/bin/env node
const message = new TextEncoder().encode('QARBI ML-DSA-65 testnet proof');
try {
  const { createMlDsa65Provider } = await import('../src/lib/mlDsa65Provider.ts');
  const pqc = await createMlDsa65Provider();
  const { publicKey, secretKey } = await pqc.keygen();
  const sig = await pqc.sign(message, secretKey);
  if (!(await pqc.verify(message, sig, publicKey))) throw new Error('valid signature rejected');
  const tampered = new TextEncoder().encode('QARBI ML-DSA-65 tampered proof');
  if (await pqc.verify(tampered, sig, publicKey)) throw new Error('tampered message accepted');
  console.log('ML-DSA-65 SMOKE: PASS');
} catch (e) {
  console.error('ML-DSA-65 SMOKE: BLOCKED', e.message);
  process.exit(1);
}
