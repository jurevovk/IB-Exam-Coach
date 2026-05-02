export type EeRubricVersion = "pre-2027" | "first-exams-2027";

export type EeSubject = "computer-science" | "mathematics" | "economics";

export const eeSubjectLabels: Record<
  EeSubject,
  "Computer Science" | "Mathematics" | "Economics"
> = {
  "computer-science": "Computer Science",
  mathematics: "Mathematics",
  economics: "Economics",
};

export type EeCriterionId = "A" | "B" | "C" | "D" | "E";

export type EeRubricCriterion = {
  id: EeCriterionId;
  title: string;
  maxMarks: number;
  focus: string;
  bands: Array<{
    range: string;
    descriptor: string;
  }>;
};

export type EeRubric = {
  version: EeRubricVersion;
  label: string;
  totalMarks: number;
  criteria: EeRubricCriterion[];
  gradeBoundaries: Array<{
    grade: "A" | "B" | "C" | "D" | "E";
    min: number;
    max: number;
  }>;
};
