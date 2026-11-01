#!/usr/bin/env node
/**
 * QARBI Protocol — Bounded Raven RSI + REA Recursive Self-Improvement Engine
 * 
 * Formal implementation of the 6-step bounded agentic loop defined in
 * docs/QUICKNODE_RAVEN_REA_RSI.md:
 * 
 * 1. OBSERVE : Ingests environment, RPC status, and system metrics into EvidenceStore
 * 2. INSPECT : Runs static safety analysis and invariant scanning in sandbox
 * 3. PLAN    : Proposes bounded, non-security-critical improvement candidates
 * 4. VALIDATE: Tests candidate against full regression suite & security gates
 * 5. ADOPT/REJECT: Evaluates formal acceptance equation:
 *      Score(c) = 0.25*T + 0.25*V + 0.20*R + 0.15*P + 0.15*O
 *      Enforces zero-autonomous-mainnet, zero-signer-access boundaries
 * 6. RECOVER : Computes rollback baseline and audit trail
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { rsiResultDigest } from './rsi-result-integrity.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║   QARBI PROTOCOL — BOUNDED RAVEN RSI + REA AGENTIC VERIFICATION ENGINE   ║');
console.log('║   "Bounded evidence collection; independent security review required" ║');
function assert(condition, message) {
  if (!condition) throw new Error(`RSI INVARIANT VIOLATION: ${message}`);
}

const startTime = Date.now();

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: OBSERVE (EvidenceStore Ingestion)
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ [STEP 1/6] OBSERVE: Capturing System State & Evidence Ingestion...');

const gitCommit = execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim();
const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir }).toString().trim();

const invocationChallenge = process.env.QARBI_RSI_RUN_CHALLENGE;
if (invocationChallenge !== undefined && !/^[a-f0-9]{32}$/.test(invocationChallenge)) {
  throw new Error('BLOCKED: malformed REA/RSI mission invocation challenge');
}

const evidenceStore = {
  timestamp: new Date().toISOString(),
  gitCommit,
  gitBranch,
  nodeVersion: process.version,
  platform: process.platform,
  rpcConfigured: Boolean(process.env.QUICKNODE_ARBITRUM_SEPOLIA_RPC || process.env.ARBITRUM_SEPOLIA_RPC),
  deployedManifestState: 'UNVERIFIED_TESTNET_RECORD',
  invariantsAuditTimestamp: Date.now(),
  ...(invocationChallenge ? { invocationChallenge } : {})
};

const evidenceHash = crypto.createHash('sha256').update(JSON.stringify(evidenceStore)).digest('hex');
console.log(`  ✓ EvidenceStore Ingested (Commit: ${gitCommit.slice(0, 8)}, SHA-256: ${evidenceHash.slice(0, 16)}...)`);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: INSPECT (REA Sandboxed Analysis)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ [STEP 2/6] INSPECT: REA Sandboxed Security & Invariant Inspection...');

// Check 1: Truth check enforcement
let truthCheckPassed = false;
try {
  execSync('node scripts/check-truth.mjs', { cwd: rootDir, stdio: 'pipe' });
  truthCheckPassed = true;
  console.log('  ✓ Deployment truth guard script passed (scope-limited)');
} catch (err) {
  console.error('  ❌ Truth check inspection failed');
}

// Check 2: Secret exposure guard
const deployScript = fs.readFileSync(path.join(rootDir, 'scripts', 'deploy.js'), 'utf8');
const hasKeyLogging = /console\.log\([^\n]*(?:wallet\.privateKey|privateKey)/.test(deployScript);
const hasRandomWallet = /Wallet\.createRandom\(/.test(deployScript);

if (hasKeyLogging || hasRandomWallet) {
  throw new Error('CRITICAL INSPECTION BREACH: Deployer key logging or fake wallet generator found');
}
console.log('  ✓ Limited deployer source-pattern scan passed (not a secrets audit)');

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: PLAN (Bounded Candidate Proposal)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ [STEP 3/6] PLAN: Recording Bounded Candidate Metadata (No Patch)...');

// Raven Agent Boundary Rules:
// - Scope MUST be bounded (test improvements, docs, non-security-critical logic)
// - Mainnet actions, signer modifications, treasury permissions are HARD-BLOCKED
const candidatePatch = {
  id: `PROPOSAL-${Date.now()}`,
  type: 'TEST_AND_EVIDENCE_REINFORCEMENT',
  targetFiles: [
    'test/smart-contracts-security.test.ts',
    'scripts/raven-rea-rsi-runner.mjs',
    'scripts/reality-scorecard-v3.mjs'
  ],
  boundedAutonomyScope: 'SANDBOXED_VERIFICATION_ONLY',
  modifiesSigners: false,
  modifiesTreasury: false,
  touchesMainnet: false,
  requiresHumanReview: true
};

console.log(`  ✓ Candidate metadata ${candidatePatch.id} (no code generated):`);
console.log(`    • Scope: ${candidatePatch.boundedAutonomyScope}`);
console.log(`    • Modifies Signers: ${candidatePatch.modifiesSigners} (STRICTLY PROHIBITED)`);
console.log(`    • Touches Mainnet : ${candidatePatch.touchesMainnet} (STRICTLY PROHIBITED)`);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4: VALIDATE (Regression & Invariant Execution)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ [STEP 4/6] VALIDATE: Executing Multi-Tier Invariant Suite...');

const validationResults = {};

// 1. TypeScript typecheck
try {
  execSync('npm run typecheck', { cwd: rootDir, stdio: 'pipe' });
  validationResults.typecheck = true;
  console.log('  ✓ [1/6] Typecheck (tsc --noEmit): PASS');
} catch {
  validationResults.typecheck = false;
  console.log('  ❌ [1/6] Typecheck: FAIL');
}

// 2. Contracts compilation
try {
  execSync('npm run compile:contracts', { cwd: rootDir, stdio: 'pipe' });
  validationResults.compileContracts = true;
  console.log('  ✓ [2/6] Compile Contracts (solc 0.8.24 viaIR): PASS');
} catch {
  validationResults.compileContracts = false;
  console.log('  ❌ [2/6] Compile Contracts: FAIL');
}

// 3. Official NIST vectors
try {
  execSync('npm run test:nist', { cwd: rootDir, stdio: 'pipe' });
  validationResults.nistVectors = true;
  console.log('  ✓ [3/6] NIST FIPS 204/203 & RFC Vectors: PASS');
} catch {
  validationResults.nistVectors = false;
  console.log('  ❌ [3/6] NIST Vectors: FAIL');
}

// 4. Quantum portfolio & secure channel
try {
  execSync('npm run test:quantum', { cwd: rootDir, stdio: 'pipe' });
  validationResults.quantumSuite = true;
  console.log('  ✓ [4/6] Quantum SQA/bSB & PQC Channel: PASS');
} catch {
  validationResults.quantumSuite = false;
  console.log('  ❌ [4/6] Quantum Suite: FAIL');
}

// 5. Smart contracts security invariants
try {
  execSync('npx tsx test/smart-contracts-security.test.ts', { cwd: rootDir, stdio: 'pipe' });
  validationResults.contractSecurity = true;
  console.log('  ✓ [5/6] Smart Contract Invariants (6 Tiers): PASS');
} catch {
  validationResults.contractSecurity = false;
  console.log('  ❌ [5/6] Smart Contract Invariants: FAIL');
}

// 6. Supply-chain dependency audit: fail closed on high/critical advisories
try {
  execSync('npm audit --audit-level=high', { cwd: rootDir, stdio: 'pipe' });
  validationResults.dependencyAudit = true;
  console.log('  ✓ [6/6] Dependency security audit: PASS');
} catch {
  validationResults.dependencyAudit = false;
  console.log('  ❌ [6/6] Dependency security audit: FAIL or unavailable');
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5: ADOPT OR REJECT (Formal Acceptance Equation)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ [STEP 5/6] ADOPT OR REJECT: Evaluating Acceptance Equation...');

// Score(c) = 0.25*T + 0.25*V + 0.20*R + 0.15*P + 0.15*O
const T = (validationResults.typecheck && validationResults.nistVectors && validationResults.quantumSuite && validationResults.contractSecurity && validationResults.dependencyAudit) ? 1.0 : 0.0;
const V = (truthCheckPassed && !candidatePatch.modifiesSigners && !candidatePatch.touchesMainnet) ? 1.0 : 0.0;
const R = validationResults.compileContracts ? 1.0 : 0.0;
const P = 0.0; // No performance/memory benchmark evidence collected in this run
const O = 0.0;  // Audit artifact has not yet been persisted or independently inspected

const rsiScore = 0.25 * T + 0.25 * V + 0.20 * R + 0.15 * P + 0.15 * O;
console.log(`  • Formula: Score(c) = 0.25*${T} + 0.25*${V} + 0.20*${R} + 0.15*${P} + 0.15*${O}`);
console.log(`  • Calculated RSI Score: ${(rsiScore * 100).toFixed(1)} / 100`);

const isAdopted = false; // No candidate patch was generated, tested, or committed
console.log('  REVIEW REQUIRED: No candidate code patch was generated; automatic adoption prohibited.');
console.log(`  Evidence-only score: ${(rsiScore * 100).toFixed(1)} / 100 (not certification)`);
console.log('  BOUNDED AUTONOMY: No patch staged. Zero autonomous mainnet deployment.');

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6: MONITOR & RECOVER (Rollback Baseline)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ [STEP 6/6] MONITOR & RECOVER: Baseline Snapshot & Audit Trail...');

const recoveryBaseline = {
  baselineCommit: gitCommit,
  evidenceStore,
  evidenceHash,
  evaluatedScore: rsiScore,
  validationResults,
  durationMs: Date.now() - startTime,
  status: 'REVIEW_REQUIRED_NOT_ADOPTED',
  candidateAdopted: false,
  truthCheckPassed
};

// Bind reported check outcomes and score to the persisted audit, not only its input evidence.
// This is local integrity detection, not external attestation or cryptographic authentication.
recoveryBaseline.resultDigest = rsiResultDigest(recoveryBaseline);

const artifactDir = path.join(rootDir, 'reality');
fs.mkdirSync(artifactDir, { recursive: true });
fs.writeFileSync(path.join(artifactDir, 'RAVEN_REA_RSI_AUDIT.json'), JSON.stringify(recoveryBaseline, null, 2));

console.log(`  ✓ Rollback Baseline preserved in reality/RAVEN_REA_RSI_AUDIT.json`);
console.log(`  ✓ Execution completed in ${recoveryBaseline.durationMs} ms`);

console.log('\n══════════════════════════════════════════════════════════════════════════');
console.log('RAVEN RSI + REA EVIDENCE COLLECTION FINISHED — NOT CERTIFIED');
console.log('══════════════════════════════════════════════════════════════════════════\n');

if (!truthCheckPassed || Object.values(validationResults).some(value => value !== true)) {
  console.error('REA/RSI verification failed: one or more checks did not pass.');
  process.exitCode = 1;
}
