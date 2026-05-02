"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { MarkdownText } from "@/components/ui/MarkdownText";
import { computeScore, getGradeBand } from "@/lib/practice/scoring";
import type { PracticeAttempt, PracticeSession } from "@/lib/storage";
import {
  addAttemptToHistory,
  getLastAttempt,
  getLastSession,
  setLastAttempt,
  setRewriteMode,
} from "@/lib/storage";
import { addWeaknessEvents } from "@/lib/weaknesses";

type ResubmitResult = {
  delta: number;
  nextScore: number;
  nextBand: number;
  summary: string;
};

type PracticeAiFeedback = {
  mode: "demo" | "gemini";
  feedback: string;
  weaknessTags: string[];
};

const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

export default function PracticeReportPage() {
  const router = useRouter();
  const [session] = useState<PracticeSession | null>(() => getLastSession());
  const [attempt, setAttempt] = useState<PracticeAttempt | null>(() =>
    getLastAttempt()
  );
  const [resubmitResult, setResubmitResult] = useState<ResubmitResult | null>(
    null
  );
  const [aiFeedback, setAiFeedback] = useState<PracticeAiFeedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

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
    addWeaknessEvents(
      fresh.lostMarks.map((lostMark) => ({
        source: "practice",
        subjectId: session.subject,
        label: lostMark,
        detail: `${session.paper} · ${session.topic}`,
        href: "/practice/report",
      }))
    );
    setResubmitResult({ delta, nextScore, nextBand, summary });
  };

  const handleAiFeedback = async () => {
    if (!session || !attempt || feedbackLoading) {
      return;
    }

    setFeedbackLoading(true);
    try {
      const response = await fetch("/api/practice/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
          answer: attempt.submittedText || attempt.draftText,
        }),
      });
      const data = (await response.json()) as PracticeAiFeedback & {
        error?: string;
      };

      if (!response.ok || !data.feedback) {
        throw new Error(data.error || "Unable to generate feedback.");
      }

      setAiFeedback(data);
      addWeaknessEvents(
        data.weaknessTags.map((tag) => ({
          source: "practice",
          subjectId: session.subject,
          label: tag,
          detail: `${session.paper} · ${session.topic}`,
          href: "/practice/report",
        }))
      );
    } catch (error) {
      setAiFeedback({
        mode: "demo",
        feedback:
          error instanceof Error
            ? error.message
            : "Unable to generate feedback right now.",
        weaknessTags: [],
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (!session || !attempt) {
    return (
      <Container className="px-0">
        <Card className="border-border bg-card/80 shadow-soft">
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
          <Card className="border-border bg-card/80 shadow-soft">
            <p className="text-sm font-semibold text-text-main">Strengths</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Card>

          <Card className="border-border bg-card/80 shadow-soft">
            <p className="text-sm font-semibold text-text-main">Lost Marks</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {lostMarks.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Card>

          <Card className="border-border bg-card/80 shadow-soft">
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
          <Card className="border border-primary/20 bg-card/85 shadow-soft">
            <p className="text-sm font-semibold text-text-main">
              Improvement check
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {resubmitResult.summary}
            </p>
          </Card>
        ) : null}

        {aiFeedback ? (
          <Card className="border border-primary/20 bg-card/90 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-text-main">
                AI feedback
              </p>
              <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-text-secondary">
                {aiFeedback.mode === "gemini" ? "Gemini" : "Demo mode"}
              </span>
            </div>
            <div className="mt-3 text-sm text-text-secondary">
              <MarkdownText content={aiFeedback.feedback} />
            </div>
          </Card>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="shadow" onClick={handleRewrite}>
            Rewrite with guidance
          </Button>
          <Button variant="secondary" onClick={handleResubmit}>
            Resubmit
          </Button>
          <Button
            variant="secondary"
            onClick={handleAiFeedback}
            disabled={feedbackLoading}
          >
            {feedbackLoading ? "Getting feedback..." : "Get AI feedback"}
          </Button>
        </div>
      </div>
    </Container>
  );
}
