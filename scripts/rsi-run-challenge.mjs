/** Bind a mission RSI audit to the current invocation, not merely the same Git commit. */
export function requireRsiRunChallenge(audit, expectedChallenge) {
  if (typeof expectedChallenge !== 'string' || !/^[a-f0-9]{32}$/.test(expectedChallenge) ||
      audit?.evidenceStore?.invocationChallenge !== expectedChallenge) {
    throw new Error('BLOCKED: REA/RSI audit was not generated for this mission invocation');
  }
  return true;
}
