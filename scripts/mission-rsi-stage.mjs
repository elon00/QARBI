import { validateRsiAuditEvidence } from './validate-rsi-audit.mjs';
import { requireRsiRunChallenge } from './rsi-run-challenge.mjs';

/** Only allow mission stage 10 to pass with a complete, current, bounded RSI audit. */
export function verifiedRsiStageDetails(audit, expectedCommit, expectedChallenge) {
  validateRsiAuditEvidence(audit, expectedCommit);
  requireRsiRunChallenge(audit, expectedChallenge);
  return { rsiScore: `${(audit.evaluatedScore * 100).toFixed(1)}/100`, externalRavenVerified: false };
}
