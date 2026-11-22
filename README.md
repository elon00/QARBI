# QARBI Protocol

QARBI is an Arbitrum Sepolia testnet preview for developers evaluating agent coordination, token escrow, and post-quantum signatures.

- [Hosted preview](https://qarbi.netlify.app/)
- [Contract addresses and creation receipts](src/contracts/deployedAddresses.json)
- [Issues and feedback](https://github.com/elon00/QARBI/issues)

## What the preview supports

- Inspect five testnet deployments and check their bytecode hashes, the token supply, and the registry-to-market link.
- Claim QARBI test tokens using an injected Arbitrum Sepolia wallet. A successful receipt and token mint event confirm the claim.
- Draft a read-only task proposal with Gemini when the server has an API key and model configured.
- Request a one-time ML-DSA-65 signature sample or run the classical portfolio optimizer against the bundled research dataset via the API.

The deployed ConwayEngine is Solidity EVM. The source tree also includes research and earlier prototype UI components. Paid x402 services, QuickNode integration, and hosted secure messaging are unavailable in this preview.

## Run and verify

Use Node.js 22 and npm.

```sh
npm ci
npm run typecheck
npm run check:truth
npm run test:preview
npm run dev
```

Copy `.env.example` to `.env` to enable Gemini. Set `GEMINI_API_KEY` on the server and choose a supported model with `GEMINI_MODEL`. Treat prompts as data sent to the configured provider. The browser receives a draft and has no transaction execution interface for it.

Deploy the frontend and the shared API handler with the repository's Netlify configuration. In a preview deployment, check `GET /api/health`, verify the five Arbiscan links, and test a wallet-approved faucet claim. Confirm unconfigured Gemini returns a service-unavailable response. Use a reviewed deploy preview and keep the previous known-good deployment available for rollback.

## Release status

Testnet deployment receipts establish that the contracts were created. Production release requires reproducible source and compiler provenance for every deployed contract, independent contract review, wallet and escrow end-to-end tests, access and spending controls, monitoring, incident ownership, and a recovery drill. A paid service also needs persistent payment replay protection and settlement reconciliation.

QARBI is maintained by Martin Luther. See [LICENSE](LICENSE).
