/**
 * QARBI PROTOCOL — POST-QUANTUM SECURE AGENT COMMUNICATION CHANNEL
 *
 * Implements end-to-end post-quantum authenticated encryption between autonomous agents:
 * 1. Key Encapsulation: NIST FIPS 203 ML-KEM-768 (1,184B pk, 1,088B ct, 32B ss)
 * 2. Key Derivation: RFC 5869 HKDF-SHA256
 * 3. Authenticated Encryption: AES-256-GCM with 96-bit nonce & 128-bit authentication tag
 * 4. Digital Signature Attestation: NIST FIPS 204 ML-DSA-65 (1,952B pk, 3,309B signature)
 * 5. Fail-Closed Security: Bit-flip tampering in ciphertext, tag, or signature is strictly rejected.
 */

import { gcm } from '@noble/ciphers/aes.js';
import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha256';
import { keccak_256 } from '@noble/hashes/sha3';
import { mlKemEngine, MLKemKeyPair } from '../pqc/ml-kem.js';
import { mlDsaEngine, MLDsaKeyPair } from '../pqc/ml-dsa.js';

export interface QuantumAgentIdentity {
  agentId: number;
  agentName: string;
  walletAddress: string;
  kemKeys: MLKemKeyPair;
  dsaKeys: MLDsaKeyPair;
}

export interface EncryptedQuantumPackage {
  senderAgentId: number;
  senderWallet: string;
  senderPqcCommitment: string;
  senderDsaPublicKeyHex: string;
  recipientAgentId: number;
  recipientPqcCommitment: string;
  kemCiphertextHex: string; // 1,088 bytes hex
  encryptedPayloadHex: string;
  authTagHex: string;        // 16 bytes hex (128-bit GCM tag)
  ivHex: string;             // 12 bytes hex (96-bit GCM IV)
  mlDsaSignatureHex: string; // 3,309 bytes hex
  timestamp: number;
}

export interface DecryptionResult {
  success: boolean;
  plaintext?: string;
  error?: string;
  tamperDetected?: boolean;
  senderVerified?: boolean;
}

export class QuantumSecureChannelEngine {
  /**
   * Derives a 32-byte AES-256 key and a 12-byte IV from an ML-KEM shared secret via HKDF-SHA256
   */
  public deriveSessionKeys(sharedSecret: Uint8Array, contextInfo: string): { aesKey: Uint8Array; iv: Uint8Array } {
    const salt = new TextEncoder().encode('QARBI_PQC_COMMUNICATION_SALT_V1');
    const info = new TextEncoder().encode(contextInfo);

    // 44 bytes total: 32 bytes AES key + 12 bytes IV
    const derivedBytes = hkdf(sha256, sharedSecret, salt, info, 44);
    const aesKey = derivedBytes.slice(0, 32);
    const iv = derivedBytes.slice(32, 44);

    return { aesKey, iv };
  }

  /**
   * Encapsulates, encrypts, and lattice-attests a confidential inter-agent message
   */
  public sendSecureMessage(
    sender: QuantumAgentIdentity,
    recipientKemPublicKey: Uint8Array,
    recipientAgentId: number,
    recipientCommitment: string,
    messagePlaintext: string
  ): EncryptedQuantumPackage {
    // 1. ML-KEM-768 Encapsulation
    const encap = mlKemEngine.encapsulate(recipientKemPublicKey);
    const contextInfo = `QARBI_INTER_AGENT_${sender.agentId}_TO_${recipientAgentId}`;
    const { aesKey, iv } = this.deriveSessionKeys(encap.sharedSecret, contextInfo);

    // 2. AES-256-GCM Authenticated Encryption via @noble/ciphers
    const cipher = gcm(aesKey, iv);
    const plaintextBytes = new TextEncoder().encode(messagePlaintext);
    const encryptedWithTag = cipher.encrypt(plaintextBytes);

    // Split into ciphertext body and 16-byte authentication tag
    const encrypted = encryptedWithTag.slice(0, encryptedWithTag.length - 16);
    const authTag = encryptedWithTag.slice(encryptedWithTag.length - 16);

    const timestamp = Date.now();
    const kemCiphertextHex = '0x' + Buffer.from(encap.cipherText).toString('hex');
    const encryptedPayloadHex = '0x' + Buffer.from(encrypted).toString('hex');
    const authTagHex = '0x' + Buffer.from(authTag).toString('hex');
    const ivHex = '0x' + Buffer.from(iv).toString('hex');

    // 3. Lattice Digital Signature over transmission transcript
    const transcriptToSign = Buffer.concat([
      Buffer.from(sender.dsaKeys.commitmentHash, 'utf8'),
      Buffer.from(recipientCommitment, 'utf8'),
      encap.cipherText,
      encrypted,
      authTag,
      iv,
      Buffer.from(timestamp.toString(), 'utf8'),
    ]);

    const mlDsaSig = mlDsaEngine.sign(transcriptToSign, sender.dsaKeys.secretKey);
    const mlDsaSignatureHex = '0x' + Buffer.from(mlDsaSig).toString('hex');

    return {
      senderAgentId: sender.agentId,
      senderWallet: sender.walletAddress,
      senderPqcCommitment: sender.dsaKeys.commitmentHash,
      senderDsaPublicKeyHex: sender.dsaKeys.publicKeyHex,
      recipientAgentId,
      recipientPqcCommitment: recipientCommitment,
      kemCiphertextHex,
      encryptedPayloadHex,
      authTagHex,
      ivHex,
      mlDsaSignatureHex,
      timestamp,
    };
  }

