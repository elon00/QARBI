import type { PQCProvider } from './pqcProvider';

/**
 * ML-DSA-65 testnet adapter.
 * This module intentionally loads the provider lazily so browser builds do not
 * silently bundle secret-key operations until the dependency is pinned.
 */
export async function createMlDsa65Provider(): Promise<PQCProvider> {
  const mod = await import('@noble/post-quantum/ml-dsa.js');
  const impl = mod.ml_dsa65;
  if (!impl) throw new Error('ML-DSA-65 provider export unavailable');

  return {
    async keygen() {
      const keys = impl.keygen();
      return { publicKey: keys.publicKey, secretKey: keys.secretKey };
    },
    async sign(message, secretKey) {
      return impl.sign(message, secretKey);
    },
    async verify(message, signature, publicKey) {
      return impl.verify(signature, message, publicKey);
    },
  };
}
