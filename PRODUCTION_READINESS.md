# QARBI Production Readiness Contract

QARBI follows a reality-first release policy.

## Release laws

1. A production claim must be backed by reproducible evidence.
2. Fake transaction hashes, fake receipts, random wallet addresses, and simulated cryptographic signatures are prohibited in production paths.
3. Testnet and simulation features must be explicitly labelled.
4. Blockchain features require a real wallet signature, confirmed transaction, emitted contract event, and explorer-verifiable receipt.
5. PQC features may only claim a named standard when the implementation is a real, vetted cryptographic implementation with interoperability/test-vector coverage.
6. Mainnet deployment requires passing testnet E2E, build, contract, security, and release gates first.

## Current network

QARBI's checked deployment configuration targets **Arbitrum Sepolia (421614)**. This repository is therefore a testnet release until a separate Arbitrum One deployment is independently verified.

## Mandatory release evidence

- Contract addresses and deployment transaction hashes
- Explorer links
- Verified contract source/bytecode
- Unit/integration/E2E test results
- Security scan results
- Accurate README claims
- No production simulation patterns

## Mainnet blocker

The project MUST NOT claim mainnet production readiness merely because the UI deployer exists. Mainnet requires a separately funded and controlled deployment, verified contracts, security review, and an E2E proof trail.
