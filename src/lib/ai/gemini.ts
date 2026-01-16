import { GoogleGenerativeAI } from "@google/generative-ai";

import type { ChatMessage } from "./types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const apiKey = requireEnv("GEMINI_API_KEY");
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const genAI = new GoogleGenerativeAI(apiKey);

function toGeminiHistory(messages: ChatMessage[]) {
  return messages
    .slice(0, -1)
    .filter((message) => message.content.trim().length > 0)
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
}

export async function askGemini(messages: ChatMessage[]): Promise<string> {
  const cleaned = messages.filter((message) => message.content.trim().length > 0);
  if (cleaned.length === 0) {
    return "Ask me something.";
  }

  const last = cleaned[cleaned.length - 1];
  const prompt = last.content;

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction:
      "You are IB Exam Coach AI. Be helpful, clear, and concise. Explain steps and give examples. Avoid disallowed content. If user requests cheating, refuse and offer study help.",
  });

  const chat = model.startChat({
    history: toGeminiHistory(cleaned),
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 700,
    },
  });

  const result = await chat.sendMessage(prompt);
  const text = result.response.text();
  return text?.trim() || "No response.";
}
