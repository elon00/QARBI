# QARBI Master Architecture — Production & Market Readiness v1.0
**Status:** engineering target, NOT certification. No mainnet operations or spending permitted. Evidence-based 100/100 only.
## Chapters and acceptance criteria
01. Product scope: Arbitrum Sepolia 421614, intended users, measurable outcomes and non-financial claims.
02. Architecture: React/Vite UI → wallet EIP-1193 → signed intents → Express API/agent policy → Solidity Registry/Wallet/TaskMarket + Conway engine → RPC/explorer. Only claim real execution when a confirmed receipt is verified.
03. Data contracts: deterministic network, address, transaction, block, chainID, receipt, finality, retry, and idempotency schemas.
04. Smart contracts: role-based permissions, ownership, reentrancy protection, escrow state machine, invariants, fuzz and testnet E2E.
05. PQC: real ML-DSA-65/ML-KEM off-chain verified vectors, secret lifecycle, boundary disclosure; no unverified claim of on-chain PQ signatures.
06. AI agents: multimodel adapter, approvals, scoped tools, anti-prompt-injection policies, audit logs; no autonomous signer access.
07. REA/RSI: observe → inspect → propose → test → review → rollback. Use real Raven/REA integrations only after compatible upstream dependency testing; proposals are not automatically applied.
08. Payments: x402 challenge / verification / settlement / replay protection, Bazaar discovery; separate settlement proof from API response.
09. Infrastructure: QuickNode optional authenticated RPC, fallback health checks, chainID verification, rate limits, webhooks HMAC, reorg monitoring.
10. Conway/Web4: deterministic Conway B3/S23 simulation and separate on-chain anchor only if deployed; Web4 describes interoperable identity/service architecture, not consensus.
11. Wallet UX: MetaMask/Trust Wallet EIP-6963 discovery where supported, balances from provider, confirmation, QR chain awareness, signing rejection paths.
12. Tokens and launchpad: utility justification, mint roles, budget and issuance governance, supply disclosure, launchpad only if justified by requirements.
13. Code quality: npm ci, TS, Solidity compile, unit, smoke, negative, regression, integration, security static and dependency audit.
14. Governance: branch protection, CodeQL, required checks, reviewed PRs, SBOM, dependency pinning, secret scanning, provenance and rollback.
15. Deployment: DEV → CI → STAGING → TESTNET → AUDIT → HUMAN APPROVAL → MAINNET. No automatic funds/cycles/deploy.
16. Market: documented risks, user validation, UX testing, responsible tokenomics, pricing, privacy policies, legal review, support/runbooks.
## 100-point scorecard
Each domain is worth 10 only after linked, independently inspectable evidence. Partial work may be reported but is NOT certified.
1. Build & CI (10)
2. Automated tests (10)
3. Contracts & adversarial invariants (10)
4. PQC, key boundaries & cryptographic tests (10)
5. Wallet & authentic user transaction E2E (10)
6. REA/RSI with bounded measured improvement (10)
7. x402, QuickNode and chain data integrity (10)
8. Security, supply chain and independent findings (10)
9. Operational reliability and release governance (10)
10. Live testnet evidence and market/customer/legal acceptance (10)
**Release hard blockers:** missing verified chain receipts, exploitable critical issues, unreviewed signer permissions, incomplete independent audit, or missing explicit mainnet approval. Until resolved: NOT production-certified, irrespective of numeric score.
## Known issues from 2026-11-01
PR #15 has unresolved conflicts; PR #50 is a separate review branch. Local npm test exited 0, but Vite __dirname/native-loader warning, >500KB bundle warning, and Node DEP0190 warning are recorded. These are improvement items, not proof of a breach. 195 packages were installed on the user's PC; full release evidence was not demonstrated.
## Relevant source and standards
- GitHub Actions and CodeQL: https://docs.github.com/en/actions and https://codeql.github.com/
- Arbitrum Sepolia: https://sepolia.arbiscan.io
- QuickNode: https://www.quicknode.com/docs
- x402: https://github.com/x402-foundation/x402
- Raven: https://github.com/EverMind-AI/Raven
- REA: https://github.com/morluto/rea
- NIST FIPS 204: https://csrc.nist.gov/pubs/fips/204/final
