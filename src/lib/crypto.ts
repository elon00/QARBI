/**
 * Development-only PQC identity adapter.
 *
 * This module deliberately does NOT claim to implement ML-DSA-65.
 * A production ML-DSA implementation must come from a vetted cryptographic
 * library and should be integrated behind this interface before mainnet use.
 */

export interface PQCIdentityResult {
  algorithm: "UNVERIFIED-PQC-COMMITMENT";
  publicKeyHex: string;
  publicKeyPreview: string;
  pqcCommitmentHash: string;
  delegatedWalletAddress: string;
  signaturePreview: string;
  createdAt: number;
}

function randomHex(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, length);
}

/**
 * Produces a locally generated commitment placeholder for testnet UX only.
 * It must never be advertised as a real ML-DSA keypair/signature.
 */
export function generatePQCIdentity(_agentName?: string): PQCIdentityResult {
  const publicKeyHex = `0x${randomHex(3904)}`;
  const pqcCommitmentHash = `0x${randomHex(64)}`;
  const delegatedWalletAddress = `0x${randomHex(40)}`;
  const signaturePreview = `0x${randomHex(130)}`;

  return {
    algorithm: "UNVERIFIED-PQC-COMMITMENT",
    publicKeyHex,
    publicKeyPreview: `${publicKeyHex.slice(0, 10)}...${publicKeyHex.slice(-8)} (development placeholder)`,
    pqcCommitmentHash,
    delegatedWalletAddress,
    signaturePreview,
    createdAt: Date.now(),
  };
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
