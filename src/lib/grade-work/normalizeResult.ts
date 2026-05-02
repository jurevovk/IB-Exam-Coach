import type {
  AiGradeWorkResult,
  CriterionGrade,
  FormalRequirementCheck,
  FormalCheckStatus,
  GradeWorkRequest,
  GradeWorkResult,
  GradingMode,
} from "@/lib/grade-work/types";
import { getEeSubjectGuidance } from "@/lib/rubrics/ee/subjectGuidance";
import {
  eeSubjectLabels,
  type EeCriterionId,
  type EeRubric,
} from "@/lib/rubrics/types";

const disclaimer =
  "Estimated rubric-based evaluation only. This is not an official IB mark.";

const clampMark = (value: unknown, maxMarks: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, Math.min(maxMarks, Math.round(value)));
};

const toStringArray = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items.slice(0, 5) : fallback;
};

const criterionEvidenceTerms: Record<EeCriterionId, string[]> = {
  A: [
    "research question",
    "rq:",
    "method",
    "methodology",
    "scope",
    "approach",
  ],
  B: [
    "algorithm",
    "economics",
    "economic",
    "demand",
    "supply",
    "elasticity",
    "externality",
    "inflation",
    "unemployment",
    "exchange rate",
    "mathematics",
    "mathematical",
    "theorem",
    "proof",
    "equation",
    "function",
    "model",
    "data structure",
    "database",
    "complexity",
    "system",
    "source",
    "literature",
  ],
  C: [
    "analysis",
    "evaluation",
    "testing",
    "results",
    "limitation",
    "conclusion",
    "performance",
    "stakeholder",
    "short run",
    "long run",
    "policy",
    "market failure",
    "trade",
    "deductive",
    "hypothesis",
    "reasoning",
    "algebra",
  ],
  D: [
    "introduction",
    "conclusion",
    "bibliography",
    "references",
    "appendix",
    "figure",
    "graph",
    "diagram",
  ],
  E: [
    "reflection",
    "i decided",
    "i changed",
    "challenge",
    "supervisor",
    "process",
    "learned",
  ],
};

const signalLabels: Record<EeCriterionId, Record<string, string>> = {
  A: {
    "research question": "Research question signal",
    "rq:": "Research question label",
    method: "Method signal",
    methodology: "Methodology signal",
    scope: "Scope signal",
    approach: "Approach signal",
  },
  B: {
    algorithm: "Computer Science concept signal",
    economics: "Economics focus signal",
    economic: "Economics focus signal",
    demand: "Demand signal",
    supply: "Supply signal",
    elasticity: "Elasticity signal",
    externality: "Externality signal",
    inflation: "Macroeconomics signal",
    unemployment: "Macroeconomics signal",
    "exchange rate": "Global economy signal",
    mathematics: "Mathematics signal",
    mathematical: "Mathematics signal",
    theorem: "Theorem signal",
    proof: "Proof signal",
    equation: "Equation signal",
    function: "Function signal",
    model: "Mathematical model signal",
    "data structure": "Technical terminology signal",
    database: "Technical terminology signal",
    complexity: "Complexity discussion signal",
    system: "System context signal",
    source: "Source-use signal",
    literature: "Academic context signal",
  },
  C: {
    analysis: "Analysis signal",
    evaluation: "Evaluation signal",
    testing: "Testing evidence signal",
    results: "Results signal",
    limitation: "Limitations signal",
    conclusion: "Conclusion signal",
    performance: "Performance evidence signal",
    stakeholder: "Stakeholder evaluation signal",
    "short run": "Time-frame evaluation signal",
    "long run": "Time-frame evaluation signal",
    policy: "Policy analysis signal",
    "market failure": "Market failure signal",
    trade: "Trade analysis signal",
    deductive: "Deductive reasoning signal",
    hypothesis: "Hypothesis signal",
    reasoning: "Reasoning signal",
    algebra: "Algebra signal",
  },
  D: {
    introduction: "Structure signal",
    conclusion: "Structure signal",
    bibliography: "Bibliography signal",
    references: "References signal",
    appendix: "Appendix signal",
    figure: "Presentation signal",
    graph: "Graph signal",
    diagram: "Diagram signal",
  },
  E: {
    reflection: "Reflection signal",
    "i decided": "Decision-making signal",
    "i changed": "Development signal",
    challenge: "Challenge reflection signal",
    supervisor: "Supervision process signal",
    process: "Research process signal",
    learned: "Learning signal",
  },
};

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const truncateSnippet = (value: string) => {
  const normalized = normalizeWhitespace(value);

  if (normalized.length <= 220) {
    return normalized;
  }

  return `${normalized.slice(0, 217).trim()}...`;
};

