import React, { useState, useEffect } from "react";
import {
  Zap,
  Copy,
  CheckCircle,
  ExternalLink,
  Activity,
  Send,
  Layers,
  Sparkles,
  Server,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Globe,
  Radio,
} from "lucide-react";
import {
  QUICKNODE_SUPPORTED_CHAINS,
  QUICKNODE_CREDITS_COUPON,
  QUICKNODE_TELEGRAM_SUPPORT,
  QUICKNODE_PRICING_URL,
  measureRpcLatency,
  ChainConfig,
} from "../lib/quicknode";
import { getActiveRpcUrl, setActiveRpcUrl } from "../lib/web3";

interface QuickNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNetwork?: (chain: ChainConfig) => void;
}

export const QuickNodeModal: React.FC<QuickNodeModalProps> = ({
  isOpen,
  onClose,
  onSelectNetwork,
}) => {
  const [selectedChainKey, setSelectedChainKey] = useState<string>("arbitrum-sepolia");
  const [customRpcUrl, setCustomRpcUrl] = useState<string>("");
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);
  const [copiedFilter, setCopiedFilter] = useState<boolean>(false);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [qnLatency, setQnLatency] = useState<{ latencyMs: number; ok: boolean; blockNumber?: number | null } | null>(null);
  const [publicLatency, setPublicLatency] = useState<{ latencyMs: number; ok: boolean; blockNumber?: number | null } | null>(null);
  const [streamEvents, setStreamEvents] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"credits" | "rpc" | "streams">("credits");
  const [isAutoConfiguring, setIsAutoConfiguring] = useState<boolean>(false);
  const [autoConfigSuccess, setAutoConfigSuccess] = useState<string | null>(null);

  const handle1ClickRedeem = () => {
    navigator.clipboard.writeText(QUICKNODE_CREDITS_COUPON);
    setCopiedCoupon(true);
    window.open(`https://www.quicknode.com/pricing?coupon=${QUICKNODE_CREDITS_COUPON}&cycle=monthly`, "_blank");
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const handle1ClickAutoConfigure = async () => {
    setIsAutoConfiguring(true);
    setAutoConfigSuccess(null);
    try {
      const res = await fetch("/api/quicknode/auto-configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rpcUrl: customRpcUrl.trim() || currentChain.publicRpc,
          chainName: currentChain.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveRpcUrl(data.config.rpcUrl);
        setCustomRpcUrl(data.config.rpcUrl);
        setAutoConfigSuccess(`QuickNode successfully connected! ${data.config.latencyMs}ms latency · Block #${data.config.blockNumber} · .env updated.`);
        await fetchStreamEvents();
      } else {
        alert(data.error || "Failed to auto-configure QuickNode");
      }
    } catch (e: any) {
      alert("Auto-configuration error: " + (e.message || "Failed"));
    } finally {
      setIsAutoConfiguring(false);
    }
  };

  const currentChain = QUICKNODE_SUPPORTED_CHAINS[selectedChainKey] || QUICKNODE_SUPPORTED_CHAINS["arbitrum-sepolia"];

  useEffect(() => {
    if (isOpen) {
      setCustomRpcUrl(getActiveRpcUrl());
      fetchStreamEvents();
    }
  }, [isOpen]);

  const fetchStreamEvents = async () => {
    try {
      const res = await fetch("/api/quicknode/streams-events");
      if (res.ok) {
        const data = await res.json();
        setStreamEvents(data.events || []);
      }
    } catch {
      // Backend polling fallback
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(QUICKNODE_CREDITS_COUPON);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleCopyFilter = () => {
    const filterSnippet = `// QuickNode Streams Filter for QARBI Protocol
function main(stream) {
  const data = stream.data || stream;
  const blocks = Array.isArray(data) ? data : [data];
  const qContracts = ["0xa513e6e4b8f2a923d98304ec87f64353c4d5c853","0x89d227316719b407137ffee47a50c83602525150","0x5fbdb2315678afecb367f032d93f642f64180aa3","0x3648bfd0d046a9f8ff4579f2188ae15d48074dc8","0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7"];
  const matches = [];
  for (const b of blocks) {
    for (const r of (b.receipts || [])) {
      for (const log of (r.logs || [])) {
        if (qContracts.includes((log.address || '').toLowerCase())) {
          matches.push({ tx: r.transactionHash, contract: log.address, block: b.number, topics: log.topics });
        }
      }
    }
  }
  return matches.length ? { events: matches } : null;
}`;
    navigator.clipboard.writeText(filterSnippet);
    setCopiedFilter(true);
    setTimeout(() => setCopiedFilter(false), 2500);
  };

  const handleSaveRpc = () => {
    if (customRpcUrl) {
      setActiveRpcUrl(customRpcUrl.trim());
      alert(`Active RPC endpoint updated to: ${customRpcUrl.trim()}`);
    } else {
      setActiveRpcUrl("");
      alert("Reset to default public RPC endpoint.");
    }
  };

  const handleRunBenchmark = async () => {
    setIsBenchmarking(true);
    const targetRpc = customRpcUrl && customRpcUrl.startsWith("http") ? customRpcUrl : currentChain.publicRpc;
    
    // Benchmark active RPC
    const targetResult = await measureRpcLatency(targetRpc);
    setQnLatency(targetResult);

    // Benchmark public standard RPC for comparison
    const pubResult = await measureRpcLatency(currentChain.publicRpc);
    setPublicLatency(pubResult);

    setIsBenchmarking(false);
  };

  const handleSimulateStreamEvent = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/quicknode/simulate-stream-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "TASK_CREATED",
          customDetails: {
            title: "QuickNode Stream Agent Bounty Claim",
            reward: "40 QARBI",
            network: currentChain.name,
            speedup: "Sub-second webhook delivery",
          },
        }),
      });
      if (res.ok) {
        await fetchStreamEvents();
      }
    } catch (e) {
      console.error("Failed to simulate stream event:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-950/50">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  QuickNode ⚡ Arbitrum Open House Singapore
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Buildathon Partner
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Low-latency endpoints, full archive, and Streams event pipelines for QARBI on Arbitrum One, Nova & Orbit chains.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("credits")}
            className={`pb-3 px-4 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === "credits"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Credits & Redeem Voucher</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rpc")}
            className={`pb-3 px-4 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === "rpc"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Multi-Chain RPC & Latency</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("streams")}
            className={`pb-3 px-4 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === "streams"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Streams Event Pipeline</span>
          </button>
        </div>

        {/* TAB 1: CREDITS & REDEEM VOUCHER */}
        {activeTab === "credits" && (
          <div className="space-y-5 animate-fade-in">
            {/* 1-Click QuickNode Automation Master Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-900/60 via-slate-900 to-emerald-900/40 border-2 border-cyan-400/60 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wide">
                      Single-Click Automation
                    </span>
                    <span className="text-xs font-bold text-cyan-300">
                      Zero Manual Config
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white">
                    1-Click Redeem & Connect QuickNode to QARBI
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Redeem coupon <code className="text-amber-300 font-mono font-bold">ARBOHSGP</code>, open checkout, and auto-inject high-speed QuickNode RPC and Streams into your running project with zero manual setup.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={handle1ClickRedeem}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 transition active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{copiedCoupon ? "✓ Coupon Copied & Opening..." : "1-Click Redeem ARBOHSGP"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handle1ClickAutoConfigure}
                    disabled={isAutoConfiguring}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-cyan-950/40 transition active:scale-95 flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Zap className={`w-4 h-4 ${isAutoConfiguring ? "animate-spin" : "text-cyan-200"}`} />
                    <span>{isAutoConfiguring ? "Configuring Project..." : "1-Click Apply to Project"}</span>
                  </button>
                </div>
              </div>

              {autoConfigSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/70 text-emerald-200 text-xs flex items-center space-x-2 animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{autoConfigSuccess}</span>
                </div>
              )}

              {/* CLI Command Shortcut */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Terminal Alternative (CLI 1-Click Automation):</span>
                </span>
                <div className="flex items-center space-x-2">
                  <code className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                    npm run quicknode:setup
                  </code>
                </div>
              </div>
            </div>

            {/* Promo Voucher Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Exclusive Singapore Builder Grant
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      3 Months Free
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Free QuickNode Build Plan ($147 Total Value)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Covers the entire Open House Singapore Buildathon and gives you 2 extra months to scale and ship production AI agents on Arbitrum!
                  </p>
                </div>

                <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-2xl border border-slate-700">
                  <div className="px-4 py-2 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coupon Code</div>
                    <div className="font-mono text-lg font-black text-amber-400 tracking-wider">
                      {QUICKNODE_CREDITS_COUPON}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    {copiedCoupon ? <CheckCircle className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCoupon ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Redemption Instructions Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold font-mono">Step 1</span>
                  <p className="text-slate-300">Open QuickNode dashboard & navigate to <strong>Usage & Billing</strong>.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold font-mono">Step 2</span>
                  <p className="text-slate-300">Select the <strong>Build Plan</strong> on the pricing page.</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                  <span className="text-amber-400 font-bold font-mono">Step 3 (Critical)</span>
                  <p className="text-amber-200">Choose <strong>Monthly</strong> billing (coupon will not apply to annual).</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold font-mono">Step 4</span>
                  <p className="text-slate-300">Enter <code className="text-amber-300 font-mono">ARBOHSGP</code> at checkout before entering card.</p>
                </div>
              </div>
            </div>

            {/* Quick Links & Telegram Builder Support */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={QUICKNODE_PRICING_URL}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-400">QuickNode Pricing</div>
                  <div className="text-[11px] text-slate-400">Select Build Plan</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </a>

              <a
                href="https://t.me/sensahill"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-400">Telegram Builder Support</div>
                  <div className="text-[11px] text-slate-400">Chat with {QUICKNODE_TELEGRAM_SUPPORT}</div>
                </div>
                <Send className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </a>

              <a
                href="https://status.quicknode.com"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400">Platform Status</div>
                  <div className="text-[11px] text-slate-400">SOC 2 Type 2 & ISO 27001</div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-CHAIN RPC & LATENCY */}
        {activeTab === "rpc" && (
          <div className="space-y-5 animate-fade-in">
            {/* Supported Networks Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Arbitrum Track / Orbit Chain:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.values(QUICKNODE_SUPPORTED_CHAINS).map((chain) => {
                  const isSelected = selectedChainKey === chain.id;
                  return (
                    <button
                      key={chain.id}
                      type="button"
                      onClick={() => {
                        setSelectedChainKey(chain.id);
                        if (onSelectNetwork) onSelectNetwork(chain);
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-950/40"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-[10px] font-bold text-cyan-400">{chain.trackName}</div>
                      <div className="text-xs font-bold mt-1 text-slate-200 truncate">{chain.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">ID: {chain.chainId}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chain Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{currentChain.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
                      Chain ID: {currentChain.chainId}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{currentChain.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {currentChain.faucetUrl && (
                    <a
                      href={currentChain.faucetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center space-x-1 transition"
                    >
                      <span>⚡ QuickNode Faucet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <a
                    href={currentChain.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    <span>RPC Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Endpoint Input */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-semibold text-slate-400">
                  QuickNode Custom RPC URL (Arbitrum Sepolia / One / Orbit):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customRpcUrl}
                    onChange={(e) => setCustomRpcUrl(e.target.value)}
                    placeholder={currentChain.defaultQuicknodeTemplate}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleSaveRpc}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                  >
                    Save RPC
                  </button>
                  <button
                    type="button"
                    onClick={handleRunBenchmark}
                    disabled={isBenchmarking}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Activity className={`w-3.5 h-3.5 ${isBenchmarking ? "animate-spin" : ""}`} />
                    <span>Test Latency</span>
                  </button>
                </div>
              </div>

              {/* Latency Comparison Benchmark */}
              {(qnLatency || publicLatency) && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Endpoint Latency</div>
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-xl font-bold font-mono ${qnLatency?.ok ? "text-emerald-400" : "text-rose-400"}`}>
                        {qnLatency?.ok ? `${qnLatency.latencyMs} ms` : "Failed"}
                      </span>
                      {qnLatency?.blockNumber && (
                        <span className="text-[10px] text-slate-500 font-mono">Block #{qnLatency.blockNumber}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      {qnLatency?.latencyMs && qnLatency.latencyMs < 150 ? "⚡ Low Latency Tuned" : "Standard Connection"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Public Fallback RPC</div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-bold font-mono text-slate-300">
                        {publicLatency?.ok ? `${publicLatency.latencyMs} ms` : "Timeout"}
                      </span>
                      {publicLatency?.blockNumber && (
                        <span className="text-[10px] text-slate-500 font-mono">Block #{publicLatency.blockNumber}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">Shared rate-limited baseline</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STREAMS EVENT PIPELINE */}
        {activeTab === "streams" && (
          <div className="space-y-5 animate-fade-in">
            {/* Streams Explanation */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>QuickNode Streams Real-Time Event Pipeline</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Filter QARBI smart contract events, escrow bounties, Conway grid transitions, and x402 payments with custom JS on QuickNode and push directly to our webhook!
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyFilter}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    {copiedFilter ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFilter ? "Filter Copied!" : "Copy Stream Filter JS"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateStreamEvent}
                    disabled={isSimulating}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                    <span>Simulate Event</span>
                  </button>
                </div>
              </div>

              {/* Webhook Endpoint Info */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-slate-400">Webhook Destination:</span>
                  <span className="text-emerald-400">POST /api/webhooks/quicknode-stream</span>
                </div>
                <span className="text-[11px] text-slate-500">HMAC Signature Verification Enabled</span>
              </div>
            </div>

            {/* Live Events Stream Monitor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live Ingested Stream Events ({streamEvents.length})</span>
                </span>
                <button
                  type="button"
                  onClick={fetchStreamEvents}
                  className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-2 font-mono text-xs">
                {streamEvents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Radio className="w-8 h-8 mx-auto text-slate-700 mb-2" />
                    <p>No stream events received yet.</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Click "Simulate Event" above or deploy transactions on Arbitrum Sepolia to test the pipeline.
                    </p>
                  </div>
                ) : (
                  streamEvents.map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2 text-[11px]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                            {evt.eventType}
                          </span>
                          <span className="text-slate-400">Block #{evt.blockNumber}</span>
                          <span className="text-slate-500 font-mono">{evt.txHash?.slice(0, 10)}...</span>
                        </div>
                        <div className="text-slate-300 text-[10px]">
                          {typeof evt.details === "object" ? JSON.stringify(evt.details) : evt.details}
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 whitespace-nowrap">
                        Instant Push
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>QuickNode Singapore Buildathon Integration Ready</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
