/** Avoid persisting RPC credentials from any URL component, including the hostname. */
export function safeRpcLabel(endpoint) {
  if (!(endpoint instanceof URL) || endpoint.protocol !== 'https:') {
    throw new Error('BLOCKED: HTTPS RPC endpoint required');
  }
  return 'HTTPS_RPC_ENDPOINT_REDACTED';
}

/** Provider exceptions may embed full credential-bearing RPC URLs. Never stringify them in logs. */
export function safeRpcFailureMessage(_error) {
  return 'RPC verification failed (provider details redacted)';
}
