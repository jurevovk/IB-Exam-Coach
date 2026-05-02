import {
  GoogleGenerativeAI,
  SchemaType,
  type ResponseSchema,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

import { buildGradeWorkPrompt } from "@/lib/grade-work/buildPrompt";
import {
  normalizeGradeWorkResult,
  parseAiGradeWorkJson,
} from "@/lib/grade-work/normalizeResult";
import type {
  AiGradeWorkResult,
  GradeWorkRequest,
} from "@/lib/grade-work/types";
import { getEeSubjectGuidance } from "@/lib/rubrics/ee/subjectGuidance";
import { firstExams2027EeRubric } from "@/lib/rubrics/ee/firstExams2027";
import { pre2027EeRubric } from "@/lib/rubrics/ee/pre2027";
import {
  eeSubjectLabels,
  type EeCriterionId,
  type EeRubric,
  type EeSubject,
} from "@/lib/rubrics/types";

export const runtime = "nodejs";

type GradeWorkErrorCode =
  | "request_parse_failed"
  | "validation_failed"
  | "payload_too_large"
  | "gemini_unavailable"
  | "gemini_timeout"
  | "gemini_empty_response"
  | "response_parse_failed"
  | "response_invalid"
  | "normalization_failed"
  | "unknown";

class GradeWorkApiError extends Error {
  constructor(
    public code: GradeWorkErrorCode,
    public safeMessage: string,
    public status = 500,
    message = safeMessage
  ) {
    super(message);
  }
}

const rubrics: Record<GradeWorkRequest["rubricVersion"], EeRubric> = {
  "pre-2027": pre2027EeRubric,
  "first-exams-2027": firstExams2027EeRubric,
};
const expectedCriterionIds: EeCriterionId[] = ["A", "B", "C", "D", "E"];
const supportedSubjects: EeSubject[] = [
  "computer-science",
  "mathematics",
  "economics",
];

const maxEssayCharacters = 120_000;
const maxReflectionCharacters = 30_000;

const stringArraySchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  items: { type: SchemaType.STRING },
  maxItems: 5,
};

const gradeWorkResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    overallSummary: { type: SchemaType.STRING },
    criteria: {
      type: SchemaType.ARRAY,
      minItems: 5,
      maxItems: 5,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          criterionId: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["A", "B", "C", "D", "E"],
          },
          mark: { type: SchemaType.NUMBER, nullable: true },
          gradable: { type: SchemaType.BOOLEAN },
          justification: { type: SchemaType.STRING },
          evidenceSnippets: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            maxItems: 2,
          },
          detectedSignals: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            maxItems: 3,
          },
          strengths: stringArraySchema,
          weaknesses: stringArraySchema,
          nextStep: { type: SchemaType.STRING },
        },
        required: [
          "criterionId",
          "mark",
          "gradable",
          "justification",
          "evidenceSnippets",
          "detectedSignals",
          "strengths",
          "weaknesses",
          "nextStep",
        ],
      },
    },
    strengths: stringArraySchema,
    weaknesses: stringArraySchema,
    topImprovements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      maxItems: 3,
    },
    confidenceNote: { type: SchemaType.STRING },
  },
  required: [
    "overallSummary",
    "criteria",
    "strengths",
    "weaknesses",
    "topImprovements",
    "confidenceNote",
  ],
};

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `grade-work-${Date.now()}`;
};

const logGradeWork = (
  requestId: string,
  stage: string,
  details: Record<string, unknown>
) => {
  console.info("[grade-work]", { requestId, stage, ...details });
};

