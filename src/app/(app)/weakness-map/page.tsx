"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  getWeaknessDisplayLabel,
  getWeaknessEvents,
  getWeaknessSeverity,
  summarizeWeaknessEvents,
} from "@/lib/weaknesses";
import { useRequireAuth } from "@/lib/useRequireAuth";

const sourceLabel: Record<string, string> = {
  practice: "Practice",
  ia: "Economics IA",
  ee: "Extended Essay",
};

const sourceClassName: Record<string, string> = {
  practice: "border-primary/20 bg-primary/10 text-primary",
  ia: "state-success",
  ee: "state-warning",
};

export default function WeaknessMapPage() {
  const { ready } = useRequireAuth();
  const { profile } = useAuth();
  const events = useMemo(() => getWeaknessEvents(), []);
  const summary = useMemo(() => summarizeWeaknessEvents(events), [events]);
  const subjectLabels = useMemo(() => {
    const labels = new Map<string, string>();
    profile?.subjects.forEach((subject) => labels.set(subject.key, subject.name));
    return labels;
  }, [profile]);
  const subjectGroups = useMemo(() => {
    const groups = new Map<string, typeof summary>();

    summary.forEach((item) => {
      const subjectId = item.latest?.subjectId ?? "general";
      const current = groups.get(subjectId) ?? [];
      groups.set(subjectId, [...current, item]);
    });

    return Array.from(groups.entries()).map(([subjectId, items]) => ({
      subjectId,
      subjectName:
        subjectLabels.get(subjectId) ??
        subjectId
          .split("-")
          .map((part) => part[0]?.toUpperCase() + part.slice(1))
          .join(" "),
      items,
    }));
  }, [subjectLabels, summary]);
  const topSources = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((event) => {
      counts.set(event.source, (counts.get(event.source) ?? 0) + 1);
    });

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [events]);

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.16),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative">
            <BackButton className="mb-6" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                  Weakness Map
                </p>
                <h1 className="mt-2 font-heading text-2xl font-semibold text-text-main">
                  Improvement signals by subject
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-text-muted">
                  Built from local Practice, IA, and Extended Essay feedback.
                  These tags power Dashboard and My Plan priorities.
                </p>
              </div>
              <Button href="/learn" className="shadow">
                Open Learn
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Total signals
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-main">
                  {events.length}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Stored locally on this device
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Source mix
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {topSources.length ? (
                    topSources.map(([source, count]) => (
                      <span
                        key={source}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${sourceClassName[source] ?? "border-border bg-card text-text-secondary"}`}
                      >
                        {sourceLabel[source] ?? source} · {count}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-secondary">
                      No sources yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-text-main">
                  Subject groups
                </p>
                <div className="mt-4 space-y-3">
                  {subjectGroups.length ? (
                    subjectGroups.map((group) => (
                      <div
                        key={group.subjectId}
                        className="rounded-2xl border border-border/60 bg-card/80 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-text-main">
                            {group.subjectName}
                          </p>
                          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary">
                            {group.items.reduce(
                              (total, item) => total + item.count,
                              0
                            )}{" "}
                            signals
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {group.items.slice(0, 4).map((item) => {
                            const severity = getWeaknessSeverity(item.count);

                            return (
                              <div
                                key={item.label}
                                className="rounded-xl border border-border/60 bg-card/80 px-3 py-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-text-main">
                                      {getWeaknessDisplayLabel(item.label)}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted">
                                      {item.latest?.detail ??
                                        "Local study signal"}
                                    </p>
                                  </div>
                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                      severity === "high"
                                        ? "state-danger"
                                        : severity === "medium"
                                          ? "state-warning"
                                          : "state-success"
                                    }`}
                                  >
                                    {severity} · {item.count}x
                                  </span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Link
                                    href="/learn"
                                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary transition hover:border-primary/25 hover:text-text-main"
                                  >
                                    Learn
                                  </Link>
                                  <Link
                                    href="/practice"
                                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary transition hover:border-primary/25 hover:text-text-main"
                                  >
                                    Practice
                                  </Link>
                                  <Link
                                    href={item.latest?.href ?? "/grade-work-app"}
                                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary transition hover:border-primary/25 hover:text-text-main"
                                  >
                                    Grade Work
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-text-secondary">
                      Submit Economics practice, IA, or EE feedback to start
                      building your weakness map.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-text-main">
                    How to use this
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                    <li>- Pick one repeated tag.</li>
                    <li>- Open the linked practice, IA, or EE flow.</li>
                    <li>- Add a matching topic to My Plan from Learn.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-text-main">
                    Fast actions
                  </p>
                  <div className="mt-4 grid gap-2">
                    <Button href="/practice" variant="secondary">
                      Start practice
                    </Button>
                    <Button href="/grade-work-app/ia" variant="secondary">
                      Grade Economics IA
                    </Button>
                    <Button href="/my-plan" className="shadow">
                      Open My Plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
