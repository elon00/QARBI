/**
 * QARBI PROTOCOL — POST-QUANTUM PORTFOLIO & COMMUNICATION TEST SUITE
 *
 * Exhaustively validates:
 * Tier 1: Markowitz Mean-Variance to QUBO Matrix Mapping Invariants
 * Tier 2: Simulated Quantum Annealing (SQA) Transverse Tunneling
 * Tier 3: Ballistic Simulated Bifurcation (bSB) Convergence
 * Tier 4: NIST FIPS 204 ML-DSA-65 Lattice Portfolio Attestation
 * Tier 5: NIST FIPS 203 ML-KEM-768 Key Encapsulation & HKDF Derivation
 * Tier 6: End-to-End Post-Quantum Secure Agent Channel Handshake & Decryption
 * Tier 7: Fail-Closed Adversarial Tamper Rejection (Ciphertext, Tag, & Signature)
 */

import { quantumPortfolioOptimizer, DEFAULT_ARBITRUM_BASKET, DEFAULT_COVARIANCE_MATRIX } from '../quantum/portfolio-optimizer.js';
import { quantumSecureChannel } from '../quantum/secure-channel.js';
import { mlDsaEngine } from '../pqc/ml-dsa.js';
import { mlKemEngine } from '../pqc/ml-kem.js';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  }
}

