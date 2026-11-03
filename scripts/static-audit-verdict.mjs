/** A conservative verdict for a limited, heuristic Solidity source scan. */
export function summarizeStaticAudit(results, expectedContracts = 5) {
  if (!Array.isArray(results) || results.length !== expectedContracts ||
      results.some(r => !r || !Array.isArray(r.issues) ||
        !Number.isInteger(r.vulnerabilitiesFound) || r.vulnerabilitiesFound !== r.issues.length)) {
    throw new Error('BLOCKED: incomplete or inconsistent static-audit results');
  }
  const issuesFound = results.reduce((total, r) => total + r.vulnerabilitiesFound, 0);
  const allBytecodeWithinLimit = results.every(r =>
    Number.isInteger(r.bytecodeSizeBytes) && r.bytecodeSizeBytes > 0 &&
    r.bytecodeSizeBytes <= 24576 && r.eip170Compliant === true);
  const status = issuesFound > 0 ? 'FAIL_STATIC_PATTERNS_DETECTED' :
    !allBytecodeWithinLimit ? 'BLOCKED_BYTECODE_SIZE_UNVERIFIED_OR_EXCEEDED' :
    'PASS_LIMITED_STATIC_PATTERN_CHECKS';
  return {
    status,
    passed: status === 'PASS_LIMITED_STATIC_PATTERN_CHECKS',
    issuesFound,
    allBytecodeWithinLimit,
    standardCompliance: {
      eip170SizeLimits: allBytecodeWithinLimit,
      reentrancyChecksEffectsInteractions: null,
      solidityCheckedArithmetic: null,
      accessControlEnforced: null,
      zeroTxOriginVulnerabilities: null,
      zeroSelfdestructHazards: null
    },
    limitations: 'Six heuristic source patterns and local artifact size checks only; no AST proof, complete vulnerability coverage, source-to-bytecode equivalence, independent security audit or on-chain verification.'
  };
}
