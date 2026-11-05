import { REQUIRED_RSI_CHECKS } from './validate-rsi-audit.mjs';

/** Fail closed: unsuccessful bounded checks must not produce review-ready evidence. */
export function rsiAuditOutcome({ truthCheckPassed, validationResults, candidateAdopted }) {
  const complete = validationResults !== null && typeof validationResults === 'object' &&
    !Array.isArray(validationResults) &&
    Object.keys(validationResults).length === REQUIRED_RSI_CHECKS.length &&
    REQUIRED_RSI_CHECKS.every(key => Object.hasOwn(validationResults, key) && validationResults[key] === true);
  const passed = truthCheckPassed === true && candidateAdopted === false && complete;
  return {
    status: passed ? 'REVIEW_REQUIRED_NOT_ADOPTED' : 'BLOCKED_CURRENT_RUN_UNVERIFIED',
    exitCode: passed ? 0 : 1
  };
}
