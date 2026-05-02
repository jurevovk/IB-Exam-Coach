export type EconomicsIaUnit = "microeconomics" | "macroeconomics" | "global-economy";

export type EconomicsIaCriterionId = "A" | "B" | "C" | "D" | "E";

export type EconomicsIaRequest = {
  articleTitle: string;
  source: string;
  datePublished: string;
  unit: EconomicsIaUnit;
  keyConcept: string;
  commentaryText: string;
  articleUrl?: string;
  articleText?: string;
};

export type EconomicsIaCriterionResult = {
  id: EconomicsIaCriterionId;
  title: string;
  maxMarks: number;
  mark: number;
  justification: string;
  nextStep: string;
};

export type EconomicsIaResult = {
  mode: "demo" | "gemini";
  estimatedTotal: number;
  maxTotal: number;
  criteria: EconomicsIaCriterionResult[];
  strengths: string[];
  weaknesses: string[];
  diagramGuidance: string;
  evaluationGuidance: string;
  warnings: string[];
  portfolioChecks: Array<{
    label: string;
    status: "ok" | "warning" | "missing";
    note: string;
  }>;
  weaknessTags: string[];
  disclaimer: string;
};

export type EconomicsIaHistoryItem = {
  id: string;
  createdAt: string;
  input: EconomicsIaRequest;
  result: EconomicsIaResult;
};

export const economicsIaUnits: Array<{
  id: EconomicsIaUnit;
  label: string;
}> = [
  { id: "microeconomics", label: "Unit 2: Microeconomics" },
  { id: "macroeconomics", label: "Unit 3: Macroeconomics" },
  { id: "global-economy", label: "Unit 4: The Global Economy" },
];

export const economicsKeyConcepts = [
  "scarcity",
  "choice",
  "efficiency",
  "equity",
  "economic well-being",
  "sustainability",
  "change",
  "interdependence",
  "intervention",
];

export const iaCriteria = [
  { id: "A" as const, title: "Diagrams", maxMarks: 3 },
  { id: "B" as const, title: "Terminology", maxMarks: 2 },
  { id: "C" as const, title: "Application and analysis", maxMarks: 3 },
  { id: "D" as const, title: "Key concept", maxMarks: 3 },
  { id: "E" as const, title: "Evaluation", maxMarks: 3 },
];

const wordCount = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

const hasAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const monthsBetween = (from: Date, to: Date) => {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
};

const clamp = (value: number, max: number) =>
  Math.max(0, Math.min(max, Math.round(value)));

export const getEconomicsIaHistory = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem("ibec:economicsIaHistory");
    return raw ? (JSON.parse(raw) as EconomicsIaHistoryItem[]) : [];
  } catch {
    return [];
  }
};

export const saveEconomicsIaHistory = (items: EconomicsIaHistoryItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    "ibec:economicsIaHistory",
    JSON.stringify(items.slice(0, 10))
  );
};

