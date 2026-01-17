import { NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";
import type { AskRequest } from "@/lib/ai/types";

export const runtime = "nodejs";

const lastHit = new Map<string, number>();
const COOLDOWN_MS = 900;

function getIP(req: Request) {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

function isDemoMode() {
  return process.env.DEMO_MODE === "true";
}

function demoReply(messages: { role: string; content: string }[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = (lastUser?.content || "").toLowerCase();

  if (text.includes("econ") || text.includes("economics")) {
    return 'Demo mode ✅ Econ: For "Evaluate", do 2 balanced points + evidence, then finish with a judgement sentence ("Overall, X is more significant because...").';
  }
  if (text.includes("geo") || text.includes("geography")) {
    return "Demo mode ✅ Geo: Use a named case study + explain impacts + evaluate (strength/limit) to hit higher bands.";
  }
  if (
    text.includes("command term") ||
    text.includes("evaluate") ||
    text.includes("discuss") ||
    text.includes("to what extent")
  ) {
    return "Demo mode ✅ Command terms: Discuss = balanced arguments. Evaluate = evidence + judgement + limitations. To what extent = argue both sides + final stance.";
  }

  return "Demo mode is ON ✅ (No API calls). Ask me an IB question like: “Econ HL Paper 1 10-mark: how do I evaluate?”";
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req);
    const now = Date.now();
    const prev = lastHit.get(ip) || 0;

    if (now - prev < COOLDOWN_MS) {
      return NextResponse.json(
        { reply: "Slow down a bit 😄 Try again in a second." },
        { status: 429 }
      );
    }

    lastHit.set(ip, now);

    const body = (await req.json()) as AskRequest;
    if (!body?.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ reply: "Bad request." }, { status: 400 });
    }

    // ✅ DEMO MODE: do NOT call Gemini
    if (isDemoMode()) {
      return NextResponse.json({ reply: demoReply(body.messages) });
    }

    // ✅ LIVE MODE
    const reply = await askGemini(body.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("API /api/ask error:", err);
    return NextResponse.json(
      { reply: "Server error. Check env vars + logs." },
      { status: 500 }
    );
  }
}