const logGradeWorkError = (
  requestId: string,
  stage: string,
  error: unknown,
  details: Record<string, unknown> = {}
) => {
  console.error("[grade-work]", {
    requestId,
    stage,
    error: error instanceof Error ? error.message : String(error),
    ...details,
  });
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const estimateMark = ({
  essay,
  maxMarks,
  strongSignals,
  mediumSignals,
}: {
  essay: string;
  maxMarks: number;
  strongSignals: string[];
  mediumSignals: string[];
}) => {
  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  let ratio = wordCount > 2500 ? 0.55 : wordCount > 900 ? 0.4 : 0.25;

  if (includesAny(essay, mediumSignals)) {
    ratio += 0.15;
  }

  if (includesAny(essay, strongSignals)) {
    ratio += 0.2;
  }

  return Math.max(1, Math.min(maxMarks, Math.round(maxMarks * ratio)));
};

function buildDemoAiResult(
  input: GradeWorkRequest,
  rubric: EeRubric
): AiGradeWorkResult {
  const essay = input.essayText.toLowerCase();
  const hasReflection = Boolean(input.reflectionText?.trim());
  const subjectGuidance = getEeSubjectGuidance(
    input.subject,
    input.rubricVersion
  );
  const isMathematics = input.subject === "mathematics";
  const isEconomics = input.subject === "economics";
  const criteria = rubric.criteria.map((criterion) => {
    const common = {
      criterionId: criterion.id as EeCriterionId,
      gradable: true,
      strengths: ["Some relevant evidence is visible in the pasted text."],
      weaknesses: ["The estimate may miss formatting or source details."],
    };

    if (criterion.id === "E" && !hasReflection) {
      return {
        ...common,
        mark: null,
        gradable: false,
        justification:
          "Reflection/RPPF text was not provided, so Criterion E has insufficient evidence.",
        nextStep: "Paste the reflection/RPPF text for an engagement estimate.",
      };
    }

    const mark = estimateMark({
      essay,
      maxMarks: criterion.maxMarks,
      mediumSignals: isEconomics
        ? [
            "analysis",
            "method",
            "demand",
            "supply",
            "market",
            "policy",
            "data",
          ]
        : isMathematics
          ? ["analysis", "method", "proof", "model", "equation", "data"]
          : ["analysis", "method", "algorithm", "data", "testing"],
      strongSignals: [
        "research question",
        "evaluation",
        "conclusion",
        "bibliography",
        "references",
        ...(isMathematics ? ["deductive", "hypothesis", "mathematical"] : []),
        ...(isEconomics
          ? ["elasticity", "stakeholder", "externality", "inflation"]
          : []),
      ],
    });

    return {
      ...common,
      mark,
      justification: `Demo mode estimate for ${criterion.title} using the selected ${rubric.label}.`,
      nextStep:
        criterion.id === "C"
          ? isMathematics
            ? "Add clearer mathematical reasoning, proof, modelling, or evaluation tied to the research question."
            : isEconomics
              ? "Add clearer economic theory, model application, stakeholder evaluation, and data use tied to the research question."
              : "Add more explicit technical evaluation tied to the research question."
          : "Make the rubric evidence more explicit in this section.",
    };
  });

  return {
    overallSummary:
      `Demo mode produced an estimated ${subjectGuidance.subject} EE review from the selected ${rubric.label}, with ${subjectGuidance.label.toLowerCase()} as interpretation support.`,
    criteria,
    strengths: [
      "The pasted text can be checked against the EE criteria.",
      `The selected rubric controls scoring while ${subjectGuidance.subject} guidance supports subject-specific interpretation.`,
    ],
    weaknesses: [
      "Formatting and citation quality cannot be fully verified from pasted text alone.",
      hasReflection
        ? "Reflection still needs to show decision-making, not only description."
        : "Criterion E is missing reflection/RPPF evidence.",
    ],
    topImprovements: [
      "Make the research question visible and narrow.",
      isMathematics
        ? "Show mathematical work such as proof, modelling, calculations, or statistical reasoning."
        : isEconomics
          ? "Use economic theory, diagrams, data, and stakeholder evaluation to answer the research question."
        : "Show technical evidence such as implementation, benchmarks, or code analysis.",
      hasReflection
        ? "Use reflection to explain choices and changes in thinking."
        : "Add reflection/RPPF text before relying on an engagement estimate.",
    ],
    confidenceNote:
      "Demo mode uses local heuristics only; Gemini mode can give a more detailed rubric-based estimate.",
  };
}

function validateRequest(body: Partial<GradeWorkRequest>) {
  if (body.workType !== "ee") {
    return new GradeWorkApiError(
      "validation_failed",
      "Only Extended Essay grading is supported in this MVP.",
      400
    );
  }

  if (!body.subject || !supportedSubjects.includes(body.subject)) {
    return new GradeWorkApiError(
      "validation_failed",
      "Select Computer Science, Mathematics, or Economics for this EE grading request.",
      400
    );
  }

  if (!body.rubricVersion || !rubrics[body.rubricVersion]) {
    return new GradeWorkApiError(
      "validation_failed",
      "Select a supported EE rubric version.",
      400
    );
  }

  if (!hasText(body.essayText)) {
    return new GradeWorkApiError(
      "validation_failed",
      "Paste essay text before requesting feedback.",
      400
    );
  }

  if (body.essayText.length > maxEssayCharacters) {
    return new GradeWorkApiError(
      "payload_too_large",
      "The essay text is too long for one grading request. Shorten the pasted text or remove appendices, then try again.",
      413
    );
  }

  if ((body.reflectionText?.length ?? 0) > maxReflectionCharacters) {
    return new GradeWorkApiError(
      "payload_too_large",
      "The reflection text is too long for one grading request. Shorten the reflection/RPPF text, then try again.",
      413
    );
  }

  return null;
}

const toErrorResponse = (error: GradeWorkApiError) =>
  NextResponse.json(
    {
      error: error.safeMessage,
      code: error.code,
    },
    { status: error.status }
  );

export async function POST(req: Request) {
  const requestId = createRequestId();

  try {
    let body: Partial<GradeWorkRequest>;

    try {
      body = (await req.json()) as Partial<GradeWorkRequest>;
      logGradeWork(requestId, "request_parsed", {
        workType: body.workType,
        subject: body.subject,
        rubricVersion: body.rubricVersion,
        essayCharacters: body.essayText?.length ?? 0,
        reflectionCharacters: body.reflectionText?.length ?? 0,
      });
    } catch (error) {
      logGradeWorkError(requestId, "request_parse_failed", error);
      throw new GradeWorkApiError(
        "request_parse_failed",
        "The grading request could not be read. Refresh the page and try again.",
        400
      );
    }

    const validationError = validateRequest(body);

    if (validationError) {
      logGradeWorkError(requestId, "validation_failed", validationError, {
        code: validationError.code,
      });
      return toErrorResponse(validationError);
    }

    const input = body as GradeWorkRequest;
    const rubric = rubrics[input.rubricVersion];
    const apiKey = process.env.GEMINI_API_KEY;
    const useDemoMode = process.env.DEMO_MODE === "true" || !apiKey;

    if (useDemoMode) {
      logGradeWork(requestId, "demo_mode", {
        hasApiKey: Boolean(apiKey),
        demoMode: process.env.DEMO_MODE === "true",
      });

      let result;
      try {
        result = normalizeGradeWorkResult({
          aiResult: buildDemoAiResult(input, rubric),
          input,
          rubric,
          mode: "demo",
        });
      } catch (error) {
        logGradeWorkError(requestId, "normalization_failed", error, {
          mode: "demo",
        });
        throw new GradeWorkApiError(
          "normalization_failed",
          "The demo grading result could not be prepared. Try again in a moment.",
          500
        );
      }

      return NextResponse.json(result);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction:
        "You are a careful IB Extended Essay rubric reviewer. Return only JSON.",
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: gradeWorkResponseSchema,
      },
    });
    const prompt = buildGradeWorkPrompt(input, rubric);
    let responseText = "";

    try {
      logGradeWork(requestId, "gemini_request_start", {
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        promptCharacters: prompt.length,
        subject: eeSubjectLabels[input.subject],
        rubricVersion: input.rubricVersion,
      });
      const response = await model.generateContent(prompt, { timeout: 90_000 });
      responseText = response.response.text()?.trim() ?? "";
      logGradeWork(requestId, "gemini_response_received", {
        responseCharacters: responseText.length,
      });
    } catch (error) {
      const isTimeout =
        error instanceof Error &&
        /abort|timeout|deadline/i.test(error.message);
      logGradeWorkError(requestId, "gemini_request_failed", error, {
        isTimeout,
      });
      throw new GradeWorkApiError(
        isTimeout ? "gemini_timeout" : "gemini_unavailable",
        isTimeout
          ? "Gemini took too long to grade this essay. Try again with a shorter pasted text or retry in a moment."
          : "Gemini is unavailable for this grading request. Check the server logs, API key, model name, or try again shortly.",
        isTimeout ? 504 : 503
      );
    }

    if (!responseText) {
      logGradeWorkError(
        requestId,
        "gemini_empty_response",
        new Error("Gemini returned empty text")
      );
      throw new GradeWorkApiError(
        "gemini_empty_response",
        "Gemini returned an empty grading response. Try again in a moment.",
        502
      );
    }

    let aiResult: AiGradeWorkResult;
    try {
      aiResult = parseAiGradeWorkJson(responseText);
      const criterionIds = new Set(
        aiResult.criteria?.map((criterion) => criterion.criterionId)
      );

      if (!expectedCriterionIds.every((id) => criterionIds.has(id))) {
        throw new GradeWorkApiError(
          "response_invalid",
          "Gemini returned grading JSON, but it was missing one or more EE criteria. Retry once; if it repeats, shorten the pasted essay text.",
          502
        );
      }

      logGradeWork(requestId, "gemini_response_parsed", {
        criteriaCount: aiResult.criteria?.length ?? 0,
      });
    } catch (error) {
      logGradeWorkError(
        requestId,
        error instanceof GradeWorkApiError ? error.code : "response_parse_failed",
        error,
        {
          responseCharacters: responseText.length,
          responseStart: responseText.slice(0, 120).replace(/\s+/g, " "),
        }
      );
      if (error instanceof GradeWorkApiError) {
        throw error;
      }

      throw new GradeWorkApiError(
        "response_parse_failed",
        "Gemini returned a response, but it was not valid grading JSON. Retry once; if it repeats, shorten the pasted essay text.",
        502
      );
    }

    let result;
    try {
      result = normalizeGradeWorkResult({
        aiResult,
        input,
        rubric,
        mode: "gemini",
      });
      logGradeWork(requestId, "result_normalized", {
        criteriaCount: result.criteria.length,
        estimatedTotal: result.estimatedTotal,
        maxTotal: result.maxTotal,
      });
    } catch (error) {
      logGradeWorkError(requestId, "normalization_failed", error, {
        criteriaCount: aiResult.criteria?.length ?? 0,
      });
      throw new GradeWorkApiError(
        "normalization_failed",
        "Gemini returned grading data, but the result could not be shaped for the page. Try again in a moment.",
        500
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GradeWorkApiError) {
      logGradeWorkError(requestId, error.code, error);
      return toErrorResponse(error);
    }

    logGradeWorkError(requestId, "unknown", error);
    return toErrorResponse(
      new GradeWorkApiError(
        "unknown",
        "Unable to grade this essay right now. Check the server logs and try again.",
        500
      )
    );
  }
}
