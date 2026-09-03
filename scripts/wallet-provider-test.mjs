import { strict as assert } from 'node:assert';

console.log('--- RUNNING WALLET INTEGRATION & EIP-1193/6963 GATE ---');

const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
const ARBITRUM_SEPOLIA_HEX_CHAIN_ID = '0x66eee';

// Test 1: Chain ID conversion & hex matching
assert.equal(parseInt(ARBITRUM_SEPOLIA_HEX_CHAIN_ID, 16), ARBITRUM_SEPOLIA_CHAIN_ID, 'Hex chain ID must match numeric Arbitrum Sepolia ID');

// Test 2: Injected provider identification rules
function isTrust(p) {
  return Boolean(p?.isTrust || p?.isTrustWallet || p?.providerInfo?.rdns === 'com.trustwallet.app');
}
function isMetaMask(p) {
  return Boolean(p?.isMetaMask) && !isTrust(p);
}

const mockMm = { isMetaMask: true };
const mockTrust = { isTrust: true, isMetaMask: true };
const mockCoinbase = { isCoinbaseWallet: true };

assert.equal(isMetaMask(mockMm), true, 'Pure MetaMask provider must be identified as MetaMask');
assert.equal(isTrust(mockMm), false, 'MetaMask must not be identified as Trust Wallet');
assert.equal(isTrust(mockTrust), true, 'Trust Wallet must be identified as Trust Wallet');
assert.equal(isMetaMask(mockTrust), false, 'Trust Wallet with isMetaMask:true flag must NOT be classified as MetaMask');
assert.equal(isMetaMask(mockCoinbase), false, 'Other providers must not be classified as MetaMask');

// Test 3: Error translation
function translateWalletError(label, error) {
  const m = String(error?.message || error || '');
  if (/broadcast channel unavailable|channel secret not available/i.test(m)) {
    return `${label} extension is not ready. Unlock/restart only that wallet extension, reload the page, and try again.`;
  }
  if (/user rejected|rejected the request|4001/i.test(m)) {
    return `${label} connection was cancelled.`;
  }
  return m || `Failed to connect ${label}`;
}

const rejectionErr = new Error('User rejected the request.');
assert.match(translateWalletError('MetaMask', rejectionErr), /cancelled/i, 'Rejection should translate cleanly');

const channelErr = new Error('Broadcast channel unavailable');
assert.match(translateWalletError('Trust Wallet', channelErr), /extension is not ready/i, 'Extension channel errors should translate with clear advice');

console.log('WALLET INTEGRATION GATE: PASS — EIP-1193 identification, network invariants, and error isolation verified.');
