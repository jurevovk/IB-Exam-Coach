"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { computeScore, getGradeBand } from "@/lib/practice/scoring";
import type { PracticeAttempt, PracticeSession } from "@/lib/storage";
import {
  addAttemptToHistory,
  getLastAttempt,
  getLastSession,
  setLastAttempt,
  setRewriteMode,
} from "@/lib/storage";

type ResubmitResult = {
  delta: number;
  nextScore: number;
  nextBand: number;
  summary: string;
};

const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

export default function PracticeReportPage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [attempt, setAttempt] = useState<PracticeAttempt | null>(null);
  const [resubmitResult, setResubmitResult] = useState<ResubmitResult | null>(
    null
  );

  useEffect(() => {
    const storedSession = getLastSession();
    const storedAttempt = getLastAttempt();

    if (!storedSession || !storedAttempt) {
      setSession(null);
      setAttempt(null);
      return;
    }

    setSession(storedSession);
    setAttempt(storedAttempt);
  }, []);

  const scoreLine = useMemo(() => {
    if (!session || !attempt) {
      return null;
    }

    return `${attempt.score}/${session.marks} \u2192 Grade ${attempt.gradeBand}`;
  }, [attempt, session]);

  const strengths = attempt?.strengths?.length
    ? attempt.strengths
    : ["No strengths recorded yet."];
  const lostMarks = attempt?.lostMarks?.length
    ? attempt.lostMarks
    : ["No lost marks recorded yet."];
  const bandJumpPlan = attempt?.bandJumpPlan?.length
    ? attempt.bandJumpPlan
    : ["Add another example and final judgement."];

  const handleRewrite = () => {
    setRewriteMode(true);
    router.push("/practice/write");
  };

  const handleResubmit = () => {
    if (!session || !attempt) {
      return;
    }

    const baseText = attempt.submittedText || attempt.draftText;
    const fresh = computeScore(baseText, session);
    let nextScore = fresh.score;

    if (nextScore <= attempt.score) {
      nextScore = Math.min(session.marks, attempt.score + 2);
    }

    const delta = nextScore - attempt.score;
    const nextBand = getGradeBand(nextScore, session.marks);
    const summary =
      delta > 0
        ? `+${delta} marks gained, evaluation improved, confidence high.`
        : "Score steady. Tighten evaluation and evidence next pass.";

    const updated: PracticeAttempt = {
      ...attempt,
      submittedText: baseText,
      wordCount: attempt.wordCount || countWords(baseText),
      timeSpent: attempt.timeSpent,
      score: nextScore,
      gradeBand: nextBand,
      strengths: fresh.strengths,
      lostMarks: fresh.lostMarks,
      bandJumpPlan: fresh.bandJumpPlan,
    };

    setAttempt(updated);
    setLastAttempt(updated);
    addAttemptToHistory(updated);
    setResubmitResult({ delta, nextScore, nextBand, summary });
  };

  if (!session || !attempt) {
    return (
      <Container className="px-0">
        <Card className="border-border bg-white/70 shadow-soft">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-text-main">
              No report yet
            </h1>
            <p className="text-sm text-text-secondary">
              Start a practice session to generate your examiner report.
            </p>
            <Button className="shadow" href="/practice/setup">
              Start Practice
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Examiner Report
          </p>
          <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Your result
          </h1>
        </header>

        <Card className="border border-white/10 bg-report text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Score
          </p>
          <p className="mt-4 text-3xl font-semibold">{scoreLine}</p>
          <p className="mt-2 text-sm text-white/70">
            {session.subject.split("-").join(" ")} · {session.paper} ·{" "}
            {session.marks} marks
          </p>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-border bg-white/70 shadow-soft">
            <p className="text-sm font-semibold text-text-main">Strengths</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Card>

          <Card className="border-border bg-white/70 shadow-soft">
            <p className="text-sm font-semibold text-text-main">Lost Marks</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {lostMarks.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Card>

          <Card className="border-border bg-white/70 shadow-soft">
            <p className="text-sm font-semibold text-text-main">
              Band Jump Plan
            </p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {bandJumpPlan.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Card>
        </div>

        {resubmitResult ? (
          <Card className="border border-primary/20 bg-white/80 shadow-soft">
            <p className="text-sm font-semibold text-text-main">
              Improvement check
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {resubmitResult.summary}
            </p>
          </Card>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="shadow" onClick={handleRewrite}>
            Rewrite with guidance
          </Button>
          <Button variant="secondary" onClick={handleResubmit}>
            Resubmit
          </Button>
        </div>
      </div>
    </Container>
  );
}
