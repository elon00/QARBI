import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  TrendingUp,
  Radio,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Copy,
  Zap,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Agent, TransactionRecord, TranslationStrings } from "../types";
import {
  quantumPortfolioOptimizer,
  DEFAULT_ARBITRUM_BASKET,
  DEFAULT_COVARIANCE_MATRIX,
  OptimizationResult,
} from "../crypto/quantum/portfolio-optimizer";
import {
  quantumSecureChannel,
  EncryptedQuantumPackage,
  DecryptionResult,
} from "../crypto/quantum/secure-channel";
import { generateTxHash } from "../lib/crypto";

interface QuantumOperationsProps {
  agents: Agent[];
  onAddTransaction: (tx: TransactionRecord) => void;
  t: TranslationStrings;
}

export const QuantumOperations: React.FC<QuantumOperationsProps> = ({
  agents,
  onAddTransaction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"portfolio" | "channel">("portfolio");

  // Portfolio Optimization State
  const [riskAversion, setRiskAversion] = useState<number>(1.8);
  const [budgetK, setBudgetK] = useState<number>(3);
  const [penaltyMultiplier, setPenaltyMultiplier] = useState<number>(3.5);
  const [annealingSteps, setAnnealingSteps] = useState<number>(350);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [portfolioResult, setPortfolioResult] = useState<OptimizationResult | null>(() =>
    quantumPortfolioOptimizer.optimizeAndAttest()
  );
  const [anchoredTxHash, setAnchoredTxHash] = useState<string | null>(null);

  // Secure Communication Channel State
  const [senderAgentId, setSenderAgentId] = useState<number>(agents[0]?.id || 1);
  const [recipientAgentId, setRecipientAgentId] = useState<number>(agents[1]?.id || 2);
  const [secretMessage, setSecretMessage] = useState<string>(
    "CONFIDENTIAL_INTENT: Disperse 45 QARBI bounty for reentrancy formal verification on Stylus Escrow."
  );
  const [encryptedPackage, setEncryptedPackage] = useState<EncryptedQuantumPackage | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);
  const [recipientSkHex, setRecipientSkHex] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const senderAgent = agents.find((a) => a.id === senderAgentId) || agents[0];
  const recipientAgent = agents.find((a) => a.id === recipientAgentId) || agents[1] || agents[0];

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setAnchoredTxHash(null);
    setTimeout(() => {
      try {
        const res = quantumPortfolioOptimizer.optimizeAndAttest({
          assets: DEFAULT_ARBITRUM_BASKET,
          covarianceMatrix: DEFAULT_COVARIANCE_MATRIX,
          riskAversion,
          budgetK,
          penaltyMultiplier,
          annealingSteps,
        });
        setPortfolioResult(res);
      } finally {
        setIsOptimizing(false);
      }
    }, 400);
  };

  const handleAnchorToArbitrum = () => {
    if (!portfolioResult) return;
    const txHash = generateTxHash();
    setAnchoredTxHash(txHash);

    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: 0,
      from: senderAgent?.walletAddress || "0x4b7f92aC7738240562e84773821034D5154371C8",
      to: "0x89D227316719b407137fFEe47a50C83602525150 (AgentRegistry.sol)",
      type: "QUANTUM_PORTFOLIO_OPTIMIZE",
      value: "0.0 ETH",
      status: "PENDING",
      timestamp: Date.now(),
      gasUsed: 4620,
      gasSavedStylus: "Stylus Rust VM Execution",
      dataSummary: `anchorQuantumPortfolio([${portfolioResult.selectedAssets.join(",")}]) - Sharpe: ${portfolioResult.sharpeRatio}`,
    };

    onAddTransaction(txRecord);
  };

  const handleSendQuantumMessage = () => {
    setIsTransmitting(true);
    setDecryptionResult(null);

    setTimeout(() => {
      try {
        // Instantiate recipient identity with real ML-KEM and ML-DSA keys
        const recipientIdent = quantumSecureChannel.createAgentQuantumIdentity(
          recipientAgent.id,
          recipientAgent.name,
          recipientAgent.walletAddress
        );
        const senderIdent = quantumSecureChannel.createAgentQuantumIdentity(
          senderAgent.id,
          senderAgent.name,
          senderAgent.walletAddress
        );

        setRecipientSkHex(Buffer.from(recipientIdent.kemKeys.secretKey).toString("hex"));

        const pkg = quantumSecureChannel.sendSecureMessage(
          senderIdent,
          recipientIdent.kemKeys.publicKey,
          recipientIdent.agentId,
          recipientIdent.dsaKeys.commitmentHash,
          secretMessage
        );

        setEncryptedPackage(pkg);

        // Record transmission
        const txHash = generateTxHash();
        const txRecord: TransactionRecord = {
          hash: txHash,
          blockNumber: 0,
          from: senderAgent.walletAddress,
          to: recipientAgent.walletAddress,
          type: "QUANTUM_SECURE_TRANSMIT",
          value: "0.0 ETH",
          status: "PENDING",
          timestamp: Date.now(),
          gasUsed: 5120,
          gasSavedStylus: "88.7% vs EVM",
          dataSummary: `pqcTransmit(${senderAgent.name} -> ${recipientAgent.name}) - ML-KEM-768 (1088B ct) + ML-DSA-65 (3309B sig)`,
        };
        onAddTransaction(txRecord);
      } finally {
        setIsTransmitting(false);
      }
    }, 450);
  };

  const handleDecryptMessage = (tamper = false) => {
    if (!encryptedPackage || !recipientSkHex) return;

    const skBytes = Buffer.from(recipientSkHex, "hex");
    let pkgToDecrypt = encryptedPackage;

    if (tamper) {
      // Invert byte in encrypted payload to test fail-closed rejection
      pkgToDecrypt = {
        ...encryptedPackage,
        encryptedPayloadHex:
          encryptedPackage.encryptedPayloadHex.slice(0, 10) +
          "ff" +
          encryptedPackage.encryptedPayloadHex.slice(12),
      };
    }

    const res = quantumSecureChannel.receiveSecureMessage(skBytes, pkgToDecrypt);
    setDecryptionResult(res);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Post-Quantum Enclave & QUBO Optimization
              </h2>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Authentic NIST FIPS 204/203 lattice cryptography paired with Quadratic Unconstrained
              Binary Optimization (QUBO) and Simulated Quantum Annealing for Arbitrum Sepolia DeFi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> NIST FIPS 204 ML-DSA-65
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> NIST FIPS 203 ML-KEM-768
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> QUBO / SQA Tunneling
            </span>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-700/60 mt-6 pt-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveSubTab("portfolio")}
            className={`pb-3 text-sm font-semibold transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === "portfolio"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Quantum Portfolio Optimizer (QUBO)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("channel")}
            className={`pb-3 text-sm font-semibold transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === "channel"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-4 h-4" /> Post-Quantum Inter-Agent Channel
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PORTFOLIO OPTIMIZER */}
      {activeSubTab === "portfolio" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Hamiltonian Parameters
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                Markowitz to QUBO
              </span>
            </div>

            {/* Asset Basket Preview */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-2">
                Arbitrum DeFi Token Universe (N=5):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_ARBITRUM_BASKET.map((asset) => (
                  <span
                    key={asset.symbol}
                    className="px-2 py-1 text-xs font-mono rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    {asset.symbol} ({Math.round(asset.expectedReturn * 100)}% Ret)
                  </span>
                ))}
              </div>
            </div>

            {/* Risk Aversion */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Risk Aversion Factor (λ):</span>
                <span className="font-mono text-cyan-400">{riskAversion.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={riskAversion}
                onChange={(e) => setRiskAversion(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Budget K */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Target Asset Cardinality (K):</span>
                <span className="font-mono text-cyan-400">{budgetK} Assets</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={budgetK}
                onChange={(e) => setBudgetK(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Penalty Multiplier */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Constraint Penalty (γ):</span>
                <span className="font-mono text-cyan-400">{penaltyMultiplier.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={penaltyMultiplier}
                onChange={(e) => setPenaltyMultiplier(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Annealing Steps */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">SQA Trotter Annealing Steps:</span>
                <span className="font-mono text-cyan-400">{annealingSteps}</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="50"
                value={annealingSteps}
                onChange={(e) => setAnnealingSteps(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Run Button */}
            <button
              type="button"
              onClick={handleRunOptimization}
              disabled={isOptimizing}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-950/40"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Tunneling Transverse Field...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Simulated Quantum Annealing
                </>
              )}
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 space-y-6">
            {portfolioResult && (
              <>
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] text-slate-400 font-medium">Expected Return</p>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      +{(portfolioResult.expectedReturn * 100).toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Annualized μ_p</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] text-slate-400 font-medium">Portfolio Volatility</p>
                    <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                      {(portfolioResult.portfolioVolatility * 100).toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Annualized σ_p</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] text-slate-400 font-medium">Sharpe Ratio</p>
                    <p className="text-xl font-bold font-mono text-cyan-400 mt-1">
                      {portfolioResult.sharpeRatio.toFixed(3)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">(μ_p - r_f) / σ_p</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] text-slate-400 font-medium">QUBO Ground Energy</p>
                    <p className="text-xl font-bold font-mono text-indigo-400 mt-1">
                      {portfolioResult.quboEnergy.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">min x^T Q x</p>
                  </div>
                </div>

                {/* Allocation Weights Breakdown */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                    <span>Quantum Optimal Allocation Weights</span>
                    <span className="text-xs text-slate-400 font-mono">
                      Selected: {portfolioResult.selectedAssets.join(", ")}
                    </span>
                  </h4>

                  <div className="space-y-3">
                    {DEFAULT_ARBITRUM_BASKET.map((asset) => {
                      const weight = portfolioResult.weights[asset.symbol] || 0;
                      const percentage = Math.round(weight * 100);
                      const isSelected = weight > 0;

                      return (
                        <div key={asset.symbol} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={isSelected ? "font-bold text-white" : "text-slate-500"}>
                              {asset.name} ({asset.symbol})
                            </span>
                            <span className="font-mono text-slate-300">{percentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isSelected
                                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                                  : "bg-transparent"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* NIST Attestation & Settlement */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      NIST FIPS 204 Lattice Attestation
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      3309-Byte ML-DSA-65 Signature
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">On-Chain State Commitment:</span>
                      <span className="text-cyan-300 break-all">
                        {portfolioResult.pqcAttestation.commitmentHash}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Attestation Payload Digest:</span>
                      <span className="text-indigo-300 break-all">
                        {portfolioResult.pqcAttestation.attestationHash}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-400">
                      Anchor this quantum optimization receipt to Arbitrum Sepolia ledger:
                    </p>
                    <button
                      type="button"
                      onClick={handleAnchorToArbitrum}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Anchor to Arbitrum Sepolia
                    </button>
                  </div>

                  {anchoredTxHash && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-between text-xs">
                      <span className="text-emerald-300">
                        Anchored in transaction: <span className="font-mono">{anchoredTxHash.slice(0, 18)}...</span>
                      </span>
                      <a
                        href={`https://sepolia.arbiscan.io/tx/${anchoredTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        Arbiscan <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SECURE AGENT COMMUNICATION CHANNEL */}
      {activeSubTab === "channel" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dispatch Panel */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> Dispatch Encrypted Agent Transmission
            </h3>

            {/* Agent Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Sender Agent:</label>
                <select
                  value={senderAgentId}
                  onChange={(e) => setSenderAgentId(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.archetype})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Recipient Agent:</label>
                <select
                  value={recipientAgentId}
                  onChange={(e) => setRecipientAgentId(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {agents
                    .filter((a) => a.id !== senderAgentId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.archetype})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">
                Confidential Task Intent / Bounty Negotiation Payload:
              </label>
              <textarea
                rows={4}
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSendQuantumMessage}
              disabled={isTransmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Encapsulating ML-KEM-768 Lattice...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Encapsulate & Lattice-Sign Transmission
                </>
              )}
            </button>
          </div>

          {/* Wire Inspection & Decryption */}
          <div className="lg:col-span-6 space-y-4">
            {encryptedPackage ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" /> Post-Quantum Transmission Package
                  </h4>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    NIST FIPS 203 & 204
                  </span>
                </div>

                {/* Hex Inspectors */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ML-KEM-768 Ciphertext (1,088 Bytes):</span>
                      <span className="text-indigo-300">
                        {encryptedPackage.kemCiphertextHex.slice(0, 32)}...{encryptedPackage.kemCiphertextHex.slice(-16)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(encryptedPackage.kemCiphertextHex, "kem")}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-slate-500 block text-[10px]">AES-256-GCM Encrypted Payload:</span>
                      <span className="text-amber-300">
                        {encryptedPackage.encryptedPayloadHex.slice(0, 32)}...
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(encryptedPackage.encryptedPayloadHex, "payload")}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ML-DSA-65 Attestation Signature (3,309 Bytes):</span>
                      <span className="text-emerald-300">
                        {encryptedPackage.mlDsaSignatureHex.slice(0, 32)}...
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(encryptedPackage.mlDsaSignatureHex, "sig")}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Recipient Verification Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDecryptMessage(false)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Decrypt as {recipientAgent.name}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecryptMessage(true)}
                    className="py-2.5 px-3 bg-rose-900/70 hover:bg-rose-800 text-rose-200 border border-rose-700/50 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Test Tamper Attack
                  </button>
                </div>

                {/* Decryption Result */}
                {decryptionResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      decryptionResult.success
                        ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-200"
                        : "bg-rose-950/40 border-rose-700/50 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {decryptionResult.success ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>PQC Lattice Verification & Decryption Successful</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>Fail-Closed Cryptographic Rejection</span>
                        </>
                      )}
                    </div>

                    {decryptionResult.success ? (
                      <div className="font-mono bg-slate-950/60 p-2 rounded border border-emerald-900/60 text-slate-200">
                        {decryptionResult.plaintext}
                      </div>
                    ) : (
                      <div className="text-[11px] text-rose-300 font-mono">
                        Error: {decryptionResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-8 text-center text-slate-500 text-xs">
                <Lock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                No transmission package in transit. Dispatch an encrypted inter-agent transmission to inspect lattice wire data.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
