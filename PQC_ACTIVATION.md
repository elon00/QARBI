# QARBI PQC Activation Checklist

Run only after a reproducible ML-DSA-65 dependency version is installed and committed with its lockfile:

```bash
npm run pqc:real
```

Expected gates:

1. provider declaration consistency
2. strict PQC provider boundary
3. real ML-DSA-65 keygen/sign/verify
4. tampered-message rejection

A PASS is test evidence for the configured dependency; it is not by itself a mainnet security audit.