const getSourceTextForCriterion = (
  criterionId: EeCriterionId,
  input: GradeWorkRequest
) => {
  if (criterionId === "E") {
    return input.reflectionText?.trim() ?? "";
  }

  return input.essayText;
};

const findEvidenceSnippets = (
  criterionId: EeCriterionId,
  input: GradeWorkRequest
) => {
  const sourceText = getSourceTextForCriterion(criterionId, input);

  if (!sourceText.trim()) {
    return criterionId === "E"
      ? ["Reflection/RPPF text was not provided, so no Criterion E evidence was available."]
      : ["No confident evidence snippet detected in the provided text."];
  }

  const terms = criterionEvidenceTerms[criterionId];
  const chunks = sourceText
    .split(/\n+|[.!?]\s+/)
    .map(truncateSnippet)
    .filter((chunk) => chunk.length >= 35);
  const matches = chunks.filter((chunk) => {
    const lowerChunk = chunk.toLowerCase();
    return terms.some((term) => lowerChunk.includes(term));
  });

  return matches.length
    ? matches.slice(0, 2)
    : ["No confident evidence snippet detected in the provided text."];
};

const detectSignals = (criterionId: EeCriterionId, input: GradeWorkRequest) => {
  const sourceText = getSourceTextForCriterion(criterionId, input).toLowerCase();

  if (!sourceText.trim()) {
    return criterionId === "E"
      ? ["Reflection/RPPF missing"]
      : ["No strong signal detected from the provided text"];
  }

  const labels = criterionEvidenceTerms[criterionId]
    .filter((term) => sourceText.includes(term))
    .map((term) => signalLabels[criterionId][term] ?? term);
  const uniqueLabels = Array.from(new Set(labels));

  return uniqueLabels.length
    ? uniqueLabels.slice(0, 3)
    : ["No strong signal detected from the provided text"];
};

const textIncludes = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const checkStatus = (condition: boolean, unclear = false): FormalCheckStatus => {
  if (condition) {
    return "present";
  }

  return unclear ? "unclear" : "missing";
};

export function getFormalChecks(input: GradeWorkRequest): FormalRequirementCheck[] {
  const essay = input.essayText.toLowerCase();
  const reflection = input.reflectionText?.trim() ?? "";
  const wordCountMention = /\b\d{3,5}\s+words?\b|\bword count\b/i.test(
    input.essayText
  );

  return [
    {
      id: "research-question",
      label: "Research question clearly present",
      status: checkStatus(
        textIncludes(essay, ["research question", "rq:"]) || essay.includes("?"),
        true
      ),
      note:
        "Checked for an explicit research question label or a clear question in the pasted text.",
    },
    {
      id: "word-count",
      label: "Apparent word count mention",
      status: checkStatus(wordCountMention, true),
      note:
        "Pasted text may not preserve the final title page, so this can only be estimated.",
    },
    {
      id: "methodology",
      label: "Methodology section present",
      status: checkStatus(
        textIncludes(essay, ["methodology", "method", "approach", "procedure"]),
        true
      ),
      note: "Checked for methodology or equivalent process language.",
    },
    {
      id: "conclusion",
      label: "Conclusion present",
      status: checkStatus(
        textIncludes(essay, ["conclusion", "to conclude", "in conclusion"]),
        true
      ),
      note: "Checked for a conclusion heading or conclusion signal.",
    },
    {
      id: "bibliography",
      label: "Bibliography / references present",
      status: checkStatus(
        textIncludes(essay, ["bibliography", "references", "works cited"]),
        true
      ),
      note:
        "Full citation quality cannot be fully judged from pasted text alone.",
    },
    {
      id: "structure",
      label: "Structure / section headings present",
      status: checkStatus(
        textIncludes(essay, [
          "introduction",
          "analysis",
          "methodology",
          "conclusion",
          "bibliography",
        ]),
        true
      ),
      note: "Checked for common EE section headings.",
    },
    {
      id: "reflection",
      label: "Reflection provided",
      status: reflection ? "present" : "missing",
      note: reflection
        ? "Reflection text was provided for Criterion E evidence."
        : "Criterion E is not fully gradable without reflection/RPPF evidence.",
    },
  ];
}

export function getEstimatedLetterGrade(
  total: number,
  rubric: EeRubric,
  enoughCriteriaGradable: boolean
) {
  if (!enoughCriteriaGradable) {
    return null;
  }

  return (
    rubric.gradeBoundaries.find(
      (boundary) => total >= boundary.min && total <= boundary.max
    )?.grade ?? null
  );
}

