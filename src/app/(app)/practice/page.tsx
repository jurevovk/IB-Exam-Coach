"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { SubjectCard } from "@/components/subjects/SubjectCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Subject } from "@/lib/subjects";
import { subjects } from "@/lib/subjects";
import type { PracticeSession } from "@/lib/storage";
import { getLastSession, setLastSession, setRewriteMode } from "@/lib/storage";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
};

const createSession = (
  subject: string,
  level: PracticeSession["level"],
  overrides: Partial<PracticeSession> = {}
): PracticeSession => ({
  id: createId(),
  subject,
  level,
  paper: overrides.paper ?? "Paper 1",
  topic: overrides.topic ?? "Any",
  marks: overrides.marks ?? 15,
  mode: overrides.mode ?? "timed",
  difficulty: overrides.difficulty ?? "medium",
  commandTerm: overrides.commandTerm ?? "Discuss",
  goalMode: overrides.goalMode ?? "band-jump",
  practiceMode: overrides.practiceMode,
  lessonId: overrides.lessonId,
});

const economicsPracticeModes: Array<{
  id: NonNullable<PracticeSession["practiceMode"]>;
  title: string;
  detail: string;
  session: Partial<PracticeSession>;
}> = [
  {
    id: "topic-drill",
    title: "Topic Drill",
    detail: "Short Unit 1 checks for definitions, models, and examples.",
    session: {
      paper: "Paper 1",
      topic: "Scarcity and opportunity cost",
      marks: 10,
      mode: "untimed",
      difficulty: "easy",
      commandTerm: "Explain",
      practiceMode: "topic-drill",
      lessonId: "scarcity-choice-opportunity-cost",
    },
  },
  {
    id: "paper-practice",
    title: "Paper Practice",
    detail: "Paper 1 style prompts using Unit 1 economic reasoning.",
    session: {
      paper: "Paper 1",
      topic: "PPC and circular flow",
      marks: 15,
      mode: "untimed",
      difficulty: "medium",
      commandTerm: "Analyze",
      practiceMode: "paper-practice",
      lessonId: "ppc-circular-flow",
    },
  },
  {
    id: "timed-mode",
    title: "Timed Mode",
    detail: "A focused timed response with evaluation expectations.",
    session: {
      paper: "Paper 1",
      topic: "Economic systems",
      marks: 15,
      mode: "timed",
      difficulty: "medium",
      commandTerm: "Evaluate",
      practiceMode: "timed-mode",
      lessonId: "economic-systems",
    },
  },
  {
    id: "weakness-repair",
    title: "Weakness Repair",
    detail: "Targets common weak areas like evaluation and concept application.",
    session: {
      paper: "Paper 1",
      topic: "Positive and normative economics",
      marks: 15,
      mode: "untimed",
      difficulty: "hard",
      commandTerm: "Discuss",
      practiceMode: "weakness-repair",
      lessonId: "positive-normative-economic-thought",
    },
  },
];

export default function PracticePage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [lastSession] = useState<PracticeSession | null>(() =>
    getLastSession()
  );

  type SubjectCardItem = Subject & {
    levelLabel: string;
    level: "hl" | "sl";
  };

  const subjectCards = useMemo<SubjectCardItem[]>(() => {
    if (profile?.subjects?.length) {
      return profile.subjects.flatMap((selected) => {
        const base = subjects.find((subject) => subject.key === selected.key);
        if (!base) {
          return [];
        }

        return [
          {
            ...base,
            levelLabel: selected.level.toUpperCase(),
            level: selected.level,
          },
        ];
      });
    }

    return subjects.map((subject) => ({
      ...subject,
      levelLabel: "HL/SL",
      level: "hl" as const,
    }));
  }, [profile]);

  const handleStartSetup = (subjectKey: string, level: "hl" | "sl") => {
    const session = createSession(subjectKey, level);
    setLastSession(session);
    setRewriteMode(false);
    router.push("/practice/setup");
  };

  const handleQuickStart = () => {
    const subjectKey =
      lastSession?.subject ||
      profile?.subjects?.[0]?.key ||
      subjects[0]?.key;
    const level =
      lastSession?.level ?? profile?.subjects?.[0]?.level ?? "hl";

    if (!subjectKey) {
      return;
    }

    const session = createSession(subjectKey, level);
    setLastSession(session);
    setRewriteMode(false);
    router.push("/practice/write");
  };

  const economicsProfileSubject = profile?.subjects.find(
    (subject) => subject.key === "economics"
  );

  const handleEconomicsMode = (
    mode: (typeof economicsPracticeModes)[number]
  ) => {
    const session = createSession(
      "economics",
      economicsProfileSubject?.level ?? "hl",
      mode.session
    );
    setLastSession(session);
    setRewriteMode(false);
    router.push("/practice/write");
  };

  const handleResume = () => {
    if (lastSession) {
      router.push("/practice/write");
      return;
    }

    router.push("/practice/setup");
  };

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Practice
          </p>
          <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Practice Home
          </h1>
          <p className="text-sm text-text-secondary">
            Pick a subject and move through the 5-stage practice flow.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="border-border bg-card/80 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Continue last session
                </p>
                <p className="mt-3 text-lg font-semibold text-text-main">
                  {lastSession
                    ? `${lastSession.subject.split("-").join(" ")} · ${
                        lastSession.paper
                      }`
                    : "No active session yet"}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  {lastSession
                    ? `${lastSession.marks} marks · ${lastSession.mode}`
                    : "Start a new session to build momentum."}
                </p>
              </div>
              <Button className="shadow" onClick={handleResume}>
                Resume
              </Button>
            </div>
          </Card>

          <Card className="border-border bg-card/80 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Quick Start
            </p>
            <p className="mt-3 text-lg font-semibold text-text-main">
              Jump into a 15-mark response
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Uses your last subject and opens the writing workspace.
            </p>
            <Button className="mt-4 shadow" onClick={handleQuickStart}>
              Quick Start
            </Button>
          </Card>
        </div>

        <div className="rounded-2xl border border-primary/15 bg-card/80 p-4 text-sm text-text-secondary shadow-soft">
          <span className="font-semibold text-text-main">Daily mission:</span>{" "}
          Complete one timed response and improve your evaluation language.
        </div>

        {economicsProfileSubject ? (
          <Card className="border-border bg-card/90 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Economics Practice 2.0
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-text-main">
                  Unit 1 starter modes
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Seeded for Unit 1 now, with room for Paper 1, Paper 2, HL
                  Paper 3, topic-based, and weakness-based expansion later.
                </p>
              </div>
              <Button href="/learn" variant="secondary">
                Open Economics Learn
              </Button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {economicsPracticeModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleEconomicsMode(mode)}
                  className="rounded-2xl border border-border/60 bg-card/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card"
                >
                  <p className="font-semibold text-text-main">{mode.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {mode.detail}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subjectCards.map((subject) => (
            <SubjectCard
              key={subject.key}
              subject={subject}
              levelLabel={subject.levelLabel}
              onStart={() => handleStartSetup(subject.key, subject.level)}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
