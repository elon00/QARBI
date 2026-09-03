# 📖 RULEBOOK: Autonomous Blockchain, AI Agent & Cryptographic Standards

This Rulebook sets the universal baseline for software development, verification, security policies, and regulatory compliance across all decentralized and AI projects.

## 🎯 Mandatory Core Rules

### 1. Truth & Reality Rule (RULE-01)
- Never fabricate test outputs, blockchain transactions, wallet balances, or cryptographic proofs.
- If a feature is a prototype or on testnet, state it clearly.
- If an external audit has not occurred, never claim "production audited".

### 2. Legal & Regulatory Compliance (RULE-02)
- **Indian Supreme Court & Statutory Guidelines:**
  - Compliance with *IAMAI v. RBI (2020)* principles on lawful decentralized computing.
  - Compliance with PMLA 2002 & FIU-IND 2023 AML/CFT rules: sanctions screening, velocity checks, and audit logging.
  - Compliance with CERT-In 2022 cyber directions for immutable audit logs.
  - Compliance with ASCI 2022 VDA disclaimer requirements on all user-facing interfaces.
- **International Blockchain Directives:**
  - FATF Recommendation 16 (Travel Rule) sanctions filtering.
  - EU MiCA (Regulation EU 2023/1114) transparent tokenomics and anti-manipulation.
  - NIST FIPS 204 (ML-DSA-65) post-quantum cryptographic standards.

### 3. Smart Contract Security Invariants (RULE-03)
- No contract with fund-handling logic may be deployed without reentrancy guards.
- All agent spendings must be bounded by single-tx limits and 24-hour velocity caps.
- Emergency pause / kill switch functionality must be available for guardian interventions.

### 4. Reproducible Automation Pipeline (RULE-04)
- Every project must maintain a single, deterministic master verification pipeline (`npm run finish:all` / `qmoosa:finish`) that tests:
  - Requirement classification & traceability
  - Dependency integrity
  - Smart contract compilation
  - Stylus / Rust WASM compilation and unit testing
  - Post-Quantum cryptography provider & smoke verification
  - Wallet isolation and provider testing
  - Legal & regulatory compliance gates
  - Live testnet bytecode verification
  - Machine-readable evidence reporting
