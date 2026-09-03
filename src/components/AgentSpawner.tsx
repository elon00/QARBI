import React, { useState } from "react";
import {
  Sparkles,
  Key,
  Shield,
  CheckCircle,
  ExternalLink,
  PlusCircle,
  Copy,
} from "lucide-react";
import { ethers } from "ethers";
import { Agent, AgentArchetype, TranslationStrings, TransactionRecord } from "../types";
import { generatePQCIdentity, type PQCIdentityResult } from "../lib/crypto";
import { registerAgentOnchain, explorerTxUrl, getProductionContracts } from "../lib/productionChain";

interface AgentSpawnerProps {
  agents: Agent[];
  onAddAgent: (newAgent: Agent, tx: TransactionRecord) => void;
  onEvolveAgent: (agentId: number) => void;
  t: TranslationStrings;
  onNavigateToTerminal: (agentName: string) => void;
  signer?: ethers.Signer | null;
  walletAddress?: string | null;
}

const ARCHETYPES: { type: AgentArchetype; name: string; desc: string }[] = [
  { type: "RESEARCHER", name: "Autonomous Researcher", desc: "Analyzes Arbitrum ecosystem data, protocol stats, and on-chain liquidity shifts." },
  { type: "SECURITY_AUDITOR", name: "Security Auditor", desc: "Scans smart contracts for security and memory-safety invariants." },
  { type: "QUANT_TRADER", name: "Quant & Arbitrageur", desc: "Monitors cross-DEX pricing anomalies and verified routing." },
  { type: "DEFI_OPTIMIZER", name: "DeFi Yield Optimizer", desc: "Automates vault rebalancing on supported test protocols." },
  { type: "VALIDATOR", name: "PQC Attestation Validator", desc: "Verifies post-quantum commitments and agent intent proofs." },
  { type: "CREATIVE_SYNTH", name: "Autonomous Coordinator", desc: "Multi-agent task decomposition and team orchestration." },
];

