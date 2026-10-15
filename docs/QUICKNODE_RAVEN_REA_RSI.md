# QARBI: QuickNode + Raven RSI + REA Integration Blueprint

**Status: PROPOSED / PARTIALLY IMPLEMENTED.** The accompanying `scripts/quicknode-reality-gate.mjs` implements an optional read-only RPC check; Raven, REA, QuickNode Streams, and on-chain deployments are **not** integrated or verified by this proposal.

## Intended architecture

1. **Observe**: QuickNode Arbitrum Sepolia RPC and, later, signed Streams webhooks supply actual blocks, receipts and contract logs. Store block number/hash, source, timestamp and provenance. Treat all incoming event data as untrusted.
2. **Inspect**: REA runs in a restricted offline analysis environment against **owned or authorized** source, binaries and captured behavior. Export findings as evidence, not executable instructions.
3. **Plan**: Raven orchestrates research, code and verification agents, receives read-only evidence and proposes minimal patches on a disposable branch. Raven is early-stage software; pin a reviewed release or commit and check its interfaces.
4. **Validate**: Run `npm run typecheck`, `npm run build`, `npm test`, the repository reality gates, static analyzers, fuzzing, and contract-specific tests. Test against a live **testnet** for claims involving on-chain execution; neither a mock nor a local assertion proves deployment.
5. **Adopt or reject**: Only improvements supported by reproducible evidence, non-regression, and required human review can enter protected branches. Never auto-merge contract, permission, minting, treasury, wallet, signer, policy or deployment changes. No automatic mainnet broadcast.
6. **Recover**: Record baseline metrics and revert or disable a change if post-merge guardrail metrics regress. Escalate rather than silently weakening a failing security gate.

## Objective and acceptance equation

Let c be a candidate patch, B the verified baseline and E immutable evidence:

```
QARBI_(t+1) = Accept(c, E, B) ? Apply(QARBI_t, c) : QARBI_t

Score(c) = 0.25*T + 0.25*V + 0.20*R + 0.15*P + 0.15*O
Accept(c, E, B) =
  reproducible_evidence(E)
  AND no_critical_findings
  AND tests_pass
  AND security_invariants_hold
  AND no_regression_from(B)
  AND required_approvals_present
```

T = tests; V = security verification; R = reliability; P = performance; O = observability. Each is normalized to [0,1]. Weights and thresholds are **proposal-only**, not Raven/REA standards. A numerical score **never overrides** any hard gate.

## QuickNode integration

Obtain an Arbitrum Sepolia HTTPS endpoint from the QuickNode dashboard. Set `QUICKNODE_ARBITRUM_SEPOLIA_RPC` as a **secret**, never commit its tokenized URL or log it. In a trusted runtime:

```bash
QUICKNODE_ARBITRUM_SEPOLIA_RPC="https://YOUR_PRIVATE_ENDPOINT" node scripts/quicknode-reality-gate.mjs
```

A successful run validates a live chain ID (421614), positive height and matching block hash. It makes **no deployment claim**. Keep public RPC fallback independent and do not call a fallback success a QuickNode verification. Record rate limits and billing before enabling ingestion.

Streams phase (not implemented): verify webhook authenticity according to QuickNode documentation, implement replay/deduplication using chain ID + block hash + transaction hash + log index, handle reorgs/finality, validate payload schemas, use a retry-safe durable queue, and restrict indexing to allowlisted contracts.

The Open House coupon **ARBOHSGP** and its advertised 3-month Build offer are user-provided; eligibility, remaining redemption time, checkout conditions and any eventual charges must be checked in the provider's billing UI. Never provision paid resources automatically.

## Minimal agent boundary

```text
QuickNode (read only) -> EvidenceStore (immutable provenance)
                            |                 |
                            v                 v
                     REA (sandbox)       Raven (sandbox)
                            \                 /
                             -> candidate PR ->
                  CI + independent reality gates ->
                  security review + human approvals ->
                    merge or reject (no mainnet)
```

Raven and REA should be installed as separate, pinned tools/services after verifying license and compatibility. Do not paste in or execute unreviewed remote install scripts as part of CI. Do not grant them production wallet keys, unrestricted shell or repository-admin privileges. Use short-lived, least-privilege tokens; egress allowlists and strict execution quotas.

## Phased acceptance

- **Phase A**: This proposed document and optional read-only verification script.
- **Phase B**: Validate QuickNode connection with real credentials in a trusted CI/runtime and retain redacted evidence.
- **Phase C**: Independently deploy/test pinned Raven and REA versions and connect via an explicit structured evidence adapter; demonstrate a generated PR and failure rollback.
- **Phase D**: Add signed Streams ingestion, reorg handling and observational SLOs.
- **Phase E**: Formal review, audit, verified testnet contracts and only then consider separately approved mainnet operations.

References:
- https://www.quicknode.com/docs/arbitrum
- https://www.quicknode.com/docs/streams
- https://github.com/EverMind-AI/Raven
- https://github.com/morluto/rea
