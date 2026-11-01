import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRpcLabel } from '../scripts/rpc-log-safety.mjs';

const REDACTED = 'HTTPS_RPC_ENDPOINT_REDACTED';

test('redacts RPC provider token in URL path', () => {
  const label = safeRpcLabel(new URL('https://example.quiknode.pro/SECRET_TOKEN/'));
  assert.equal(label, REDACTED);
  assert.doesNotMatch(label, /SECRET_TOKEN/);
});

test('redacts query-string credentials, fragments and userinfo', () => {
  const label = safeRpcLabel(new URL('https://username:password@rpc.example.org:8443/v1/key?api_key=SECRET#token'));
  assert.equal(label, REDACTED);
  for (const secret of ['username', 'password', 'api_key', 'SECRET', 'token']) {
    assert.equal(label.includes(secret), false, `leaked ${secret}`);
  }
});

test('redacts credential-bearing hostnames and subdomains', () => {
  const label = safeRpcLabel(new URL('https://SECRET_TOKEN.rpc.example.org:8443/v1/key'));
  assert.equal(label, REDACTED);
  assert.doesNotMatch(label, /SECRET_TOKEN|rpc\.example\.org|8443/);
});

test('rejects non-HTTPS and malformed inputs', () => {
  for (const value of [new URL('http://rpc.example.org/token'), new URL('file:///tmp/token'), null, {}, 'https://rpc.example.org/token']) {
    assert.throws(() => safeRpcLabel(value), /BLOCKED/);
  }
});
