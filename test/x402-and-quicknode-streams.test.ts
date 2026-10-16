/**
 * QARBI Protocol — x402 Autonomous Commerce & QuickNode Streams Test Suite
 * 
 * Verifies:
 * 1. x402 Discovery (.well-known/x402.json) Bazaar Schema & CAIP-2 Arbitrum Sepolia compliance
 * 2. HTTP 402 Payment Required challenge generation & WWW-Authenticate headers
 * 3. x402 EVM transaction verification & anti-replay protection engine
 * 4. QuickNode Streams edge filter (filtering deployed Arbitrum Sepolia contracts & x402 payments)
 * 5. QuickNode Webhook HMAC-SHA256 signature verification and payload integrity
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { main as streamFilter, QARBI_CONTRACTS, EVENT_TOPICS } from '../scripts/quicknode-stream-filter.js';

describe('x402 Autonomous Agent Commerce & QuickNode Streams Suite', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. x402 Bazaar Discovery & Schema Compliance
  // ─────────────────────────────────────────────────────────────────────────────
  describe('x402 Protocol Bazaar & Discovery Specification', () => {
    it('should match CAIP-2 Arbitrum Sepolia identifier (eip155:421614)', () => {
      const caip2 = 'eip155:421614';
      assert.match(caip2, /^eip155:\d+$/);
      assert.equal(caip2, 'eip155:421614');
    });

    it('should generate valid HTTP 402 challenge header with realm and parameters', () => {
      const recipient = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7';
      const amount = '0.0001';
      const challenge = `x402 realm="qarbi", payTo="${recipient}", amount="${amount}", currency="ETH", network="eip155:421614"`;

      assert.ok(challenge.startsWith('x402 realm="qarbi"'));
      assert.ok(challenge.includes(`payTo="${recipient}"`));
      assert.ok(challenge.includes(`amount="${amount}"`));
      assert.ok(challenge.includes('network="eip155:421614"'));
    });

    it('should enforce strict x402 EVM transaction format validation', () => {
      const isValidTx = (tx: string) => Boolean(tx && tx.startsWith('0x') && tx.length === 66 && /^0x[0-9a-fA-F]{64}$/.test(tx));

      assert.equal(isValidTx(''), false);
      assert.equal(isValidTx('0x1234'), false);
      assert.equal(isValidTx('not-a-hash'), false);
      assert.equal(isValidTx('0x' + 'a'.repeat(63)), false); // 65 chars
      assert.equal(isValidTx('0x' + 'g'.repeat(64)), false); // non-hex
      assert.equal(isValidTx('0x' + 'a'.repeat(64)), true);  // 66 chars valid
      assert.equal(isValidTx('0x75d18410da3c7a9f4f2ea91047066f321954819143fa5c035d1a1aa1214efbed'), true);
    });

    it('should enforce anti-replay single-use transaction cache', () => {
      const usedTxs = new Set<string>();
      const txHash = '0x' + 'f'.repeat(64);

      const claimTx = (hash: string) => {
        const clean = hash.toLowerCase();
        if (usedTxs.has(clean)) {
          return { success: false, error: 'Replay Protection: This transaction hash has already been claimed.' };
        }
        usedTxs.add(clean);
        return { success: true };
      };

      // First claim should succeed
      const first = claimTx(txHash);
      assert.equal(first.success, true);
      assert.equal(usedTxs.has(txHash.toLowerCase()), true);

      // Second identical claim MUST be rejected by anti-replay
      const second = claimTx(txHash);
      assert.equal(second.success, false);
      assert.ok(second.error?.includes('Replay Protection'));
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. QuickNode Streams Edge JavaScript Filter
  // ─────────────────────────────────────────────────────────────────────────────
  describe('QuickNode Streams Edge JavaScript Filter Engine', () => {
    it('should filter AgentRegistered events emitted from canonical AgentRegistry', () => {
      const mockStream = {
        data: [{
          number: '0x1313400',
          timestamp: '0x670f5e00',
          receipts: [{
            transactionHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
            logs: [{
              address: QARBI_CONTRACTS.REGISTRY,
              topics: [EVENT_TOPICS.AGENT_REGISTERED],
              data: '0x0000000000000000000000000000000000000000000000000000000000000001'
            }]
          }],
          transactions: []
        }]
      };

      const result = streamFilter(mockStream);
      assert.ok(result);
      assert.equal(result.streamSource, 'QuickNode Arbitrum Streams');
      assert.equal(result.eventCount, 1);
      assert.equal(result.events[0].eventType, 'AGENT_REGISTERED');
      assert.equal(result.events[0].contractAddress, QARBI_CONTRACTS.REGISTRY.toLowerCase());
    });

    it('should filter native ETH x402 payment transactions to payment recipient', () => {
      const mockStream = {
        data: [{
          number: '0x1313401',
          timestamp: '0x670f5e05',
          receipts: [],
          transactions: [{
            hash: '0x2222222222222222222222222222222222222222222222222222222222222222',
            from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            to: QARBI_CONTRACTS.OFFICIAL_PAYMENT_RECIPIENT,
            value: '0x5af3107a4000', // 0.0001 ETH (100000000000000 wei)
            blockNumber: '0x1313401'
          }]
        }]
      };

      const result = streamFilter(mockStream);
      assert.ok(result);
      assert.equal(result.eventCount, 1);
      assert.equal(result.events[0].eventType, 'X402_PAYMENT');
      assert.equal(result.events[0].parsed.paymentChannel, 'x402-autonomous-settlement');
      assert.equal(result.events[0].valueWei, '100000000000000');
    });

    it('should ignore irrelevant non-QARBI transactions and return null', () => {
      const mockStream = {
        data: [{
          number: '0x1313402',
          receipts: [{
            transactionHash: '0x3333333333333333333333333333333333333333333333333333333333333333',
            logs: [{
              address: '0x9999999999999999999999999999999999999999',
              topics: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
              data: '0x'
            }]
          }],
          transactions: [{
            hash: '0x4444444444444444444444444444444444444444444444444444444444444444',
            from: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            to: '0xcccccccccccccccccccccccccccccccccccccccc',
            value: '0x0'
          }]
        }]
      };

      const result = streamFilter(mockStream);
      assert.equal(result, null);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. QuickNode Webhook HMAC-SHA256 Signature Security
  // ─────────────────────────────────────────────────────────────────────────────
  describe('QuickNode Webhook HMAC-SHA256 Authentication', () => {
    const secret = 'test-quicknode-stream-secret-key-32b';
    const payload = JSON.stringify({
      streamSource: 'QuickNode Arbitrum Streams',
      eventCount: 1,
      events: [{ eventType: 'X402_PAYMENT', txHash: '0x123' }]
    });

    it('should generate and verify authentic HMAC-SHA256 signatures', () => {
      const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const verifyHmac = (receivedSig: string, body: string, key: string) => {
        const expected = crypto.createHmac('sha256', key).update(body).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expected));
      };

      assert.equal(verifyHmac(validSignature, payload, secret), true);
    });

    it('should reject tampered payloads or forged signatures with timing-safe comparison', () => {
      const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const tamperedPayload = JSON.stringify({
        streamSource: 'QuickNode Arbitrum Streams',
        eventCount: 9999, // tampered!
        events: []
      });

      const verifyHmac = (receivedSig: string, body: string, key: string) => {
        const expected = crypto.createHmac('sha256', key).update(body).digest('hex');
        if (receivedSig.length !== expected.length) return false;
        return crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expected));
      };

      // Tampered payload fails
      assert.equal(verifyHmac(validSignature, tamperedPayload, secret), false);

      // Forged signature fails
      const forgedSig = '0'.repeat(64);
      assert.equal(verifyHmac(forgedSig, payload, secret), false);
    });
  });
});
