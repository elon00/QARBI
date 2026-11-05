import crypto from 'node:crypto';

/** Detect changes to bounded local RSI results after audit generation; not a signature. */
export function rsiResultDigest(audit) {
  const record = {
    baselineCommit: audit.baselineCommit,
    evidenceHash: audit.evidenceHash,
    validationResults: audit.validationResults,
    truthCheckPassed: audit.truthCheckPassed,
    evaluatedScore: audit.evaluatedScore,
    candidateAdopted: audit.candidateAdopted,
    status: audit.status,
    durationMs: audit.durationMs
  };
  return crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex');
}
