"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { questionBank, type PracticeQuestion } from "@/lib/practice/questionBank";
import { computeScore } from "@/lib/practice/scoring";
import type { PracticeAttempt, PracticeSession } from "@/lib/storage";
import {
  addAttemptToHistory,
  getLastAttempt,
  getLastSession,
  getRewriteMode,
  setLastAttempt,
  setLastSession,
  setRewriteMode,
} from "@/lib/storage";

const commandTermHelp: Record<string, string> = {
  Explain: "Make clear how or why something happens by linking steps logically.",
  Discuss: "Offer a balanced view with multiple perspectives and a judgement.",
  Evaluate: "Weigh strengths and weaknesses before reaching a conclusion.",
  Compare: "Highlight similarities and differences using evidence.",
  "To what extent":
    "State the degree of agreement and support it with evaluation.",
  Analyze: "Break the issue into parts and show how they connect.",
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `attempt-${Date.now()}`;
};

const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

const resolveQuestion = (session: PracticeSession): PracticeQuestion => {
  const bySubject = questionBank.filter(
    (question) => question.subject === session.subject
  );
  const byPaper = bySubject.filter(
    (question) => question.paper === session.paper
  );
  const byTopic =
    session.topic && session.topic !== "Any"
      ? byPaper.filter((question) => question.topic === session.topic)
      : byPaper;
  const byMarks = byTopic.filter((question) => question.marks === session.marks);
  const byDifficulty = byMarks.filter(
    (question) => question.difficulty === session.difficulty
  );

  return (
    byDifficulty[0] ||
    byMarks[0] ||
    byTopic[0] ||
    byPaper[0] ||
    bySubject[0] ||
    questionBank[0]
  );
};

