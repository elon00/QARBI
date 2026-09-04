# 🛡️ QARBI Protocol: External Security Audit Readiness Dossier

## 1. Protocol Architecture & Threat Model
- **Network Target:** Arbitrum Sepolia (Chain ID 421614)
- **Execution Target:** Nitro EVM + Stylus Rust WASM (`crates/conway-stylus`)
- **Deployed Contracts:**
  - `QARBIToken.sol` (`0x1787F3d2F1BfF32C05EC1E0a6043669D7224d387`)
  - `AgentRegistry.sol` (`0xcF782d7409B9911F295855506164100AAc1b3Dc1`)
  - `TaskMarket.sol` (`0x45DEFB4710162830476a8EA2c6467E87FD7FacA1`)
  - `ConwayEngine.sol` (`0xF8C60603BA7436FB74d67699af9CfD7A76C20543`)
  - `AgentWallet.sol` (`0x61Ac7a4b292381266d06e1CfD84b4769c287DcD7`)

## 2. Invariant Specifications
1. **Reentrancy Protection:** All external call routines in `TaskMarket.sol` and `AgentWallet.sol` implement checks-effects-interactions and reentrancy guards.
2. **Velocity Caps:** Autonomous agent spending is bounded by `singleTxLimit` and 24-hour rolling `dailyBudget` inside `src/lib/policyEngine.ts`.
3. **PQC Commitments:** Agent on-chain registration requires a 32-byte SHA-256 public key commitment hash of an ML-DSA-65 post-quantum keypair (NIST FIPS 204).
4. **Sanctions Filtering:** Sanctioned mixer and exploit addresses are rejected at policy validation.

## 3. Automated Verification Checklist for Auditors
- [x] Solidity Contracts Compile (`solc 0.8.24`, `viaIR: true`)
- [x] Rust Stylus Crate Unit Tests (`cargo test` -> 4/4 PASS)
- [x] Rust Stylus Target Compilation (`wasm32-unknown-unknown` -> PASS)
- [x] Post-Quantum Cryptography Smoke (`ml-dsa65-smoke.mjs` -> PASS)
- [x] Wallet Provider Isolation Tests (`wallet-provider-test.mjs` -> PASS)
- [x] Browser Wallet E2E Evidence Harness (`browser-wallet-e2e.mjs` -> PASS)
- [x] Legal & Regulatory Compliance Gate (`legal-compliance-gate.js` -> PASS)
- [x] Live Bytecode & Receipts Verified on Arbitrum Sepolia RPC
