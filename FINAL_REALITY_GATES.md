# Final Reality Gates

## Automated baseline
- [x] Typecheck
- [x] Solidity compilation
- [x] Production simulation guard
- [x] Production build
- [x] One-click baseline command

## External evidence gates (cannot be auto-faked)
- [ ] Fund a persistent Arbitrum Sepolia deployer
- [ ] Deploy QARBIToken, AgentRegistry, TaskMarket, ConwayEngine and AgentWallet
- [ ] Record each deployment transaction hash
- [ ] Verify explorer evidence and set manifest verification only after confirmation
- [ ] Run create → claim → settle TaskMarket E2E against deployed contracts
- [ ] Run Conway step against deployed contract and record receipt
- [ ] Replace PQC placeholder with real ML-DSA-65 implementation and test vectors
- [ ] Run security/invariant testing

**Release rule:** the frontend and release gate must refuse to claim live-chain execution until the corresponding deployment evidence exists.
