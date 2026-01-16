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

    const reply = await askGemini(body.messages);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Server error. Check env vars + logs." },
      { status: 500 }
    );
  }
}
