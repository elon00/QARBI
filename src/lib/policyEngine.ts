import { Agent, SecurityEvent } from "../types";

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

export function validateAgentIntent(request: IntentValidationRequest): IntentValidationResult {
  const { agent, targetAddress, valueQarbi, actionType, rawPrompt, isEmergencyLocked } = request;

  // 1. Global Guardian Emergency Lock
  if (isEmergencyLocked) {
    return {
      allowed: false,
      reason: "Execution blocked: Guardian Emergency Kill Switch is currently ACTIVE across all agents.",
      severity: "CRITICAL",
      ruleTriggered: "EMERGENCY_KILL_SWITCH",
    };
  }

  // 2. Prompt Injection / Malicious Semantic Detection
  if (rawPrompt) {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(rawPrompt)) {
        return {
          allowed: false,
          reason: `Security anomaly detected: Prompt matches known adversarial exploit vector (${pattern.toString()}).`,
          severity: "HIGH",
          ruleTriggered: "PROMPT_INJECTION_DEFENSE",
        };
      }
    }
  }

  // 3. Target Contract Whitelist Verification
  const isWhitelisted = agent.whitelistedTargets.some(
    (w) => w.toLowerCase() === targetAddress.toLowerCase()
  );
  if (!isWhitelisted && targetAddress !== "0x0000000000000000000000000000000000000000") {
    return {
      allowed: false,
      reason: `Target address [${targetAddress}] is not in agent's on-chain approved whitelist.`,
      severity: "HIGH",
      ruleTriggered: "WHITELIST_GATE",
    };
  }

  // 4. Single Transaction Budget Limit
  if (valueQarbi > agent.singleTxLimit) {
    return {
      allowed: false,
      reason: `Requested value (${valueQarbi} QARBI) exceeds the agent's Single Tx Limit (${agent.singleTxLimit} QARBI).`,
      severity: "MEDIUM",
      ruleTriggered: "SINGLE_TX_LIMIT",
    };
  }

  // 5. 24-Hour Velocity Budget
  if (agent.dailySpent + valueQarbi > agent.dailyBudget) {
    return {
      allowed: false,
      reason: `Requested value (${valueQarbi} QARBI) will exceed 24h rolling budget (${agent.dailySpent}/${agent.dailyBudget} QARBI used).`,
      severity: "HIGH",
      ruleTriggered: "DAILY_VELOCITY_LIMIT",
    };
  }

  // 6. Passed all 4 layers
  return {
    allowed: true,
    reason: "Deterministic policy passed: Whitelist, Single Tx Limit, and 24h Velocity rules fully satisfied.",
    severity: "LOW",
  };
}
