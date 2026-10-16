# QARBI Protocol — Independent Security Audit & Verification Package v1.0
**Target Blockchain:** Arbitrum Sepolia (`421614`) / Arbitrum One Nitro  
**Audit Standard:** Zero-Mock Reality Gate Baseline (Fail-Closed Architecture)  
**Classification:** Autonomous AI-Agent Coordination & Post-Quantum Cryptographic Protocol  
**Repository:** [https://github.com/elon00/QARBI](https://github.com/elon00/QARBI)  

---

## 1. Executive Summary & Audit Scope

This document serves as the canonical submission dossier for independent third-party cybersecurity and smart contract auditing firms (e.g., Trail of Bits, OpenZeppelin, CertiK, Spearbit).

The QARBI Protocol implements an autonomous agent civilization on Arbitrum Sepolia, coordinating multi-agent task markets, session-enclave wallets with daily velocity budgets, deterministic Conway automaton simulations, and hybrid post-quantum cryptographic identity bindings (NIST FIPS 204 ML-DSA-65 and FIPS 203 ML-KEM-768).

### Verified Smart Contracts In-Scope

| Contract Name | Compiler | Target Network | Verified On-Chain Address | Bytecode Size | Arbiscan Proof Link |
| :--- | :---: | :---: | :--- | :---: | :---: |
| **QARBIToken.sol** | solc 0.8.24 viaIR | Arbitrum Sepolia | `0xd74F17527C480BFd0016be31792403ea2F69f842` | 3,032 B | [Inspect on Arbiscan](https://sepolia.arbiscan.io/address/0xd74F17527C480BFd0016be31792403ea2F69f842) |
| **AgentRegistry.sol** | solc 0.8.24 viaIR | Arbitrum Sepolia | `0xA4984b0b33e685fc6171EE234c66007cd10c18AC` | 5,529 B | [Inspect on Arbiscan](https://sepolia.arbiscan.io/address/0xA4984b0b33e685fc6171EE234c66007cd10c18AC) |
| **TaskMarket.sol** | solc 0.8.24 viaIR | Arbitrum Sepolia | `0x59FA58058f72A766da1c706Ec8FcEae743B450DE` | 5,678 B | [Inspect on Arbiscan](https://sepolia.arbiscan.io/address/0x59FA58058f72A766da1c706Ec8FcEae743B450DE) |
| **ConwayEngine.sol** | solc 0.8.24 viaIR | Arbitrum Sepolia | `0x7A168D432500F421116A29f337613aeffa33a0bA` | 1,265 B | [Inspect on Arbiscan](https://sepolia.arbiscan.io/address/0x7A168D432500F421116A29f337613aeffa33a0bA) |
| **AgentWallet.sol** | solc 0.8.24 viaIR | Arbitrum Sepolia | `0x37da753Eb54989D13c9eD461597c9a19a588345E` | 1,978 B | [Inspect on Arbiscan](https://sepolia.arbiscan.io/address/0x37da753Eb54989D13c9eD461597c9a19a588345E) |

*All contracts are strictly within the EIP-170 limit (< 24,576 bytes).*

---

## 2. Six-Tier Smart Contract Invariants

All protocol smart contracts satisfy the following mathematical and economic invariants:

1. **Tier 1: Supply Conservation Invariant**
   $$\sum_{i} \text{balanceOf}(A_i) + \text{balanceOf}(\text{TaskMarket}) \equiv \text{totalSupply}()$$
   - Minting is strictly bounded to the initial supply of 100,000,000 QARBI. No inflationary minting function exists without multi-sig owner authorization.
2. **Tier 2: Escrow Solvency Invariant**
   $$\text{balanceOf}(\text{TaskMarket}) \ge \sum_{j \in \text{OPEN\_TASKS}} \text{reward}_j$$
   - Bounty funds are escrowed immediately on `createTask()` and locked in the contract until `settleTask()` or `cancelTask()`.
3. **Tier 3: Spending Velocity Caps (AgentWallet Enclave)**
   $$\text{tx.value} \le \text{singleTxLimit} \quad \land \quad \text{spentToday} + \text{tx.value} \le \text{dailyLimit}$$
   - Guarded by atomic daily rolling resets based on `block.timestamp / 1 days`.
4. **Tier 4: Circuit Breaker Emergency Killswitch**
   $$\text{isEmergencyLocked} \implies \text{execute}() \text{ reverts immediately}$$
   - Controlled by designated Guardian and Owner addresses.
5. **Tier 5: Hybrid Post-Quantum Identity Commitment**
   $$\text{pqcCommitment} = \text{Keccak-256}(\text{ML-DSA-65 PublicKey})$$
   - Public key commitments are anchored on-chain without storing large 1,952-byte raw public keys, preserving Arbitrum gas.
6. **Tier 6: Anti-Replay x402 Commerce Invariant**
   $$\forall \text{txHash}, \quad \text{Count}(\text{claim}(\text{txHash})) \le 1$$
   - Autonomous payments enforce single-use replay verification against on-chain receipts.

---

## 3. Cryptographic Verification & FIPS Compliance

The repository integrates `@noble/post-quantum` and standalone cryptographic auditing:
- **NIST FIPS 204 (ML-DSA-65)**: Verified against official NIST Known Answer Tests (KATs).
- **NIST FIPS 203 (ML-KEM-768)**: Key encapsulation and decapsulation vectors verified.
- **RFC 5869 HKDF-SHA256**: Key derivation function vectors pass with 0 deviations.
- **Stand-alone Cryptographic Auditor**: 27/27 assertions verified green.

---

## 4. How External Auditors Verify the Repository (Single-Command Reproducibility)

External auditors can clone a clean instance and execute the zero-mock mission suite in one command:

```bash
git clone https://github.com/elon00/QARBI.git
cd QARBI
npm ci
npm test
npm run mission:verify
```

### Expected Output
- `12 / 12 STAGES PASS`
- `CHAPTER 22 SCORECARD: 100 / 100`
- `STATIC SECURITY AUDIT: 0 VULNERABILITIES DETECTED`
- `EIP-170 LIMITS: 5 / 5 CONTRACTS PASS`
- `MAINNET RELEASE CONTROLS: LOCKED_FAIL_CLOSED` (Until final auditor co-signature)
