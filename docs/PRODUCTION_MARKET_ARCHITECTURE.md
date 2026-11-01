# QARBI — 10/10 Architecture and 100/100 Evidence-Gated Release Standard

Status: **proposed design and enforceable release criteria, not a production certificate**. Source branch: `main` @ `a7442d6` (2026-11-01). No mainnet deployment or funds authorized.

## Architecture (10 independent domains)
1. **Frontend / UX:** React, TypeScript, responsive flows, WCAG accessibility, transparent testnet labels.
2. **Wallet / Identity:** EIP-1193 and wallet discovery, explicit chain 421614, hardware/wallet signing, disconnect, no synthetic balances.
3. **Agent planning:** AI generates proposals only; scoped tools, approvals, budgets, audit trail, prompt-injection defense.
4. **Execution / x402:** request challenge, replay-safe nonces, idempotency keys, settlement receipts, fail-closed authorization.
5. **Smart contracts:** AgentRegistry, AgentWallet, TaskMarket, Conway automaton; ownership/access-control, escrow invariants, reentrancy and pause protection.
6. **PQC boundary:** ML-DSA-65 and ML-KEM tested against NIST KATs; distinguish off-chain crypto verification from EVM on-chain verification.
7. **Stylus Rust engine:** compile, unit/property tests, WASM build, Arbitrum Sepolia deployment + contract verification before deployed claim.
8. **Backend / Operations:** Express/Netlify APIs, secret isolation, quotas/rate limiting, structured logs, retries and circuit breakers.
9. **Observability / Security:** CodeQL, dependency audit, adversarial tests, reproducible builds, vulnerability triage, incident response.
10. **Release / Market:** real-chain receipts, reproducible deployments, public docs, tokenomics, privacy/compliance review, customer UX testing.

## Release scorecard (100 points)
Each section is binary: **10 points** only with reproducible evidence; otherwise **0**. Unknown is 0, not a pass.

| Domain | Evidence needed |
|---|---|
| 1. Build | clean `npm ci`, `npm test`, `npm run build` on CI |
| 2. Tests | unit, negative, regression and real integration artifacts |
| 3. Security | CodeQL plus adjudicated dependency and contract findings |
| 4. Contracts | verified source/ABI, address, chain ID and explorer evidence |
| 5. E2E | funded testnet wallet transaction receipts: deploy, register, escrow, settle |
| 6. PQC | NIST vectors, tamper negatives, runtime/provider audit and proof of actual boundary |
| 7. Wallet | real wallet sign/connect/disconnect, chain mismatch and rejected transaction tests |
| 8. Operations | monitoring, alerting, rollback, secret scanning and backup/incident drill |
| 9. Governance | branch protection, code-owner review, release approvals, reproducible provenance |
| 10. Market | accurate public docs, economics, customer testing, compliance counsel review |

**100/100** requires all ten evidence domains, plus no unresolved release-blocking findings. Passing workflows is necessary, not sufficient. **No market-ready / mainnet-ready label** without independent security review and verified actual deployment.

## PR #15 integration policy
Existing `production-hardening` differs from current `main` by 143 ahead / 77 behind commits, across 79 changed files. Never merge blindly. Preserve current main, cherry-pick only reviewed behavior to a dedicated integration branch, run CI and negative tests, and inspect `crates/conway-stylus`, `scripts/security-ast-scanner.js`, `src/components/WalletModal.tsx`, `src/lib/productionChain.ts` and contract diffs. Keep historical unverifiable evidence labeled as non-certifying.

## Planned rollout
Phase A: fix CI and truthful docs. Phase B: safe hardening integration and security tests. Phase C: verified Arbitrum Sepolia E2E. Phase D: independent audit/ops/market gate. Phase E: separately approved mainnet release only when all gates pass.

Currency/token policy: use utility tokens only when justified by real use. Unlimited supply is not a release requirement and needs explicit inflation, emission and abuse controls. Do not include central-bank-digital-currency integrations.

## Evidence manifest
Maintain `release-evidence/readiness.json` with ten entries, each containing `status: verified`, a nonempty evidence URL pointing to an independently inspectable artifact, an ISO timestamp and a verifier identity. This JSON is an **attestation**, not automatic proof; human review and live-chain validation remain mandatory.
