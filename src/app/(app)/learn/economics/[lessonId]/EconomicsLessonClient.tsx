"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import {
  economicsUnit1Lessons,
  getEconomicsUnit1Lesson,
  type EconomicsLesson,
} from "@/lib/economics/unit1Lessons";
import {
  createLessonProgressKey,
  createProgressKey,
  getLessonProgress,
  getPlanTopics,
  getQuickCheckAttempts,
  setLessonProgress,
  setPlanTopics,
  setQuickCheckAttempts,
  togglePlanTopic,
  updateLessonProgressStatus,
} from "@/lib/learn/progress";
import type {
  LessonProgressMap,
  LessonProgressStatus,
  PlanTopic,
  QuickCheckAttemptMap,
} from "@/lib/learn/types";
import {
  setLastSession,
  setRewriteMode,
  type PracticeSession,
} from "@/lib/storage";

const SUBJECT_ID = "economics";
const CURRICULUM_VERSION_ID = "economics-current";
const ASK_AI_DRAFT_KEY = "ibec:askAiDraft";

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}`;
};

const normalizeAnswer = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isAcceptedAnswer = (answer: string, acceptedAnswers: string[]) => {
  const normalized = normalizeAnswer(answer);

  if (!normalized) {
    return false;
  }

  return acceptedAnswers.some((accepted) => {
    const normalizedAccepted = normalizeAnswer(accepted);
    return (
      normalized === normalizedAccepted ||
      normalized.includes(normalizedAccepted)
    );
  });
};

const lessonStatusLabel: Record<LessonProgressStatus, string> = {
  "not-started": "Not started",
  studying: "Studying",
  completed: "Completed",
};

const getLessonIndex = (lesson: EconomicsLesson) =>
  economicsUnit1Lessons.findIndex((item) => item.id === lesson.id);

function LessonVisuals({ lesson }: { lesson: EconomicsLesson }) {
  if (lesson.id === "micro-vs-macro") {
    return (
      <Card className="border-border bg-card/90 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Visual compare
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Microeconomics",
              detail: "Individual markets, consumers, firms, prices, and allocation.",
              items: ["Coffee market", "Sugar tax", "Rental price ceiling"],
            },
            {
              title: "Macroeconomics",
              detail: "Whole-economy outcomes, objectives, and policy trade-offs.",
              items: ["Inflation", "Unemployment", "Economic growth"],
            },
          ].map((block) => (
            <div
              key={block.title}
              className="rounded-2xl border border-border/60 bg-bg/45 p-4"
            >
              <p className="font-semibold text-text-main">{block.title}</p>
              <p className="mt-2 text-sm text-text-secondary">{block.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {block.items.map((item) => (
                  <span
                    key={item}
                    className="chip rounded-full border px-3 py-1 text-xs font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (lesson.id === "factors-of-production") {
    const factors = [
      ["Land", "Natural resources", "Rent"],
      ["Labour", "Human effort", "Wages"],
      ["Capital", "Produced tools", "Interest"],
      ["Enterprise", "Risk + organization", "Profit"],
    ];

    return (
      <Card className="border-border bg-card/90 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Factor income map
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {factors.map(([factor, resource, income]) => (
            <div
              key={factor}
              className="rounded-2xl border border-border/60 bg-bg/45 p-4 text-center"
            >
              <p className="text-sm font-semibold text-text-main">{factor}</p>
              <p className="mt-2 text-xs text-text-muted">{resource}</p>
              <div className="state-success mt-4 rounded-full border px-3 py-1 text-xs font-semibold">
                {income}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (lesson.id === "economic-systems") {
    return (
      <Card className="border-border bg-card/90 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Systems spectrum
        </p>
        <div className="mt-5 rounded-2xl border border-border/60 bg-bg/45 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Free market", "Prices and private choice dominate allocation."],
              ["Mixed economy", "Markets operate, but government intervenes."],
              ["Planned economy", "The state directs major allocation decisions."],
            ].map(([title, detail], index) => (
              <div key={title} className="relative rounded-xl bg-card/80 p-4">
                <span className="absolute -top-3 left-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-text-main">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-xs text-text-muted sm:grid-cols-3">
            <span>What to produce?</span>
            <span>How to produce?</span>
            <span>For whom to produce?</span>
          </div>
        </div>
      </Card>
    );
  }

  if (lesson.id === "ppc-circular-flow") {
    return (
      <Card className="border-border bg-card/90 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Model sketch
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-bg/45 p-4">
            <p className="text-sm font-semibold text-text-main">PPC reading</p>
            <div className="mt-4 h-44 rounded-xl border border-border/60 bg-card/80 p-4">
              <svg viewBox="0 0 220 140" className="h-full w-full">
                <path
                  d="M30 120 C80 108 145 78 190 22"
                  fill="none"
                  stroke="rgb(var(--color-primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M30 15 V120 H205"
                  fill="none"
                  stroke="rgb(var(--color-border))"
                  strokeWidth="2"
                />
                <circle cx="95" cy="92" r="5" fill="rgb(var(--color-warning-border))" />
                <circle cx="138" cy="68" r="5" fill="rgb(var(--color-success-border))" />
                <circle cx="178" cy="48" r="5" fill="rgb(var(--color-danger-border))" />
                <text
                  x="42"
                  y="24"
                  fill="rgb(var(--color-text-muted))"
                  fontSize="10"
                >
                  Good A
                </text>
                <text
                  x="168"
                  y="134"
                  fill="rgb(var(--color-text-muted))"
                  fontSize="10"
                >
                  Good B
                </text>
              </svg>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-text-secondary">
              <span>Inside curve: inefficient or unemployed resources.</span>
              <span>On curve: productively efficient.</span>
              <span>Outside curve: currently unattainable.</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-bg/45 p-4">
            <p className="text-sm font-semibold text-text-main">
              Circular flow pressure
            </p>
            <div className="mt-4 grid gap-3">
              <div className="state-success rounded-xl border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Injections
                </p>
                <p className="mt-1 text-sm">Investment · Government spending · Exports</p>
              </div>
              <div className="state-warning rounded-xl border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Leakages
                </p>
                <p className="mt-1 text-sm">Savings · Taxes · Imports</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (lesson.id === "positive-normative-economic-thought") {
    const timeline = [
      ["Classical", "Markets, specialization, and self-interest."],
      ["Marginal", "Utility and decisions at the margin."],
      ["Marx", "Power, conflict, and critique of capitalism."],
      ["Keynes", "Demand management during downturns."],
      ["Modern", "Behaviour, incentives, sustainability, and circularity."],
    ];

    return (
      <Card className="border-border bg-card/90 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Thought timeline
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {timeline.map(([title, detail]) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-bg/45 p-4"
            >
              <p className="text-sm font-semibold text-text-main">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return null;
}

export function EconomicsLessonClient({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { profile } = useAuth();
  const lesson = getEconomicsUnit1Lesson(lessonId);
  const [lessonProgress, setLocalLessonProgress] =
    useState<LessonProgressMap>(() => getLessonProgress());
  const [quickCheckAttempts, setLocalQuickCheckAttempts] =
    useState<QuickCheckAttemptMap>(() => getQuickCheckAttempts());
  const [planTopics, setLocalPlanTopics] = useState<PlanTopic[]>(() =>
    getPlanTopics()
  );
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [showLessonIndex, setShowLessonIndex] = useState(false);

  const economicsSubject = profile?.subjects.find(
    (subject) => subject.key === SUBJECT_ID
  );
  const level = economicsSubject?.level ?? "hl";
  const lessonKey = lesson
    ? createLessonProgressKey(SUBJECT_ID, CURRICULUM_VERSION_ID, lesson.id)
    : "";
  const topicKey = lesson
    ? createProgressKey(SUBJECT_ID, CURRICULUM_VERSION_ID, lesson.id)
    : "";
  const attempts = quickCheckAttempts[lessonKey] ?? {};
  const status = lessonProgress[lessonKey]?.status ?? "not-started";
  const score = lesson
    ? lesson.quickChecks.filter((check) => attempts[check.id]?.isCorrect).length
    : 0;
  const total = lesson?.quickChecks.length ?? 0;
  const accuracy = total ? Math.round((score / total) * 100) : 0;
  const isInPlan = planTopics.some((topic) => topic.id === topicKey);
  const currentIndex = lesson ? getLessonIndex(lesson) : -1;
  const lessonProgressPercent = Math.round(
    ((currentIndex + 1) / economicsUnit1Lessons.length) * 100
  );
  const previousLesson = economicsUnit1Lessons[currentIndex - 1];
  const nextLesson = economicsUnit1Lessons[currentIndex + 1];

  const lessonNav = useMemo(
    () =>
      economicsUnit1Lessons.map((item) => ({
        id: item.id,
        title: item.title,
        isActive: item.id === lessonId,
      })),
    [lessonId]
  );

  if (!lesson) {
    return null;
  }

  const persistLessonProgress = (
    nextStatus: LessonProgressStatus,
    nextScore = score,
    nextTotal = total
  ) => {
    const next = updateLessonProgressStatus(
      lessonProgress,
      lessonKey,
      nextStatus,
      nextScore,
      nextTotal
    );
    setLocalLessonProgress(next);
    setLessonProgress(next);
  };

  const submitQuickCheck = (checkId: string, answer: string) => {
    const check = lesson.quickChecks.find((item) => item.id === checkId);
    if (!check) {
      return;
    }

    const isCorrect = isAcceptedAnswer(answer, check.acceptedAnswers);
    const nextAttempts: QuickCheckAttemptMap = {
      ...quickCheckAttempts,
      [lessonKey]: {
        ...attempts,
        [checkId]: {
          answer,
          isCorrect,
          updatedAt: new Date().toISOString(),
        },
      },
    };
    const nextScore = lesson.quickChecks.filter((item) => {
      if (item.id === checkId) {
        return isCorrect;
      }
      return nextAttempts[lessonKey]?.[item.id]?.isCorrect;
    }).length;

    setLocalQuickCheckAttempts(nextAttempts);
    setQuickCheckAttempts(nextAttempts);
    persistLessonProgress(status === "not-started" ? "studying" : status, nextScore, total);
  };

  const countAsCorrect = (checkId: string) => {
    const answer = draftAnswers[checkId] ?? attempts[checkId]?.answer ?? "";
    const nextAttempts: QuickCheckAttemptMap = {
      ...quickCheckAttempts,
      [lessonKey]: {
        ...attempts,
        [checkId]: {
          answer,
          isCorrect: true,
          manuallyCounted: true,
          updatedAt: new Date().toISOString(),
        },
      },
    };
    const nextScore = lesson.quickChecks.filter(
      (item) => item.id === checkId || nextAttempts[lessonKey]?.[item.id]?.isCorrect
    ).length;

    setLocalQuickCheckAttempts(nextAttempts);
    setQuickCheckAttempts(nextAttempts);
    persistLessonProgress(status === "not-started" ? "studying" : status, nextScore, total);
  };

  const togglePlan = () => {
    const topic: PlanTopic = {
      id: topicKey,
      subjectId: SUBJECT_ID,
      subjectName: "Economics",
      level,
      curriculumVersionId: CURRICULUM_VERSION_ID,
      topicGroupId: lesson.unitId,
      topicGroupTitle: lesson.unitTitle,
      subtopicId: lesson.id,
      subtopicTitle: lesson.shortTitle,
      href: `/learn/economics/${lesson.id}`,
      addedAt: new Date().toISOString(),
    };
    const next = togglePlanTopic(planTopics, topic);
    setLocalPlanTopics(next);
    setPlanTopics(next);
  };

  const askAi = () => {
    window.localStorage.setItem(
      ASK_AI_DRAFT_KEY,
      `Help me understand "${lesson.title}" for IB Economics ${level.toUpperCase()}. Explain it simply, use one exam-style example, include common mistakes, and give me a short practice prompt.`
    );
    router.push("/ask-ai");
  };

  const startPractice = () => {
    const session: PracticeSession = {
      id: createId("econ-u1-practice"),
      subject: SUBJECT_ID,
      level,
      paper: "Paper 1",
      topic: lesson.practiceTopic,
      marks: lesson.id === "ppc-circular-flow" ? 15 : 10,
      mode: "timed",
      difficulty: "medium",
      commandTerm:
        lesson.examMiniTask.commandTerm === "Distinguish"
          ? "Explain"
          : lesson.examMiniTask.commandTerm,
      goalMode: "band-jump",
      lessonId: lesson.id,
      practiceMode: "topic-drill",
    };

    setLastSession(session);
    setRewriteMode(false);
    router.push("/practice/write");
  };

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-6 shadow-soft backdrop-blur-sm sm:p-8">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgb(var(--color-primary)/0.18),rgb(var(--color-info-bg)/0)_70%)] blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Economics Unit 1 Lesson
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                {lesson.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">
                {lesson.summary}
              </p>
            </div>
            <div className="min-w-60 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
              <p className="font-semibold text-text-main">
                {lessonStatusLabel[status]}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {score}/{total} checks · {accuracy}% accuracy
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${lessonProgressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-text-muted">
                Lesson {currentIndex + 1} of {economicsUnit1Lessons.length}
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowLessonIndex((prev) => !prev)}
              className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/15"
            >
              {showLessonIndex ? "Hide Unit lessons" : "Browse Unit 1 lessons"}
            </button>
            <button
              type="button"
              onClick={() =>
                persistLessonProgress(
                  status === "studying" ? "not-started" : "studying"
                )
              }
              className="chip rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-primary/25 hover:text-text-main"
            >
              {status === "studying" ? "Unmark studying" : "Mark studying"}
            </button>
            <button
              type="button"
              onClick={() =>
                persistLessonProgress(
                  status === "completed" ? "not-started" : "completed"
                )
              }
              className="state-success rounded-xl border px-3 py-2 text-xs font-semibold transition hover:brightness-105"
            >
              {status === "completed" ? "Undo completed" : "Mark completed"}
            </button>
            <button
              type="button"
              onClick={togglePlan}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                isInPlan ? "state-warning" : "chip hover:border-primary/25"
              )}
            >
              {isInPlan ? "Remove plan" : "Add to My Plan"}
            </button>
            <button
              type="button"
              onClick={askAi}
              className="chip rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-primary/25 hover:text-text-main"
            >
              Ask AI
            </button>
            <button
              type="button"
              onClick={startPractice}
              className="rounded-xl border border-primary/20 bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover"
            >
              Start Practice
            </button>
          </div>
        </header>

        <Card className="border-border bg-card/90 p-4 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Study mode
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Focus on the current lesson, then jump forward or open the full
                Unit 1 index when needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {previousLesson ? (
                <button
                  type="button"
                  onClick={() => router.push(`/learn/economics/${previousLesson.id}`)}
                  className="chip rounded-xl border px-3 py-2 text-xs font-semibold"
                >
                  Previous
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowLessonIndex((prev) => !prev)}
                className="chip rounded-xl border px-3 py-2 text-xs font-semibold"
              >
                Unit 1 lessons
              </button>
              {nextLesson ? (
                <button
                  type="button"
                  onClick={() => router.push(`/learn/economics/${nextLesson.id}`)}
                  className="rounded-xl border border-primary/20 bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  Next lesson
                </button>
              ) : null}
            </div>
          </div>
        </Card>

        {showLessonIndex ? (
          <Card className="border-border bg-card/90 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Unit 1 lesson index
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Jump between lessons without keeping the index permanently on screen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLessonIndex(false)}
                className="chip rounded-full border px-3 py-1 text-xs font-semibold"
              >
                Collapse
              </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {lessonNav.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setShowLessonIndex(false);
                    router.push(`/learn/economics/${item.id}`);
                  }}
                  className={cn(
                    "rounded-2xl border p-3 text-left text-xs font-semibold transition",
                    item.isActive
                      ? "border-primary/25 bg-primary/10 text-text-main shadow-sm"
                      : "border-border/60 bg-card/80 text-text-secondary hover:border-primary/20 hover:text-text-main"
                  )}
                >
                  <span className="text-text-muted">1.{index + 1}</span>
                  <span className="mt-1 block">{item.title.replace(/^1\.\d\s/, "")}</span>
                </button>
              ))}
            </div>
          </Card>
        ) : null}

        <main className="mx-auto w-full max-w-6xl space-y-5">
            <Card className="border-border bg-card/90 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Learning goals
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {lesson.learningGoals.map((goal) => (
                  <div
                    key={goal}
                    className="rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-text-secondary"
                  >
                    {goal}
                  </div>
                ))}
              </div>
            </Card>

            <LessonVisuals lesson={lesson} />

            {lesson.examples.length ? (
              <Card className="border-border bg-card/90 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Worked examples
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {lesson.examples.map((example) => (
                    <div
                      key={example}
                      className="rounded-2xl border border-border/60 bg-bg/45 p-4 text-sm leading-relaxed text-text-secondary"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {lesson.sections.map((section, sectionIndex) => (
              <Card
                key={section.heading}
                className="border-border border-l-4 border-l-primary/35 bg-card/90 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {sectionIndex + 1}
                  </span>
                  <h2 className="font-heading text-xl font-semibold text-text-main">
                    {section.heading}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {section.body}
                </p>
                {section.bullets?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                    {section.bullets.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.examples?.length ? (
                  <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Examples
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                      {section.examples.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Card>
            ))}

            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="border-border bg-card/90 shadow-card">
                <p className="text-sm font-semibold text-text-main">
                  Key takeaways
                </p>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {lesson.keyTakeaways.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </Card>
              <Card className="border-border bg-card/90 shadow-card">
                <p className="text-sm font-semibold text-text-main">
                  Common mistakes
                </p>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {lesson.commonMistakes.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="border-border bg-card/90 shadow-card">
              <p className="text-sm font-semibold text-text-main">
                Mini glossary
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.glossary.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-xl border border-border/60 bg-card/80 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-text-main">
                      {item.term}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-card/90 shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Quick checks
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-text-main">
                    {score}/{total} correct
                  </h2>
                </div>
                <span className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-text-secondary">
                  Deterministic checks + manual override
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {lesson.quickChecks.map((check) => {
                  const attempt = attempts[check.id];
                  const draft = draftAnswers[check.id] ?? attempt?.answer ?? "";

                  return (
                    <div
                      key={check.id}
                      className="rounded-2xl border border-border/60 bg-card/80 p-4"
                    >
                      <p className="text-sm font-semibold text-text-main">
                        {check.prompt}
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={draft}
                          onChange={(event) =>
                            setDraftAnswers((prev) => ({
                              ...prev,
                              [check.id]: event.target.value,
                            }))
                          }
                          className="field min-h-11 flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                          placeholder="Type your answer..."
                        />
                        <button
                          type="button"
                          onClick={() => submitQuickCheck(check.id, draft)}
                          className="rounded-xl border border-primary/20 bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover"
                        >
                          Check
                        </button>
                        <button
                          type="button"
                          onClick={() => countAsCorrect(check.id)}
                          className="chip rounded-xl border px-4 py-2 text-xs font-semibold transition hover:border-primary/25"
                        >
                          Count as correct
                        </button>
                      </div>
                      {attempt ? (
                        <div
                          className={cn(
                            "mt-3 rounded-xl border px-3 py-2 text-xs",
                            attempt.isCorrect ? "state-success" : "state-warning"
                          )}
                        >
                          {attempt.isCorrect
                            ? attempt.manuallyCounted
                              ? "Counted as correct manually."
                              : check.feedback
                            : "Not quite. Check the lesson wording, or count it manually if your answer is valid."}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border border-primary/20 bg-card/90 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                End-of-lesson mini task
              </p>
              <h2 className="mt-2 font-heading text-xl font-semibold text-text-main">
                {lesson.examMiniTask.commandTerm}: {lesson.examMiniTask.prompt}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {lesson.examMiniTask.successCriteria.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {previousLesson ? (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      router.push(`/learn/economics/${previousLesson.id}`)
                    }
                  >
                    Previous lesson
                  </Button>
                ) : null}
                <Button onClick={startPractice} className="shadow">
                  Practice this skill
                </Button>
                {nextLesson ? (
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/learn/economics/${nextLesson.id}`)}
                  >
                    Next lesson
                  </Button>
                ) : (
                  <Button variant="secondary" href="/learn">
                    Back to Learn
                  </Button>
                )}
              </div>
            </Card>
        </main>
      </div>
    </Container>
  );
}
