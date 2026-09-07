# External Security Audit Evidence Boundary

## Purpose

This document defines what QARBI can and cannot claim from automated repository evidence.

## Automated evidence can establish

- clean dependency installation with `npm ci`
- deterministic source revision and lockfile identity
- TypeScript compilation
- Solidity compilation
- repository test vectors and negative tests
- cryptographic API behavior exercised by the repository
- production build completion
- reproducible URS certificate generation

## Automated evidence cannot establish

- absence of all security vulnerabilities
- correctness of every cryptographic integration in every deployment context
- formal compliance certification by NIST or any government body
- an independent third-party security audit
- production-mainnet safety without deployment-specific verification

## External audit requirement

The remaining independent-assurance gap must be closed by an auditor who is organizationally independent of the repository authors and who publishes, or provides, a dated report covering:

1. threat model and trust boundaries
2. smart-contract review
3. cryptographic integration review
4. dependency and supply-chain review
5. authentication and key-management review
6. adversarial and negative testing
7. findings, severity, remediation, and retest status
8. exact audited commit SHA

## URS rule

`H = 1.0` is prohibited unless the independent audit evidence above exists and is bound to an exact commit SHA.

Until then:

```
H < 1.0
FINAL 10/10 = NOT CLAIMABLE
```

This is a fail-closed evidence boundary, not a scoring shortcut.