export default function PracticeWritePage() {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showCommandHelp, setShowCommandHelp] = useState(true);
  const [showStructureGuide, setShowStructureGuide] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const timeSpentRef = useRef(0);

  useEffect(() => {
    timeSpentRef.current = timeSpent;
  }, [timeSpent]);

  useEffect(() => {
    const storedSession = getLastSession();
    if (!storedSession) {
      router.replace("/practice/setup");
      return;
    }

    const resolved = resolveQuestion(storedSession);
    const nextSession =
      storedSession.questionId === resolved.id
        ? storedSession
        : {
            ...storedSession,
            questionId: resolved.id,
            topic: resolved.topic,
            marks: resolved.marks,
            commandTerm: storedSession.commandTerm || resolved.commandTerm,
          };

    if (nextSession !== storedSession) {
      setLastSession(nextSession);
    }

    setSession(nextSession);
    setQuestion(resolved);

    const lastAttempt = getLastAttempt();
    if (lastAttempt?.sessionId === nextSession.id) {
      setAttemptId(lastAttempt.id);
      setDraft(lastAttempt.draftText || lastAttempt.submittedText || "");
      setTimeSpent(lastAttempt.timeSpent || 0);
    } else {
      setAttemptId(createId());
    }

    setShowGuidance(getRewriteMode());
  }, [router]);

  const wordCount = useMemo(() => countWords(draft), [draft]);

  useEffect(() => {
    if (!session || !attemptId) {
      return;
    }

    setIsSaving(true);
    const timeout = window.setTimeout(() => {
      const attempt: PracticeAttempt = {
        id: attemptId,
        sessionId: session.id,
        draftText: draft,
        submittedText: "",
        wordCount,
        timeSpent: timeSpentRef.current,
        score: 0,
        gradeBand: 0,
        strengths: [],
        lostMarks: [],
        bandJumpPlan: [],
      };

      setLastAttempt(attempt);
      setSavedAt(new Date());
      setIsSaving(false);
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [attemptId, draft, session, wordCount]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!session || !attemptId) {
      return;
    }

    const result = computeScore(draft, session);
    const attempt: PracticeAttempt = {
      id: attemptId,
      sessionId: session.id,
      draftText: draft,
      submittedText: draft,
      wordCount,
      timeSpent: timeSpentRef.current,
      score: result.score,
      gradeBand: result.gradeBand,
      strengths: result.strengths,
      lostMarks: result.lostMarks,
      bandJumpPlan: result.bandJumpPlan,
    };

    setLastAttempt(attempt);
    addAttemptToHistory(attempt);
    setRewriteMode(false);
    router.push("/practice/report");
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const saveLabel = () => {
    if (isSaving) {
      return "Saving...";
    }

    if (!savedAt) {
      return "Not saved yet";
    }

    const elapsed = Math.floor((Date.now() - savedAt.getTime()) / 1000);
    if (elapsed < 10) {
      return "Saved just now";
    }

    return `Saved ${elapsed}s ago`;
  };

  const guidancePlan = useMemo(() => {
    const lastAttempt = getLastAttempt();
    if (!lastAttempt?.bandJumpPlan?.length) {
      return [];
    }

    return lastAttempt.bandJumpPlan;
  }, []);

  if (!session || !question) {
    return null;
  }

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
              Write Stage
            </p>
            <h1 className="mt-2 font-heading text-2xl font-semibold text-text-main sm:text-3xl">
              {question.topic} practice
            </h1>
            <p className="text-sm text-text-secondary">
              {session.subject.split("-").join(" ")}{" "}
              {session.level.toUpperCase()} ·{" "}
              {session.paper} · {session.marks} marks
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-full border border-border/60 bg-white/70 px-4 py-2 text-xs text-text-muted shadow-sm">
            <span>
              {session.mode === "timed" ? "Timer" : "Time"}:{" "}
              <strong className="text-text-main">{formatTimer(timeSpent)}</strong>
            </span>
            <span>
              Words: <strong className="text-text-main">{wordCount}</strong>
            </span>
            <span>{saveLabel()}</span>
            <Button className="px-4 py-2 text-xs shadow" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-4">
            <Card className="border-border bg-white/70 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Question
              </p>
              <p className="mt-3 text-sm text-text-main">{question.prompt}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-muted">
                <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1">
                  Command: {session.commandTerm}
                </span>
                <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1">
                  Difficulty: {session.difficulty}
                </span>
              </div>
            </Card>

            <Card className="border-border bg-white/70 shadow-soft">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-text-main"
                onClick={() => setShowCommandHelp((prev) => !prev)}
              >
                Command term helper
                <span className="text-xs text-text-muted">
                  {showCommandHelp ? "Hide" : "Show"}
                </span>
              </button>
              {showCommandHelp ? (
                <p className="mt-3 text-sm text-text-secondary">
                  {commandTermHelp[session.commandTerm] ??
                    "Use clear reasoning and justify each claim with evidence."}
                </p>
              ) : null}
            </Card>

            <Card className="border-border bg-white/70 shadow-soft">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-text-main"
                onClick={() => setShowStructureGuide((prev) => !prev)}
              >
                Structure guide
                <span className="text-xs text-text-muted">
                  {showStructureGuide ? "Hide" : "Show"}
                </span>
              </button>
              {showStructureGuide ? (
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  <li>1. Define key terms and set the scope.</li>
                  <li>2. Make two clear points with evidence.</li>
                  <li>3. Evaluate each point before concluding.</li>
                </ul>
              ) : null}
            </Card>

            <Card className="border-border bg-white/70 shadow-soft">
              <p className="text-sm font-semibold text-text-main">
                Evidence reminders
              </p>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li>Include one data point or statistic.</li>
                <li>Reference a real-world example or case study.</li>
                <li>Link evidence back to the command term.</li>
              </ul>
            </Card>

            {showGuidance && guidancePlan.length ? (
              <Card className="border-border bg-white/80 shadow-soft">
                <p className="text-sm font-semibold text-text-main">
                  Band Jump Plan
                </p>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {guidancePlan.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>

          <Card className="border-border bg-white/70 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-main">
                Your response
              </p>
              <span className="text-xs text-text-muted">
                Autosave {isSaving ? "active" : "ready"}
              </span>
            </div>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write your response here..."
              rows={18}
              className="mt-4 w-full resize-none rounded-2xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </Card>
        </div>
      </div>
    </Container>
  );
}