export const AgentSpawner: React.FC<AgentSpawnerProps> = ({
  agents,
  onAddAgent,
  onEvolveAgent: _onEvolveAgent,
  t,
  onNavigateToTerminal: _onNavigateToTerminal,
  signer,
  walletAddress,
}) => {
  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState<AgentArchetype>("RESEARCHER");
  const [description, setDescription] = useState("");
  const [singleTxLimit, setSingleTxLimit] = useState(25);
  const [dailyBudget, setDailyBudget] = useState(100);
  const [pqcIdentity, setPqcIdentity] = useState<PQCIdentityResult | null>(null);
  const [isGeneratingPQC, setIsGeneratingPQC] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedTxHash, setDeployedTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGeneratePQC = async () => {
    setError(null);
    setIsGeneratingPQC(true);
    try {
      const id = await generatePQCIdentity(name.trim() || "Qarbi-Agent");
      setPqcIdentity(id);
    } catch (err: any) {
      setError("PQC generation failed: " + (err?.message || String(err)));
    } finally {
      setIsGeneratingPQC(false);
    }
  };

  const handleDeployAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDeployedTxHash(null);
    if (!name.trim()) return;
    if (!signer || !walletAddress) {
      setError("Connect a wallet on Arbitrum Sepolia before registering an agent.");
      return;
    }

    setIsDeploying(true);

    try {
      const activePqc = pqcIdentity || await generatePQCIdentity(name.trim());
      setPqcIdentity(activePqc);
      const metadata = {
        name: name.trim(),
        archetype,
        description: description.trim(),
        schema: "qarbi.agent.v1",
      };
      const result = await registerAgentOnchain(signer, {
        name: name.trim(),
        archetype,
        pqcCommitmentHash: activePqc.pqcCommitmentHash,
        delegatedSessionWallet: walletAddress,
        metadataURI: `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`,
        singleTxLimit: ethers.parseEther(String(singleTxLimit)),
        dailyBudget: ethers.parseEther(String(dailyBudget)),
      });

      const registryAddress = await getProductionContracts(signer).registry.getAddress();
      const agentId = Number(result.agentId);
      const newAgent: Agent = {
        id: agentId,
        name: name.trim(),
        archetype,
        status: "ACTIVE",
        reputation: 800,
        energy: 100,
        completedTasks: 0,
        failedTasks: 0,
        walletAddress,
        pqcCommitmentHash: activePqc.pqcCommitmentHash,
        pqcPublicKeyPreview: activePqc.publicKeyPreview,
        metadataURI: `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`,
        singleTxLimit,
        dailyBudget,
        dailySpent: 0,
        whitelistedTargets: [],
        registeredAt: Date.now(),
        description: description.trim() || ARCHETYPES.find((a) => a.type === archetype)?.desc || "Autonomous Agent Citizen",
        avatarSeed: name.toLowerCase().replace(/\s+/g, "-"),
        isCustom: true,
      };

      const txRecord: TransactionRecord = {
        hash: result.txHash,
        blockNumber: result.receipt.blockNumber,
        from: walletAddress,
        to: registryAddress,
        type: "AGENT_REGISTER",
        value: "0.0 ETH",
        status: "CONFIRMED",
        timestamp: Date.now(),
        gasUsed: Number(result.receipt.gasUsed),
        gasSavedStylus: "On-chain confirmed",
        dataSummary: `registerAgent(${agentId}, ${newAgent.name})`,
      };

      onAddAgent(newAgent, txRecord);
      setDeployedTxHash(result.txHash);
      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || "On-chain agent registration failed.");
    } finally {
      setIsDeploying(false);
    }
  };

  const copyHash = async () => {
    if (!deployedTxHash) return;
    await navigator.clipboard?.writeText(deployedTxHash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><Sparkles className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-white tracking-wide">{t?.spawner?.title || "Autonomous Agent Citadel"}</h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-300 max-w-3xl">Register autonomous agents directly on Arbitrum Sepolia with an on-chain identity commitment.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
            <div><span className="text-slate-400 block">Registered Agents</span><span className="font-mono text-lg font-bold text-cyan-300">{agents?.length || 0}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <form onSubmit={handleDeployAgent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t?.spawner?.agentNameLabel || "Agent Designation"} *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t?.spawner?.archetypeLabel || "Functional Archetype"}</label>
            <select value={archetype} onChange={(e) => setArchetype(e.target.value as AgentArchetype)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white">
              {ARCHETYPES.map((arch) => <option key={arch.type} value={arch.type}>{arch.name} ({arch.type})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mission & Directives</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white" />
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300"><Shield className="w-3.5 h-3.5 text-indigo-400" /><span>Deterministic Wallet Guardrails</span></div>
            <div><div className="flex justify-between text-xs text-slate-400"><span>Single Tx Limit</span><span className="font-mono text-cyan-300">{singleTxLimit} QARBI</span></div><input type="range" min="5" max="25" value={singleTxLimit} onChange={(e) => setSingleTxLimit(Number(e.target.value))} className="w-full" /></div>
            <div><div className="flex justify-between text-xs text-slate-400"><span>Daily Budget</span><span className="font-mono text-cyan-300">{dailyBudget} QARBI</span></div><input type="range" min="20" max="100" step="5" value={dailyBudget} onChange={(e) => setDailyBudget(Number(e.target.value))} className="w-full" /></div>
          </div>
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-300"><span className="flex items-center gap-2"><Key className="w-3.5 h-3.5" />PQC Commitment</span><button type="button" disabled={isGeneratingPQC} onClick={handleGeneratePQC} className="underline disabled:opacity-50">{isGeneratingPQC ? "Generating ML-DSA-65..." : "Generate"}</button></div>
            <p className="mt-2 text-[11px] text-amber-300">Cryptographic implementation must be independently verified before calling this a production ML-DSA identity.</p>
            {pqcIdentity && <div className="mt-2 font-mono text-[11px] text-cyan-300 flex items-center gap-2"><span className="truncate">{pqcIdentity.pqcCommitmentHash}</span><button type="button" onClick={copyHash}><Copy className="w-3 h-3" /></button>{copied && <span className="text-emerald-300">copied</span>}</div>}
          </div>
          {error && <div className="p-3 rounded-xl bg-red-950/30 border border-red-800 text-sm text-red-300">{error}</div>}
          {deployedTxHash && <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800 text-sm text-emerald-300 flex items-center justify-between"><span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Confirmed on Arbitrum Sepolia</span><a className="flex items-center gap-1 underline" href={explorerTxUrl(deployedTxHash)} target="_blank" rel="noreferrer">View TX <ExternalLink className="w-3 h-3" /></a></div>}
          <button disabled={isDeploying} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold"><PlusCircle className="w-4 h-4" />{isDeploying ? "Waiting for confirmation…" : (t?.spawner?.deployOnchainBtn || "Register Agent On-Chain")}</button>
        </form>
      </div>
    </div>
  );
};
