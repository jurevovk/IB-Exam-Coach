import type { PracticeSession } from "@/lib/storage";

type ScoreResult = {
  score: number;
  gradeBand: number;
  strengths: string[];
  lostMarks: string[];
  bandJumpPlan: string[];
};

const wordTargets: Record<number, number> = {
  10: 160,
  15: 230,
  20: 320,
};

const evaluationMarkers = [
  "however",
  "on the other hand",
  "to a large extent",
  "to some extent",
  "whereas",
];

const conclusionMarkers = [
  "overall",
  "to conclude",
  "in conclusion",
  "therefore",
  "thus",
];

const evidenceMarkers = [
  "for example",
  "case study",
  "data",
  "statistics",
  "percent",
  "%",
];

const countWords = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
};

export const getGradeBand = (score: number, marks: number) => {
  if (!marks) {
    return 1;
  }

  const ratio = score / marks;
  if (ratio >= 0.85) return 7;
  if (ratio >= 0.72) return 6;
  if (ratio >= 0.6) return 5;
  if (ratio >= 0.5) return 4;
  if (ratio >= 0.4) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
};

export const computeScore = (
  text: string,
  session: PracticeSession
): ScoreResult => {
  const lower = text.toLowerCase();
  const wordCount = countWords(text);
  const target = wordTargets[session.marks] ?? 200;

  let score = Math.round(session.marks * Math.min(wordCount / target, 1));

  const hasEvaluation = evaluationMarkers.some((marker) =>
    lower.includes(marker)
  );
  const hasConclusion = conclusionMarkers.some((marker) =>
    lower.includes(marker)
  );
  const hasEvidence =
    evidenceMarkers.some((marker) => lower.includes(marker)) || /\d/.test(lower);

  if (hasEvaluation) score += 1;
  if (hasConclusion) score += 1;
  if (hasEvidence) score += 1;

  if (wordCount < target * 0.6) score -= 2;
  if (wordCount < target * 0.4) score -= 2;

  score = Math.max(0, Math.min(session.marks, score));

  const strengths: string[] = [];
  const lostMarks: string[] = [];
  const bandJumpPlan: string[] = [];

  if (wordCount >= target * 0.85) {
    strengths.push("Sustained development matches the mark allocation.");
  } else {
    lostMarks.push("Answer is brief for the mark allocation.");
    bandJumpPlan.push("Add one more developed paragraph to reach the target.");
  }

  if (hasEvaluation) {
    strengths.push("Balances perspectives with evaluation language.");
  } else {
    lostMarks.push("Limited evaluation of competing perspectives.");
    bandJumpPlan.push("Use evaluative phrases such as 'however' or 'to a large extent'.");
  }

  if (hasEvidence) {
    strengths.push("Uses evidence, data, or concrete examples.");
  } else {
    lostMarks.push("Needs clearer evidence or specific examples.");
    bandJumpPlan.push("Add a data point or named case study to support each claim.");
  }

  if (hasConclusion) {
    strengths.push("Ends with a clear concluding judgement.");
  } else {
    lostMarks.push("Missing a clear concluding judgement.");
    bandJumpPlan.push("Finish with a short judgement that answers the question.");
  }

  return {
    score,
    gradeBand: getGradeBand(score, session.marks),
    strengths: strengths.slice(0, 3),
    lostMarks: lostMarks.slice(0, 3),
    bandJumpPlan: bandJumpPlan.slice(0, 4),
  };
};
