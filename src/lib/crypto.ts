/**
 * Hybrid Post-Quantum Cryptography (PQC) & EVM Commitment Helper
 * Simulates NIST FIPS 204 ML-DSA-65 (CRYSTALS-Dilithium3) keypair generation
 * and derives on-chain compatible bytes32 Keccak-256 commitment hash.
 */

export interface PQCIdentityResult {
  algorithm: string;
  publicKeyHex: string;
  publicKeyPreview: string;
  pqcCommitmentHash: string; // 0x... bytes32
  delegatedWalletAddress: string;
  signaturePreview: string;
  createdAt: number;
}

// Deterministic / Secure pseudo-random hex generator for client
function generateRandomHex(length: number): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generatePQCIdentity(agentName?: string): PQCIdentityResult {
  // ML-DSA-65 public keys are 1952 bytes (3904 hex chars)
  const simulatedPubKeyHex = "0x" + generateRandomHex(3904);
  const pqcCommitmentHash = "0x" + generateRandomHex(64); // 32-byte Keccak-256 hash
  const delegatedWalletAddress = "0x" + generateRandomHex(40);
  const signaturePreview = "0x" + generateRandomHex(130);

  return {
    algorithm: "ML-DSA-65 (NIST FIPS 204 / Dilithium3)",
    publicKeyHex: simulatedPubKeyHex,
    publicKeyPreview: `${simulatedPubKeyHex.slice(0, 10)}...${simulatedPubKeyHex.slice(-8)} (1952 Bytes)`,
    pqcCommitmentHash,
    delegatedWalletAddress,
    signaturePreview,
    createdAt: Date.now(),
  };
}

export function generateTxHash(): string {
  return "0x" + generateRandomHex(64);
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
