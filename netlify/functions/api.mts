import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

export default async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/api/, "").replace(/^\/api/, "");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  if (path === "/health" || path === "" || path === "/") {
    return new Response(JSON.stringify({
      status: "ok",
      network: "Arbitrum Sepolia",
      chainId: 421614,
      stylusEngine: "not_verified_by_this_api",
      pqcVersion: "UNVERIFIED-PQC-COMMITMENT",
      timestamp: Date.now(),
    }), { status: 200, headers });
  }

  if (path === "/crypto/pqc-generate" && req.method === "POST") {
    const placeholderPubKeyBytes = crypto.randomBytes(1952);
    const pqcCommitmentHash = "0x" + crypto.createHash("sha3-256").update(placeholderPubKeyBytes).digest("hex");
    const ephemeralWallet = "0x" + crypto.randomBytes(20).toString("hex");
    return new Response(JSON.stringify({
      success: true,
      algorithm: "UNVERIFIED-PQC-COMMITMENT",
      publicKeyBytesLength: 1952,
      publicKeyPreview: "0x" + placeholderPubKeyBytes.slice(0, 16).toString("hex") + "..." + placeholderPubKeyBytes.slice(-16).toString("hex"),
      warning: "Development placeholder only; not an ML-DSA-65 key or signature.",
      pqcCommitmentHash,
      delegatedSessionWallet: ephemeralWallet,
      attestationSignature: null,
      generatedAt: new Date().toISOString(),
    }), { status: 200, headers });
  }

  if (path === "/gemini/plan-task" && req.method === "POST") {
    try {
      const body = await req.json();
      const { prompt, agentContext } = body;
      if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return new Response(JSON.stringify({ success: false, error: "prompt is required" }), { status: 400, headers });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return new Response(JSON.stringify({ success: false, error: "Gemini API is not configured; no simulated plan is returned." }), { status: 503, headers });
      }
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = `You are the Qarbi Autonomous Agent Orchestrator. Return strict JSON only. Do not claim that an action was executed on-chain. Fields: taskTitle, taskDescription, suggestedArchetype, estimatedGasUnits, rewardQarbi, policyVerification.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\nUser Prompt: ${prompt}\nAgent Context: ${JSON.stringify(agentContext ?? {})}` }] }],
        config: { responseMimeType: "application/json" },
      });
      const parsed = JSON.parse(response.text || "{}");
      return new Response(JSON.stringify({ success: true, plan: parsed, execution: "planning_only" }), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: "Unable to generate a verified AI plan", details: error instanceof Error ? error.message : "unknown error" }), { status: 502, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers });
};
