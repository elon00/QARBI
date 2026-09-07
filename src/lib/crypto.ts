/**
 * QARBI PROTOCOL — REAL POST-QUANTUM CRYPTOGRAPHY & EVM COMMITMENT ENGINE
 * Powered by pure-TypeScript @noble/post-quantum (NIST FIPS 204 ML-DSA-65)
 *
 * Implements genuine lattice arithmetic over polynomial ring R_q = Z_8380417[X]/(X^256 + 1)
 * and computes exact on-chain Keccak-256 commitments for AgentRegistry.sol.
 * Pure deterministic lattice operations over high-dimensional polynomial rings.
 */

import { ethers } from 'ethers';
import { mlDsaEngine } from '../crypto/pqc/ml-dsa';

export interface PQCIdentityResult {
  algorithm: string;
  publicKeyHex: string;
  publicKeyPreview: string;
  pqcCommitmentHash: string; // 0x... bytes32 Keccak-256
  delegatedWalletAddress: string;
  signaturePreview: string;
  createdAt: number;
}

/**
 * Generates a genuine NIST FIPS 204 ML-DSA-65 post-quantum identity
 * with real 1,952-byte public key, 32-byte Keccak-256 on-chain commitment,
 * an EVM delegated session wallet, and an authentic lattice signature preview.
 */
export function generatePQCIdentity(agentName?: string): PQCIdentityResult {
  // 1. Generate authentic ML-DSA-65 lattice keypair
  const pqcKeys = mlDsaEngine.keygen();
  const pkHex = pqcKeys.publicKeyHex; // 0x... (1952 bytes = 3904 hex chars)
  const commitmentHash = pqcKeys.commitmentHash; // 32-byte Keccak-256 hash matching AgentRegistry.sol

  // 2. Generate a real random EVM delegated session wallet
  const randomWallet = ethers.Wallet.createRandom();
  const delegatedWalletAddress = randomWallet.address;

  // 3. Generate a genuine ML-DSA-65 signature on the genesis attestation payload
  const attestationMessage = new TextEncoder().encode(
    `QARBI_AGENT_ATTESTATION:${agentName || 'Qarbi-Agent'}:${delegatedWalletAddress}:${commitmentHash}`
  );
  const realSignature = mlDsaEngine.sign(attestationMessage, pqcKeys.secretKey);
  const sigHex = '0x' + Buffer.from(realSignature).toString('hex');

  return {
    algorithm: "ML-DSA-65 (NIST FIPS 204 / Dilithium3)",
    publicKeyHex: pkHex,
    publicKeyPreview: `${pkHex.slice(0, 10)}...${pkHex.slice(-8)} (1952 Bytes ML-DSA-65)`,
    pqcCommitmentHash: commitmentHash,
    delegatedWalletAddress,
    signaturePreview: `${sigHex.slice(0, 14)}...${sigHex.slice(-10)} (3309 Bytes NIST FIPS 204)`,
    createdAt: Date.now(),
  };
}

/**
 * Generates a deterministic or cryptographically secure transaction hash
 */
export function generateTxHash(): string {
  const randomBytes = ethers.randomBytes(32);
  return ethers.hexlify(randomBytes);
}

/**
 * Formats an Ethereum/Arbitrum address for display
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
