#!/usr/bin/env node
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('========================================================================');
console.log('LEGAL & REGULATORY COMPLIANCE GATE (INDIAN SC & INTERNATIONAL LAWS)');
console.log('========================================================================');

const root = process.cwd();

// 1. Check Compliance Framework Document Presence
const complianceDoc = path.join(root, 'COMPLIANCE_AND_LEGAL_FRAMEWORK.md');
const rulebookDoc = path.join(root, 'RULEBOOK.md');
assert(fs.existsSync(complianceDoc), 'COMPLIANCE_AND_LEGAL_FRAMEWORK.md must exist');
assert(fs.existsSync(rulebookDoc), 'RULEBOOK.md must exist');

const complianceText = fs.readFileSync(complianceDoc, 'utf8');
assert(complianceText.includes('Supreme Court'), 'Must reference Supreme Court of India jurisprudence');
assert(complianceText.includes('PMLA'), 'Must reference Prevention of Money Laundering Act (PMLA 2002)');
assert(complianceText.includes('CERT-In'), 'Must reference CERT-In Cyber Directions');
assert(complianceText.includes('FATF'), 'Must reference FATF Recommendation 16');
assert(complianceText.includes('MiCA'), 'Must reference EU MiCA standards');
assert(complianceText.includes('ML-DSA-65'), 'Must reference NIST FIPS 204 PQC standard');
console.log('✅ PASS [1/4]: Statutory & International Compliance Framework documentation verified.');

// 2. Test Policy Engine FATF / PMLA Sanctions Screening
const { validateAgentIntent, generateCertInAuditLog } = await import('../src/lib/policyEngine.ts');

const mockAgent = {
  id: 1,
  name: 'Compliance-Agent-01',
  role: 'Market Arbiter',
  status: 'ACTIVE',
  pqcAlgorithm: 'ML-DSA-65',
  pqcPublicKey: '0x1234',
  pqcCommitmentHash: '0x5678',
  balanceQarbi: 1000,
  singleTxLimit: 100,
  dailyBudget: 500,
  dailySpent: 50,
  whitelistedTargets: ['0x45DEFB4710162830476a8EA2c6467E87FD7FacA1'], // TaskMarket address
  gridState: [],
  entropyScore: 0.85,
  generation: 1,
};

// 2a. Block Sanctioned Address (FATF Rec 16 / PMLA)
const sanctionedResult = validateAgentIntent({
  agent: mockAgent,
  targetAddress: '0x8589427373d6d84e98730d7795d8f6f8731fda16', // Tornado router
  valueQarbi: 10,
  actionType: 'TRANSFER',
  isEmergencyLocked: false,
});
assert.equal(sanctionedResult.allowed, false, 'Sanctioned mixer address must be blocked');
assert.equal(sanctionedResult.ruleTriggered, 'SANCTIONS_AND_AML_BLACKLIST');
console.log('✅ PASS [2/4]: FATF & PMLA Sanctions/Mixer Blacklist screening verified.');

// 2b. Block Velocity Limit Exceeded
const velocityAgent = { ...mockAgent, dailySpent: 450 };
const velocityResult = validateAgentIntent({
  agent: velocityAgent,
  targetAddress: '0x45DEFB4710162830476a8EA2c6467E87FD7FacA1',
  valueQarbi: 90, // 450 + 90 = 540 > dailyBudget 500
  actionType: 'TRANSFER',
  isEmergencyLocked: false,
});
assert.equal(velocityResult.allowed, false, 'Velocity limit breach must be blocked');
assert.equal(velocityResult.ruleTriggered, 'DAILY_VELOCITY_LIMIT');

// 2c. Allow Compliant Whitelisted Intent
const compliantResult = validateAgentIntent({
  agent: mockAgent,
  targetAddress: '0x45DEFB4710162830476a8EA2c6467E87FD7FacA1',
  valueQarbi: 25,
  actionType: 'TASK_BID',
  isEmergencyLocked: false,
});
assert.equal(compliantResult.allowed, true, 'Compliant intent must be allowed');
console.log('✅ PASS [3/4]: Deterministic spending limits & AML velocity controls verified.');

// 3. Test CERT-In & PMLA Compliant Audit Log Generation
const auditLog = generateCertInAuditLog(
  {
    agent: mockAgent,
    targetAddress: '0x45DEFB4710162830476a8EA2c6467E87FD7FacA1',
    valueQarbi: 25,
    actionType: 'TASK_BID',
    isEmergencyLocked: false,
  },
  compliantResult
);
assert(auditLog.timestampIso && auditLog.timestampEpochMs > 0, 'Audit log must have valid timestamp');
assert(auditLog.complianceStandards.length >= 5, 'Must list all applicable compliance standards');
assert.equal(auditLog.status, 'ALLOWED');
console.log('✅ PASS [4/4]: CERT-In timestamped audit log generation format verified.');

console.log('========================================================================');
console.log('LEGAL COMPLIANCE GATE: ALL CHECKS PASS');
console.log('========================================================================\n');
