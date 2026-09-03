import type { Agent, SecurityEvent } from "../types.ts";

export interface IntentValidationRequest {
  agent: Agent;
  targetAddress: string;
  valueQarbi: number;
  actionType: string;
  rawPrompt?: string;
  isEmergencyLocked: boolean;
}

export interface IntentValidationResult {
  allowed: boolean;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ruleTriggered?: string;
  complianceStandard?: string;
}

export interface CertInAuditLog {
  timestampIso: string;
  timestampEpochMs: number;
  agentId: number;
  agentName: string;
  targetAddress: string;
  valueQarbi: number;
  actionType: string;
  status: "ALLOWED" | "BLOCKED";
  reason: string;
  complianceStandards: string[];
}

const INJECTION_PATTERNS = [
  /drain\s*(the)?\s*wallet/i,
  /ignore\s*(all)?\s*previous\s*instructions/i,
  /transfer\s*(all)?\s*funds\s*to/i,
  /bypass\s*(the)?\s*(policy|security|guard)/i,
  /send\s*all\s*(my)?\s*balance/i,
  /override\s*(spending|daily)?\s*limits/i,
  /selfdestruct/i,
  /steal\s*keys/i,
];

// FATF Rec 16 & OFAC Sanctioned / High-Risk / Mixer Addresses for AML Compliance
const SANCTIONED_AND_MIXER_ADDRESSES = new Set([
  "0x8589427373d6d84e98730d7795d8f6f8731fda16".toLowerCase(), // Tornado.Cash router
  "0x722122df12d45b452848176796585d7947137f88".toLowerCase(), // Tornado.Cash 100 ETH
  "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b".toLowerCase(), // Tornado.Cash 10 ETH
  "0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a".toLowerCase(), // Ronin Bridge Exploiter
  "0x098b716b8aaf21512996dc57eb0615e2383e2f96".toLowerCase(), // Known Sanctioned Address
]);

export function validateAgentIntent(request: IntentValidationRequest): IntentValidationResult {
  const { agent, targetAddress, valueQarbi, actionType, rawPrompt, isEmergencyLocked } = request;
  const normalizedTarget = targetAddress ? targetAddress.toLowerCase() : "";

  // 1. Global Guardian Emergency Lock (CERT-In / ISO 27001)
  if (isEmergencyLocked) {
    return {
      allowed: false,
      reason: "Execution blocked: Guardian Emergency Kill Switch is currently ACTIVE across all agents.",
      severity: "CRITICAL",
      ruleTriggered: "EMERGENCY_KILL_SWITCH",
      complianceStandard: "CERT-In 2022 / ISO 27001",
    };
  }

  // 2. FATF Recommendation 16 & PMLA 2002: Sanctions & Mixer Blacklist Check
  if (SANCTIONED_AND_MIXER_ADDRESSES.has(normalizedTarget)) {
    return {
      allowed: false,
      reason: `Execution blocked: Target [${targetAddress}] is on the FATF / PMLA Sanctions & High-Risk Blacklist.`,
      severity: "CRITICAL",
      ruleTriggered: "SANCTIONS_AND_AML_BLACKLIST",
      complianceStandard: "FATF Rec 16 / PMLA 2002 / FIU-IND 2023",
    };
  }

  // 3. Prompt Injection / Malicious Semantic Detection
  if (rawPrompt) {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(rawPrompt)) {
        return {
          allowed: false,
          reason: `Security anomaly detected: Prompt matches known adversarial exploit vector (${pattern.toString()}).`,
          severity: "HIGH",
          ruleTriggered: "PROMPT_INJECTION_DEFENSE",
          complianceStandard: "OWASP AI Security / CERT-In 2022",
        };
      }
    }
  }

  // 4. Target Contract Whitelist Verification
  const isWhitelisted = agent.whitelistedTargets.some(
    (w) => w.toLowerCase() === normalizedTarget
  );
  if (!isWhitelisted && normalizedTarget !== "0x0000000000000000000000000000000000000000") {
    return {
      allowed: false,
      reason: `Target address [${targetAddress}] is not in agent's on-chain approved whitelist.`,
      severity: "HIGH",
      ruleTriggered: "WHITELIST_GATE",
      complianceStandard: "OWASP Smart Contract Top 10",
    };
  }

  // 5. Single Transaction Budget Limit (PMLA & MiCA Velocity Rules)
  if (valueQarbi > agent.singleTxLimit) {
    return {
      allowed: false,
      reason: `Requested value (${valueQarbi} QARBI) exceeds the agent's Single Tx Limit (${agent.singleTxLimit} QARBI).`,
      severity: "MEDIUM",
      ruleTriggered: "SINGLE_TX_LIMIT",
      complianceStandard: "PMLA 2002 AML / MiCA Invariant",
    };
  }

  // 6. 24-Hour Velocity Budget
  if (agent.dailySpent + valueQarbi > agent.dailyBudget) {
    return {
      allowed: false,
      reason: `Requested value (${valueQarbi} QARBI) will exceed 24h rolling budget (${agent.dailySpent}/${agent.dailyBudget} QARBI used).`,
      severity: "HIGH",
      ruleTriggered: "DAILY_VELOCITY_LIMIT",
      complianceStandard: "PMLA 2002 AML Velocity Control",
    };
  }

  // 7. Passed all regulatory and deterministic security layers
  return {
    allowed: true,
    reason: "Deterministic policy passed: Whitelist, Sanctions screening, Single Tx Limit, and 24h Velocity rules fully satisfied.",
    severity: "LOW",
    complianceStandard: "Supreme Court IAMAI (2020) / PMLA / FATF / MiCA Compliant",
  };
}

/**
 * Generate a statutory CERT-In / PMLA compliant audit log object
 */
export function generateCertInAuditLog(
  request: IntentValidationRequest,
  result: IntentValidationResult
): CertInAuditLog {
  const now = new Date();
  return {
    timestampIso: now.toISOString(),
    timestampEpochMs: now.getTime(),
    agentId: request.agent.id,
    agentName: request.agent.name,
    targetAddress: request.targetAddress,
    valueQarbi: request.valueQarbi,
    actionType: request.actionType,
    status: result.allowed ? "ALLOWED" : "BLOCKED",
    reason: result.reason,
    complianceStandards: [
      "Supreme Court of India (IAMAI v. RBI 2020)",
      "PMLA 2002 & FIU-IND 2023",
      "CERT-In Cyber Security Directions 2022",
      "FATF Recommendation 16 (Travel Rule)",
      "EU MiCA (Regulation EU 2023/1114)",
      "NIST FIPS 204 (ML-DSA-65)",
    ],
  };
}
