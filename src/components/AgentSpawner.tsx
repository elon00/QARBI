import React, { useState } from "react";
import {
  Sparkles,
  Key,
  Shield,
  Zap,
  CheckCircle,
  ExternalLink,
  PlusCircle,
  Copy,
  Award,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Agent, AgentArchetype, TranslationStrings, TransactionRecord } from "../types";
import { generatePQCIdentity, generateTxHash, formatAddress } from "../lib/crypto";

interface AgentSpawnerProps {
  agents: Agent[];
  onAddAgent: (newAgent: Agent, tx: TransactionRecord) => void;
  onEvolveAgent: (agentId: number) => void;
  t: TranslationStrings;
  onNavigateToTerminal: (agentName: string) => void;
}

const ARCHETYPES: { type: AgentArchetype; name: string; desc: string; defaultRep: number; defaultEnergy: number }[] = [
  {
    type: "RESEARCHER",
    name: "Autonomous Researcher",
    desc: "Analyzes Arbitrum ecosystem data, protocol stats, and on-chain liquidity shifts.",
    defaultRep: 120,
    defaultEnergy: 100,
  },
  {
    type: "SECURITY_AUDITOR",
    name: "Security Auditor",
    desc: "Scans smart contracts for reentrancy, overflow, and Stylus Wasm memory safety invariants.",
    defaultRep: 150,
    defaultEnergy: 95,
  },
  {
    type: "QUANT_TRADER",
    name: "Quant & Arbitrageur",
    desc: "Monitors cross-DEX pricing anomalies and executes verified low-slippage routing.",
    defaultRep: 110,
    defaultEnergy: 90,
  },
  {
    type: "DEFI_OPTIMIZER",
    name: "DeFi Yield Optimizer",
    desc: "Automates vault rebalancing and compounding on Arbitrum Sepolia test protocols.",
    defaultRep: 130,
    defaultEnergy: 95,
  },
  {
    type: "VALIDATOR",
    name: "PQC Attestation Validator",
    desc: "Cryptographically verifies ML-DSA post-quantum commitments and agent intent proofs.",
    defaultRep: 140,
    defaultEnergy: 100,
  },
  {
    type: "CREATIVE_SYNTH",
    name: "Autonomous Coordinator",
    desc: "Multi-agent task decomposition and hierarchical team orchestration.",
    defaultRep: 115,
    defaultEnergy: 100,
  },
];

