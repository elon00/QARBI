#!/usr/bin/env node
/** Fail-closed structural and commit-bound validation of the bounded local REA/RSI audit. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const REQUIRED_RSI_CHECKS = Object.freeze([
  'typecheck', 'compileContracts', 'nistVectors',
  'quantumSuite', 'contractSecurity', 'dependencyAudit'
]);

export function validateRsiAuditEvidence(audit, expectedCommit) {
  if (!audit || typeof audit !== 'object' || Array.isArray(audit)) {
    throw new Error('BLOCKED: missing or malformed REA/RSI audit');
  }
  if (audit.status !== 'REVIEW_REQUIRED_NOT_ADOPTED' || audit.candidateAdopted !== false || audit.truthCheckPassed !== true) {
    throw new Error('BLOCKED: REA/RSI safety boundary or truth check failed');
  }
  if (!/^[a-f0-9]{40}$/.test(expectedCommit || '') || audit.baselineCommit !== expectedCommit) {
    throw new Error('BLOCKED: REA/RSI audit does not match checked-out commit');
  }
  if (!/^[a-f0-9]{64}$/.test(audit.evidenceHash || '')) {
    throw new Error('BLOCKED: missing or malformed REA/RSI evidence hash');
  }
  if (typeof audit.evaluatedScore !== 'number' || !Number.isFinite(audit.evaluatedScore) ||
      audit.evaluatedScore < 0 || audit.evaluatedScore > 0.7 + 1e-10) {
    throw new Error('BLOCKED: invalid bounded evidence-only score');
  }
  const checks = audit.validationResults;
  if (!checks || typeof checks !== 'object' || Array.isArray(checks) ||
      Object.keys(checks).length !== REQUIRED_RSI_CHECKS.length ||
      !REQUIRED_RSI_CHECKS.every(key => Object.hasOwn(checks, key) && checks[key] === true)) {
    throw new Error('BLOCKED: required REA/RSI validation results missing, failed or unexpected');
  }
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const expectedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const audit = JSON.parse(fs.readFileSync('reality/RAVEN_REA_RSI_AUDIT.json', 'utf8'));
    validateRsiAuditEvidence(audit, expectedCommit);
    console.log('Bounded local REA/RSI evidence PASS (not external Raven verification or production certification)');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
