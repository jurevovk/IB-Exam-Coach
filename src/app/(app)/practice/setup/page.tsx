"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState<PracticeSession["level"]>("hl");
  const [paper, setPaper] = useState(papers[0]);
  const [topic, setTopic] = useState("Any");
  const [marks, setMarks] = useState(15);
  const [mode, setMode] = useState<PracticeSession["mode"]>("timed");
  const [difficulty, setDifficulty] =
    useState<PracticeSession["difficulty"]>("medium");
  const [commandTerm, setCommandTerm] = useState("Discuss");
  const [goalMode, setGoalMode] =
    useState<PracticeSession["goalMode"]>("band-jump");

  useEffect(() => {
    const lastSession = getLastSession();
    if (lastSession) {
      setSubject(lastSession.subject);
      setLevel(lastSession.level);
      setPaper(lastSession.paper ?? papers[0]);
      setTopic(lastSession.topic || "Any");
      setMarks(lastSession.marks || 15);
      setMode(lastSession.mode ?? "timed");
      setDifficulty(lastSession.difficulty ?? "medium");
      setCommandTerm(lastSession.commandTerm ?? "Discuss");
      setGoalMode(lastSession.goalMode ?? "band-jump");
      return;
    }

    if (subjectOptions.length) {
      setSubject(subjectOptions[0].key);
      setLevel(subjectOptions[0].level);
    }
  }, [subjectOptions]);

  useEffect(() => {
    const match = subjectOptions.find((option) => option.key === subject);
    if (match) {
      setLevel(match.level);
    }
  }, [subject, subjectOptions]);

  const topicOptions = useMemo(() => {
    const topics = questionBank
      .filter((question) => question.subject === subject)
      .map((question) => question.topic);
    return ["Any", ...Array.from(new Set(topics))];
  }, [subject]);

  useEffect(() => {
    if (!topicOptions.includes(topic)) {
      setTopic("Any");
    }
  }, [topic, topicOptions]);

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
      paper,
      topic,
      marks,
      mode,
      difficulty,
      commandTerm,
      goalMode,
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

        <Card className="border-border bg-white/70 shadow-soft">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-text-secondary">
              Subject
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
                value={paper}
                onChange={(event) => setPaper(event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
                onChange={(event) => setTopic(event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
                value={marks}
                onChange={(event) => setMarks(Number(event.target.value))}
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
                value={mode}
                onChange={(event) =>
                  setMode(event.target.value as PracticeSession["mode"])
                }
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value as PracticeSession["difficulty"]
                  )
                }
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
                value={commandTerm}
                onChange={(event) => setCommandTerm(event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
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
              <div className="mt-2 inline-flex rounded-full border border-border/60 bg-white/70 p-1 text-xs">
                {goalModes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGoalMode(option)}
                    className={cn(
                      "rounded-full px-4 py-1 text-xs font-semibold transition",
                      goalMode === option
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
