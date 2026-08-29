# QARBI Security & Reality Audit

## Current verified baseline

- [x] TypeScript typecheck in CI
- [x] Solidity compilation in CI
- [x] Production/simulation guard in CI
- [x] Production build in CI
- [x] CodeQL analysis passing
- [x] One-click baseline command
- [x] Frontend refuses unverified deployment manifests

## Critical findings

### P0 — Task settlement authorization
The current TaskMarket allows the task creator or protocol admin to submit an arbitrary non-zero proof hash and trigger settlement. This is **not equivalent to cryptographic proof verification**. Do not market this as trustless cryptographic verification until an actual verifier and proof scheme are implemented.

### P0 — Conway entropy semantics
ConwayEngine mixes block.timestamp into the entropy score. The Game of Life transition itself is deterministic, but this score is time-dependent. Any consensus/reproducibility claim must distinguish deterministic grid output from timestamp-derived metrics.

### P0 — Real PQC
A real ML-DSA-65 implementation with known-answer tests and integration boundaries is still required before PQC production claims.

## Release rule

No mainnet or production-security claim is permitted until every P0 item has an implementation and reproducible test evidence.
