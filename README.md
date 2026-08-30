<div align="center">

# ⚡ QARBI Protocol

### Autonomous AI Agent Prototype & Conway State Engine
**Current verified target: Arbitrum Sepolia · PQC integration and Stylus deployment are release blockers until independently verified**

[![CI - Build & Quality Assurance](https://github.com/elon00/QARBI/actions/workflows/ci.yml/badge.svg)](https://github.com/elon00/QARBI/actions/workflows/ci.yml)
[![CodeQL Security Scan](https://github.com/elon00/QARBI/actions/workflows/codeql.yml/badge.svg)](https://github.com/elon00/QARBI/actions/workflows/codeql.yml)
[![Network: Arbitrum Sepolia](https://img.shields.io/badge/Network-Arbitrum%20Sepolia%20(421614)-12AAFF?style=flat-square&logo=arbitrum&logoColor=white)](https://sepolia.arbiscan.io)
[![AI: Google Gemini 2.0](https://img.shields.io/badge/AI-Google%20Gemini%202.0%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![TypeScript: 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

[Explore Features](#-key-features) • [Architecture](#-system-architecture) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Arbitrum Stylus Specs](#-arbitrum-stylus-engine) • [Author & License](#-author--maintainer)

</div>

---

## ⚠️ Verification Status

**Current status: prototype hardening on the `production-hardening` branch.** The repository must not be represented as mainnet-ready. Smart contracts compile, but production readiness still requires live testnet deployment evidence, real end-to-end contract execution, real ML-DSA-65 integration with test vectors, and security testing.

- Network target: **Arbitrum Sepolia (testnet)**
- PQC placeholder: **not a verified ML-DSA-65 implementation**
- Conway contract: **Solidity EVM contract; not a verified Stylus deployment**
- AI planning: **planning only; it does not automatically execute blockchain transactions**

## 📖 Overview

**QARBI Protocol** is an agent-native Web4 execution environment where autonomous AI agents exist as sovereign citizens on **Arbitrum Sepolia**. Agents operate with cryptographic identity, on-chain reputations, strict policy boundaries, and economic agency to discover, negotiate, and execute bounties on-chain.

QARBI is being hardened into a verifiable agent-coordination prototype. Features are only described as production capabilities when supported by reproducible code and deployment evidence.
For ai developers and defi users

---

## 🚀 Key Features

### 1. 🧬 Agent Identity
- On-chain identity registration is being integrated with the agent registry.
- **Release blocker:** replace the current PQC placeholder with a real, tested ML-DSA-65 implementation before making PQC production claims.

### 2. 🌌 Conway Cellular Automaton
- **Cellular Entropy State Engine**: Simulates agent lifecycles, synergy accumulation, energy depletion, and evolution on a dynamic grid.
- **Current execution status**: the checked-in Conway engine is Solidity; a Stylus/Rust deployment is not yet independently verified.
- **Emergent Multi-Agent Synergy**: Neighboring agent cells share energy, earn reputation boosts, and unlock collaborative archetypes.

### 3. 🧠 Gemini Agentic Intent Planning
- **Natural Language Intent Decomposition**: Translates human prompts into discrete, validated on-chain contract interactions.
- **Deterministic Policy Validation**: Evaluates intent against whitelist rules, budget quotas, and security heuristics before dispatching transactions.
- **Archetype Auto-Assignment**: Categorizes tasks across `RESEARCHER`, `SECURITY_AUDITOR`, `QUANT_TRADER`, `DEFI_OPTIMIZER`, `VALIDATOR`, and `CREATIVE_SYNTH`.

### 4. 💼 Task Escrow Marketplace Prototype
- **Escrow design**: smart-contract escrow code exists; live end-to-end settlement evidence remains a release requirement.
- **Task workflow**: claiming and settlement must be demonstrated against a deployed testnet contract before production claims.
- **Verifiable Reputation Loop**: Successful executions boost agent reputation scores (0-1000) and unlock higher tier bounties.

### 5. 🛡️ Autonomous Security Enclave & Emergency Killswitch
- **Real-Time Intrusion & Anomaly Detection**: Tracks malicious injection vectors, overbudget transaction attempts, and unwhitelisted contract interactions.
- **Protocol-Wide Circuit Breaker**: Instant emergency halts on suspicious activity with cryptographic audit trail logging.
- **Interactive Threat Simulator**: Live simulation suite for penetration testing policy limits under adverse network conditions.

### 6. 🌐 Arbitrum Sepolia Block Explorer & Multi-Language Support
- **Transaction ledger UI**: local development records are not blockchain evidence; production requires verified receipts and explorer links.
- **Internationalization (i18n)**: Fully localized across **11 languages** (English, Hindi, Spanish, Japanese, Chinese, Korean, French, German, Portuguese, Russian, Arabic).

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |         User / Orchestrator           |
                                  |   (Natural Language / Dashboard)      |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |     Gemini 2.0 AI Reasoning Core      |
                                  |    Intent Decomposition & Planning    |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |       Policy & Security Enclave       |
                                  |  - PQC attestation (release blocker)  |
                                  |  - Spending Limits & Whitelist Check  |
                                  |  - Real-time Threat Guardrails        |
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
    +-----------------------------------------+               +-----------------------------------------+
    |       Verified on-chain execution TBD    |               |          Arbitrum Sepolia L2            |
    |      Conway Automata State Engine       |               |        Task & Bounty Escrow             |
    |  - High-throughput Grid Matrix State    |               |  - Agent Registry & Reputations         |
    |  - Sub-microsecond Gas Optimization     |               |  - $QARBI Token Settlements             |
    +-----------------------------------------+               +-----------------------------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Layer 2 Blockchain** | [Arbitrum Sepolia](https://arbitrum.io/) (Chain ID: `421614`) |
| **Smart Contract VM** | [Arbitrum Stylus](https://docs.arbitrum.io/stylus/stylus-overview) (Rust -> WebAssembly) |
| **Cryptography** | NIST FIPS 204 [ML-DSA-65 / Dilithium3](https://csrc.nist.gov/pubs/fips/204/final), SHA3-256, Keccak-256 |
| **AI Reasoning** | [Google Gemini 2.0 Flash](https://ai.google.dev/) via `@google/genai` |
| **Frontend UI** | [React 19](https://react.dev/), [TypeScript 5.8](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/) |
| **Backend & Bundling** | [Express](https://expressjs.com/), [Vite 6](https://vitejs.dev/), [esbuild](https://esbuild.github.io/), [TSX](https://github.com/privatenumber/tsx) |
| **CI / CD & Security** | GitHub Actions, CodeQL, Dependabot |

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 20.0.0`
- [npm](https://www.npmjs.com/) `>= 10.0.0`
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (optional for full AI reasoning features)

### 1. Clone Repository
```bash
git clone https://github.com/elon00/QARBI.git
cd QARBI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file from the example template:
```bash
cp .env.example .env
```
Edit `.env` to include your Gemini API key:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
# Typecheck codebase
npm run typecheck

# Build frontend and bundled backend server
npm run build

# Start production server
npm start
```

---

## 🌐 Deploy to Netlify (Live UI/UX Demo)

The project includes built-in configuration ([`netlify.toml`](netlify.toml)) and Netlify Serverless Functions for seamless 1-click deployment on Netlify.

### Option A: Deploy via Netlify Web UI (Recommended)
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and choose repository [`elon00/QARBI`](https://github.com/elon00/QARBI).
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. *(Optional)* Add your `GEMINI_API_KEY` under **Site configuration > Environment variables**.
6. Click **"Deploy QARBI"**. Your live demo URL will be ready in under 1 minute!

### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --build
```

## 📡 API Reference

The server exposes REST endpoints for prototype identity workflows, local development state transitions, and AI planning. These endpoints are not proof of mainnet execution.

### 1. Health & Network Status
- **Endpoint:** `GET /api/health`
- **Response:**
```json
{
  "status": "ok",
  "network": "Arbitrum Sepolia",
  "chainId": 421614,
  "stylusEngine": "not independently verified",
  "pqcVersion": "UNVERIFIED-PQC-COMMITMENT",
  "timestamp": 1755225000000
}
```

### 2. Post-Quantum Identity Generation
- **Endpoint:** `POST /api/crypto/pqc-generate`
- **Payload:**
```json
{
  "agentName": "Sentinel-Prime"
}
```
- **Response:**
```json
{
  "success": true,
  "agentName": "Sentinel-Prime",
  "algorithm": "UNVERIFIED-PQC-COMMITMENT",
  "publicKeyBytesLength": 1952,
  "publicKeyPreview": "0x4f8a...c91e",
  "pqcCommitmentHash": "0x7a9bc2...3d4f",
  "delegatedSessionWallet": "0x3B9408b08D383AE85dF7565451C8118A2B6b9075",
  "attestationSignature": "0x892f...a1b2",
  "generatedAt": "2026-08-15T08:30:00.000Z"
}
```

### 3. Gemini AI Agent Task Planning
- **Endpoint:** `POST /api/gemini/plan-task`
- **Payload:**
```json
{
  "prompt": "Audit the Arbitrum Stylus task escrow contract for reentrancy vulnerabilities",
  "agentContext": "Security Auditor Agent",
  "language": "en"
}
```
- **Response:**
```json
{
  "taskTitle": "Stylus Escrow Reentrancy Audit",
  "taskDescription": "Perform formal verification and check memory safety invariants...",
  "suggestedArchetype": "SECURITY_AUDITOR",
  "estimatedGasUnits": 38400,
  "rewardQarbi": 25,
  "policyVerification": {
    "isWithinSingleTxLimit": true,
    "whitelistedTarget": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "securityRisk": "LOW",
    "riskAnalysis": "Target contract is on verified whitelist."
  }
}
```

---

## 💎 Conway Execution Status

The current checked-in Conway engine is Solidity. A Rust/WASM Stylus implementation must be added and deployed before the project claims verified Stylus execution.

## 🛡️ Security & Quality Assurance

- **Static Type Checking**: Strict TypeScript mode enabled across the entire codebase (`tsc --noEmit`).
- **Continuous Integration**: Multi-version Node.js matrix testing (`ci.yml`) on every push and pull request.
- **Vulnerability Scanning**: Automated GitHub CodeQL SAST scanning (`codeql.yml`).
- **Dependency Health**: Automated weekly Dependabot scans (`dependabot.yml`).

---

## 🤝 Contributing

Contributions are welcomed! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing new feature'`).
4. Ensure all checks pass (`npm run typecheck && npm run build`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a [Pull Request](https://github.com/elon00/QARBI/pulls).

---

## 👤 Author & Maintainer

**Martin Luther**
- **GitHub:** [@elon00](https://github.com/elon00)
- **Email:** [martinlutherupa1@gmail.com](mailto:martinlutherupa1@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
