import type {
  EeCriterionId,
  EeRubricVersion,
  EeSubject,
} from "@/lib/rubrics/types";

export type GradeWorkSubject = EeSubject;
export type GradeWorkType = "ee";
export type GradingMode = "demo" | "gemini";

export type GradeWorkRequest = {
  workType: GradeWorkType;
  subject: GradeWorkSubject;
  rubricVersion: EeRubricVersion;
  essayText: string;
  reflectionText?: string;
};

export type CriterionGrade = {
  criterionId: EeCriterionId;
  title: string;
  maxMarks: number;
  mark: number | null;
  gradable: boolean;
  justification: string;
  evidenceSnippets: string[];
  detectedSignals: string[];
  strengths: string[];
  weaknesses: string[];
  nextStep: string;
};

export type FormalCheckStatus = "present" | "missing" | "unclear";

export type FormalRequirementCheck = {
  id: string;
  label: string;
  status: FormalCheckStatus;
  note: string;
};

export type GradeWorkResult = {
  workType: GradeWorkType;
  subject: "Computer Science" | "Mathematics" | "Economics";
  rubricVersion: EeRubricVersion;
  rubricLabel: string;
  subjectGuidanceLabel: string;
  subjectGuidanceNote: string;
  mode: GradingMode;
  overallSummary: string;
  criteria: CriterionGrade[];
  formalChecks: FormalRequirementCheck[];
  strengths: string[];
  weaknesses: string[];
  topImprovements: string[];
  estimatedTotal: number;
  maxTotal: number;
  enoughCriteriaGradable: boolean;
  estimatedLetterGrade: "A" | "B" | "C" | "D" | "E" | null;
  confidenceNote: string;
  disclaimer: string;
};

export type AiCriterionGrade = Partial<
  Omit<CriterionGrade, "criterionId" | "title" | "maxMarks"> & {
    criterionId: EeCriterionId;
  }
>;

export type AiGradeWorkResult = Partial<
  Omit<
    GradeWorkResult,
    | "workType"
    | "subject"
    | "rubricVersion"
    | "rubricLabel"
    | "mode"
    | "criteria"
    | "formalChecks"
    | "estimatedLetterGrade"
  > & {
    criteria: AiCriterionGrade[];
  }
>;
