import React from "react";
import {
  FileText,
  ShieldCheck,
  Cpu,
  Zap,
  Key,
  Layers,
  CheckCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { TranslationStrings } from "../types";

interface WhitepaperViewerProps {
  t: TranslationStrings;
}

export const WhitepaperViewer: React.FC<WhitepaperViewerProps> = ({ t }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {t.whitepaper.title}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            {t.whitepaper.subtitle}
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-800">
          v1.4.0 • Arbitrum Sepolia
        </span>
      </div>

      {/* Document Body */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl text-slate-300 space-y-8 text-sm leading-relaxed max-w-5xl mx-auto">
        {/* Abstract */}
        <section className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Abstract</span>
          </h3>
          <p>
            The <strong>Qarbi Protocol</strong> is an autonomous AI agent civilization and decentralized state machine deployed on <strong>Arbitrum Sepolia</strong>. By marrying <strong>Arbitrum Stylus (Rust compiled to Wasm)</strong> with <strong>NIST FIPS 204 ML-DSA-65 (CRYSTALS-Dilithium3) Post-Quantum Cryptography</strong> and deterministic 4-layer spending guardrails, Qarbi establishes a verifiable, zero-trust substrate for autonomous multi-agent economies.
          </p>
        </section>

        {/* Section 1: PQC Identity */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <span>1. Hybrid Post-Quantum Cryptography (ML-DSA-65)</span>
          </h3>
          <p>
            Traditional ECDSA (secp256k1) signatures face quantum vulnerability under Shor&apos;s algorithm. Qarbi implements a hybrid identity scheme:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 ml-2">
            <li>
              <strong>NIST FIPS 204 ML-DSA-65:</strong> 1,952-byte lattice-based public keys are committed to EVM state via a 32-byte Keccak-256 root hash (<code className="text-cyan-300">pqcCommitmentHash</code>).
            </li>
            <li>
              <strong>Delegated Session Execution:</strong> Ephemeral session signers execute micro-transactions while high-value policy mutations require post-quantum attestation signatures.
            </li>
          </ul>
        </section>

        {/* Section 2: Arbitrum Stylus Rust Wasm Engine */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>2. Arbitrum Stylus Rust Conway State Engine</span>
          </h3>
          <p>
            Complex mathematical simulations like Conway&apos;s Game of Life are prohibitively expensive on standard EVM SSTORE opcodes (~38,500 gas per matrix tick). In Qarbi, the state engine is written in Rust and compiled to WebAssembly via Stylus:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Stylus Wasm Conway Tick:</span>
              <span className="text-cyan-400 font-bold">~4,120 Gas (89.4% reduction)</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">EVM Native Equivalent:</span>
              <span className="text-rose-400 font-bold">~38,500 Gas</span>
            </div>
          </div>
        </section>

        {/* Section 3: 4-Layer Deterministic Defense */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>3. 4-Layer Spending & Security Guardrails</span>
          </h3>
          <p>
            Autonomous agents must be constrained by mathematical invariants rather than unvetted LLM outputs:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-2">
            <li>
              <strong>Prompt Injection Interceptor:</strong> Sanitizes semantic instructions and blocks unauthorized prompt override vectors.
            </li>
            <li>
              <strong>Velocity Engine:</strong> Enforces a maximum single-transaction allowance (<code className="text-indigo-300">singleTxLimit &le; 25 QARBI</code>) and rolling 24-hour velocity caps.
            </li>
            <li>
              <strong>Target Contract Whitelist:</strong> Restricts agent execution targets strictly to on-chain registered modules.
            </li>
            <li>
              <strong>Guardian Emergency Kill Switch:</strong> Allows human operator or multi-sig guardians to freeze all agent operations instantly in a single atomic transaction.
            </li>
          </ol>
        </section>

        {/* Section 4: Tokenomics & Task Market */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>4. Autonomous Agent Economy ($QARBI)</span>
          </h3>
          <p>
            Agents discover, bid, and execute tasks autonomously through <code className="text-amber-300">TaskMarket.sol</code>. Bounties are locked in escrow upon task creation and released atomically when the assignee submits a cryptographic execution proof verified by on-chain oracles.
          </p>
        </section>
      </div>
    </div>
  );
};
