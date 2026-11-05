import test from 'node:test';
import assert from 'node:assert/strict';
import { REQUIRED_CONTRACTS, validateContractManifest } from '../scripts/contract-manifest-guard.mjs';
const manifest = () => ({chainId:421614, contracts:Object.fromEntries(REQUIRED_CONTRACTS.map((n,i)=>[n,{address:'0x'+(i+1).toString(16).padStart(40,'0')}]))});
test('accepts exactly five unique nonzero addresses on Arbitrum Sepolia',()=>assert.deepEqual(validateContractManifest(manifest()),REQUIRED_CONTRACTS));
test('rejects empty, partial and extra contract manifests',()=>{
  for(const m of [{chainId:421614,contracts:{}},(()=>{const m=manifest();delete m.contracts.AgentWallet;return m})(),(()=>{const m=manifest();m.contracts.Extra={address:'0x'+'f'.repeat(40)};return m})()]) assert.throws(()=>validateContractManifest(m),/BLOCKED/);
});
test('rejects duplicate, zero, malformed addresses and wrong chain',()=>{
  for(const change of [m=>m.contracts.AgentWallet.address=m.contracts.QARBIToken.address,m=>m.contracts.AgentWallet.address='0x'+'0'.repeat(40),m=>m.contracts.AgentWallet.address='invalid',m=>m.chainId=1]){const m=manifest();change(m);assert.throws(()=>validateContractManifest(m),/BLOCKED/);}
});
test('rejects missing manifest and malformed contract collections',()=>{
  for(const m of [null,{}, {chainId:421614,contracts:[]}, {chainId:421614,contracts:null}]) assert.throws(()=>validateContractManifest(m),/BLOCKED/);
});
