# QARBI One-Click Operations

## Fast commands

```bash
npm ci
npm run oneclick
```

Runs: typecheck → contract compile → production guard → production build.

For a release candidate:

```bash
npm run oneclick:release
```

This additionally runs the deployment-evidence gate and intentionally fails until genuine Arbitrum Sepolia evidence exists.

## Portfolio model

```
scripts/
  one-click.cjs
  production-guard.cjs
  release-gate.cjs
  compile.js
.github/workflows/
  ci.yml
PRODUCTION_READINESS.md
ONE_CLICK_OPERATIONS.md
```

One command checks everything automatable; evidence gates stop anything requiring real-world proof.
