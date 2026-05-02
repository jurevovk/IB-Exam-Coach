"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { resolveSelectedSubjectBlueprints } from "@/lib/learn/blueprints";
import {
  createLessonProgressKey,
  createProgressKey,
  getLessonProgress,
  getLearnProgress,
  getPlanTopics,
  setLearnProgress,
  setPlanTopics,
  togglePlanTopic,
  updateLearnProgressStatus,
} from "@/lib/learn/progress";
import type {
  LessonProgressMap,
  LearnProgressMap,
  LearnProgressStatus,
  LearnSubtopic,
  PlanTopic,
  ResolvedSubjectBlueprint,
  TopicGroup,
} from "@/lib/learn/types";
import {
  setLastSession,
  setRewriteMode,
  type PracticeSession,
} from "@/lib/storage";

const ASK_AI_DRAFT_KEY = "ibec:askAiDraft";

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}`;
};

const statusLabels: Record<LearnProgressStatus, string> = {
  "not-started": "Not started",
  studying: "Studying",
  studied: "Studied",
};

const statusClassName = (status: LearnProgressStatus) =>
  cn(
    "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
    status === "studied" && "state-success",
    status === "studying" && "border-primary/20 bg-primary/10 text-primary",
    status === "not-started" && "chip"
  );

const isVisibleForLevel = (
  level: "hl" | "sl",
  itemLevel?: "hl" | "sl" | "both"
) => !itemLevel || itemLevel === "both" || itemLevel === level;

const getVisibleGroups = (subject: ResolvedSubjectBlueprint) =>
  subject.version.topicGroups
    .filter((group) =>
      isVisibleForLevel(subject.profileSubject.level, group.level)
    )
    .map((group) => ({
      ...group,
      subtopics: group.subtopics.filter((subtopic) =>
        isVisibleForLevel(subject.profileSubject.level, subtopic.level)
      ),
    }))
    .filter((group) => group.subtopics.length > 0);

const getProgressStats = (
  subject: ResolvedSubjectBlueprint,
  progress: LearnProgressMap,
  lessonProgress: LessonProgressMap
) => {
  const subtopics = getVisibleGroups(subject).flatMap((group) => group.subtopics);
  const studied = subtopics.filter((subtopic) => {
    const key = createProgressKey(
      subject.blueprint.subjectId,
      subject.version.id,
      subtopic.id
    );
    const lessonKey = subtopic.lessonId
      ? createLessonProgressKey(
          subject.blueprint.subjectId,
          subject.version.id,
          subtopic.lessonId
        )
      : null;
    return (
      progress[key]?.status === "studied" ||
      (lessonKey ? lessonProgress[lessonKey]?.status === "completed" : false)
    );
  }).length;

  return {
    total: subtopics.length,
    studied,
    percent: subtopics.length ? Math.round((studied / subtopics.length) * 100) : 0,
  };
};

const getPracticePaper = (subject: ResolvedSubjectBlueprint, group: TopicGroup) => {
  if (subject.blueprint.subjectId !== "economics") {
    return subject.version.paperStructure[0]?.split(":")[0] ?? "Paper 1";
  }

  if (group.id === "global-economy") {
    return "Paper 2";
  }

  if (group.id === "hl-paper-3-extension") {
    return "Paper 3";
  }

  return "Paper 1";
};

export default function LearnPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [progress, setProgress] = useState<LearnProgressMap>(() =>
    getLearnProgress()
  );
  const [lessonProgress] = useState<LessonProgressMap>(() => getLessonProgress());
  const [planTopics, setPinnedPlanTopics] = useState<PlanTopic[]>(() =>
    getPlanTopics()
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

  const activeSubject =
    resolvedSubjects.find(
      (subject) => subject.blueprint.subjectId === selectedSubjectId
    ) ??
    resolvedSubjects.find((subject) => subject.blueprint.subjectId === "economics") ??
    resolvedSubjects[0];

  const visibleGroups = activeSubject ? getVisibleGroups(activeSubject) : [];
  const activeGroup =
    visibleGroups.find((group) => group.id === selectedGroupId) ??
    visibleGroups[0];
  const activeStats = activeSubject
    ? getProgressStats(activeSubject, progress, lessonProgress)
    : null;
  const activePinnedTopics = activeSubject
    ? planTopics.filter(
        (topic) => topic.subjectId === activeSubject.blueprint.subjectId
      )
    : [];

  const updateStatus = (key: string, status: LearnProgressStatus) => {
    const nextStatus = progress[key]?.status === status ? "not-started" : status;
    const nextProgress = updateLearnProgressStatus(progress, key, nextStatus);
    setProgress(nextProgress);
    setLearnProgress(nextProgress);
  };

  const toggleTopicPlan = (
    subject: ResolvedSubjectBlueprint,
    group: TopicGroup,
    subtopic: LearnSubtopic
  ) => {
    const topic: PlanTopic = {
      id: createProgressKey(
        subject.blueprint.subjectId,
        subject.version.id,
        subtopic.id
      ),
      subjectId: subject.blueprint.subjectId,
      subjectName: subject.blueprint.displayName,
      level: subject.profileSubject.level,
      curriculumVersionId: subject.version.id,
      topicGroupId: group.id,
      topicGroupTitle: group.title,
      subtopicId: subtopic.id,
      subtopicTitle: subtopic.title,
      href: subtopic.lessonId
        ? `/learn/economics/${subtopic.lessonId}`
        : "/learn",
      addedAt: new Date().toISOString(),
    };
    const nextTopics = togglePlanTopic(planTopics, topic);
    setPinnedPlanTopics(nextTopics);
    setPlanTopics(nextTopics);
  };

  const askAi = (
    subject: ResolvedSubjectBlueprint,
    group: TopicGroup,
    subtopic: LearnSubtopic
  ) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        ASK_AI_DRAFT_KEY,
        `Explain ${subtopic.title} for IB ${subject.blueprint.displayName} ${subject.profileSubject.level.toUpperCase()}. Include the key diagram/model if relevant, common mistakes, and one exam-style practice strategy.`
      );
    }

    router.push("/ask-ai");
  };

  const startPractice = (
    subject: ResolvedSubjectBlueprint,
    group: TopicGroup,
    subtopic: LearnSubtopic
  ) => {
    const session: PracticeSession = {
      id: createId("learn-practice"),
      subject: subject.blueprint.subjectId,
      level: subject.profileSubject.level,
      paper: getPracticePaper(subject, group),
      topic: subtopic.practiceTags?.[0] ?? subtopic.title,
      marks: group.id === "hl-paper-3-extension" ? 10 : 15,
      mode: "timed",
      difficulty: "medium",
      commandTerm: group.id === "hl-paper-3-extension" ? "Calculate" : "Evaluate",
      goalMode: "band-jump",
    };

    setLastSession(session);
    setRewriteMode(false);
    router.push("/practice/write");
  };

  if (!profile) {
    return (
      <Container className="px-0">
        <Card className="border-border bg-card/85 shadow-soft">
          Loading Learn Hub...
        </Card>
      </Container>
    );
  }

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/95 p-6 shadow-soft backdrop-blur-sm sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Learn
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Syllabus cockpit
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Switch subjects, track topic progress, launch practice, and add
                focused topics to your plan.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
              <span className="font-semibold text-text-main">
                {profile.examSession || "No session set"}
              </span>
              <span className="mx-2 text-text-muted">·</span>
              {resolvedSubjects.length} selected subject
              {resolvedSubjects.length === 1 ? "" : "s"}
            </div>
          </div>
        </header>

        {!resolvedSubjects.length ? (
          <Card className="border-border bg-card/90 shadow-soft">
            <p className="font-semibold text-text-main">
              No selected subjects yet
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Add subjects in settings to generate a personalized Learn Hub.
            </p>
            <Button href="/edit-subjects" className="mt-4 shadow">
              Edit subjects
            </Button>
          </Card>
        ) : null}

        {activeSubject && activeStats ? (
          <>
            <Card className="border-border bg-card/90 shadow-card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Active subject
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resolvedSubjects.map((subject) => {
                      const isActive =
                        subject.blueprint.subjectId ===
                        activeSubject.blueprint.subjectId;

                      return (
                        <button
                          key={subject.blueprint.subjectId}
                          type="button"
                          onClick={() => {
                            setSelectedSubjectId(subject.blueprint.subjectId);
                            setSelectedGroupId(null);
                          }}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-semibold transition",
                            isActive
                              ? "border-primary/30 bg-primary text-white shadow-sm"
                              : "border-border bg-card/85 text-text-secondary hover:border-primary/25 hover:text-text-main"
                          )}
                        >
                          {subject.blueprint.displayName}{" "}
                          {subject.profileSubject.level.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="min-w-52 rounded-2xl border border-border/60 bg-card/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Progress
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-3xl font-semibold text-text-main">
                      {activeStats.percent}%
                    </p>
                    <p className="pb-1 text-xs text-text-muted">
                      {activeStats.studied}/{activeStats.total} studied
                    </p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-border/50">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${activeStats.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="space-y-4">
                <Card className="border-border bg-report text-white shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    {activeSubject.blueprint.displayName}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">
                    {activeSubject.version.label}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">
                    {activeSubject.version.sessionNote}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeSubject.version.paperStructure.map((paper) => (
                      <span
                        key={paper}
                        className="rounded-full border border-white/10 bg-card/10 px-3 py-1 text-xs text-white/75"
                      >
                        {paper}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="border-border bg-card/95 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Unit quick jump
                  </p>
                  <div className="mt-3 space-y-2">
                    {visibleGroups.map((group) => {
                      const isActive = activeGroup?.id === group.id;

                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setSelectedGroupId(group.id)}
                          className={cn(
                            "w-full rounded-xl border px-3 py-3 text-left text-sm transition",
                            isActive
                              ? "border-primary/25 bg-primary/10 text-text-main"
                              : "border-border/60 bg-card/80 text-text-secondary hover:border-primary/20"
                          )}
                        >
                          <span className="font-semibold">{group.title}</span>
                          <span className="mt-1 block text-xs text-text-muted">
                            {group.subtopics.length} topics
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Card>

                <Card className="border-border bg-card/90 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Pinned topics
                  </p>
                  <div className="mt-3 space-y-2">
                    {activePinnedTopics.length ? (
                      activePinnedTopics.slice(0, 4).map((topic) => (
                        <div
                          key={topic.id}
                          className="rounded-xl border border-border/60 bg-card/80 px-3 py-2"
                        >
                          <p className="text-sm font-semibold text-text-main">
                            {topic.subtopicTitle}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            {topic.topicGroupTitle}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-secondary">
                        Add topics from this page to build My Plan.
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              {activeGroup ? (
                <Card className="border-border bg-card/90 shadow-card">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                        Unit
                      </p>
                      <h2 className="mt-1 font-heading text-2xl font-semibold text-text-main">
                        {activeGroup.title}
                      </h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        {activeGroup.description}
                      </p>
                    </div>
                    {activeGroup.level === "hl" ? (
                      <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        HL only
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-3 xl:grid-cols-2">
                    {activeGroup.subtopics.map((subtopic) => {
                      const key = createProgressKey(
                        activeSubject.blueprint.subjectId,
                        activeSubject.version.id,
                        subtopic.id
                      );
                      const status = progress[key]?.status ?? "not-started";
                      const lessonKey = subtopic.lessonId
                        ? createLessonProgressKey(
                            activeSubject.blueprint.subjectId,
                            activeSubject.version.id,
                            subtopic.lessonId
                          )
                        : null;
                      const lessonStatus = lessonKey
                        ? lessonProgress[lessonKey]?.status
                        : undefined;
                      const visibleStatus =
                        status === "studied" || lessonStatus === "completed"
                          ? "studied"
                          : status === "studying" || lessonStatus === "studying"
                            ? "studying"
                            : "not-started";
                      const inPlan = planTopics.some((topic) => topic.id === key);

                      return (
                        <div
                          key={subtopic.id}
                          className={cn(
                            "rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card",
                            visibleStatus === "studied" && "state-success",
                            visibleStatus === "studying" &&
                              "border-primary/25 bg-primary/5",
                            visibleStatus === "not-started" &&
                              "border-border/60 bg-card/80",
                            inPlan && "ring-1 ring-amber-200"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-text-main">
                                {subtopic.title}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                                {subtopic.description}
                              </p>
                            </div>
                            <span className={statusClassName(visibleStatus)}>
                              {statusLabels[visibleStatus]}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (subtopic.lessonId) {
                                  router.push(`/learn/economics/${subtopic.lessonId}`);
                                  return;
                                }

                                updateStatus(key, "studying");
                              }}
                              className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-primary/30 hover:text-text-main"
                            >
                              {subtopic.lessonId
                                ? "Open lesson"
                                : status === "studying"
                                  ? "Unmark studying"
                                  : "Learn topic"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                askAi(activeSubject, activeGroup, subtopic)
                              }
                              className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-primary/30 hover:text-text-main"
                            >
                              Ask AI
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                startPractice(activeSubject, activeGroup, subtopic)
                              }
                              className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-primary/30 hover:text-text-main"
                            >
                              Practice
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                toggleTopicPlan(
                                  activeSubject,
                                  activeGroup,
                                  subtopic
                                )
                              }
                              className={cn(
                                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                                inPlan
                                  ? "state-warning"
                                  : "chip hover:border-primary/30 hover:text-text-main"
                              )}
                            >
                              {inPlan ? "Remove plan" : "Add plan"}
                            </button>
                          </div>
                          {inPlan ? (
                            <div className="state-warning mt-2 rounded-xl border px-3 py-2 text-xs font-semibold">
                              Pinned to My Plan
                            </div>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => updateStatus(key, "studied")}
                            className="state-success mt-2 w-full rounded-xl border px-3 py-2 text-xs font-semibold transition hover:brightness-105"
                          >
                            {status === "studied"
                              ? "Undo studied"
                              : "Mark as studied"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </Container>
  );
}
