"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { questionBank } from "@/lib/practice/questionBank";
import { subjects } from "@/lib/subjects";
import type { PracticeSession } from "@/lib/storage";
import { getLastSession, setLastSession, setRewriteMode } from "@/lib/storage";
import { useAuth } from "@/components/auth/AuthProvider";

const papers = ["Paper 1", "Paper 2", "Paper 3"];
const marksOptions = [10, 15, 20];
const modes: PracticeSession["mode"][] = ["timed", "untimed"];
const difficulties: PracticeSession["difficulty"][] = ["easy", "medium", "hard"];
const goalModes: PracticeSession["goalMode"][] = ["band-jump", "consistency"];

const fallbackCommandTerms = [
  "Explain",
  "Discuss",
  "Evaluate",
  "Compare",
  "To what extent",
  "Analyze",
];

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
};

type PracticeSetupForm = Omit<PracticeSession, "id" | "questionId">;

const getInitialForm = (): PracticeSetupForm => {
  const lastSession = getLastSession();

  return {
    subject: lastSession?.subject ?? "",
    level: lastSession?.level ?? "hl",
    paper: lastSession?.paper ?? papers[0],
    topic: lastSession?.topic || "Any",
    marks: lastSession?.marks || 15,
    mode: lastSession?.mode ?? "timed",
    difficulty: lastSession?.difficulty ?? "medium",
    commandTerm: lastSession?.commandTerm ?? "Discuss",
    goalMode: lastSession?.goalMode ?? "band-jump",
  };
};

const getTopicOptions = (subject: string) => {
  const topics = questionBank
    .filter((question) => question.subject === subject)
    .map((question) => question.topic);
  return ["Any", ...Array.from(new Set(topics))];
};

export default function PracticeSetupPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const subjectOptions = useMemo(() => {
    if (profile?.subjects?.length) {
      return profile.subjects.map((subject) => ({
        key: subject.key,
        name: subject.name,
        level: subject.level,
      }));
    }

    return subjects.map((subject) => ({
      key: subject.key,
      name: subject.name,
      level: "hl" as const,
    }));
  }, [profile]);

  const [form, setForm] = useState<PracticeSetupForm>(() => getInitialForm());
  const subject = form.subject || subjectOptions[0]?.key || "";
  const level =
    subjectOptions.find((option) => option.key === subject)?.level ?? form.level;

  const topicOptions = useMemo(() => {
    return getTopicOptions(subject);
  }, [subject]);
  const topic = topicOptions.includes(form.topic) ? form.topic : "Any";

  const commandTermOptions = useMemo(() => {
    const terms = questionBank
      .filter((question) => question.subject === subject)
      .map((question) => question.commandTerm);
    return Array.from(new Set([...terms, ...fallbackCommandTerms]));
  }, [subject]);

  const handleStart = () => {
    if (!subject) {
      return;
    }

    const session: PracticeSession = {
      id: createId(),
      subject,
      level,
      paper: form.paper,
      topic,
      marks: form.marks,
      mode: form.mode,
      difficulty: form.difficulty,
      commandTerm: form.commandTerm,
      goalMode: form.goalMode,
    };

    setLastSession(session);
    setRewriteMode(false);
    router.push("/practice/write");
  };

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Practice Setup
          </p>
          <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Configure your session
          </h1>
          <p className="text-sm text-text-secondary">
            Pick the subject, paper, and goal mode to shape the question.
          </p>
        </header>

        <Card className="border-border bg-card/80 shadow-soft">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-text-secondary">
              Subject
              <select
                value={subject}
                onChange={(event) => {
                  const nextSubject = event.target.value;
                  const nextLevel =
                    subjectOptions.find(
                      (option) => option.key === nextSubject
                    )?.level ?? "hl";

                  setForm((prev) => ({
                    ...prev,
                    subject: nextSubject,
                    level: nextLevel,
                  }));
                }}
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {subjectOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-text-muted">
                Level: {level.toUpperCase()}
              </span>
            </label>

            <label className="space-y-2 text-sm text-text-secondary">
              Paper
              <select
                value={form.paper}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, paper: event.target.value }))
                }
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {papers.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-text-secondary">
              Topic
              <select
                value={topic}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, topic: event.target.value }))
                }
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {topicOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-text-secondary">
              Marks
              <select
                value={form.marks}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    marks: Number(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {marksOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-text-secondary">
              Mode
              <select
                value={form.mode}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    mode: event.target.value as PracticeSession["mode"],
                  }))
                }
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {modes.map((option) => (
                  <option key={option} value={option}>
                    {option === "timed" ? "Timed" : "Untimed"}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-text-secondary">
              Difficulty
              <select
                value={form.difficulty}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    difficulty: event.target
                      .value as PracticeSession["difficulty"],
                  }))
                }
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {difficulties.map((option) => (
                  <option key={option} value={option}>
                    {option[0].toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-text-secondary">
              Command term
              <select
                value={form.commandTerm}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    commandTerm: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                {commandTermOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Goal mode
              </p>
              <div className="mt-2 inline-flex rounded-full border border-border/60 bg-card/80 p-1 text-xs">
                {goalModes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, goalMode: option }))
                    }
                    className={cn(
                      "rounded-full px-4 py-1 text-xs font-semibold transition",
                      form.goalMode === option
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-muted hover:text-text-main"
                    )}
                  >
                    {option === "band-jump" ? "Band Jump" : "Consistency"}
                  </button>
                ))}
              </div>
            </div>
            <Button className="shadow" onClick={handleStart}>
              Start Session
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
