import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import type { PracticeSession } from "@/lib/storage";

export const runtime = "nodejs";

type PracticeFeedbackRequest = {
  session?: PracticeSession;
  answer?: string;
};

const demoFeedback = (session?: PracticeSession) => ({
  mode: "demo" as const,
  feedback:
    `**Demo feedback**\n\n- Add more explicit Economics terminology for ${session?.topic ?? "this topic"}.\n- Use one clear diagram/model and explain what shifts or changes.\n- End with a judgement that weighs stakeholders and short-run vs long-run effects.`,
  weaknessTags: ["weak evaluation", "diagram weak", "weak terminology"],
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PracticeFeedbackRequest;
    const answer = body.answer?.trim() ?? "";

    if (!answer) {
      return NextResponse.json(
        { error: "Answer text is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const useDemoMode = process.env.DEMO_MODE === "true" || !apiKey;

    if (useDemoMode) {
      return NextResponse.json(demoFeedback(body.session));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction:
        "You are Exam Coach. Give concise IB Economics practice feedback. Be specific, practical, and honest. Do not claim official marking.",
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 900,
      },
    });

    const prompt = `Review this IB Economics practice answer.

Session:
- Subject: ${body.session?.subject ?? "unknown"}
- Level: ${body.session?.level?.toUpperCase() ?? "unknown"}
- Paper: ${body.session?.paper ?? "unknown"}
- Topic: ${body.session?.topic ?? "unknown"}
- Command term: ${body.session?.commandTerm ?? "unknown"}
- Marks: ${body.session?.marks ?? "unknown"}

Return concise markdown with:
- **Overall**
- **What worked**
- **What to fix**
- **Next rewrite target**
- **Weakness tags** as a comma-separated final line using only tags like weak evaluation, diagram weak, weak terminology, descriptive not analytical, poor application to article, weak data use, weak conclusion, poor stakeholder analysis.

Answer:
${answer}`;

    const result = await model.generateContent(prompt, { timeout: 60_000 });
    const text = result.response.text()?.trim() || "";
    const tagLine = text
      .split("\n")
      .find((line) => line.toLowerCase().includes("weakness tags"));
    const weaknessTags =
      tagLine
        ?.replace(/^\s*[-*]?\s*\*\*?weakness tags\*\*?:?/i, "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5) ?? [];

    return NextResponse.json({
      mode: "gemini" as const,
      feedback: text || demoFeedback(body.session).feedback,
      weaknessTags,
    });
  } catch (error) {
    console.error("[practice-feedback]", error);
    return NextResponse.json(
      { error: "Unable to generate practice feedback right now." },
      { status: 500 }
    );
  }
}
