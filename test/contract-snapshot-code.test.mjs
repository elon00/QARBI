import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getRuntimeCodeAtSnapshot } from '../scripts/contract-snapshot-code.mjs';
import { readFileSync } from 'node:fs';

test('reads each contract at the same explicit snapshot block, not latest', async () => {
  const calls = [];
  const provider = { getCode: async (address, tag) => {
    calls.push([address, tag]);
    return '0x60006000';
  } };
  assert.equal(await getRuntimeCodeAtSnapshot(provider, '0xabc', 12345), '0x60006000');
  assert.equal(await getRuntimeCodeAtSnapshot(provider, '0xdef', 12345), '0x60006000');
  assert.deepEqual(calls, [['0xabc', 12345], ['0xdef', 12345]]);
});

test('rejects invalid snapshot heights before any RPC request', async () => {
  let called = false;
  const provider = { getCode: async () => { called = true; return '0x'; } };
  for (const tag of [undefined, null, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(getRuntimeCodeAtSnapshot(provider, '0xabc', tag), /invalid contract verification snapshot block/);
  }
  assert.equal(called, false);
});

test('rejects malformed RPC code rather than recording a false presence result', async () => {
  for (const value of [null, '0x0', '0xzz', '0x600', '6000', 7]) {
    await assert.rejects(getRuntimeCodeAtSnapshot({ getCode: async () => value }, '0xabc', 1), /malformed runtime code/);
  }
});

test('propagates provider errors so verification fails closed', async () => {
  await assert.rejects(getRuntimeCodeAtSnapshot({ getCode: async () => { throw new Error('RPC unavailable'); } }, '0xabc', 1), /RPC unavailable/);
});

test('contract verifier uses the snapshot helper for every address', () => {
  const source = readFileSync(new URL('../scripts/verify-testnet-contracts.mjs', import.meta.url), 'utf8');
  assert.match(source, /getRuntimeCodeAtSnapshot\(provider, checksummed, blockNumber\)/);
  assert.doesNotMatch(source, /provider\.getCode\(checksummed\)/);
});
