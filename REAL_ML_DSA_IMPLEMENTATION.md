# Real ML-DSA-65 Integration Plan

QARBI currently ships a clearly labelled development placeholder. A real ML-DSA-65 implementation must not be substituted with random bytes or cosmetic API names.

## Required implementation gate

1. Add a maintained ML-DSA implementation whose version and API are pinned.
2. Replace the placeholder behind a small adapter with real key generation, signing and verification.
3. Add official known-answer/vector tests appropriate to the chosen implementation.
4. Add tamper, wrong-message and wrong-public-key negative tests.
5. Run the tests in CI.
6. Keep browser/server boundaries explicit: private keys must never be silently exposed in client bundles.
7. Only after all tests pass may UI metadata say `ML-DSA-65`.

## Fast architecture

```
PQC provider
   -> keygen()
   -> sign(message)
   -> verify(message, signature, publicKey)
   -> tests
   -> CI evidence
```

Until a dependency is installed and locked reproducibly, the project must retain `UNVERIFIED-PQC-COMMITMENT`.