export const AgentSpawner: React.FC<AgentSpawnerProps> = ({
  agents,
  onAddAgent,
  onEvolveAgent,
  t,
  onNavigateToTerminal,
}) => {
  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState<AgentArchetype>("RESEARCHER");
  const [description, setDescription] = useState("");
  const [singleTxLimit, setSingleTxLimit] = useState(25);
  const [dailyBudget, setDailyBudget] = useState(100);

  const [pqcIdentity, setPqcIdentity] = useState<{
    publicKeyPreview: string;
    pqcCommitmentHash: string;
    delegatedWallet: string;
  } | null>(null);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedTxHash, setDeployedTxHash] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleGeneratePQC = () => {
    const id = generatePQCIdentity(name || "Qarbi-Agent");
    setPqcIdentity({
      publicKeyPreview: id.publicKeyPreview,
      pqcCommitmentHash: id.pqcCommitmentHash,
      delegatedWallet: id.delegatedWalletAddress,
    });
  };

  const handleDeployAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let activePqc = pqcIdentity;
    if (!activePqc) {
      const generated = generatePQCIdentity(name);
      activePqc = {
        publicKeyPreview: generated.publicKeyPreview,
        pqcCommitmentHash: generated.pqcCommitmentHash,
        delegatedWallet: generated.delegatedWalletAddress,
      };
      setPqcIdentity(activePqc);
    }

    setIsDeploying(true);
    setDeployedTxHash(null);

    // Simulate Arbitrum Sepolia AgentRegistry.sol transaction
    setTimeout(() => {
      const txHash = generateTxHash();
      const newAgent: Agent = {
        id: agents.length + 1,
        name: name.trim(),
        archetype,
        status: "ACTIVE",
        reputation: 100,
        energy: 100,
        completedTasks: 0,
        failedTasks: 0,
        walletAddress: activePqc!.delegatedWallet,
        pqcCommitmentHash: activePqc!.pqcCommitmentHash,
        pqcPublicKeyPreview: activePqc!.publicKeyPreview,
        metadataURI: `ipfs://bafkrei${Math.random().toString(36).substring(2, 12)}`,
        singleTxLimit,
        dailyBudget,
        dailySpent: 0,
        whitelistedTargets: [
          "0x5FbDB2315678afecb367f032d93F642f64180aa3", // TaskMarket.sol
          "0x89D227316719b407137fFEe47a50C83602525150", // AgentRegistry.sol
        ],
        registeredAt: Date.now(),
        description: description.trim() || ARCHETYPES.find((a) => a.type === archetype)?.desc || "Autonomous Agent Citizen",
        avatarSeed: name.toLowerCase().replace(/\s+/g, "-"),
        isCustom: true,
      };

      const txRecord: TransactionRecord = {
        hash: txHash,
        blockNumber: 18492100 + agents.length,
        from: "0x71C...8e9B (Deployer)",
        to: "0x89D227316719b407137fFEe47a50C83602525150 (AgentRegistry.sol)",
        type: "AGENT_REGISTER",
        value: "0.0 ETH",
        status: "CONFIRMED",
        timestamp: Date.now(),
        gasUsed: 28420,
        gasSavedStylus: "45.2% vs EVM",
        dataSummary: `registerAgent(ID: ${newAgent.id}, ${newAgent.name}, PQC: ${newAgent.pqcCommitmentHash.slice(0, 10)}...)`,
      };

      onAddAgent(newAgent, txRecord);
      setDeployedTxHash(txHash);
      setIsDeploying(false);

      // Reset form
      setName("");
      setDescription("");
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {t?.spawner?.title || "Autonomous Agent Citadel"}
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-300 max-w-3xl">
              {t?.spawner?.subtitle || "Provision on-chain AI agents with Hybrid PQC (Dilithium3) commitments, dedicated smart wallets, and Conway state bindings."}
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block">Total Active Citizens</span>
              <span className="font-mono text-lg font-bold text-cyan-300">{agents?.length || 0} Agents</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block">State Engine</span>
              <span className="font-mono text-lg font-bold text-indigo-400">Arbitrum Stylus</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Spawn Agent Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>{t?.spawner?.createAgentBtn || "Spawn New Agent"}</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
              AgentRegistry.sol
            </span>
          </div>

          <form onSubmit={handleDeployAgent} className="space-y-4">
            {/* Agent Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t?.spawner?.agentNameLabel || "Agent Designation"} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sentinel-X09, QuantArb-04"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Functional Archetype */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t?.spawner?.archetypeLabel || "Functional Archetype"}
              </label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value as AgentArchetype)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 transition"
              >
                {ARCHETYPES.map((arch) => (
                  <option key={arch.type} value={arch.type}>
                    {arch.name} ({arch.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Mission / Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t?.spawner?.descriptionLabel || "Mission & Directives"}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe agent mission and operational objectives on Arbitrum Sepolia..."
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Spending Policies (4-Layer Guardrail) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deterministic Wallet Guardrails</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{t?.spawner?.singleLimitLabel || "Single Tx Limit ($QARBI)"}</span>
                  <span className="font-mono text-cyan-300 font-semibold">{singleTxLimit} QARBI</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={singleTxLimit}
                  onChange={(e) => setSingleTxLimit(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{t?.spawner?.dailyBudgetLabel || "24h Velocity Budget ($QARBI)"}</span>
                  <span className="font-mono text-cyan-300 font-semibold">{dailyBudget} QARBI</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* PQC Hybrid Identity Box */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hybrid PQC Identity (ML-DSA-65)</span>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePQC}
                  className="text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
                >
                  {pqcIdentity ? "Regenerate Keys" : (t?.spawner?.generatePqcBtn || "Generate ML-DSA PQC Keypair")}
                </button>
              </div>

              {pqcIdentity ? (
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 bg-slate-950/80 p-2 rounded-lg">
                    <span className="text-slate-500">Commitment:</span>
                    <span className="text-cyan-300 truncate max-w-[190px]">
                      {pqcIdentity.pqcCommitmentHash}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(pqcIdentity.pqcCommitmentHash, "pqc")}
                      className="ml-1 text-slate-400 hover:text-white"
                      title="Copy bytes32 Commitment"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
                    <span>Public Key: {pqcIdentity.publicKeyPreview}</span>
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Quantum-resistant Dilithium3 keys will be generated and hashed into on-chain <code className="text-indigo-300">bytes32</code> commitment during registration.
                </p>
              )}
            </div>

            {/* Deploy Button */}
            <button
              type="submit"
              disabled={isDeploying || !name.trim()}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center space-x-2 ${
                isDeploying || !name.trim()
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-900/30 cursor-pointer active:scale-98"
              }`}
            >
              {isDeploying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Arbitrum Sepolia...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{t?.spawner?.deployOnchainBtn || "Register on AgentRegistry.sol"}</span>
                </>
              )}
            </button>

            {deployedTxHash && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Agent Successfully Registered On-Chain!</span>
                </div>
                <div className="font-mono text-[11px] break-all text-emerald-400/90">
                  Tx: {deployedTxHash}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Citizen Agents Roster (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{t?.spawner?.citizenAgentsTitle || "Registered On-Chain Agents"}</span>
              <span className="text-xs font-mono font-normal text-slate-400">({agents?.length || 0})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Stylus Engine: <strong className="text-cyan-400">Wasm Evolving</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents?.filter(Boolean)?.map((agent) => {
              const isGraduated = agent?.status === "GRADUATED";
              const isDormant = agent?.status === "DORMANT";

              return (
                <div
                  key={agent?.id || Math.random()}
                  className={`p-5 rounded-2xl border transition shadow-lg flex flex-col justify-between ${
                    isGraduated
                      ? "bg-gradient-to-b from-amber-950/30 to-slate-900 border-amber-500/50 shadow-amber-950/20"
                      : isDormant
                      ? "bg-slate-900/60 border-slate-800 opacity-70"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-slate-950/40"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-base">{agent?.name || "Agent"}</h4>
                          <span className="text-[10px] font-mono text-slate-500">#{agent?.id}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-cyan-400">
                          {agent?.archetype}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                          isGraduated
                            ? "bg-amber-950 text-amber-300 border-amber-600 animate-pulse"
                            : isDormant
                            ? "bg-slate-800 text-slate-400 border-slate-700"
                            : "bg-emerald-950 text-emerald-300 border-emerald-700"
                        }`}
                      >
                        {isGraduated ? "🎓 Graduated" : (agent?.status || "ACTIVE")}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-300 line-clamp-2">
                      {agent?.description || ""}
                    </p>

                    {/* Progress Bars: Reputation & Energy */}
                    <div className="mt-4 space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Award className="w-3 h-3 text-amber-400" />
                            <span>{t?.spawner?.reputationLabel || "Reputation"}</span>
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            {agent?.reputation || 0}/1000
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((agent?.reputation || 0) / 1000) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>{t?.spawner?.energyLabel || "Energy"}</span>
                          </span>
                          <span className="font-mono font-bold text-cyan-300">
                            {agent?.energy || 0}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${agent?.energy || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* PQC Commitment Hash */}
                    <div className="mt-3.5 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
                      <span className="text-slate-500 text-[10px]">PQC:</span>
                      <span className="truncate max-w-[140px] text-indigo-300">
                        {agent?.pqcCommitmentHash}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(agent?.pqcCommitmentHash || "", `agent-${agent?.id}`)}
                        className="text-slate-500 hover:text-white transition"
                        title="Copy PQC Hash"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      <span>Tasks: <strong>{agent?.completedTasks || 0}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onEvolveAgent(agent?.id || 1)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition cursor-pointer flex items-center space-x-1"
                        title="Call Stylus ConwayEngine.rs evolveState()"
                      >
                        <TrendingUp className="w-3 h-3 text-indigo-400" />
                        <span>Evolve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToTerminal(agent?.name || "Agent")}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition cursor-pointer flex items-center space-x-1"
                      >
                        <span>Command</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
