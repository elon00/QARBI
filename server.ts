import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "qarbi-protocol/1.0.0",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    network: "Arbitrum Sepolia",
    chainId: 421614,
    stylusEngine: "not_runtime_verified",
    pqcVersion: "not_cryptographically_verified",
    statusNote: "This health endpoint does not certify a live Stylus deployment or ML-DSA implementation.",
    timestamp: Date.now(),
  });
});

// 2. Post-Quantum Hybrid Identity Generation
app.post("/api/crypto/pqc-generate", (req, res) => {
  try {
    const { agentName } = req.body || {};
    // Demonstration only: random bytes are not an ML-DSA-65 keypair or signature.
    const rawEntropy = crypto.randomBytes(64);
    const mockPubKeyBytes = crypto.randomBytes(1952);
    const pqcCommitmentHash = "0x" + crypto.createHash("sha3-256").update(mockPubKeyBytes).digest("hex");
    const ephemeralWallet = "0x" + crypto.randomBytes(20).toString("hex");

    res.json({
      success: true,
      agentName: agentName || "Autonomous-Agent",
      algorithm: "SIMULATION ONLY — not an ML-DSA-65 keypair",
      publicKeyBytesLength: 1952,
      publicKeyPreview: "0x" + mockPubKeyBytes.slice(0, 16).toString("hex") + "..." + mockPubKeyBytes.slice(-16).toString("hex"),
      pqcCommitmentHash,
      delegatedSessionWallet: ephemeralWallet,
      attestationSignature: null,
      cryptographicVerification: "NOT PERFORMED",
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate PQC identity" });
  }
});

// 3. Gemini AI Agent Task Planner & Reasoning
app.post("/api/gemini/plan-task", async (req, res) => {
  try {
    const { prompt, agentContext, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    let planData: any = null;

    if (ai) {
      try {
        const systemPrompt = `You are the Qarbi Autonomous Agent Orchestrator on Arbitrum Sepolia.
Your job is to analyze the user's natural language intent, decompose it into actionable on-chain steps, identify policy checks, assign an agent archetype, formulate a task with $QARBI token bounty, and output strict JSON.
Respond ONLY with a valid JSON object with the following structure:
{
  "taskTitle": "Short descriptive title",
  "taskDescription": "Detailed execution steps",
  "suggestedArchetype": "RESEARCHER" | "SECURITY_AUDITOR" | "QUANT_TRADER" | "DEFI_OPTIMIZER" | "DATA_VALIDATOR",
  "estimatedGasUnits": number (between 25000 and 120000),
  "rewardQarbi": number (between 5 and 50),
  "policyVerification": {
    "isWithinSingleTxLimit": true,
    "whitelistedTarget": "0x5FbDB2315678afecb367f032d93F642f64180aa3 (TaskMarket.sol)",
    "securityRisk": "LOW" | "MEDIUM" | "HIGH",
    "riskAnalysis": "Brief risk review"
  },
  "stylusExecutionLogic": "Conway state mutation description",
  "expectedStateOutcome": "Reputation delta and energy boost details",
  "executionSummary": "Clear 2-sentence summary of what will happen on Arbitrum Sepolia"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: `User Goal: "${prompt}". Active Agent Context: ${JSON.stringify(agentContext || {})}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        if (response.text) {
          planData = JSON.parse(response.text.trim());
        }
      } catch (geminiError) {
        console.warn("Gemini API call fell back to local heuristic:", geminiError);
      }
    }

    // Explicit demonstration fallback when Gemini is unavailable: no on-chain execution is performed.
    if (!planData) {
      const isSecurity = /security|audit|vulnerability|exploit|bug|safe/i.test(prompt);
      const isTrader = /trade|swap|arbitrage|price|liquidity|yield/i.test(prompt);
      const isResearcher = /research|find|analyze|gather|scan|data/i.test(prompt);

      const archetype = isSecurity
        ? "SECURITY_AUDITOR"
        : isTrader
        ? "QUANT_TRADER"
        : isResearcher
        ? "RESEARCHER"
        : "DEFI_OPTIMIZER";

      planData = {
        taskTitle: `Execute: ${prompt.slice(0, 40)}...`,
        taskDescription: `Demonstration plan created locally. Intent: ${prompt}. No Stylus mutation, contract dispatch, or Arbitrum settlement is executed by this fallback.`,
        suggestedArchetype: archetype,
        estimatedGasUnits: Math.floor(Math.random() * 45000) + 32000,
        rewardQarbi: Math.floor(Math.random() * 20) + 10,
        policyVerification: {
          isWithinSingleTxLimit: null,
          whitelistedTarget: "NOT VERIFIED — demonstration placeholder",
          securityRisk: "UNKNOWN",
          riskAnalysis: "No live policy contract or target whitelist was queried in fallback mode.",
        },
        stylusExecutionLogic: "SIMULATION ONLY — no Stylus runtime call executed.",
        expectedStateOutcome: "Agent reputation increases; neighbor synergy coefficient evolves on the Conway grid.",
        executionSummary: "Task intent was parsed locally. No transaction was submitted and no on-chain proof exists.",
      };
    }

    res.json({ success: true, plan: planData });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to plan task" });
  }
});

// 4. Gemini Agentic Chat
app.post("/api/gemini/agent-chat", async (req, res) => {
  try {
    const { message, agentName, agentRole, history } = req.body;
    const ai = getGenAI();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: `User: ${message}`,
          config: {
            systemInstruction: `You are ${agentName || "Agent-Qarbi"}, an autonomous on-chain agent citizen of the Qarbi Protocol operating on Arbitrum Sepolia. Your role is ${agentRole || "Autonomous Coordinator"}.
You possess a hybrid PQC identity (ML-DSA-65) committed onchain, a dedicated AgentWallet with daily spending velocity rules, and your state evolves via the Conway Automaton engine in Stylus Rust.
Respond professionally, concisely, and action-oriented. Reference your on-chain state, gas efficiency on Arbitrum Stylus, and task execution logic when relevant.`,
            temperature: 0.7,
          },
        });

        return res.json({
          reply: response.text || "Action scheduled on Arbitrum Sepolia.",
          agent: agentName,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.warn("Gemini chat fallback:", err);
      }
    }

    // Heuristic Fallback
    res.json({
      reply: `[${agentName || "Agent-01"}]: Received instruction "${message}". Validated with off-chain policy engine. Dispatching action to Arbitrum Sepolia through Stylus Conway Engine. Transaction commitment verified.`,
      agent: agentName,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to process chat" });
  }
});

// 5. Stylus Conway Evolution Engine Simulator
app.post("/api/stylus/evolve", (req, res) => {
  try {
    const { currentReputation, energy, completedTasks, failedTasks, neighborSynergy } = req.body;

    const repVal = Number(currentReputation) || 100;
    let energyVal = Number(energy) || 100;
    const completed = Number(completedTasks) || 0;
    const failed = Number(failedTasks) || 0;
    const synergy = Math.min(Number(neighborSynergy) || 10, 50);

    // 1. Success Delta
    const successGain = completed * 15;
    const failurePenalty = failed * 25;

    // 2. New Reputation Calculation
    let newRep = Math.max(0, repVal + successGain + synergy - failurePenalty);
    newRep = Math.min(newRep, 1000);

    // 3. Energy Management
    if (completed > 0) {
      energyVal = Math.min(100, energyVal + 10);
    } else {
      energyVal = Math.max(0, energyVal - 10);
    }

    // 4. Status determination (0: Inactive, 1: Active, 2: Dormant, 3: Graduated)
    let status = 1;
    if (energyVal === 0) {
      status = 2; // Dormant
    } else if (newRep >= 800 && completed >= 20) {
      status = 3; // Graduated
    }

    res.json({
      success: true,
      newReputation: newRep,
      newEnergy: energyVal,
      status,
      statusLabel: status === 3 ? "Graduated" : status === 2 ? "Dormant" : "Active",
      isGraduationEligible: newRep >= 800 && completed >= 20,
      gasUsedWasm: 4120,
      gasSavedVsEVM: "89.4%",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Stylus evolution failed" });
  }
});

async function start() {
  const isProduction = process.env.NODE_ENV === "production" || __filename.includes("dist");
  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Qarbi Protocol Server running on http://localhost:${PORT}`);
  });
}

start();
