"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { resolveSelectedSubjectBlueprints } from "@/lib/learn/blueprints";
import {
  getPlanSignals,
  getProgressSummary,
} from "@/lib/learn/insights";
import {
  removePlanTopic,
  setPlanTopics,
} from "@/lib/learn/progress";
import { getWeaknessDisplayLabel } from "@/lib/weaknesses";

type StudyTask = {
  id: string;
  title: string;
  detail: string;
  href: string;
  priority: "High" | "Medium" | "Low";
};

type TaskState = Record<
  string,
  {
    done?: boolean;
    removed?: boolean;
    snoozedUntil?: string;
  }
>;

const TASK_STATE_KEY = "ibec:planTaskState";

const getTaskState = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(TASK_STATE_KEY);
    return raw ? (JSON.parse(raw) as TaskState) : {};
  } catch {
    return {};
  }
};

const setTaskStateStorage = (state: TaskState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TASK_STATE_KEY, JSON.stringify(state));
};

const priorityClassName: Record<StudyTask["priority"], string> = {
  High: "state-danger",
  Medium: "state-warning",
  Low: "state-success",
};

export default function MyPlanPage() {
  const { profile } = useAuth();
  const planSignals = useMemo(() => getPlanSignals(), []);
  const [taskState, setTaskState] = useState<TaskState>(() => getTaskState());
  const [planTopics, setLocalPlanTopics] = useState(
    () => planSignals.pinnedTopics
  );

  const resolvedSubjects = useMemo(() => {
    if (!profile?.subjects?.length) {
      return [];
    }

    return resolveSelectedSubjectBlueprints(
      profile.subjects,
      profile.examSession
    );
  }, [profile]);

  const progressSummary = useMemo(
    () => getProgressSummary(resolvedSubjects),
    [resolvedSubjects]
  );
  const hasEconomics = useMemo(
    () =>
      resolvedSubjects.some(
        (subject) => subject.blueprint.subjectId === "economics"
      ),
    [resolvedSubjects]
  );

  const seededTopicTasks = useMemo<StudyTask[]>(() => {
    return resolvedSubjects
      .flatMap((subject) =>
        subject.version.topicGroups.flatMap((group) =>
          group.subtopics.slice(0, 1).map((subtopic) => ({
            id: `seeded:${subject.blueprint.subjectId}:${subtopic.id}`,
            title: `Review ${subtopic.title}`,
            detail: `${subject.blueprint.displayName} ${subject.profileSubject.level.toUpperCase()} · ${group.title}`,
            href: subtopic.lessonId
              ? `/learn/economics/${subtopic.lessonId}`
              : "/learn",
            priority: "Medium" as const,
          }))
        )
      )
      .slice(0, 2);
  }, [resolvedSubjects]);

  const todayPlan = useMemo<StudyTask[]>(() => {
    const pinned = planTopics.slice(0, 2).map((topic, index) => ({
      id: `pinned:${topic.id}`,
      title: topic.subtopicTitle,
      detail: `${topic.subjectName} ${topic.level.toUpperCase()} · pinned from Learn`,
      href: topic.href ?? "/learn",
      priority: index === 0 ? ("High" as const) : ("Medium" as const),
    }));
    const weakness = planSignals.weaknessTags[0]
      ? {
          id: `weakness:${planSignals.weaknessTags[0].label}`,
          title: "Fix one recurring weakness",
          detail: getWeaknessDisplayLabel(planSignals.weaknessTags[0].label),
          href: "/weakness-map",
          priority: "High" as const,
        }
      : null;
    const practice = {
      id: "practice:timed-response",
      title: "Complete one timed practice response",
      detail: planSignals.lastSession
        ? `${planSignals.lastSession.subject.split("-").join(" ")} · ${
            planSignals.lastSession.topic
          }`
        : "Use your first selected subject",
      href: "/practice",
      priority: "Medium" as const,
    };
    const economicsIa = hasEconomics
      ? {
          id: "economics:ia-check",
          title: "Check one Economics IA commentary",
          detail:
            "Review diagrams, terminology, key concept use, and evaluation.",
          href: "/grade-work-app/ia",
          priority: "Medium" as const,
        }
      : null;
    const economicsEe = hasEconomics
      ? {
          id: "economics:ee-rq",
          title: "Refine an Economics EE research question",
          detail:
            "Keep the issue economics-focused, contemporary, and narrow.",
          href: "/grade-work-app/ee",
          priority: "Low" as const,
        }
      : null;

    const today = [
      ...pinned,
      ...(weakness ? [weakness] : []),
      practice,
      ...(economicsIa ? [economicsIa] : []),
      ...(economicsEe ? [economicsEe] : []),
      ...seededTopicTasks,
    ];
    const now = new Date().toISOString();

    return today
      .filter((task) => {
        const state = taskState[task.id];
        return (
          !state?.done &&
          !state?.removed &&
          (!state?.snoozedUntil || state.snoozedUntil <= now)
        );
      })
      .slice(0, 4);
  }, [hasEconomics, planSignals, planTopics, seededTopicTasks, taskState]);

  const weekFocus = useMemo(() => {
    const subjectFocus = resolvedSubjects.slice(0, 3).map((subject) => ({
      title: subject.blueprint.displayName,
      detail: `${subject.profileSubject.level.toUpperCase()} · ${
        subject.version.label
      }`,
    }));

    return subjectFocus.length
      ? subjectFocus
      : [{ title: "Choose subjects", detail: "Complete onboarding or edit subjects." }];
  }, [resolvedSubjects]);

  const updateTaskState = (taskId: string, nextState: TaskState[string]) => {
    const next = {
      ...taskState,
      [taskId]: {
        ...taskState[taskId],
        ...nextState,
      },
    };
    setTaskState(next);
    setTaskStateStorage(next);
  };

  const removePinnedTopic = (id: string) => {
    const nextTopics = removePlanTopic(planTopics, id);
    setLocalPlanTopics(nextTopics);
    setPlanTopics(nextTopics);
  };

  if (!profile) {
    return (
      <Container className="px-0">
        <Card className="border-border bg-card/85 shadow-soft">
          Loading plan...
        </Card>
      </Container>
    );
  }

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-6 shadow-soft backdrop-blur-sm sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.16),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                My Plan
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Practical study plan
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Generated from your selected subjects, session, Learn progress,
                pinned topics, recent practice, and Grade Work weaknesses.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
              <span className="font-semibold text-text-main">
                {profile.examSession || "No session set"}
              </span>
              <span className="mx-2 text-text-muted">·</span>
              {progressSummary.percent}% topic progress
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border bg-card/90 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Today
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-text-main">
                  High-leverage tasks
                </h2>
              </div>
              <Button href="/learn" variant="secondary">
                Open Learn
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {todayPlan.map((task) => (
                <div
                  key={`${task.title}-${task.detail}`}
                  className="rounded-2xl border border-border/60 bg-card/80 p-4 transition hover:border-primary/25 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text-main">
                        {task.title}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {task.detail}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityClassName[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button href={task.href} className="px-3 py-2 text-xs">
                      Open
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={() => updateTaskState(task.id, { done: true })}
                    >
                      Done
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={() =>
                        updateTaskState(task.id, {
                          snoozedUntil: new Date(
                            Date.now() + 1000 * 60 * 60 * 24
                          ).toISOString(),
                        })
                      }
                    >
                      Snooze
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={() =>
                        updateTaskState(task.id, { removed: true })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="border-border bg-card/90 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                This week&apos;s focus
              </p>
              <div className="mt-4 space-y-3">
                {weekFocus.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border/60 bg-card/80 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-text-main">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-card/90 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Weakness priority
              </p>
              <div className="mt-4 space-y-2">
                {planSignals.weaknessTags.length ? (
                  planSignals.weaknessTags.slice(0, 4).map((tag) => (
                    <div
                      key={tag.label}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2 text-sm"
                    >
                      <span className="truncate text-text-secondary">
                      {getWeaknessDisplayLabel(tag.label)}
                      </span>
                      <span className="font-semibold text-text-main">
                        {tag.count}x
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-secondary">
                    Weakness tags will appear after Grade Work or Practice
                    results.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        <Card className="border-border bg-card/90 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Pinned from Learn
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Topics added from Learn stay local for now and can later be
                migrated to a database-backed plan.
              </p>
            </div>
            <Button href="/learn" className="shadow">
              Add topics
            </Button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {planTopics.length ? (
              planTopics.slice(0, 6).map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-border/60 bg-card/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-text-main">
                      {topic.subtopicTitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => removePinnedTopic(topic.id)}
                      className="rounded-full border border-border bg-card px-2 py-1 text-[11px] font-semibold text-text-muted transition hover:text-text-main"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {topic.subjectName} {topic.level.toUpperCase()} ·{" "}
                    {topic.topicGroupTitle}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-text-secondary">
                No pinned topics yet. Add topics from Learn to personalize this
                section.
              </div>
            )}
          </div>
        </Card>

        <Card className="border-border bg-card/90 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Direct launch
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Jump straight into the study pillar that matches today&apos;s
                priority.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              <Button href="/learn" variant="secondary">
                Learn
              </Button>
              <Button href="/practice" variant="secondary">
                Practice
              </Button>
              <Button href="/grade-work-app/ia" variant="secondary">
                IA
              </Button>
              <Button href="/grade-work-app/ee" variant="secondary">
                EE
              </Button>
              <Button href="/chat" className="shadow">
                Ask AI
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
