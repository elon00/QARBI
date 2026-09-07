/**
 * QARBI PROTOCOL — LAYER 2 DUAL HYBRID CONJUNCTION
 * Strict Conjunction Security: EVM ECDSA (secp256k1) ∧ NIST ML-DSA-65 (FIPS 204)
 *
 * Invariant:
 * An agent action is cryptographically valid IF AND ONLY IF:
 * 1. The classical EVM ECDSA signature verifies against the delegated session wallet address.
 * 2. The post-quantum ML-DSA-65 signature verifies against the 1,952-byte lattice public key.
 * 3. The 1,952-byte public key hashes to the exact on-chain bytes32 Keccak-256 commitment.
 *
 * Failure of ANY condition results in strict fail-closed rejection.
 */

import { ethers } from 'ethers';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { keccak_256 } from '@noble/hashes/sha3';

export interface DualHybridPayload {
  message: string;
  evmSessionWalletAddress: string;
  evmSignature: string; // 65-byte ECDSA signature
  pqcPublicKeyHex: string; // 1952-byte ML-DSA-65 public key in hex
  pqcSignatureHex: string; // 3309-byte ML-DSA-65 signature in hex
  expectedCommitmentHash: string; // 32-byte bytes32 Keccak-256 commitment
}

export interface DualConjunctionVerificationResult {
  valid: boolean;
  evmEcdsaValid: boolean;
  pqcMlDsaValid: boolean;
  commitmentHashValid: boolean;
  error?: string;
  timestamp: string;
}

export class DualHybridConjunctionEngine {
  /**
   * Verifies dual signature conjunction over an agent intent payload
   */
  public verifyConjunction(payload: DualHybridPayload): DualConjunctionVerificationResult {
    const timestamp = new Date().toISOString();

    // 1. Verify EVM Classical ECDSA Signature (secp256k1)
    let evmEcdsaValid = false;
    try {
      const recoveredAddress = ethers.verifyMessage(payload.message, payload.evmSignature);
      evmEcdsaValid = recoveredAddress.toLowerCase() === payload.evmSessionWalletAddress.toLowerCase();
    } catch {
      evmEcdsaValid = false;
    }

    if (!evmEcdsaValid) {
      return {
        valid: false,
        evmEcdsaValid: false,
        pqcMlDsaValid: false,
        commitmentHashValid: false,
        error: 'Classical EVM ECDSA signature invalid or signer address mismatch',
        timestamp,
      };
    }

    // 2. Verify On-Chain Keccak-256 Commitment Hash
    let commitmentHashValid = false;
    let pqcPkBytes: Uint8Array;
    try {
      const cleanPkHex = payload.pqcPublicKeyHex.startsWith('0x') ? payload.pqcPublicKeyHex.slice(2) : payload.pqcPublicKeyHex;
      pqcPkBytes = Uint8Array.from(Buffer.from(cleanPkHex, 'hex'));
      if (pqcPkBytes.length !== 1952) {
        throw new Error(`Invalid ML-DSA-65 public key size: expected 1952 bytes, got ${pqcPkBytes.length}`);
      }

      const computedCommitment = '0x' + Buffer.from(keccak_256(pqcPkBytes)).toString('hex');
      commitmentHashValid = computedCommitment.toLowerCase() === payload.expectedCommitmentHash.toLowerCase();
    } catch (err: any) {
      return {
        valid: false,
        evmEcdsaValid: true,
        pqcMlDsaValid: false,
        commitmentHashValid: false,
        error: `PQC commitment mismatch: ${err.message}`,
        timestamp,
      };
    }

    if (!commitmentHashValid) {
      return {
        valid: false,
        evmEcdsaValid: true,
        pqcMlDsaValid: false,
        commitmentHashValid: false,
        error: 'PQC public key does not match on-chain Keccak-256 commitment hash',
        timestamp,
      };
    }

    // 3. Verify NIST FIPS 204 ML-DSA-65 Lattice Signature
    let pqcMlDsaValid = false;
    try {
      const cleanSigHex = payload.pqcSignatureHex.startsWith('0x') ? payload.pqcSignatureHex.slice(2) : payload.pqcSignatureHex;
      const pqcSigBytes = Uint8Array.from(Buffer.from(cleanSigHex, 'hex'));
      if (pqcSigBytes.length !== 3309) {
        throw new Error(`Invalid ML-DSA-65 signature size: expected 3309 bytes, got ${pqcSigBytes.length}`);
      }

      const msgBytes = new TextEncoder().encode(payload.message);
      pqcMlDsaValid = ml_dsa65.verify(pqcSigBytes, msgBytes, pqcPkBytes);
    } catch (err: any) {
      pqcMlDsaValid = false;
    }

    if (!pqcMlDsaValid) {
      return {
        valid: false,
        evmEcdsaValid: true,
        pqcMlDsaValid: false,
        commitmentHashValid: true,
        error: 'NIST ML-DSA-65 lattice digital signature verification failed',
        timestamp,
      };
    }

    // Strict Conjunction: Valid IF AND ONLY IF all 3 conditions pass
    return {
      valid: true,
      evmEcdsaValid: true,
      pqcMlDsaValid: true,
      commitmentHashValid: true,
      timestamp,
    };
  }
}

export const dualHybridConjunctionEngine = new DualHybridConjunctionEngine();
