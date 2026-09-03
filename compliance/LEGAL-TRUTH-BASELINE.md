# QARBI Legal & Truth Baseline

## Status
This repository implements **law-aware engineering controls**. Passing these controls does **not** constitute legal advice, regulatory approval, a licence, certification, or a finding of compliance by any court or regulator.

## Core rules
1. No fake claims: simulations, local tests, testnet deployments and production systems must be labelled differently.
2. No blanket legal-compliance claim.
3. No personal data on a public blockchain by default; prefer minimised off-chain storage plus a cryptographic commitment where appropriate.
4. Wallet actions require explicit user confirmation; no hidden signing or asset movement.
5. Activity classification is required before offering regulated virtual-asset services.
6. AML/CFT controls are assessed according to actual product activity and applicable jurisdiction; they are not assumed from the presence of a token.
7. India-specific and international sources are recorded as reference baselines and must be reviewed when product scope or law changes.

## Reference baseline
- India: Digital Personal Data Protection Act, 2023 (India Code).
- India: MeitY National Blockchain Framework / Vishvasya Blockchain Technology Stack.
- India: Supreme Court decisions are applied only by exact case holding and relevance; this repository makes no claim of a universal “Supreme Court blockchain guideline”.
- International: FATF risk-based approach to Virtual Assets/VASPs.
- EU exposure: MiCA may be relevant depending on users, activity and territorial scope.

## Mandatory human review triggers
- custody or control of user assets;
- exchange, brokerage, transfer or payment services involving virtual assets;
- token sale, public offering, investment or yield claims;
- handling regulated personal or sensitive data;
- launch into a new jurisdiction;
- mainnet deployment handling material value.

## Truth status vocabulary
IMPLEMENTED, TESTED, LIVE_TESTNET_VERIFIED, EXTERNAL_REVIEW_REQUIRED, NOT_IMPLEMENTED.
