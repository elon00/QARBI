import React, { useState } from "react";
import {
  Layers,
  PlusCircle,
  CheckCircle,
  Clock,
  Coins,
  ArrowRight,
  Shield,
  Search,
  ExternalLink,
  Zap,
  Lock,
} from "lucide-react";
import { TaskItem, Agent, TranslationStrings, TransactionRecord } from "../types";
import { generateOperationId } from "../lib/crypto";

interface TaskMarketplaceProps {
  tasks: TaskItem[];
  agents: Agent[];
  onAddTask: (task: TaskItem, txRecord: TransactionRecord) => void;
  onUpdateTask: (task: TaskItem, txRecord: TransactionRecord) => void;
  t: TranslationStrings;
}

export const TaskMarketplace: React.FC<TaskMarketplaceProps> = ({
  tasks,
  agents,
  onAddTask,
  onUpdateTask,
  t,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"RESEARCH" | "SECURITY" | "DEFI" | "VALIDATION" | "GENERAL">("RESEARCH");
  const [rewardQarbi, setRewardQarbi] = useState(15);
  const [creatorAgentId, setCreatorAgentId] = useState<number>(agents[0]?.id || 1);

  const totalEscrow = tasks.reduce((sum, t) => sum + (t.status !== "COMPLETED" ? t.rewardQarbi : 0), 0);
  const openCount = tasks.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED" || t.status === "VERIFIED").length;

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory === "ALL") return true;
    return task.category === selectedCategory;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const txHash = generateOperationId();
    const newTask: TaskItem = {
      id: `TASK-${Math.floor(Math.random() * 9000) + 1000}`,
      title: title.trim(),
      description: description.trim(),
      category,
      creatorAgentId,
      rewardQarbi,
      status: "OPEN",
      txHash,
      gasUsed: 4210,
      createdAt: Date.now(),
    };

    const creator = agents.find((a) => a.id === creatorAgentId) || agents[0];
    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: 18492200 + tasks.length,
      from: creator.walletAddress,
      to: "0x5FbDB2315678afecb367f032d93F642f64180aa3 (TaskMarket.sol)",
      type: "TASK_ESCROW",
      value: `${rewardQarbi}.0 QARBI`,
      status: "CONFIRMED",
      timestamp: Date.now(),
      gasUsed: 4210,
      gasSavedStylus: "89.4% vs EVM",
      dataSummary: `createTask(${newTask.id}, Bounty: ${rewardQarbi} QARBI locked in Escrow)`,
    };

    onAddTask(newTask, txRecord);
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const handleClaimTask = (task: TaskItem, executorAgentId: number) => {
    const txHash = generateOperationId();
    const updatedTask: TaskItem = {
      ...task,
      assigneeAgentId: executorAgentId,
      status: "IN_PROGRESS",
    };

    const executor = agents.find((a) => a.id === executorAgentId) || agents[0];
    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: 18492220 + tasks.length,
      from: executor.walletAddress,
      to: "0x5FbDB2315678afecb367f032d93F642f64180aa3 (TaskMarket.sol)",
      type: "TASK_ESCROW",
      value: "0.0 ETH",
      status: "CONFIRMED",
      timestamp: Date.now(),
      gasUsed: 3100,
      gasSavedStylus: "92.0% vs EVM",
      dataSummary: `acceptTask(${task.id}) assigned to ${executor.name}`,
    };

    onUpdateTask(updatedTask, txRecord);
  };

  const handleSubmitProof = (task: TaskItem) => {
    const txHash = generateOperationId();
    const proofHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const updatedTask: TaskItem = {
      ...task,
      status: "COMPLETED",
      proofHash,
      completedAt: Date.now(),
    };

    const executor = agents.find((a) => a.id === task.assigneeAgentId) || agents[0];
    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: 18492250 + tasks.length,
      from: "0x5FbDB2315678afecb367f032d93F642f64180aa3 (TaskMarket.sol)",
      to: executor.walletAddress,
      type: "REWARD_PAYOUT",
      value: `${task.rewardQarbi}.0 QARBI`,
      status: "CONFIRMED",
      timestamp: Date.now(),
      gasUsed: 4900,
      gasSavedStylus: "88.5% vs EVM",
      dataSummary: `settleTask(${task.id}) - Bounty ${task.rewardQarbi} QARBI transferred to ${executor.name}. Proof: ${proofHash.slice(0, 10)}...`,
    };

    onUpdateTask(updatedTask, txRecord);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {t?.tasks?.title || "Agent Economy & Task Market"}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            {t?.tasks?.subtitle || "Decentralized task delegation with $QARBI escrows."}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 block">Total Escrow Locked</span>
            <span className="font-mono text-base font-bold text-amber-400">
              {totalEscrow} $QARBI
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-950/30 transition cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>{t?.tasks?.createTaskBtn || "Create Task"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          {["ALL", "RESEARCH", "SECURITY", "DEFI", "VALIDATION"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white font-semibold shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-emerald-400 font-semibold">{openCount} Available</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-semibold">{inProgressCount} In Execution</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-semibold">{completedCount} Settled</span>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks?.filter(Boolean)?.map((task) => {
          const creator = agents.find((a) => a.id === task?.creatorAgentId) || agents[0];
          const assignee = agents.find((a) => a.id === task?.assigneeAgentId);
          const isCompleted = task?.status === "COMPLETED" || task?.status === "VERIFIED";
          const isInProgress = task?.status === "IN_PROGRESS";
          const isOpen = task?.status === "OPEN";

          return (
            <div
              key={task?.id || Math.random()}
              className={`p-5 rounded-2xl border transition shadow-lg flex flex-col justify-between ${
                isCompleted
                  ? "bg-slate-900/60 border-slate-800"
                  : isInProgress
                  ? "bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-800/40"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                      {task?.id || "TASK"}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {task?.title || "Autonomous Task"}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm font-bold text-amber-400 flex items-center space-x-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{task?.rewardQarbi || 0} QARBI</span>
                    </span>
                    <span
                      className={`mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                          : isInProgress
                          ? "bg-amber-950 text-amber-300 border-amber-700 animate-pulse"
                          : "bg-cyan-950 text-cyan-300 border-cyan-700"
                      }`}
                    >
                      {task?.status || "OPEN"}
                    </span>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  {task?.description || ""}
                </p>

                {/* Creator and Assignee Bar */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">{t?.tasks?.creator || "Creator"}:</span>
                    <span className="text-cyan-300 font-medium">{creator?.name || "Citizen Agent"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{t?.tasks?.assignee || "Assignee"}:</span>
                    <span className="text-slate-200 font-medium">
                      {assignee ? assignee.name : "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Proof Hash if Completed */}
                {task?.proofHash && (
                  <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">Proof: {task.proofHash}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {task?.completedAt
                    ? `Settled ${new Date(task.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : `Posted ${new Date(task?.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                </span>

                <div className="flex items-center space-x-2">
                  {isOpen && (
                    <button
                      type="button"
                      onClick={() => handleClaimTask(task, agents[1]?.id || agents[0]?.id || 1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition cursor-pointer flex items-center space-x-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{t?.tasks?.acceptTaskBtn || "Accept Task"}</span>
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => handleSubmitProof(task)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{t?.tasks?.submitProofBtn || "Submit Proof"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span>Create Escrowed On-Chain Task</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cross-DEX Slippage Audit & Proof Submission"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="RESEARCH">Research</option>
                    <option value="SECURITY">Security Audit</option>
                    <option value="DEFI">DeFi Arbitrage</option>
                    <option value="VALIDATION">PQC Validation</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Issuer Agent
                  </label>
                  <select
                    value={creatorAgentId}
                    onChange={(e) => setCreatorAgentId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Task Description & Requirements
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify verification steps and mathematical proof requirements..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Escrow Bounty Bounty ($QARBI)</span>
                  <span className="font-mono text-amber-300 font-semibold">{rewardQarbi} QARBI</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={rewardQarbi}
                  onChange={(e) => setRewardQarbi(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Escrow Lock Guarantee</span>
                </div>
                <span>
                  {rewardQarbi} $QARBI will be locked in <code>TaskMarket.sol</code> on Arbitrum Sepolia until valid proof submission.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold shadow-lg"
                >
                  Deploy Task Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
