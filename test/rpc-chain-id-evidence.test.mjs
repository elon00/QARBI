import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assertArbitrumSepoliaChainIdResponse } from '../scripts/rpc-chain-id-evidence.mjs';

test('accepts a complete JSON-RPC 2.0 response for Arbitrum Sepolia only', () => {
  assert.equal(assertArbitrumSepoliaChainIdResponse({ jsonrpc: '2.0', id: 1, result: '0x66eee' }), '0x66eee');
});

test('rejects forged or malformed JSON-RPC envelopes despite matching chain ID', () => {
  const invalid = [
    null, [], '0x66eee',
    { result: '0x66eee' },
    { jsonrpc: '1.0', id: 1, result: '0x66eee' },
    { jsonrpc: '2.0', result: '0x66eee' },
    { jsonrpc: '2.0', id: 2, result: '0x66eee' },
    { jsonrpc: '2.0', id: '1', result: '0x66eee' },
    { jsonrpc: '2.0', id: 1, result: '0x1' },
    { jsonrpc: '2.0', id: 1, result: 421614 },
    { jsonrpc: '2.0', id: 1, result: '0x66eee', error: null },
    { jsonrpc: '2.0', id: 1, result: '0x66eee', error: { code: -32000, message: 'failed' } }
  ];
  for (const payload of invalid) {
    assert.throws(() => assertArbitrumSepoliaChainIdResponse(payload), /invalid Arbitrum Sepolia JSON-RPC/);
  }
});

test('mission stage 14 invokes strict response validation before reporting a passing chain ID', () => {
  const source = readFileSync(new URL('../scripts/mission-verify.mjs', import.meta.url), 'utf8');
  assert.match(source, /assertArbitrumSepoliaChainIdResponse\(payload\)/);
  assert.match(source, /import\('\.\/scripts\/rpc-chain-id-evidence\.mjs'\)/);
});
