import type { EeSubject } from "@/lib/rubrics/types";

export type EeSubjectGuidance = {
  subjectKey: EeSubject;
  subject: "Computer Science" | "Mathematics" | "Economics";
  label: string;
  sourceNote: string;
  scoringRule: string;
  gradingPriorities: string[];
  subjectEvidence: string[];
  cautionFlags: string[];
  reflectionGuidance: string[];
};
