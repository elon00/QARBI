export type AgentArchetype =
  | "RESEARCHER"
  | "SECURITY_AUDITOR"
  | "QUANT_TRADER"
  | "DEFI_OPTIMIZER"
  | "VALIDATOR"
  | "CREATIVE_SYNTH";

export type AgentStatus = "ACTIVE" | "DORMANT" | "GRADUATED" | "INACTIVE";

export interface Agent {
  id: number;
  name: string;
  archetype: AgentArchetype;
  status: AgentStatus;
  reputation: number; // 0 - 1000
  energy: number; // 0 - 100
  completedTasks: number;
  failedTasks: number;
  walletAddress: string;
  pqcCommitmentHash: string; // 0x... bytes32 Keccak-256 of Dilithium3 public key
  pqcPublicKeyPreview?: string;
  metadataURI: string;
  singleTxLimit: number; // in $QARBI
  dailyBudget: number; // in $QARBI
  dailySpent: number; // in $QARBI
  whitelistedTargets: string[];
  registeredAt: number;
  description: string;
  avatarSeed: string;
  isCustom?: boolean;
}

export interface ConwayCell {
  alive: boolean;
  agentId?: number;
  energy: number;
  age: number;
  synergy: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: "RESEARCH" | "SECURITY" | "DEFI" | "VALIDATION" | "GENERAL";
  creatorAgentId: number;
  assigneeAgentId?: number;
  rewardQarbi: number;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";
  proofHash?: string;
  txHash?: string;
  gasUsed?: number;
  createdAt: number;
  completedAt?: number;
}

export interface TransactionRecord {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  type: "AGENT_REGISTER" | "CONWAY_EVOLUTION" | "TASK_ESCROW" | "REWARD_PAYOUT" | "KILL_SWITCH" | "FAUCET_CLAIM";
  value: string;
  status: "CONFIRMED" | "PENDING" | "REVERTED";
  timestamp: number;
  gasUsed: number;
  gasSavedStylus: string;
  dataSummary: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: number;
  agentId: number;
  targetAddress: string;
  value: number;
  action: string;
  status: "ALLOWED" | "BLOCKED" | "EMERGENCY_HALT";
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export type LanguageCode =
  | "en"
  | "es"
  | "ja"
  | "zh"
  | "ko"
  | "fr"
  | "de"
  | "pt"
  | "ru"
  | "ar"
  | "hi";

export interface TranslationStrings {
  appName: string;
  tagline: string;
  networkBadge: string;
  claimFaucet: string;
  walletBalance: string;
  tabs: {
    spawner: string;
    conway: string;
    terminal: string;
    tasks: string;
    security: string;
    explorer: string;
    whitepaper: string;
  };
  spawner: {
    title: string;
    subtitle: string;
    createAgentBtn: string;
    agentNameLabel: string;
    archetypeLabel: string;
    descriptionLabel: string;
    singleLimitLabel: string;
    dailyBudgetLabel: string;
    generatePqcBtn: string;
    pqcCommitmentTitle: string;
    deployOnchainBtn: string;
    citizenAgentsTitle: string;
    reputationLabel: string;
    energyLabel: string;
    tasksCompletedLabel: string;
    statusLabel: string;
  };
  conway: {
    title: string;
    subtitle: string;
    play: string;
    pause: string;
    stepTick: string;
    clear: string;
    randomize: string;
    speedLabel: string;
    patternLabel: string;
    activeCells: string;
    generation: string;
    synergyFactor: string;
    stylusRustBadge: string;
    wasmThroughput: string;
    triggerEvolutionBtn: string;
  };
  terminal: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    dispatchBtn: string;
    reasoningTrace: string;
    policyCheck: string;
    stylusExecution: string;
    onchainTxResult: string;
    presetPrompts: string;
  };
  tasks: {
    title: string;
    subtitle: string;
    createTaskBtn: string;
    openTasks: string;
    inProgress: string;
    completed: string;
    bounty: string;
    creator: string;
    assignee: string;
    acceptTaskBtn: string;
    submitProofBtn: string;
    escrowLocked: string;
  };
  security: {
    title: string;
    subtitle: string;
    killSwitchActive: string;
    killSwitchDeactive: string;
    toggleKillSwitch: string;
    attackSimulatorTitle: string;
    simulateOverbudget: string;
    simulateBadTarget: string;
    simulateInjection: string;
    auditLogTitle: string;
    layersTitle: string;
  };
  explorer: {
    title: string;
    subtitle: string;
    verifiedContracts: string;
    recentTxs: string;
    gasSavingsTitle: string;
    viewOnArbiscan: string;
  };
  whitepaper: {
    title: string;
    subtitle: string;
    downloadPdf: string;
    tableOfContents: string;
  };
}
