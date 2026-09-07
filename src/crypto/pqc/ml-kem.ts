/**
 * NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM-768)
 * Canonical implementation powered by pure-TypeScript @noble/post-quantum
 *
 * Parameters for ML-KEM-768 (Security Category 3):
 * - Matrix dimension: k=3
 * - Modulus: q = 3,329
 * - Public key size: 1,184 bytes
 * - Secret key size: 2,400 bytes
 * - Ciphertext size: 1,088 bytes
 * - Shared secret size: 32 bytes
 */

import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';

export interface MLKemKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export interface MLKemEncapsulation {
  cipherText: Uint8Array;
  sharedSecret: Uint8Array;
}

export class MLKemEngine {
  /**
   * Generates a genuine NIST FIPS 203 ML-KEM-768 keypair
   */
  public keygen(seed?: Uint8Array): MLKemKeyPair {
    return seed ? ml_kem768.keygen(seed) : ml_kem768.keygen();
  }

  /**
   * Encapsulates a fresh symmetric shared secret under a peer's public key
   */
  public encapsulate(peerPublicKey: Uint8Array): MLKemEncapsulation {
    return ml_kem768.encapsulate(peerPublicKey);
  }

  /**
   * Decapsulates a ciphertext using the recipient's secret key.
   * Enforces FIPS 203 Section 7.3 Implicit Rejection upon corrupt ciphertext.
   */
  public decapsulate(cipherText: Uint8Array, secretKey: Uint8Array): Uint8Array {
    return ml_kem768.decapsulate(cipherText, secretKey);
  }
}

export const mlKemEngine = new MLKemEngine();