export function normalizeGradeWorkResult({
  aiResult,
  input,
  rubric,
  mode,
}: {
  aiResult: AiGradeWorkResult;
  input: GradeWorkRequest;
  rubric: EeRubric;
  mode: GradingMode;
}): GradeWorkResult {
  const hasReflection = Boolean(input.reflectionText?.trim());
  const subjectGuidance = getEeSubjectGuidance(
    input.subject,
    input.rubricVersion
  );
  const criteria: CriterionGrade[] = rubric.criteria.map((criterion) => {
    const aiCriterion = aiResult.criteria?.find(
      (item) => item.criterionId === criterion.id
    );
    const mustWithhold = criterion.id === "E" && !hasReflection;
    const mark = mustWithhold
      ? null
      : clampMark(aiCriterion?.mark, criterion.maxMarks);
    const gradable = mustWithhold ? false : aiCriterion?.gradable !== false;

    return {
      criterionId: criterion.id,
      title: criterion.title,
      maxMarks: criterion.maxMarks,
      mark,
      gradable: gradable && mark !== null,
      justification:
        mustWithhold
          ? "Reflection/RPPF text was not provided, so Criterion E has insufficient evidence and is not fully gradable."
          : aiCriterion?.justification ||
            "Evidence is limited in the pasted text, so this criterion is estimated with caution.",
      strengths: toStringArray(aiCriterion?.strengths, [
        "Some relevant evidence is present.",
      ]),
      evidenceSnippets: toStringArray(
        mustWithhold ? undefined : aiCriterion?.evidenceSnippets,
        findEvidenceSnippets(criterion.id, input)
      ).slice(0, 2),
      detectedSignals: toStringArray(
        mustWithhold ? undefined : aiCriterion?.detectedSignals,
        detectSignals(criterion.id, input)
      ).slice(0, 3),
      weaknesses: toStringArray(aiCriterion?.weaknesses, [
        "More explicit rubric evidence is needed.",
      ]),
      nextStep:
        aiCriterion?.nextStep ||
        "Add clearer evidence that directly matches this criterion.",
    };
  });
  const estimatedTotal = criteria.reduce(
    (total, criterion) => total + (criterion.mark ?? 0),
    0
  );
  const enoughCriteriaGradable = criteria.every((criterion) => criterion.gradable);
  const formalChecks = getFormalChecks(input);

  return {
    workType: "ee",
    subject: eeSubjectLabels[input.subject],
    rubricVersion: rubric.version,
    rubricLabel: rubric.label,
    subjectGuidanceLabel: subjectGuidance.label,
    subjectGuidanceNote:
      `${subjectGuidance.subject} guidance supported interpretation only; scoring used the selected EE rubric.`,
    mode,
    overallSummary:
      aiResult.overallSummary ||
      `This is an estimated ${subjectGuidance.subject} EE review based on the selected rubric and pasted evidence.`,
    criteria,
    formalChecks,
    strengths: toStringArray(aiResult.strengths, [
      "The essay provides enough text for an initial rubric-based review.",
    ]),
    weaknesses: toStringArray(aiResult.weaknesses, [
      "Some rubric evidence may be missing from the pasted text.",
    ]),
    topImprovements: toStringArray(aiResult.topImprovements, [
      "Make the research question explicit and narrow.",
      "Connect technical evidence directly to the argument.",
      hasReflection
        ? "Use reflection to explain decisions and changes in thinking."
        : "Add reflection/RPPF text so Criterion E can be assessed.",
    ]).slice(0, 3),
    estimatedTotal,
    maxTotal: rubric.totalMarks,
    enoughCriteriaGradable,
    estimatedLetterGrade: getEstimatedLetterGrade(
      estimatedTotal,
      rubric,
      enoughCriteriaGradable
    ),
    confidenceNote:
      aiResult.confidenceNote ||
      "Confidence is limited because pasted text may omit formatting, citations, appendices, and process evidence.",
    disclaimer,
  };
}

export function parseAiGradeWorkJson(text: string): AiGradeWorkResult {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const jsonText = withoutFence.startsWith("{")
    ? withoutFence
    : withoutFence.slice(
        Math.max(0, withoutFence.indexOf("{")),
        withoutFence.lastIndexOf("}") + 1
      );

  if (!jsonText || !jsonText.startsWith("{") || !jsonText.endsWith("}")) {
    throw new Error("Gemini did not return a complete JSON object.");
  }

  const parsed = JSON.parse(jsonText) as AiGradeWorkResult;

  if (!parsed || !Array.isArray(parsed.criteria)) {
    throw new Error("Gemini JSON did not include a criteria array.");
  }

  return parsed;
}
