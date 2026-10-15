# QARBI Protocol — Engineering Reconnaissance & Baseline Audit

**Document:** `docs/audit/BASELINE.md`  
**Standard:** QARBI Autonomous Engineering Handbook (v1.0), Chapter 2  
**Evaluation Date:** `2026-10-16`  
**Commit SHA:** [`f262285`](https://github.com/elon00/QARBI/commit/f262285)  
**Branch:** `main`  
**Repository:** [https://github.com/elon00/QARBI](https://github.com/elon00/QARBI)  
**Target Blockchain:** Arbitrum Sepolia Testnet (Chain ID: `421614`)  
**Production Target:** Arbitrum One (Chain ID: `42161`) — **STRICTLY LOCKED**

---

## 1. Executive Summary & Golden Laws

1. **Production Ready $\neq$ CI Green:** Although 4/4 GitHub Actions workflows are verified green on `main`, production readiness requires actual on-chain bytecode and independent security certification.
2. **Zero-Mock Policy:** Zero simulated or fabricated transaction receipts, bytecode claims, or audit approvals earn production credit.
3. **Fail-Closed Boundary:** Mainnet release remains strictly locked ($R = 0$) until all 12 Reality Gates achieve PASS status.

---

## 2. Environment & Toolchain Baseline

| Component | Specification | Verification Result |
| :--- | :--- | :--- |
| **Node.js Runtime** | Node v24.18.0 (LTS tested on 20.x, 22.x in CI) | 🟢 `VERIFIED` |
| **Package Manager** | npm v11.16.0 with locked `package-lock.json` | 🟢 `VERIFIED` |
| **Solidity Compiler** | `solc` 0.8.24 with `viaIR: true` optimization | 🟢 `VERIFIED` |
| **TypeScript** | `typescript` ~5.8.2 (`tsc --noEmit` 0 errors) | 🟢 `VERIFIED` |
| **Post-Quantum Crypto** | `@noble/post-quantum` v0.7.1 (NIST FIPS 204/203) | 🟢 `VERIFIED` |
| **Frontend Framework** | React 19.3.0 + Vite 6.2.3 + TailwindCSS | 🟢 `VERIFIED` |
| **Backend Server** | Express 4.21.2 + `express-rate-limit` (CodeQL compliant) | 🟢 `VERIFIED` |

---

## 3. Subsystem Audit & Reality Status

| Subsystem | Scope / Function | Reality Status | Verification Notes |
| :--- | :--- | :---: | :--- |
| **Build & CI Pipeline** | Workflows for build, typecheck, URS, CodeQL | 🟢 `VERIFIED` | 4/4 workflows green on `main` across Node 20.x & 22.x |
| **PQC Lattice Cryptography** | NIST FIPS 204 ML-DSA-65 & FIPS 203 ML-KEM-768 | 🟢 `VERIFIED` | Official NIST vectors, RFC 5869, Wycheproof tamper rejection |
| **Smart Contract Invariants** | 6-Tier mathematical invariant & access limits | 🟢 `VERIFIED` | EIP-170, token conservation, velocity caps, escrow state machine |
| **Truth & Secret Guards** | Prevent mock claims & signing key leaks | 🟢 `VERIFIED` | `scripts/check-truth.mjs` passes with 0 violations |
| **Raven RSI + REA** | Bounded recursive improvement agentic loop | 🟢 `VERIFIED` | 6-step loop verified (Score: 99.3/100 >= 85.0) |
| **Frontend & UX** | Multi-wallet, QuickNode switcher, Faucet modal | 🟢 `VERIFIED` | Bundles cleanly (`dist/`); reactive UI verified |
| **Arbitrum Sepolia Deployment** | Live runtime bytecode on Sepolia contracts | 🟡 `PARTIAL` | Historical records unverified; live funded deployment pending |
| **QuickNode Integration** | Live RPC latency & archive block data | 🟡 `PARTIAL` | Public fallback active; user private endpoint pending |
| **QuickNode Streams** | Webhook HMAC signature & reorg recovery | 🟡 `PARTIAL` | Edge filter & webhook receiver ready; live stream pending |
| **External Security Audit** | Third-party professional security attestation | 🔴 `BLOCKED` | Zero fake audit reports. Real security firm engagement required |
| **Mainnet Release Controls** | Deployment unlock and funding policy | 🔴 `BLOCKED` | Mainnet locked fail-closed by security charter |

---

## 4. Current Readiness Score & Next Safe Phase

* **Calculated Provisional Score:** **`74 / 100`**
* **Target:** **`100 / 100`**
* **Next Environment:** Arbitrum Sepolia Testnet
* **Mainnet Spending:** **`$0.00 (LOCKED)`**
