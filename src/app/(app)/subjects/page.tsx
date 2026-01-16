"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { SubjectCard } from "@/components/subjects/SubjectCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { Subject } from "@/lib/subjects";
import { subjects } from "@/lib/subjects";
import type { PracticeSession } from "@/lib/storage";
import { getLastSession, setLastSession, setRewriteMode } from "@/lib/storage";
import { useAuth } from "@/components/auth/AuthProvider";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
};

const createSession = (
  subject: string,
  level: PracticeSession["level"]
): PracticeSession => ({
  id: createId(),
  subject,
  level,
  paper: "Paper 1",
  topic: "Any",
  marks: 15,
  mode: "timed",
  difficulty: "medium",
  commandTerm: "Discuss",
  goalMode: "band-jump",
});

export default function SubjectsPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [lastSession, setLastSessionState] =
    useState<PracticeSession | null>(null);

  useEffect(() => {
    setLastSessionState(getLastSession());
  }, []);

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
      lastSession?.subject ??
      profile?.subjects?.[0]?.key ??
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
          <Card className="border-border bg-white/70 shadow-soft">
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

          <Card className="border-border bg-white/70 shadow-soft">
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

        <div className="rounded-2xl border border-primary/15 bg-white/70 p-4 text-sm text-text-secondary shadow-soft">
          <span className="font-semibold text-text-main">Daily mission:</span>{" "}
          Complete one timed response and improve your evaluation language.
        </div>

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
