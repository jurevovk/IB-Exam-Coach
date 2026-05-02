import type { GradeWorkResult } from "@/lib/grade-work/types";

export const GRADE_WORK_HISTORY_KEY = "ibec:gradeWork:eeHistory";

export type GradeWorkHistoryItem = {
  id: string;
  createdAt: string;
  result: GradeWorkResult;
};

const isBrowser = () => typeof window !== "undefined";

export const getGradeWorkHistory = () => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GRADE_WORK_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as GradeWorkHistoryItem[]) : [];
  } catch {
    return [];
  }
};

export const saveGradeWorkHistory = (items: GradeWorkHistoryItem[]) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    GRADE_WORK_HISTORY_KEY,
    JSON.stringify(items.slice(0, 10))
  );
};
