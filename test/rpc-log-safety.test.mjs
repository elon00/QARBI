import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRpcLabel, safeRpcFailureMessage } from '../scripts/rpc-log-safety.mjs';

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

test('redacts credential-bearing upstream provider errors', () => {
  const error = new Error('request failed https://USER:PASS@SECRET.rpc.example.com/v1/TOKEN?key=API_SECRET');
  const label = safeRpcFailureMessage(error);
  assert.equal(label, 'RPC verification failed (provider details redacted)');
  assert.doesNotMatch(label, /USER|PASS|SECRET|TOKEN|API_SECRET|rpc\.example/);
});

test('does not evaluate malicious error message getters', () => {
  const error = { get message() { throw new Error('ERROR_MESSAGE_GETTER_INVOKED'); } };
  assert.equal(safeRpcFailureMessage(error), 'RPC verification failed (provider details redacted)');
});

test('handles non-Error and nested provider errors without disclosure', () => {
  for (const error of [null, undefined, 'https://secret.rpc.example', { cause: { url: 'https://secret.rpc.example' } }]) {
    assert.equal(safeRpcFailureMessage(error), 'RPC verification failed (provider details redacted)');
  }
});
