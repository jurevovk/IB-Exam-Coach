import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import {
  gradeEconomicsIaLocally,
  type EconomicsIaRequest,
  type EconomicsIaResult,
} from "@/lib/economics/ia";

export const runtime = "nodejs";

type EconomicsIaApiRequest = EconomicsIaRequest & {
  history?: Array<{
    input: EconomicsIaRequest;
  }>;
};

const parseJson = (text: string) => {
  const trimmed = text.trim();
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : trimmed.slice(
        Math.max(0, trimmed.indexOf("{")),
        trimmed.lastIndexOf("}") + 1
      );

  if (!jsonText.startsWith("{") || !jsonText.endsWith("}")) {
    throw new Error("No JSON object found.");
  }

  return JSON.parse(jsonText) as Partial<EconomicsIaResult>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EconomicsIaApiRequest;

    if (!body.commentaryText?.trim()) {
      return NextResponse.json(
        { error: "Commentary text is required." },
        { status: 400 }
      );
    }

    const history = (body.history ?? []).map((item, index) => ({
      id: `history-${index}`,
      createdAt: new Date().toISOString(),
      input: item.input,
      result: gradeEconomicsIaLocally(item.input, []),
    }));
    const localResult = gradeEconomicsIaLocally(body, history);
    const apiKey = process.env.GEMINI_API_KEY;
    const useDemoMode = process.env.DEMO_MODE === "true" || !apiKey;

    if (useDemoMode) {
      return NextResponse.json(localResult);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction:
        "You are an IB Economics IA commentary reviewer. Return only JSON. Be concise, rubric-based, and honest. Do not claim official marking.",
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const prompt = `Review one IB Economics IA commentary using criteria A-E only.

Criteria:
- A Diagrams, 3 marks
- B Terminology, 2 marks
- C Application and analysis, 3 marks
- D Key concept, 3 marks
- E Evaluation, 3 marks

Portfolio F should be treated only as checks/warnings, not part of this commentary mark.

Return JSON with:
{
  "criteria": [{"id":"A","title":"Diagrams","maxMarks":3,"mark":0,"justification":"string","nextStep":"string"}],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "diagramGuidance": "string",
  "evaluationGuidance": "string",
  "weaknessTags": ["weak evaluation", "diagram weak"]
}

Article:
- Title: ${body.articleTitle}
- Source: ${body.source}
- Date: ${body.datePublished}
- Unit: ${body.unit}
- Key concept: ${body.keyConcept}
- URL: ${body.articleUrl ?? "not provided"}

Article text:
${body.articleText || "[not provided]"}

Commentary:
${body.commentaryText}`;

    try {
      const response = await model.generateContent(prompt, { timeout: 60_000 });
      const parsed = parseJson(response.response.text() ?? "");

      return NextResponse.json({
        ...localResult,
        ...parsed,
        mode: "gemini",
        estimatedTotal:
          parsed.criteria?.reduce(
            (total, criterion) => total + (criterion.mark ?? 0),
            0
          ) ?? localResult.estimatedTotal,
        maxTotal: 14,
        warnings: localResult.warnings,
        portfolioChecks: localResult.portfolioChecks,
        disclaimer: localResult.disclaimer,
      });
    } catch (error) {
      console.error("[economics-ia] Gemini fallback:", error);
      return NextResponse.json({
        ...localResult,
        mode: "demo",
        warnings: [
          ...localResult.warnings,
          "Gemini response could not be used, so local rubric heuristics were applied.",
        ],
      });
    }
  } catch (error) {
    console.error("[economics-ia]", error);
    return NextResponse.json(
      { error: "Unable to grade this Economics IA commentary right now." },
      { status: 500 }
    );
  }
}
