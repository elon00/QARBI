/**
 * NIST FIPS 204: Module-Lattice-Based Digital Signature Standard (ML-DSA-65)
 * Canonical implementation powered by pure-TypeScript @noble/post-quantum
 *
 * Parameters for ML-DSA-65 (Security Category 3):
 * - Matrix dimensions: k=6, l=5
 * - Modulus: q = 8,380,417
 * - Public key size: 1,952 bytes
 * - Secret key size: 4,032 bytes
 * - Signature size: 3,309 bytes
 */

import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { keccak_256 } from '@noble/hashes/sha3';

export interface MLDsaKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
  publicKeyHex: string;
  commitmentHash: string; // 32-byte Keccak-256 commitment for EVM state
}

export class MLDsaEngine {
  /**
   * Generates a genuine NIST FIPS 204 ML-DSA-65 keypair over polynomial ring R_q
   */
  public keygen(seed?: Uint8Array): MLDsaKeyPair {
    const keys = seed ? ml_dsa65.keygen(seed) : ml_dsa65.keygen();
    const pkHex = '0x' + Buffer.from(keys.publicKey).toString('hex');
    const commitmentBytes = keccak_256(keys.publicKey);
    const commitmentHash = '0x' + Buffer.from(commitmentBytes).toString('hex');

    return {
      publicKey: keys.publicKey,
      secretKey: keys.secretKey,
      publicKeyHex: pkHex,
      commitmentHash,
    };
  }

  /**
   * Signs an arbitrary message using pure-TS lattice arithmetic
   */
  public sign(message: Uint8Array, secretKey: Uint8Array): Uint8Array {
    return ml_dsa65.sign(message, secretKey);
  }

  /**
   * Verifies an ML-DSA-65 digital signature against a public key
   */
  public verify(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): boolean {
    try {
      return ml_dsa65.verify(signature, message, publicKey);
    } catch {
      return false;
    }
  }

  /**
   * Verifies that a 1,952-byte public key matches its on-chain bytes32 Keccak-256 commitment
   */
  public verifyCommitment(publicKey: Uint8Array, expectedCommitment: string): boolean {
    const derived = '0x' + Buffer.from(keccak_256(publicKey)).toString('hex');
    return derived.toLowerCase() === expectedCommitment.toLowerCase();
  }
}

export const mlDsaEngine = new MLDsaEngine();
