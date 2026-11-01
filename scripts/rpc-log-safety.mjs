/** Return only the public origin of an HTTPS RPC URL; never persist API-key paths, queries or userinfo. */
export function safeRpcLabel(endpoint) {
  if (!(endpoint instanceof URL) || endpoint.protocol !== 'https:') {
    throw new Error('BLOCKED: HTTPS RPC endpoint required');
  }
  return endpoint.origin;
}
