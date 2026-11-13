import { Buffer } from "node:buffer";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { ethers } from "ethers";
import { quantumPortfolioOptimizer } from "../crypto/quantum/portfolio-optimizer.js";
import { handleGeminiRequest } from "./task-planning.js";

const unavailable = new Set([
  "/stylus/evolve", "/quantum/secure-send", "/quantum/secure-receive",
  "/v1/x402/conway/step", "/v1/x402/pqc-attest", "/webhooks/quicknode-stream",
  "/quicknode/streams-events", "/quicknode/auto-configure", "/quicknode/simulate-stream-event",
]);

function json(status: number, data: unknown): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function qarbiApi(request: Request): Promise<Response> {
  const route = new URL(request.url).pathname.replace(/^\/(?:\.netlify\/functions\/)?api(?=\/|$)/, "");
  if (route === "/health" && request.method === "GET") {
    return json(200, {
      status: "ok", network: "Arbitrum Sepolia", chainId: 421614, release: "testnet-preview",
      conwayRuntime: "solidity-evm", x402: "unavailable", quicknode: "unavailable",
    });
  }
  if (route === "/quicknode/status" && request.method === "GET") {
    return json(200, { configured: false, status: "unavailable", reason: "The preview uses the public testnet RPC." });
  }
  if (unavailable.has(route)) {
    return json(503, { error: "This integration is unavailable in the testnet preview." });
  }
  if (!["/gemini/plan-task", "/gemini/agent-chat", "/crypto/pqc-generate", "/quantum/portfolio-optimize"].includes(route)) {
    return json(404, { error: "API route not found." });
  }
  if (request.method !== "POST") return json(405, { error: "Use POST for this endpoint." });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json(415, { error: "Use Content-Type application/json." });
  }
  const body = await request.text();
  if (Buffer.byteLength(body) > 8192) return json(413, { error: "Request body is too large." });
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return json(400, { error: "Provide a JSON request body." });
  }

  try {
    if (route.startsWith("/gemini/")) {
      const result = await handleGeminiRequest(route === "/gemini/plan-task" ? "plan" : "chat", input);
      return json(result.status, result.data);
    }
    if (route === "/crypto/pqc-generate") {
      const { publicKey, secretKey } = ml_dsa65.keygen();
      try {
        const commitment = ethers.keccak256(publicKey);
        const message = "QARBI:ML-DSA-65:TESTNET_ATTESTATION:" + commitment;
        return json(200, { success: true, algorithm: "ML-DSA-65", message, commitment, publicKeyHex: ethers.hexlify(publicKey),
          attestationSignature: ethers.hexlify(ml_dsa65.sign(ethers.toUtf8Bytes(message), secretKey)),
          purpose: "one-time-signature-sample" });
      } finally {
        secretKey.fill(0);
      }
    }
    return json(200, { success: true, inputSource: "bundled-research-dataset", execution: "classical",
      result: quantumPortfolioOptimizer.optimizeAndAttest() });
  } catch {
    return json(500, { error: "The request could not be completed." });
  }
}
