# 🏛️ QARBI Protocol: Global & Indian Legal Compliance Rulebook

## 📜 Regulatory Preamble & Truth-in-Engineering Charter
This document establishes the mandatory **Legal, Regulatory, and Cryptographic Compliance Framework** for the QARBI Protocol and all affiliated autonomous agent and decentralized computing projects.

Every architecture decision, smart contract deployment, AI agent action, and user interface component must adhere to:
1. **The Supreme Court of India's constitutional jurisprudence and Indian statutory law** for blockchain and Virtual Digital Assets (VDAs).
2. **International blockchain legal frameworks** (FATF, EU MiCA, NIST Post-Quantum standards, OWASP).
3. **The Truth-First Engineering Protocol** (Strict prohibition of simulation masking, synthetic telemetry, or false production claims).

---

## 🇮🇳 PART I: SUPREME COURT OF INDIA & INDIAN STATUTORY FRAMEWORK

### 1. Supreme Court Landmark Jurisprudence (*IAMAI v. Reserve Bank of India, 2020*)
- **Constitutional Right to Blockchain Innovation:** Under Article 19(1)(g) of the Constitution of India, citizens and enterprises hold the fundamental right to carry on lawful trade, occupation, or business in blockchain software, decentralized protocols, and digital assets.
- **Proportionality Doctrine:** State regulations and intermediary actions must be proportionate, non-arbitrary, and legally grounded.
- **Protocol Compliance:** QARBI operates transparently as an open-source decentralized protocol on public testnet infrastructure, respecting all applicable financial and technical regulations.

### 2. Prevention of Money Laundering Act (PMLA), 2002 & FIU-IND Guidelines (2023)
- **VDA Intermediary Compliance (Gazette Notification S.O. 1072(E), March 7, 2023):** Entities providing virtual digital asset exchange, transfer, safekeeping, or administration services are designated as Reporting Entities under PMLA.
- **Anti-Money Laundering (AML) & Counter-Financing of Terrorism (CFT):**
  - All automated agent transactions must pass deterministic sanctions screening (OFAC / UN / MHA UAPA blacklists).
  - Prohibition of anonymous mixing, obfuscation protocols, or unauthorized dark routing.
  - Deterministic velocity and single-transaction limit enforcement on autonomous agent wallets.
- **5-Year Audit Record Retention:** All transaction logs, agent spawner records, and smart contract state changes must maintain immutable cryptographic receipts for a statutory minimum of 5 years.

### 3. CERT-In Cyber Security Directives (Directions No. 20(3)/2022-CERT-In, April 2022)
- **Logging & Security Monitoring:** Protocol interfaces and relayer servers must maintain synchronized, secure audit logs with precise UTC / IST timestamps.
- **Cyber Incident Reporting:** Any security compromise, unauthorized contract drain, or cryptographic vulnerability must be reportable within the statutory 6-hour window.

### 4. Income Tax Act, 1961 (Sections 115BBH & 194S) & Testnet Demarcation
- **Testnet Zero-Value Declaration:** QARBI tokens (`QARBI`) on Arbitrum Sepolia (Chain ID `421614`) are strictly testnet utility units with **zero fiat or market monetary value**. They cannot be traded for fiat currency or redeemable economic assets.
- **Tax Transparency:** If mainnet deployment occurs in future phases, the protocol architecture is designed to support 1% TDS (`Section 194S`) tracking and 30% flat capital gains reporting (`Section 115BBH`).

### 5. Consumer Protection Act, 2019 & ASCI Guidelines on VDAs (Feb 2022)
- **Mandatory Statutory Warning:**
  > *"Crypto products, smart contracts, and AI agent autonomous executions are experimental and unregulated. There is no statutory regulatory recourse for losses in unaudited smart contracts or experimental testnets."*
- **Truth in Advertising:** Zero misleading claims regarding investment returns, production readiness, or artificial performance metrics.

---

## 🌍 PART II: INTERNATIONAL BLOCKCHAIN LEGAL & TECHNICAL STANDARDS

### 1. Financial Action Task Force (FATF) Guidance & Recommendation 16 (Travel Rule)
- **Originator & Beneficiary Transparency:** Autonomous agent transactions must identify originating agent identities and destination contract interfaces.
- **Sanction Screening:** Automated blocking of blacklisted high-risk addresses.

### 2. European Union MiCA (Markets in Crypto-Assets Regulation, EU 2023/1114)
- **Whitepaper Transparency:** Clear disclosure of tokenomics, smart contract source code, mathematical state machine rules (Conway Game of Life), and potential operational risks.
- **Anti-Market Manipulation:** Deterministic smart contract constraints preventing wash trading, sybil spawner attacks, and front-running in the Task Marketplace.

### 3. NIST Post-Quantum Cryptographic Standards (FIPS 203, FIPS 204, FIPS 205)
- **Algorithm Standard:** NIST FIPS 204 ML-DSA-65 (CRYSTALS-Dilithium) module lattice digital signature standard.
- **Cryptographic Boundary Disclosure:** Local ML-DSA-65 keygen and signing verifications are explicitly distinguished from third-party formal mathematical audits.

### 4. OWASP Smart Contract Top 10 Security Standard
- Reentrancy protection on all fund-handling routines (`TaskMarket.sol`, `AgentWallet.sol`).
- Strict access control via `onlyOwner` / `onlyAgent` modifier invariants.
- Safe arithmetic via Solidity 0.8.24 built-in overflow checks.

---

## 🛡️ PART III: INTEGRATED RULEBOOK & POLICY INVARIANTS

| Invariant ID | Rule Description | Governing Standard | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **RULE-01** | **Zero Simulation / Pure Truth** | Truth Protocol | Automated validation gates; zero synthetic telemetry |
| **RULE-02** | **Sanctions & Blacklist Gate** | FATF Rec 16 / PMLA | `policyEngine.ts` address validation |
| **RULE-03** | **Emergency Kill Switch** | CERT-In / ISO 27001 | Global guardian lock on autonomous agents |
| **RULE-04** | **Velocity & Single Tx Budgets**| PMLA AML / MiCA | Deterministic daily and single-tx spending limits |
| **RULE-05** | **Prompt Injection Defense** | AI Safety / CERT-In | Semantic regex & invariant validation |
| **RULE-06** | **Testnet Zero-Value Notice** | Income Tax Act / ASCI| Prominent UI compliance badge & whitepaper notice |
| **RULE-07** | **PQC Boundary Disclosure** | NIST FIPS 204 | Explicit distinction of local provider vs external audit |
| **RULE-08** | **5-Year Transaction Logging** | CERT-In / PMLA 2002 | Structured JSON transaction receipts on Arbitrum RPC |