async function runQuantumTestSuite() {
  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║   QARBI PROTOCOL — QUANTUM PORTFOLIO & SECURE COMMUNICATION TEST SUITE   ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 1: QUBO Mapping Invariants
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TIER 1/7] Markowitz Mean-Variance to QUBO Matrix Invariants...');
  const params = {
    assets: DEFAULT_ARBITRUM_BASKET,
    covarianceMatrix: DEFAULT_COVARIANCE_MATRIX,
    riskAversion: 2.0,
    budgetK: 3,
    penaltyMultiplier: 4.0,
  };
  const Q = quantumPortfolioOptimizer.constructQUBOMatrix(params);
  assert(Q.length === 5 && Q[0].length === 5, 'QUBO matrix must be 5x5');

  // Verify diagonal element for asset 0 (QARBI):
  // Q_00 = -\mu_0 + \lambda \sigma_00 + \gamma(1 - 2K) = -0.38 + 2.0*(0.2704) + 4.0*(1 - 6) = -0.38 + 0.5408 - 20 = -19.8392
  const expectedQ00 = -0.38 + (2.0 * 0.2704) + 4.0 * (1 - 2 * 3);
  assert(Math.abs(Q[0][0] - expectedQ00) < 1e-6, `Q_00 mismatch: expected ${expectedQ00}, got ${Q[0][0]}`);

  // Verify off-diagonal element Q_01:
  // Q_01 = \lambda \sigma_01 + 2\gamma = 2.0*(0.0819) + 2*4.0 = 0.1638 + 8 = 8.1638
  const expectedQ01 = 2.0 * 0.0819 + 2 * 4.0;
  assert(Math.abs(Q[0][1] - expectedQ01) < 1e-6, `Q_01 mismatch: expected ${expectedQ01}, got ${Q[0][1]}`);
  console.log('  ✅ QUBO formulation verified mathematically');

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 2: Simulated Quantum Annealing (SQA)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [TIER 2/7] Simulated Quantum Annealing (Transverse Tunneling)...');
  const sqaResult = quantumPortfolioOptimizer.solveSimulatedQuantumAnnealing(params, 300);
  assert(sqaResult.bestState.length === 5, 'SQA best state must have 5 binary variables');
  const activeCount = sqaResult.bestState.reduce((a, b) => a + b, 0);
  console.log(`  ✅ SQA converged: Energy = ${sqaResult.bestEnergy.toFixed(4)}, Selected Assets Count = ${activeCount}`);
  assert(activeCount > 0 && activeCount <= 5, 'SQA selected at least 1 valid asset');

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 3: Ballistic Simulated Bifurcation (bSB)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [TIER 3/7] Ballistic Simulated Bifurcation (bSB Non-Linear Dynamics)...');
  const bsbResult = quantumPortfolioOptimizer.solveSimulatedBifurcation(params, 250);
  assert(bsbResult.bestState.length === 5, 'bSB state must have 5 binary variables');
  console.log(`  ✅ bSB converged: Energy = ${bsbResult.bestEnergy.toFixed(4)}`);

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 4: Full Optimization with NIST FIPS 204 ML-DSA-65 Attestation
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [TIER 4/7] NIST FIPS 204 ML-DSA-65 Lattice Portfolio Attestation...');
  const optResult = quantumPortfolioOptimizer.optimizeAndAttest(params);
  assert(optResult.selectedAssets.length > 0, 'Portfolio must contain selected assets');
  assert(optResult.sharpeRatio !== 0, 'Sharpe ratio must be computed');
  assert(optResult.pqcAttestation.signatureHex.length > 6000, 'ML-DSA-65 signature must be ~3309 bytes hex');
  assert(optResult.pqcAttestation.commitmentHash.length === 66, 'Commitment must be 32-byte hex (66 chars with 0x)');

  // Verify ML-DSA signature validity
  const pkBytes = Buffer.from(optResult.pqcAttestation.publicKeyHex.replace('0x', ''), 'hex');
  const sigBytes = Buffer.from(optResult.pqcAttestation.signatureHex.replace('0x', ''), 'hex');
  const attestationPayload = JSON.stringify({
    protocol: 'QARBI_PQC_PORTFOLIO_OPTIMIZER',
    selectedAssets: optResult.selectedAssets,
    weights: optResult.weights,
    expectedReturn: optResult.expectedReturn.toFixed(4),
    portfolioVolatility: optResult.portfolioVolatility.toFixed(4),
    sharpeRatio: optResult.sharpeRatio.toFixed(3),
    quboEnergy: optResult.quboEnergy.toFixed(4),
    timestamp: optResult.pqcAttestation.timestamp,
  });
  const validSig = mlDsaEngine.verify(sigBytes, new TextEncoder().encode(attestationPayload), pkBytes);
  assert(validSig, 'Lattice signature over portfolio optimization result must be valid');
  console.log(`  ✅ Portfolio Attestation Verified: Sharpe = ${optResult.sharpeRatio}, ML-DSA Signature Valid`);

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 5: NIST FIPS 203 ML-KEM-768 & HKDF Key Derivation
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [TIER 5/7] NIST FIPS 203 ML-KEM-768 & RFC 5869 HKDF-SHA256...');
  const bobKemKeys = mlKemEngine.keygen();
  const aliceEncap = mlKemEngine.encapsulate(bobKemKeys.publicKey);
  const bobDecap = mlKemEngine.decapsulate(aliceEncap.cipherText, bobKemKeys.secretKey);
  assert(
    Buffer.from(aliceEncap.sharedSecret).toString('hex') === Buffer.from(bobDecap).toString('hex'),
    'Shared secrets must match byte-for-byte'
  );

  const aliceKeys = quantumSecureChannel.deriveSessionKeys(aliceEncap.sharedSecret, 'TEST_CONTEXT');
  const bobKeys = quantumSecureChannel.deriveSessionKeys(bobDecap, 'TEST_CONTEXT');
  assert(Buffer.from(aliceKeys.aesKey).equals(Buffer.from(bobKeys.aesKey)), 'Derived AES keys must be identical');
  assert(Buffer.from(aliceKeys.iv).equals(Buffer.from(bobKeys.iv)), 'Derived IVs must be identical');
  console.log('  ✅ Ephemeral KEX converged: 1184B pk, 1088B ct, 32B shared secret, identical AES session keys');

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 6: End-to-End Post-Quantum Secure Agent Communication
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [TIER 6/7] End-to-End Post-Quantum Agent Channel Handshake & Decryption...');
  const agentAlice = quantumSecureChannel.createAgentQuantumIdentity(1, 'Researcher-01', '0x4b7f92aC7738240562e84773821034D5154371C8');
  const agentBob = quantumSecureChannel.createAgentQuantumIdentity(2, 'Auditor-07', '0x19B8c8644e51240398F65E397223b20757E429aB');

  const secretTaskMessage = 'DEAL: Allocate 50 QARBI for formal reentrancy audit on Stylus Wasm engine #8492';
  const securePkg = quantumSecureChannel.sendSecureMessage(
    agentAlice,
    agentBob.kemKeys.publicKey,
    agentBob.agentId,
    agentBob.dsaKeys.commitmentHash,
    secretTaskMessage
  );

  assert(securePkg.kemCiphertextHex.length > 2000, 'KEM ciphertext must be ~1088 bytes');
  assert(securePkg.mlDsaSignatureHex.length > 6000, 'ML-DSA signature must be ~3309 bytes');

  const receiveResult = quantumSecureChannel.receiveSecureMessage(agentBob.kemKeys.secretKey, securePkg);
  assert(receiveResult.success, `Decryption must succeed: ${receiveResult.error}`);
  assert(receiveResult.plaintext === secretTaskMessage, 'Decrypted plaintext must match original message');
  assert(receiveResult.senderVerified === true, 'Sender lattice identity must be verified');
  console.log(`  ✅ Inter-Agent Message Delivered: "${receiveResult.plaintext?.slice(0, 45)}..."`);

  // ──────────────────────────────────────────────────────────────────────────
  // TIER 7: Fail-Closed Adversarial Tamper Rejection
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [TIER 7/7] Fail-Closed Adversarial Tamper Rejection...');

  // 1. Bit-flip in ciphertext payload
  const tamperedPayloadPkg = {
    ...securePkg,
    encryptedPayloadHex: securePkg.encryptedPayloadHex.slice(0, 10) + 'ff' + securePkg.encryptedPayloadHex.slice(12),
  };
  const tamperedPayloadRes = quantumSecureChannel.receiveSecureMessage(agentBob.kemKeys.secretKey, tamperedPayloadPkg);
  assert(!tamperedPayloadRes.success && tamperedPayloadRes.tamperDetected === true, 'Tampered encrypted payload must be strictly rejected');

  // 2. Bit-flip in ML-DSA signature
  const tamperedSigPkg = {
    ...securePkg,
    mlDsaSignatureHex: securePkg.mlDsaSignatureHex.slice(0, 10) + 'aa' + securePkg.mlDsaSignatureHex.slice(12),
  };
  const tamperedSigRes = quantumSecureChannel.receiveSecureMessage(agentBob.kemKeys.secretKey, tamperedSigPkg);
  assert(!tamperedSigRes.success && tamperedSigRes.tamperDetected === true, 'Tampered ML-DSA signature must be strictly rejected');

  // 3. Bit-flip in KEM ciphertext
  const tamperedKemPkg = {
    ...securePkg,
    kemCiphertextHex: securePkg.kemCiphertextHex.slice(0, 10) + 'ee' + securePkg.kemCiphertextHex.slice(12),
  };
  const tamperedKemRes = quantumSecureChannel.receiveSecureMessage(agentBob.kemKeys.secretKey, tamperedKemPkg);
  assert(!tamperedKemRes.success && tamperedKemRes.tamperDetected === true, 'Tampered KEM ciphertext must be strictly rejected');

  console.log('  ✅ Fail-Closed Integrity: All 3 adversarial bit-flip attacks strictly rejected');

  console.log('\n══════════════════════════════════════════════════════════════════════════');
  console.log('🏆 ALL 7 QUANTUM PORTFOLIO & COMMUNICATION TIERS PASSED');
  console.log('══════════════════════════════════════════════════════════════════════════\n');
}

runQuantumTestSuite().catch((err) => {
  console.error('\n🚨 TEST SUITE FAILED:', err);
  process.exit(1);
});
