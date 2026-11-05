/** Validate the JSON-RPC envelope and exact Arbitrum Sepolia chain ID. */
export function assertArbitrumSepoliaChainIdResponse(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
      payload.jsonrpc !== '2.0' || payload.id !== 1 ||
      Object.hasOwn(payload, 'error') || payload.result !== '0x66eee') {
    throw new Error('BLOCKED: invalid Arbitrum Sepolia JSON-RPC chain ID response');
  }
  return '0x66eee';
}