  /**
   * Verifies lattice signature, decapsulates shared secret, and decrypts payload
   * Strictly enforces Fail-Closed security: any bit corruption aborts immediately.
   */
  public receiveSecureMessage(
    recipientKemSecretKey: Uint8Array,
    pkg: EncryptedQuantumPackage
  ): DecryptionResult {
    try {
      const senderPkBytes = Buffer.from(pkg.senderDsaPublicKeyHex.replace('0x', ''), 'hex');
      const senderSigBytes = Buffer.from(pkg.mlDsaSignatureHex.replace('0x', ''), 'hex');
      const kemCiphertextBytes = Buffer.from(pkg.kemCiphertextHex.replace('0x', ''), 'hex');
      const encryptedPayloadBytes = Buffer.from(pkg.encryptedPayloadHex.replace('0x', ''), 'hex');
      const authTagBytes = Buffer.from(pkg.authTagHex.replace('0x', ''), 'hex');
      const ivBytes = Buffer.from(pkg.ivHex.replace('0x', ''), 'hex');

      // 1. Verify Sender On-Chain PQC Commitment
      const derivedSenderCommitment = '0x' + Buffer.from(keccak_256(senderPkBytes)).toString('hex');
      if (derivedSenderCommitment.toLowerCase() !== pkg.senderPqcCommitment.toLowerCase()) {
        return { success: false, error: 'Sender commitment mismatch with public key', tamperDetected: true };
      }

      // 2. Verify Sender ML-DSA-65 Lattice Signature
      const transcriptToVerify = Buffer.concat([
        Buffer.from(pkg.senderPqcCommitment, 'utf8'),
        Buffer.from(pkg.recipientPqcCommitment, 'utf8'),
        kemCiphertextBytes,
        encryptedPayloadBytes,
        authTagBytes,
        ivBytes,
        Buffer.from(pkg.timestamp.toString(), 'utf8'),
      ]);

      const isSigValid = mlDsaEngine.verify(senderSigBytes, transcriptToVerify, senderPkBytes);
      if (!isSigValid) {
        return { success: false, error: 'ML-DSA-65 signature verification failed', tamperDetected: true };
      }

      // 3. Decapsulate Shared Secret via ML-KEM-768
      const sharedSecret = mlKemEngine.decapsulate(kemCiphertextBytes, recipientKemSecretKey);
      const contextInfo = `QARBI_INTER_AGENT_${pkg.senderAgentId}_TO_${pkg.recipientAgentId}`;
      const { aesKey, iv } = this.deriveSessionKeys(sharedSecret, contextInfo);

      // 4. AES-256-GCM Decryption & Authentication Tag Check via @noble/ciphers
      const cipher = gcm(aesKey, ivBytes);
      const encryptedWithTag = new Uint8Array(encryptedPayloadBytes.length + authTagBytes.length);
      encryptedWithTag.set(encryptedPayloadBytes);
      encryptedWithTag.set(authTagBytes, encryptedPayloadBytes.length);

      const decryptedBytes = cipher.decrypt(encryptedWithTag);
      const plaintext = new TextDecoder().decode(decryptedBytes);

      return {
        success: true,
        plaintext,
        senderVerified: true,
        tamperDetected: false,
      };
    } catch (err: any) {
      return {
        success: false,
        error: `Decryption / Integrity failed: ${err.message}`,
        tamperDetected: true,
        senderVerified: false,
      };
    }
  }

  /**
   * Helper to instantiate a full Quantum Agent Identity
   */
  public createAgentQuantumIdentity(agentId: number, agentName: string, walletAddress: string): QuantumAgentIdentity {
    const kemKeys = mlKemEngine.keygen();
    const dsaKeys = mlDsaEngine.keygen();

    return {
      agentId,
      agentName,
      walletAddress,
      kemKeys,
      dsaKeys,
    };
  }
}

export const quantumSecureChannel = new QuantumSecureChannelEngine();