export const gradeEconomicsIaLocally = (
  input: EconomicsIaRequest,
  history: EconomicsIaHistoryItem[],
  mode: "demo" | "gemini" = "demo"
): EconomicsIaResult => {
  const commentary = input.commentaryText.toLowerCase();
  const article = `${input.articleTitle} ${input.source} ${
    input.articleText ?? ""
  }`.toLowerCase();
  const words = wordCount(input.commentaryText);
  const hasDiagram = hasAny(commentary, [
    "diagram",
    "curve",
    "shift",
    "equilibrium",
    "deadweight",
    "externality",
    "ad/as",
    "aggregate demand",
  ]);
  const hasTerminology = hasAny(commentary, [
    "demand",
    "supply",
    "elasticity",
    "externality",
    "inflation",
    "unemployment",
    "exchange rate",
    "tariff",
    "subsidy",
  ]);
  const hasApplication = hasAny(commentary, [
    "article",
    "source",
    "consumer",
    "producer",
    "government",
    "firm",
    "household",
    input.source.toLowerCase(),
  ]);
  const hasConcept = commentary.includes(input.keyConcept.toLowerCase());
  const hasEvaluation = hasAny(commentary, [
    "however",
    "therefore",
    "short run",
    "long run",
    "stakeholder",
    "limitation",
    "overall",
    "to a large extent",
  ]);
  const hasTheory = hasAny(commentary, [
    "because",
    "leads to",
    "therefore",
    "increases",
    "decreases",
    "market",
    "policy",
  ]);
  const articleDate = input.datePublished
    ? new Date(input.datePublished)
    : null;
  const articleAgeMonths =
    articleDate && !Number.isNaN(articleDate.getTime())
      ? monthsBetween(articleDate, new Date())
      : null;
  const previousKeyConceptUse = history.some(
    (item) =>
      item.input.keyConcept.toLowerCase() === input.keyConcept.toLowerCase()
  );
  const previousUnitUse = history.some((item) => item.input.unit === input.unit);
  const previousSourceUse = history.some(
    (item) => item.input.source.toLowerCase() === input.source.toLowerCase()
  );
  const warnings: string[] = [];

  if (words > 800) {
    warnings.push(`Commentary appears to exceed 800 words (${words} words).`);
  }
  if (previousKeyConceptUse) {
    warnings.push("This key concept appears in a previous saved commentary.");
  }
  if (previousUnitUse) {
    warnings.push("This unit appears in a previous saved commentary.");
  }
  if (previousSourceUse) {
    warnings.push("This source appears in a previous saved commentary.");
  }
  if (articleAgeMonths === null) {
    warnings.push("Article date could not be checked.");
  } else if (articleAgeMonths > 12) {
    warnings.push("Article may be older than 12 months.");
  }
  if (!article.trim() && !input.articleUrl?.trim()) {
    warnings.push("No article URL or article text was provided.");
  }

  const criteria: EconomicsIaCriterionResult[] = [
    {
      id: "A",
      title: "Diagrams",
      maxMarks: 3,
      mark: clamp(hasDiagram ? 2 + (hasApplication ? 1 : 0) : 1, 3),
      justification: hasDiagram
        ? "The commentary includes diagram/model language that can support analysis."
        : "Diagram evidence is limited or not explicit in the pasted commentary.",
      nextStep:
        "Add a relevant, labelled diagram and explain the direction of each curve shift.",
    },
    {
      id: "B",
      title: "Terminology",
      maxMarks: 2,
      mark: clamp(hasTerminology ? 2 : 1, 2),
      justification: hasTerminology
        ? "Relevant Economics terminology is visible."
        : "Key Economics terminology is not explicit enough.",
      nextStep: "Define the central term before applying it to the article.",
    },
    {
      id: "C",
      title: "Application and analysis",
      maxMarks: 3,
      mark: clamp((hasApplication ? 1 : 0) + (hasTheory ? 1 : 0) + 1, 3),
      justification:
        "Application and analysis are estimated from article links, theory language, and causal explanation.",
      nextStep:
        "Quote or paraphrase one article detail, then explain it using a precise economic model.",
    },
    {
      id: "D",
      title: "Key concept",
      maxMarks: 3,
      mark: clamp(hasConcept ? 2 + (hasApplication ? 1 : 0) : 1, 3),
      justification: hasConcept
        ? "The selected key concept is visible in the commentary."
        : "The selected key concept is not clearly integrated.",
      nextStep:
        "Use the key concept as an analytical lens, not just as a label.",
    },
    {
      id: "E",
      title: "Evaluation",
      maxMarks: 3,
      mark: clamp(hasEvaluation ? 2 + (hasApplication ? 1 : 0) : 1, 3),
      justification: hasEvaluation
        ? "Evaluation language and stakeholder/limitation signals are visible."
        : "Evaluation appears limited or descriptive.",
      nextStep:
        "Add short-run/long-run, stakeholder, and limitation evaluation before the final judgement.",
    },
  ];
  const weaknesses = [
    !hasDiagram ? "Diagram support is weak." : "",
    !hasTerminology ? "Economics terminology is not explicit enough." : "",
    !hasApplication ? "Application to the article is limited." : "",
    !hasConcept ? "Key concept integration is weak." : "",
    !hasEvaluation ? "Evaluation is underdeveloped." : "",
  ].filter(Boolean);

  return {
    mode,
    estimatedTotal: criteria.reduce((total, criterion) => total + criterion.mark, 0),
    maxTotal: 14,
    criteria,
    strengths: [
      hasTheory
        ? "The commentary has some causal economic explanation."
        : "The commentary can be checked against IA criteria.",
      hasApplication
        ? "There is visible attempt to connect to the article/source."
        : "The selected article metadata gives a starting point for application.",
    ],
    weaknesses: weaknesses.length
      ? weaknesses
      : ["The next improvement is making evaluation sharper and more balanced."],
    diagramGuidance:
      "Use one directly relevant diagram, label it fully, and explain how it applies to the article rather than leaving it decorative.",
    evaluationGuidance:
      "Evaluate with stakeholder impacts, short-run versus long-run effects, assumptions, and a final judgement tied to the article.",
    warnings,
    portfolioChecks: [
      {
        label: "Different units across portfolio",
        status: previousUnitUse ? "warning" : "ok",
        note: previousUnitUse
          ? "A saved commentary already uses this unit."
          : "This unit is not repeated in saved local history.",
      },
      {
        label: "Different sources across portfolio",
        status: previousSourceUse ? "warning" : "ok",
        note: previousSourceUse
          ? "A saved commentary already uses this source."
          : "This source is not repeated in saved local history.",
      },
      {
        label: "Article recency",
        status:
          articleAgeMonths === null
            ? "missing"
            : articleAgeMonths > 12
              ? "warning"
              : "ok",
        note:
          articleAgeMonths === null
            ? "Publication date could not be checked."
            : `${articleAgeMonths} month(s) old based on the entered date.`,
      },
      {
        label: "One key concept",
        status: previousKeyConceptUse ? "warning" : "ok",
        note: previousKeyConceptUse
          ? "This key concept appears in local IA history."
          : "No repeated key concept detected in local history.",
      },
    ],
    weaknessTags: weaknesses,
    disclaimer:
      "Estimated commentary-level feedback only. Criterion F is treated as portfolio tracking, not an official IB mark.",
  };
};
