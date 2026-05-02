import { getGradeWorkHistory } from "@/lib/grade-work/history";
import {
  economicsIaUnits,
  getEconomicsIaHistory,
} from "@/lib/economics/ia";
import {
  createLessonProgressKey,
  createProgressKey,
  getLessonProgress,
  getLearnProgress,
  getPlanTopics,
} from "@/lib/learn/progress";
import type { ResolvedSubjectBlueprint } from "@/lib/learn/types";
import {
  getAttemptHistory,
  getLastAttempt,
  getLastSession,
  type PracticeAttempt,
  type PracticeSession,
} from "@/lib/storage";
import {
  getWeaknessEvents,
  normalizeWeaknessLabel,
  summarizeWeaknessEvents,
} from "@/lib/weaknesses";

export type RecentActivity = {
  id: string;
  title: string;
  detail: string;
  href: string;
  createdAt?: string;
};

export const getProgressSummary = (subjects: ResolvedSubjectBlueprint[]) => {
  const progress = getLearnProgress();
  const lessonProgress = getLessonProgress();
  let total = 0;
  let studied = 0;
  let studying = 0;

  subjects.forEach(({ blueprint, version }) => {
    version.topicGroups.forEach((group) => {
      group.subtopics.forEach((subtopic) => {
        total += 1;
        const key = createProgressKey(
          blueprint.subjectId,
          version.id,
          subtopic.id
        );
        const status = progress[key]?.status ?? "not-started";
        const lessonKey = subtopic.lessonId
          ? createLessonProgressKey(
              blueprint.subjectId,
              version.id,
              subtopic.lessonId
            )
          : null;
        const lessonStatus = lessonKey
          ? lessonProgress[lessonKey]?.status
          : undefined;

        if (status === "studied" || lessonStatus === "completed") {
          studied += 1;
        }
        if (status === "studying" || lessonStatus === "studying") {
          studying += 1;
        }
      });
    });
  });

  return {
    total,
    studied,
    studying,
    percent: total ? Math.round((studied / total) * 100) : 0,
  };
};

const getAttemptActivity = (
  attempt: PracticeAttempt | null,
  session: PracticeSession | null
): RecentActivity | null => {
  if (!attempt || !session) {
    return null;
  }

  return {
    id: `practice-${attempt.id}`,
    title: "Practice attempt",
    detail: `${session.subject.split("-").join(" ")} · ${session.topic} · ${
      attempt.score
    }/${session.marks}`,
    href: "/practice/report",
  };
};

export const getRecentActivities = () => {
  const gradeHistory = getGradeWorkHistory();
  const iaHistory = getEconomicsIaHistory();
  const attempts = getAttemptHistory();
  const lastSession = getLastSession();
  const lastAttempt = getLastAttempt();
  const activities: RecentActivity[] = [];

  const latestAttempt = attempts[0] ?? lastAttempt;
  const attemptActivity = getAttemptActivity(latestAttempt ?? null, lastSession);

  if (attemptActivity) {
    activities.push(attemptActivity);
  }

  gradeHistory.slice(0, 3).forEach((item) => {
    activities.push({
      id: `grade-${item.id}`,
      title: "Grade Work review",
      detail: `${item.result.subject} EE · ${item.result.estimatedTotal}/${item.result.maxTotal}`,
      href: "/grade-work-app/ee",
      createdAt: item.createdAt,
    });
  });

  iaHistory.slice(0, 3).forEach((item) => {
    const unitLabel =
      economicsIaUnits.find((unit) => unit.id === item.input.unit)?.label ??
      "Economics IA";

    activities.push({
      id: `economics-ia-${item.id}`,
      title: "Economics IA review",
      detail: `${unitLabel} · ${item.result.estimatedTotal}/${item.result.maxTotal}`,
      href: "/grade-work-app/ia",
      createdAt: item.createdAt,
    });
  });

  return activities.slice(0, 5);
};

export const getWeaknessTags = () => {
  const tags = new Map<string, number>();
  summarizeWeaknessEvents(getWeaknessEvents()).forEach((event) => {
    tags.set(event.label, (tags.get(event.label) ?? 0) + event.count);
  });

  getGradeWorkHistory().forEach((item) => {
    item.result.weaknesses.forEach((weakness) => {
      const label = normalizeWeaknessLabel(weakness);
      if (label) {
        tags.set(label, (tags.get(label) ?? 0) + 1);
      }
    });
    item.result.criteria.forEach((criterion) => {
      criterion.weaknesses.forEach((weakness) => {
        const label = normalizeWeaknessLabel(weakness);
        if (label) {
          tags.set(label, (tags.get(label) ?? 0) + 1);
        }
      });
    });
  });

  getAttemptHistory().forEach((attempt) => {
    attempt.lostMarks.forEach((lostMark) => {
      const label = normalizeWeaknessLabel(lostMark);
      if (label) {
        tags.set(label, (tags.get(label) ?? 0) + 1);
      }
    });
  });

  return Array.from(tags.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
};

export const getPlanSignals = () => ({
  pinnedTopics: getPlanTopics(),
  recentActivities: getRecentActivities(),
  weaknessTags: getWeaknessTags(),
  lastSession: getLastSession(),
});
