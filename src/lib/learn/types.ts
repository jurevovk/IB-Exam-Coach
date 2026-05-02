import type { ProfileSubject } from "@/lib/storage";

export type SubjectLevel = ProfileSubject["level"];

export type LearnProgressStatus = "not-started" | "studying" | "studied";

export type CurriculumVersion = {
  id: string;
  label: string;
  sessionNote: string;
  paperStructure: string[];
  options?: string[];
  topicGroups: TopicGroup[];
};

export type TopicGroup = {
  id: string;
  title: string;
  description: string;
  level?: SubjectLevel | "both";
  subtopics: LearnSubtopic[];
};

export type LearnSubtopic = {
  id: string;
  title: string;
  description: string;
  level?: SubjectLevel | "both";
  syllabusStatus: "seeded" | "extension-point";
  lessonId?: string;
  resourceLinks?: Array<{
    label: string;
    href: string;
  }>;
  practiceTags?: string[];
};

export type SubjectBlueprint = {
  subjectId: string;
  displayName: string;
  levels: SubjectLevel[];
  aiExplainSupport: boolean;
  practiceEntryPoints: string[];
  resourceLinks?: Array<{
    label: string;
    href: string;
  }>;
  versions: CurriculumVersion[];
};

export type ResolvedSubjectBlueprint = {
  profileSubject: ProfileSubject;
  blueprint: SubjectBlueprint;
  version: CurriculumVersion;
  isFallback: boolean;
};

export type LearnProgressEntry = {
  status: LearnProgressStatus;
  updatedAt: string;
};

export type LearnProgressMap = Record<string, LearnProgressEntry>;

export type LessonProgressStatus = "not-started" | "studying" | "completed";

export type LessonProgressEntry = {
  status: LessonProgressStatus;
  quickCheckScore?: number;
  quickCheckTotal?: number;
  updatedAt: string;
};

export type LessonProgressMap = Record<string, LessonProgressEntry>;

export type QuickCheckAttempt = {
  answer: string;
  isCorrect: boolean;
  manuallyCounted?: boolean;
  updatedAt: string;
};

export type QuickCheckAttemptMap = Record<string, Record<string, QuickCheckAttempt>>;

export type PlanTopic = {
  id: string;
  subjectId: string;
  subjectName: string;
  level: SubjectLevel;
  curriculumVersionId: string;
  topicGroupId: string;
  topicGroupTitle: string;
  subtopicId: string;
  subtopicTitle: string;
  href?: string;
  addedAt: string;
};
