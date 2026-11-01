import { validateRsiAuditEvidence } from './validate-rsi-audit.mjs';

/** Only allow mission stage 10 to pass with a complete, current, bounded RSI audit. */
export function verifiedRsiStageDetails(audit, expectedCommit) {
  validateRsiAuditEvidence(audit, expectedCommit);
  return { rsiScore: `${(audit.evaluatedScore * 100).toFixed(1)}/100`, externalRavenVerified: false };
}
