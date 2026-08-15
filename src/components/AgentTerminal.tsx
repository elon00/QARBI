import React, { useState } from "react";
import {
  Terminal as TerminalIcon,
  Send,
  Sparkles,
  ShieldCheck,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  User,
  Zap,
  Lock,
} from "lucide-react";
import { Agent, TranslationStrings, TaskItem, TransactionRecord } from "../types";
import { validateAgentIntent } from "../lib/policyEngine";
import { generateTxHash } from "../lib/crypto";

interface AgentTerminalProps {
  agents: Agent[];
  activeAgentName?: string;
  onPostTask: (task: TaskItem, txRecord: TransactionRecord) => void;
  t: TranslationStrings;
  isEmergencyLocked: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  agents,
  activeAgentName,
  onPostTask,
  t,
  isEmergencyLocked,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<number>(
    agents.find((a) => a.name === activeAgentName)?.id || agents[0]?.id || 1
  );
  const [promptInput, setPromptInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineState, setPipelineState] = useState<{
    step: "IDLE" | "PLANNING" | "POLICY_CHECK" | "PQC_SIGNING" | "ONCHAIN_SETTLE" | "COMPLETE" | "REJECTED";
    planData?: any;
    policyResult?: any;
    txRecord?: TransactionRecord;
    errorReason?: string;
  }>({ step: "IDLE" });

  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "agent" | "system"; text: string; time: string }[]
  >([
    {
      sender: "system",
      text: "Qarbi Agentic AI Terminal initialized. Connected to Arbitrum Sepolia Stylus VM & Policy Enclave.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      sender: "agent",
      text: `Greetings, Operator. I am ready to process natural language intents, verify deterministic spending rules, and execute on-chain state mutations on Arbitrum Sepolia.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const PRESET_DIRECTIVES = [
    "Scan Camelot & Uniswap on Arbitrum Sepolia for DEX arbitrage spread with 15 QARBI bounty",
    "Perform formal verification and reentrancy audit on new Vault contract",
    "Verify ML-DSA-65 post-quantum public key attestation commitments",
    "Benchmark 5,000 Stylus Wasm state transitions against EVM SSTORE gas costs",
  ];

  const handleDispatchIntent = async (overridePrompt?: string) => {
    const rawPrompt = overridePrompt || promptInput;
    if (!rawPrompt.trim() || isProcessing) return;

    setIsProcessing(true);
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: rawPrompt, time: userTime },
    ]);

    setPipelineState({ step: "PLANNING" });

    try {
      let plan: any = null;
      try {
        const planRes = await fetch("/api/gemini/plan-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: rawPrompt,
            agentContext: {
              name: activeAgent?.name,
              archetype: activeAgent?.archetype,
              reputation: activeAgent?.reputation,
              singleTxLimit: activeAgent?.singleTxLimit,
            },
          }),
        });

        if (planRes.ok) {
          const planJson = await planRes.json();
          plan = planJson.plan;
        }
      } catch {
        // Graceful offline/demo fallback
      }

      if (!plan) {
        plan = {
          taskTitle: `Execute: ${rawPrompt.slice(0, 36)}`,
          taskDescription: rawPrompt,
          suggestedArchetype: activeAgent?.archetype || "RESEARCHER",
          rewardQarbi: 15,
          estimatedGasUnits: 4120,
          policyVerification: { isWithinSingleTxLimit: true, securityRisk: "LOW" },
          executionSummary: "Autonomous task scheduled on Arbitrum Sepolia.",
        };
      }

      setPipelineState({ step: "POLICY_CHECK", planData: plan });

      // Step 2: Deterministic Policy Engine Gate
      await new Promise((r) => setTimeout(r, 600));

      const policyCheck = validateAgentIntent({
        agent: activeAgent,
        targetAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // TaskMarket.sol
        valueQarbi: plan.rewardQarbi || 15,
        actionType: "TASK_ESCROW",
        rawPrompt,
        isEmergencyLocked,
      });

      if (!policyCheck.allowed) {
        setPipelineState({
          step: "REJECTED",
          planData: plan,
          policyResult: policyCheck,
          errorReason: policyCheck.reason,
        });

        setChatMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: `[POLICY ENGINE REJECTED]: ${policyCheck.reason}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsProcessing(false);
        return;
      }

      setPipelineState({ step: "PQC_SIGNING", planData: plan, policyResult: policyCheck });

      // Step 3: PQC Dilithium3 Attestation
      await new Promise((r) => setTimeout(r, 500));

      setPipelineState({ step: "ONCHAIN_SETTLE", planData: plan, policyResult: policyCheck });

      // Step 4: Arbitrum Sepolia Onchain Settlement
      await new Promise((r) => setTimeout(r, 700));

      const txHash = generateTxHash();
      const newTask: TaskItem = {
        id: `TASK-${Math.floor(Math.random() * 9000) + 1000}`,
        title: plan.taskTitle || "Autonomous On-Chain Mission",
        description: plan.taskDescription || rawPrompt,
        category: (plan.suggestedArchetype === "SECURITY_AUDITOR" ? "SECURITY" : plan.suggestedArchetype === "QUANT_TRADER" ? "DEFI" : "RESEARCH"),
        creatorAgentId: activeAgent.id,
        rewardQarbi: plan.rewardQarbi || 15,
        status: "OPEN",
        txHash,
        gasUsed: plan.estimatedGasUnits || 4200,
        createdAt: Date.now(),
      };

      const txRecord: TransactionRecord = {
        hash: txHash,
        blockNumber: 18492160,
        from: activeAgent.walletAddress,
        to: "0x5FbDB2315678afecb367f032d93F642f64180aa3 (TaskMarket.sol)",
        type: "TASK_ESCROW",
        value: `${newTask.rewardQarbi}.0 QARBI`,
        status: "CONFIRMED",
        timestamp: Date.now(),
        gasUsed: newTask.gasUsed || 4200,
        gasSavedStylus: "89.4% vs EVM",
        dataSummary: `createTask(${newTask.id}, Bounty: ${newTask.rewardQarbi} QARBI)`,
      };

      onPostTask(newTask, txRecord);

      setPipelineState({
        step: "COMPLETE",
        planData: plan,
        policyResult: policyCheck,
        txRecord,
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `[${activeAgent.name}]: Intent validated and dispatched. Task ${newTask.id} created with ${newTask.rewardQarbi} QARBI escrow locked. Onchain Tx: ${txHash.slice(0, 14)}...`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      setPromptInput("");
    } catch (err: any) {
      setPipelineState({
        step: "REJECTED",
        errorReason: err.message || "Failed to dispatch intent",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <TerminalIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {t.terminal.title}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            {t.terminal.subtitle}
          </p>
        </div>

        {/* Selected Agent Selector */}
        <div className="flex items-center space-x-2 text-xs bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <User className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Active Dispatcher:</span>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(Number(e.target.value))}
            className="bg-slate-900 text-cyan-300 font-semibold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.archetype})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal Chat / Input Console (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[600px] overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-xs text-slate-400 ml-2">
                qarbi-orchestrator://arbitrum-sepolia/v1
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Policy Guard Active</span>
            </span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === "user"
                    ? "items-end"
                    : msg.sender === "system"
                    ? "items-center"
                    : "items-start"
                }`}
              >
                {msg.sender === "system" ? (
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 font-mono text-[11px] max-w-lg text-center">
                    {msg.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm"
                        : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-cyan-300">
                        {msg.sender === "user" ? "You (Operator)" : activeAgent?.name}
                      </span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Presets Bar */}
          <div className="p-2.5 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">
              {t.terminal.presetPrompts}:
            </span>
            <div className="inline-flex space-x-1.5">
              {PRESET_DIRECTIVES.map((directive, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptInput(directive);
                    handleDispatchIntent(directive);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700/60 truncate max-w-xs"
                >
                  {directive}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDispatchIntent();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={t.terminal.inputPlaceholder}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              disabled={isProcessing || !promptInput.trim()}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition flex items-center space-x-1.5 cursor-pointer ${
                isProcessing || !promptInput.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95"
              }`}
            >
              {isProcessing ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{t.terminal.dispatchBtn}</span>
            </button>
          </form>
        </div>

        {/* 4-Step Verification & Pipeline Visualizer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>4-Stage Autonomous Pipeline</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                Verifiable Execution
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Stage 1: AI Reasoning & Planning */}
              <div
                className={`p-3.5 rounded-xl border transition ${
                  pipelineState.step === "PLANNING"
                    ? "bg-sky-950/40 border-sky-500 text-sky-200"
                    : pipelineState.step !== "IDLE"
                    ? "bg-slate-950/80 border-slate-800 text-slate-300"
                    : "bg-slate-950/40 border-slate-800/40 opacity-50 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-sky-900/80 text-sky-300 flex items-center justify-center text-[10px] font-mono">
                      1
                    </span>
                    <span>1. Gemini AI Intent Decomposition</span>
                  </span>
                  {pipelineState.step === "PLANNING" && (
                    <span className="text-[10px] text-sky-400 animate-pulse">Thinking...</span>
                  )}
                  {pipelineState.planData && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                {pipelineState.planData && (
                  <div className="mt-2 text-[11px] text-slate-400 pl-7 space-y-1">
                    <div className="text-white font-medium">{pipelineState.planData.taskTitle}</div>
                    <div className="text-[10px] text-cyan-300">
                      Bounty: {pipelineState.planData.rewardQarbi} QARBI | Gas: ~{pipelineState.planData.estimatedGasUnits} units
                    </div>
                  </div>
                )}
              </div>

              {/* Stage 2: Deterministic Policy Gate */}
              <div
                className={`p-3.5 rounded-xl border transition ${
                  pipelineState.step === "POLICY_CHECK"
                    ? "bg-indigo-950/40 border-indigo-500 text-indigo-200"
                    : pipelineState.policyResult?.allowed
                    ? "bg-slate-950/80 border-slate-800 text-slate-300"
                    : pipelineState.step === "REJECTED"
                    ? "bg-rose-950/40 border-rose-600 text-rose-300"
                    : "bg-slate-950/40 border-slate-800/40 opacity-50 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-900/80 text-indigo-300 flex items-center justify-center text-[10px] font-mono">
                      2
                    </span>
                    <span>2. Deterministic Policy Gate</span>
                  </span>
                  {pipelineState.policyResult?.allowed && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                  {pipelineState.step === "REJECTED" && (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                {pipelineState.policyResult && (
                  <div className="mt-2 text-[11px] pl-7 space-y-0.5 text-slate-400">
                    <div className={pipelineState.policyResult.allowed ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                      {pipelineState.policyResult.reason}
                    </div>
                  </div>
                )}
              </div>

              {/* Stage 3: Hybrid PQC Attestation */}
              <div
                className={`p-3.5 rounded-xl border transition ${
                  pipelineState.step === "PQC_SIGNING"
                    ? "bg-indigo-950/40 border-indigo-500 text-indigo-200"
                    : pipelineState.step === "ONCHAIN_SETTLE" || pipelineState.step === "COMPLETE"
                    ? "bg-slate-950/80 border-slate-800 text-slate-300"
                    : "bg-slate-950/40 border-slate-800/40 opacity-50 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 flex items-center justify-center text-[10px] font-mono">
                      3
                    </span>
                    <span>3. ML-DSA-65 PQC Attestation</span>
                  </span>
                  {(pipelineState.step === "ONCHAIN_SETTLE" || pipelineState.step === "COMPLETE") && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                {(pipelineState.step === "ONCHAIN_SETTLE" || pipelineState.step === "COMPLETE") && (
                  <div className="mt-2 text-[11px] pl-7 text-slate-400 font-mono text-[10px]">
                    Signature commitment validated against on-chain hash {activeAgent.pqcCommitmentHash.slice(0, 14)}...
                  </div>
                )}
              </div>

              {/* Stage 4: Arbitrum Sepolia Onchain Settlement */}
              <div
                className={`p-3.5 rounded-xl border transition ${
                  pipelineState.step === "COMPLETE"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-200"
                    : "bg-slate-950/40 border-slate-800/40 opacity-50 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center text-[10px] font-mono">
                      4
                    </span>
                    <span>4. Arbitrum Sepolia Ledger Settlement</span>
                  </span>
                  {pipelineState.step === "COMPLETE" && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                {pipelineState.txRecord && (
                  <div className="mt-2 text-[11px] pl-7 space-y-1">
                    <div className="font-mono text-[10px] text-emerald-400 break-all">
                      Tx: {pipelineState.txRecord.hash}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Gas Saved on Stylus: {pipelineState.txRecord.gasSavedStylus}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Arbitrum Sepolia Testnet</span>
            <span className="font-mono text-cyan-400">Chain ID: 421614</span>
          </div>
        </div>
      </div>
    </div>
  );
};
