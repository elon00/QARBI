/**
 * PQC provider boundary for QARBI.
 *
 * IMPORTANT: This file intentionally keeps the existing placeholder API until a
 * reproducibly pinned ML-DSA-65 provider and its official test vectors are
 * installed. Never replace this boundary with random bytes and call it ML-DSA.
 */

export const PQC_STATUS = {
  algorithm: "UNVERIFIED-PQC-COMMITMENT",
  productionReady: false,
  testnetDemoAllowed: true,
} as const;

export interface PQCProvider {
  keygen(): Promise<{ publicKey: Uint8Array; secretKey: Uint8Array }>;
  sign(message: Uint8Array, secretKey: Uint8Array): Promise<Uint8Array>;
  verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
}

export function assertRealPQCProvider(provider: PQCProvider | null | undefined): asserts provider is PQCProvider {
  if (!provider) throw new Error("Real PQC provider is not installed/configured.");
  if (PQC_STATUS.productionReady) throw new Error("Static status invariant violated.");
}
