import { createHash } from 'node:crypto';
import { createMlDsa65Provider } from './mlDsa65Provider';

export interface PQCIdentityResult {
  algorithm: 'ML-DSA-65';
  publicKeyHex: string;
  publicKeyPreview: string;
  pqcCommitmentHash: string;
  signatureHex: string;
  signaturePreview: string;
  createdAt: number;
}

const encoder = new TextEncoder();

export async function generatePQCIdentity(agentName = 'QARBI-Agent'): Promise<PQCIdentityResult> {
  const provider = await createMlDsa65Provider();
  const { publicKey, secretKey } = await provider.keygen();
  const message = encoder.encode(`QARBI:PQC-IDENTITY:${agentName}`);
  const signature = await provider.sign(message, secretKey);
  const valid = await provider.verify(message, signature, publicKey);
  if (!valid) throw new Error('ML-DSA-65 self-verification failed');

  const publicKeyHex = `0x${Buffer.from(publicKey).toString('hex')}`;
  const signatureHex = `0x${Buffer.from(signature).toString('hex')}`;
  const pqcCommitmentHash = `0x${createHash('sha256').update(publicKey).digest('hex')}`;

  return {
    algorithm: 'ML-DSA-65',
    publicKeyHex,
    publicKeyPreview: `${publicKeyHex.slice(0, 10)}...${publicKeyHex.slice(-8)}`,
    pqcCommitmentHash,
    signatureHex,
    signaturePreview: `${signatureHex.slice(0, 10)}...${signatureHex.slice(-8)}`,
    createdAt: Date.now(),
  };
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateOperationId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
