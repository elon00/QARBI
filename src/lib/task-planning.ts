import { GoogleGenAI } from "@google/genai";

export interface TaskPlan {
  taskTitle: string;
  taskDescription: string;
  suggestedArchetype: string;
}

export function isTaskPlan(value: unknown): value is TaskPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Record<string, unknown>;
  return Object.entries({ taskTitle: 120, taskDescription: 1800, suggestedArchetype: 80 }).every(([key, max]) => {
    const field = plan[key];
    return typeof field === "string" && field.trim().length > 0 && field.length <= max;
  });
}

export async function handleGeminiRequest(kind: "plan" | "chat", body: unknown) {
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const raw = input[kind === "plan" ? "prompt" : "message"];
  if (typeof raw !== "string" || !raw.trim() || raw.length > 2000) {
    return { status: 400, data: { error: "Provide a non-empty message of at most 2,000 characters." } };
  }
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "your_gemini_api_key_here" || !model) {
    return { status: 503, data: { error: "AI is unavailable. Configure the Gemini API key and model." } };
  }

  const plan = kind === "plan";
  try {
    const client = new GoogleGenAI({ apiKey, httpOptions: { timeout: 8000 } });
    const response = await client.models.generateContent({
      model,
      contents: raw.trim(),
      config: {
        systemInstruction: plan
          ? "Draft a read-only proposal for the QARBI Arbitrum Sepolia testnet. Return JSON with taskTitle (120 characters), taskDescription (1800 characters), and suggestedArchetype (80 characters). Do not claim to have scheduled, signed, sent, or verified a transaction. Do not provide executable transaction data."
          : "Answer questions about QARBI as a read-only assistant. You cannot sign, submit, schedule, or verify transactions. Distinguish proposals from observed outcomes.",
        maxOutputTokens: 800,
        ...(plan ? { responseMimeType: "application/json" } : {}),
      },
    });
    const answer = response.text?.trim();
    if (!answer) throw new Error("Empty provider response");
    if (!plan) return { status: 200, data: { reply: answer, execution: "none" } };
    const result: unknown = JSON.parse(answer);
    if (!isTaskPlan(result)) throw new Error("Invalid plan shape");
    const { taskTitle, taskDescription, suggestedArchetype } = result;
    return { status: 200, data: {
      success: true, execution: "none", plan: { taskTitle, taskDescription, suggestedArchetype },
    } };
  } catch {
    return { status: 502, data: { error: "Gemini could not return a valid response. Try again later." } };
  }
}
