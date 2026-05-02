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
    return '**Demo mode** ✅\n\nFor Econ "Evaluate" questions:\n\n- Make 2 balanced points with evidence.\n- Add one limitation or counterargument.\n- Finish with a judgement sentence: "Overall, X is more significant because..."';
  }
  if (text.includes("geo") || text.includes("geography")) {
    return "**Demo mode** ✅\n\nFor Geography:\n\n- Use a named case study.\n- Explain impacts clearly.\n- Add a strength or limitation to reach higher bands.";
  }
  if (
    text.includes("command term") ||
    text.includes("evaluate") ||
    text.includes("discuss") ||
    text.includes("to what extent")
  ) {
    return "**Demo mode** ✅\n\nCommand term quick guide:\n\n- **Discuss**: balanced arguments.\n- **Evaluate**: evidence + judgement + limitations.\n- **To what extent**: both sides + a clear final stance.";
  }

  return "Demo mode is ON ✅\n\nAsk me an IB question like:\n\n- Econ HL Paper 1: how do I evaluate?\n- English Paper 2: how do I structure a comparison?\n- Biology IA: how do I improve my analysis?";
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
