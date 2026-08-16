import React, { useState } from "react";
import {
  Activity,
  CheckCircle,
  ExternalLink,
  Zap,
  Copy,
  Layers,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { TransactionRecord, TranslationStrings } from "../types";
import { VERIFIED_CONTRACTS } from "../data/initialState";

interface ArbitrumExplorerProps {
  transactions: TransactionRecord[];
  t: TranslationStrings;
  onOpenDeployer?: () => void;
}

export const ArbitrumExplorer: React.FC<ArbitrumExplorerProps> = ({
  transactions,
  t,
  onOpenDeployer,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {t?.explorer?.title || "Arbitrum Sepolia Explorer & Contracts"}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            {t?.explorer?.subtitle || "Inspect real-time verifiable transactions, contract bytecodes, and Stylus gas efficiency benchmarks."}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenDeployer && (
            <button
              type="button"
              onClick={onOpenDeployer}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <span>🚀 1-Click Deploy On-Chain</span>
            </button>
          )}

          <a
            href="https://sepolia.arbiscan.io"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
          >
            <span>{t?.explorer?.viewOnArbiscan || "View on Sepolia Arbiscan"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>


      {/* Gas Benchmark Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            {t?.explorer?.gasSavingsTitle || "Arbitrum Stylus Wasm vs Standard EVM Benchmarks"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-medium">Conway Cellular Evolution</div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-cyan-400 text-lg font-bold">4,120 Gas</span>
              <span className="text-rose-400 line-through font-mono">38,500 EVM</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: "89.4%" }} />
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">89.4% Gas Savings (Stylus Rust)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-medium">PQC Attestation Hash Proof</div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-cyan-400 text-lg font-bold">6,800 Gas</span>
              <span className="text-rose-400 line-through font-mono">52,000 EVM</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: "87.0%" }} />
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">87.0% Gas Savings (Stylus Rust)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-medium">Agent Escrow Settlement</div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-cyan-400 text-lg font-bold">4,900 Gas</span>
              <span className="text-rose-400 line-through font-mono">42,000 EVM</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: "88.3%" }} />
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">88.3% Gas Savings (Stylus Rust)</div>
          </div>
        </div>
      </div>

      {/* Verified Contracts Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{t?.explorer?.verifiedContracts || "Verified Protocol Contracts"}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">Contract Name</th>
                <th className="pb-3">Target Stack</th>
                <th className="pb-3">Arbitrum Sepolia Address</th>
                <th className="pb-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {VERIFIED_CONTRACTS.map((contract) => (
                <tr key={contract.address} className="hover:bg-slate-950/40">
                  <td className="py-3 font-semibold text-white flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{contract.name}</span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        contract.type.includes("Stylus")
                          ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {contract.type}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[11px]">
                    <div className="flex items-center space-x-1.5 text-cyan-300">
                      <span>{contract.address}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(contract.address, contract.name)}
                        className="text-slate-500 hover:text-white cursor-pointer"
                        title="Copy Address"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <a
                        href={`https://sepolia.arbiscan.io/address/${contract.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-200"
                        title="View on Arbiscan Sepolia"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {contract.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Live Transaction Ledger */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>{t?.explorer?.recentTxs || "Live On-Chain Transaction Stream"}</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Stream</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                      tx.type === "REWARD_PAYOUT"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : tx.type === "CONWAY_EVOLUTION"
                        ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                        : tx.type === "KILL_SWITCH"
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    }`}
                  >
                    {tx.type}
                  </span>
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-cyan-400 hover:text-cyan-200 font-semibold truncate max-w-[220px] flex items-center space-x-1"
                    title="View on Arbiscan"
                  >
                    <span>{tx.hash}</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </a>
                  <span className="text-slate-500 font-mono text-[10px]">

                    Block #{tx.blockNumber}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  {tx.dataSummary}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className="font-mono font-bold text-white">{tx.value}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{tx.gasSavedStylus}</div>
                </div>
                <span className="text-slate-500 text-[10px] font-mono whitespace-nowrap">
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
