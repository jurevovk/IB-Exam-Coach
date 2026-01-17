import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import type { ChatMessage } from "./types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const apiKey = requireEnv("GEMINI_API_KEY");
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(apiKey);

function toGeminiContents(messages: ChatMessage[]): Content[] {
  const cleaned = messages
    .map((m) => ({ ...m, content: (m.content || "").trim() }))
    .filter((m) => m.content.length > 0)
    // drop the very first “assistant greeting” if it exists
    .filter((m, i) => !(i === 0 && m.role === "assistant"));

  // Gemini requires the first content role to be "user".
  // So strip any leading assistant/model messages until we hit a user.
  while (cleaned.length > 0 && cleaned[0].role !== "user") cleaned.shift();

  // If somehow there's still no user message, create a minimal one.
  if (cleaned.length === 0) {
    return [
      {
        role: "user",
        parts: [{ text: "Hi. Help me study for IB." }],
      },
    ];
  }

  return cleaned.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function askGemini(messages: ChatMessage[]): Promise<string> {
  const contents = toGeminiContents(messages);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction:
      "You are IB Exam Coach AI. Be helpful, clear, and concise. Explain steps and give examples. If user requests cheating, refuse and offer legitimate study help.",
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 700,
    },
  });

  const result = await model.generateContent({ contents });
  const text = result.response.text();
  return text?.trim() || "No response.";
}