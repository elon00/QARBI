#!/usr/bin/env node
/** Fail-closed structural, freshness and commit-bound validation of the bounded local REA/RSI audit. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const REQUIRED_RSI_CHECKS = Object.freeze([
  'typecheck', 'compileContracts', 'nistVectors',
  'quantumSuite', 'contractSecurity', 'dependencyAudit'
]);

// A previously generated audit must never be reused as evidence for a new verification run.
// The runner captures both timestamps at startup; the checks below tolerate clock skew
// without treating old evidence from the same commit as current execution.
export const MAX_RSI_EVIDENCE_AGE_MS = 30 * 60 * 1000;
export const MAX_RSI_CLOCK_SKEW_MS = 2 * 60 * 1000;
export const MAX_RSI_CAPTURE_DELTA_MS = 60 * 1000;

export function validateRsiAuditEvidence(audit, expectedCommit, nowMs = Date.now()) {
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
  const store = audit.evidenceStore;
  if (!store || typeof store !== 'object' || Array.isArray(store) ||
      store.gitCommit !== expectedCommit || store.deployedManifestState !== 'UNVERIFIED_TESTNET_RECORD' ||
      typeof store.timestamp !== 'string' || !Number.isFinite(Date.parse(store.timestamp)) ||
      typeof store.gitBranch !== 'string' || !store.gitBranch ||
      typeof store.nodeVersion !== 'string' || !store.nodeVersion ||
      typeof store.platform !== 'string' || !store.platform ||
      typeof store.rpcConfigured !== 'boolean' ||
      !Number.isSafeInteger(store.invariantsAuditTimestamp) || store.invariantsAuditTimestamp <= 0) {
    throw new Error('BLOCKED: missing, malformed or stale REA/RSI evidence store');
  }
  const observedAtMs = Date.parse(store.timestamp);
  if (!Number.isSafeInteger(nowMs) ||
      observedAtMs > nowMs + MAX_RSI_CLOCK_SKEW_MS ||
      nowMs - observedAtMs > MAX_RSI_EVIDENCE_AGE_MS ||
      Math.abs(store.invariantsAuditTimestamp - observedAtMs) > MAX_RSI_CAPTURE_DELTA_MS ||
      store.invariantsAuditTimestamp > nowMs + MAX_RSI_CLOCK_SKEW_MS) {
    throw new Error('BLOCKED: REA/RSI evidence is stale, future-dated or internally inconsistent');
  }
  const computedHash = crypto.createHash('sha256').update(JSON.stringify(store)).digest('hex');
  if (audit.evidenceHash !== computedHash) {
    throw new Error('BLOCKED: REA/RSI evidence hash does not match recorded evidence');
  }
  if (typeof audit.evaluatedScore !== 'number' || !Number.isFinite(audit.evaluatedScore) ||
      Math.abs(audit.evaluatedScore - 0.7) > 1e-10) {
    throw new Error('BLOCKED: RSI score inconsistent with required passing checks');
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
