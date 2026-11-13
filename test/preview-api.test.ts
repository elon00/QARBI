import { strict as assert } from "node:assert";
import { test } from "node:test";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { ethers } from "ethers";
import handler from "../netlify/functions/api.mts";

const base = "https://qarbi.example";
function post(path: string, body: unknown) {
  return handler(new Request(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
}

test("preview reports chain and release scope", async () => {
  const response = await handler(new Request(base + "/api/health"));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.chainId, 421614);
  assert.equal(data.release, "testnet-preview");
  assert.equal(data.conwayRuntime, "solidity-evm");
});

test("planner requires input and provider configuration", async () => {
  assert.equal((await post("/api/gemini/plan-task", {})).status, 400);
  const previous = process.env.GEMINI_MODEL;
  try {
    delete process.env.GEMINI_MODEL;
    const response = await post("/api/gemini/plan-task", { prompt: "Draft a testnet task" });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).plan, undefined);
  } finally {
    if (previous !== undefined) process.env.GEMINI_MODEL = previous;
  }
});

test("unavailable integrations fail explicitly without accepting payment or keys", async () => {
  for (const path of ["/api/v1/x402/conway/step", "/api/v1/x402/pqc-attest",
    "/api/quantum/secure-receive", "/api/quicknode/auto-configure", "/api/stylus/evolve"]) {
    const response = await post(path, {});
    assert.equal(response.status, 503, path);
    assert.equal(response.headers.has("PAYMENT-REQUIRED"), false);
  }
});

test("the returned signature and commitment verify independently", async () => {
  const response = await post("/api/crypto/pqc-generate", {});
  assert.equal(response.status, 200);
  const { publicKeyHex, message, commitment, attestationSignature } = await response.json();
  const publicKey = ethers.getBytes(publicKeyHex);
  const signature = ethers.getBytes(attestationSignature);
  assert.equal(ethers.keccak256(publicKey), commitment);
  assert(ml_dsa65.verify(signature, ethers.toUtf8Bytes(message), publicKey));
  assert(!ml_dsa65.verify(signature, ethers.toUtf8Bytes(message + "!"), publicKey));
});
