/** Reject incomplete or ambiguous Arbitrum Sepolia deployment manifests. */
export const REQUIRED_CONTRACTS = Object.freeze([
  'QARBIToken', 'AgentRegistry', 'TaskMarket', 'ConwayEngine', 'AgentWallet'
]);

export function validateContractManifest(manifest) {
  if (!manifest || manifest.chainId !== 421614 || !manifest.contracts ||
      typeof manifest.contracts !== 'object' || Array.isArray(manifest.contracts)) {
    throw new Error('BLOCKED: invalid Arbitrum Sepolia deployment manifest');
  }
  const names = Object.keys(manifest.contracts);
  if (names.length !== REQUIRED_CONTRACTS.length ||
      !REQUIRED_CONTRACTS.every(name => Object.hasOwn(manifest.contracts, name))) {
    throw new Error('BLOCKED: deployment manifest must contain exactly five required contracts');
  }
  const seen = new Set();
  for (const name of REQUIRED_CONTRACTS) {
    const address = manifest.contracts[name]?.address;
    if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address) ||
        /^0x0{40}$/i.test(address) || seen.has(address.toLowerCase())) {
      throw new Error(`BLOCKED: invalid, zero or duplicate address for ${name}`);
    }
    seen.add(address.toLowerCase());
  }
  return REQUIRED_CONTRACTS;
}
