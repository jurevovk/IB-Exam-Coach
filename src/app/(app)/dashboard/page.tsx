"use client";

import Link from "next/link";
import { useMemo } from "react";

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
  createLessonProgressKey,
  getLearnProgress,
  getLessonProgress,
} from "@/lib/learn/progress";
import {
  getWeaknessDisplayLabel,
  getWeaknessEvents,
} from "@/lib/weaknesses";
import { getUserPreferences } from "@/lib/preferences";

const formatSubjectKey = (key: string) =>
  key
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

export default function DashboardPage() {
  const { profile } = useAuth();
  const progress = useMemo(() => getLearnProgress(), []);
  const lessonProgress = useMemo(() => getLessonProgress(), []);
  const planSignals = useMemo(() => getPlanSignals(), []);
  const weaknessEvents = useMemo(() => getWeaknessEvents(), []);
  const preferences = useMemo(() => getUserPreferences(), []);

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

  const subjectStats = useMemo(() => {
    return resolvedSubjects.map((subject) => {
      const visibleSubtopics = subject.version.topicGroups.flatMap((group) =>
        group.subtopics.map((subtopic) => ({
          group,
          subtopic,
          key: `${subject.blueprint.subjectId}:${subject.version.id}:${subtopic.id}`,
        }))
      );
      const studied = visibleSubtopics.filter((topic) => {
        const lessonKey = topic.subtopic.lessonId
          ? createLessonProgressKey(
              subject.blueprint.subjectId,
              subject.version.id,
              topic.subtopic.lessonId
            )
          : null;
        return (
          progress[topic.key]?.status === "studied" ||
          (lessonKey
            ? lessonProgress[lessonKey]?.status === "completed"
            : false)
        );
      }).length;
      const nextTopic =
        visibleSubtopics.find((topic) => {
          const lessonKey = topic.subtopic.lessonId
            ? createLessonProgressKey(
                subject.blueprint.subjectId,
                subject.version.id,
                topic.subtopic.lessonId
              )
            : null;
          return !(
            progress[topic.key]?.status === "studied" ||
            (lessonKey
              ? lessonProgress[lessonKey]?.status === "completed"
              : false)
          );
        }) ?? visibleSubtopics[0];
      const weaknessCount = weaknessEvents.filter(
        (event) => event.subjectId === subject.blueprint.subjectId
      ).length;

      return {
        subject,
        studied,
        total: visibleSubtopics.length,
        percent: visibleSubtopics.length
          ? Math.round((studied / visibleSubtopics.length) * 100)
          : 0,
        weaknessCount,
        nextTopic,
      };
    });
  }, [lessonProgress, progress, resolvedSubjects, weaknessEvents]);

  const strongestSubject = useMemo(
    () => [...subjectStats].sort((a, b) => b.percent - a.percent)[0],
    [subjectStats]
  );

  const weakestSubject = useMemo(
    () =>
      [...subjectStats].sort(
        (a, b) =>
          b.weaknessCount - a.weaknessCount || a.percent - b.percent
      )[0],
    [subjectStats]
  );
  const hasMultipleSubjects = subjectStats.length > 1;

  const recommendedTasks = useMemo(() => {
    const pinned = planSignals.pinnedTopics.slice(0, 2).map((topic) => ({
      title: topic.subtopicTitle,
      detail: `${topic.subjectName} ${topic.level.toUpperCase()} · from My Plan`,
      href: "/my-plan",
    }));
    const firstOpenTopic = resolvedSubjects.flatMap((subject) =>
      subject.version.topicGroups.flatMap((group) =>
        group.subtopics.map((subtopic) => {
          const key = `${subject.blueprint.subjectId}:${subject.version.id}:${subtopic.id}`;
          const lessonKey = subtopic.lessonId
            ? createLessonProgressKey(
                subject.blueprint.subjectId,
                subject.version.id,
                subtopic.lessonId
              )
            : null;
          return {
            key,
            lessonKey,
            title: subtopic.title,
            detail: `${subject.blueprint.displayName} ${subject.profileSubject.level.toUpperCase()} · ${group.title}`,
            href: subtopic.lessonId
              ? `/learn/economics/${subtopic.lessonId}`
              : "/learn",
          };
        })
      )
    ).find(
      (topic) =>
        progress[topic.key]?.status !== "studied" &&
        (topic.lessonKey
          ? lessonProgress[topic.lessonKey]?.status !== "completed"
          : true)
    );

    if (pinned.length >= 2) {
      return pinned;
    }

    return [
      ...pinned,
      firstOpenTopic ?? {
        title: "Start one focused practice response",
        detail: planSignals.lastSession
          ? `${formatSubjectKey(planSignals.lastSession.subject)} · ${
              planSignals.lastSession.topic
            }`
          : "Use your first selected subject",
        href: "/practice",
      },
    ].slice(0, 2);
  }, [lessonProgress, planSignals, progress, resolvedSubjects]);

  if (!profile) {
    return (
      <Container className="px-0">
        <Card className="border-border bg-card/85 shadow-soft">
          Loading dashboard...
        </Card>
      </Container>
    );
  }

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-6 shadow-soft backdrop-blur-sm sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
                Dashboard
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Good afternoon, {profile.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Your workspace now uses your selected subjects, exam session,
                topic progress, recent practice, and Grade Work activity.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
              <span className="font-semibold text-text-main">
                {profile.examSession || "No exam session"}
              </span>
              <span className="mx-2 text-text-muted">·</span>
              {profile.subjects.length} subject
              {profile.subjects.length === 1 ? "" : "s"}
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-border bg-card/95 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Subject cockpit
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  One next action per selected subject, balanced across your
                  workspace.
                </p>
              </div>
              <Button href="/learn" variant="secondary">
                Open Learn
              </Button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {subjectStats.map((item) => (
                <Link
                  key={item.subject.blueprint.subjectId}
                  href="/learn"
                  className="rounded-2xl border border-border/60 bg-card/80 p-4 transition hover:border-primary/25 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text-main">
                        {item.subject.blueprint.displayName}{" "}
                        {item.subject.profileSubject.level.toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        {item.nextTopic
                          ? `Next: ${item.nextTopic.subtopic.title}`
                          : "Add syllabus topics"}
                      </p>
                    </div>
                    <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-text-secondary">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-border/50">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    {item.weaknessCount
                      ? `${item.weaknessCount} weakness signal${
                          item.weaknessCount === 1 ? "" : "s"
                        }`
                      : "No weakness signals yet"}
                  </p>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="border-border bg-card/95 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Balance check
            </p>
            <div className="mt-4 space-y-3">
              <div className="state-success rounded-xl border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {hasMultipleSubjects ? "Strongest" : "Current focus"}
                </p>
                <p className="mt-1 text-sm font-semibold text-text-main">
                  {strongestSubject?.subject.blueprint.displayName ??
                    "No subject yet"}
                </p>
              </div>
              <div className="state-warning rounded-xl border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {hasMultipleSubjects ? "Needs attention" : "Next improvement"}
                </p>
                <p className="mt-1 text-sm font-semibold text-text-main">
                  {hasMultipleSubjects
                    ? weakestSubject?.subject.blueprint.displayName ??
                      "No subject yet"
                    : planSignals.weaknessTags[0]
                      ? getWeaknessDisplayLabel(planSignals.weaknessTags[0].label)
                      : "Build more activity"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="border-border bg-card/90 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Topic progress
            </p>
            <p className="mt-3 text-3xl font-semibold text-text-main">
              {progressSummary.percent}%
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-border/60">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${progressSummary.percent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              {progressSummary.studied}/{progressSummary.total} seeded Learn
              topics studied
            </p>
          </Card>

          <Card className="border-white/10 bg-report text-white shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Today&apos;s tasks
            </p>
            <div className="mt-4 space-y-3">
              {recommendedTasks.map((task, index) => (
                <Link
                  key={`${task.title}-${index}`}
                  href={task.href}
                  className="block rounded-xl border border-white/10 bg-card/10 px-4 py-3 transition hover:bg-card/15"
                >
                  <p className="text-sm font-semibold text-white">
                    {index + 1}. {task.title}
                  </p>
                  <p className="mt-1 text-xs text-white/65">{task.detail}</p>
                </Link>
              ))}
            </div>
            <Button href="/my-plan" className="mt-5 w-full shadow">
              Open My Plan
            </Button>
          </Card>

          {preferences.showExamCountdown ? (
          <Card className="border-border bg-card/85 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Next exam session
            </p>
            <p className="mt-4 text-3xl font-semibold text-text-main">
              {profile.examSession || "Not set"}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Planning is prioritized around your session and selected subject
              levels.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.subjects.slice(0, 4).map((subject) => (
                <span
                  key={subject.key}
                  className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-text-secondary"
                >
                  {subject.name} {subject.level.toUpperCase()}
                </span>
              ))}
            </div>
          </Card>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
          <Card className="border-border bg-card/90 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Quick resume
                </p>
                <p className="mt-3 text-lg font-semibold text-text-main">
                  {planSignals.lastSession
                    ? `${formatSubjectKey(planSignals.lastSession.subject)} · ${
                        planSignals.lastSession.topic
                      }`
                    : "No active practice session yet"}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  {planSignals.lastSession
                    ? `${planSignals.lastSession.paper} · ${planSignals.lastSession.marks} marks · ${planSignals.lastSession.mode}`
                    : "Start with Learn or Practice to create your first active session."}
                </p>
              </div>
              <Button href={planSignals.lastSession ? "/practice/write" : "/learn"} className="shadow">
                {planSignals.lastSession ? "Resume" : "Open Learn"}
              </Button>
            </div>
          </Card>

          <Card className="border-border bg-card/90 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Weakness signals
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
                  No weakness tags yet. Submit practice or Grade Work to build
                  your map.
                </p>
              )}
            </div>
          </Card>
        </div>

        <Card className="border-border bg-card/90 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Recent activity
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Pulled from Practice attempts and Grade Work history stored on
                this device.
              </p>
            </div>
            <Button href="/learn" variant="secondary">
              Continue learning
            </Button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {planSignals.recentActivities.length ? (
              planSignals.recentActivities.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className="rounded-2xl border border-border/60 bg-card/80 p-4 transition hover:border-primary/25 hover:shadow-sm"
                >
                  <p className="font-semibold text-text-main">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {activity.detail}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-text-secondary">
                No recent activity yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
