import type {
  LessonProgressMap,
  LessonProgressStatus,
  LearnProgressMap,
  LearnProgressStatus,
  PlanTopic,
  QuickCheckAttemptMap,
} from "@/lib/learn/types";

const LEARN_PROGRESS_KEY = "ibec:learnProgress";
const LESSON_PROGRESS_KEY = "ibec:lessonProgress";
const QUICK_CHECK_ATTEMPTS_KEY = "ibec:quickCheckAttempts";
const PLAN_TOPICS_KEY = "ibec:planTopics";

const isBrowser = () => typeof window !== "undefined";

const readJSON = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const createProgressKey = (
  subjectId: string,
  curriculumVersionId: string,
  subtopicId: string
) => `${subjectId}:${curriculumVersionId}:${subtopicId}`;

export const createLessonProgressKey = (
  subjectId: string,
  curriculumVersionId: string,
  lessonId: string
) => `${subjectId}:${curriculumVersionId}:lesson:${lessonId}`;

export const getLearnProgress = () =>
  readJSON<LearnProgressMap>(LEARN_PROGRESS_KEY, {});

export const setLearnProgress = (progress: LearnProgressMap) => {
  writeJSON(LEARN_PROGRESS_KEY, progress);
};

export const updateLearnProgressStatus = (
  progress: LearnProgressMap,
  key: string,
  status: LearnProgressStatus
): LearnProgressMap => ({
  ...progress,
  [key]: {
    status,
    updatedAt: new Date().toISOString(),
  },
});

export const getLessonProgress = () =>
  readJSON<LessonProgressMap>(LESSON_PROGRESS_KEY, {});

export const setLessonProgress = (progress: LessonProgressMap) => {
  writeJSON(LESSON_PROGRESS_KEY, progress);
};

export const updateLessonProgressStatus = (
  progress: LessonProgressMap,
  key: string,
  status: LessonProgressStatus,
  quickCheckScore?: number,
  quickCheckTotal?: number
): LessonProgressMap => ({
  ...progress,
  [key]: {
    status,
    quickCheckScore,
    quickCheckTotal,
    updatedAt: new Date().toISOString(),
  },
});

export const getQuickCheckAttempts = () =>
  readJSON<QuickCheckAttemptMap>(QUICK_CHECK_ATTEMPTS_KEY, {});

export const setQuickCheckAttempts = (attempts: QuickCheckAttemptMap) => {
  writeJSON(QUICK_CHECK_ATTEMPTS_KEY, attempts);
};

export const getPlanTopics = () => readJSON<PlanTopic[]>(PLAN_TOPICS_KEY, []);

export const setPlanTopics = (topics: PlanTopic[]) => {
  writeJSON(PLAN_TOPICS_KEY, topics.slice(0, 30));
};

export const upsertPlanTopic = (topics: PlanTopic[], nextTopic: PlanTopic) => {
  const withoutExisting = topics.filter((topic) => topic.id !== nextTopic.id);
  return [nextTopic, ...withoutExisting].slice(0, 30);
};

export const removePlanTopic = (topics: PlanTopic[], id: string) =>
  topics.filter((topic) => topic.id !== id);

export const togglePlanTopic = (topics: PlanTopic[], nextTopic: PlanTopic) => {
  const exists = topics.some((topic) => topic.id === nextTopic.id);

  return exists
    ? removePlanTopic(topics, nextTopic.id)
    : upsertPlanTopic(topics, nextTopic);
};
