"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  getGradeWorkHistory,
  saveGradeWorkHistory,
  type GradeWorkHistoryItem,
} from "@/lib/grade-work/history";
import type { GradeWorkResult, GradeWorkSubject } from "@/lib/grade-work/types";
import { cn } from "@/lib/cn";
import { addWeaknessEvents } from "@/lib/weaknesses";
import { eeSubjectLabels, type EeRubricVersion } from "@/lib/rubrics/types";
import { useRequireAuth } from "@/lib/useRequireAuth";

type UploadNotice = {
  type: "success" | "error";
  message: string;
};

type GradeWorkErrorState = {
  title: string;
  message: string;
};

type GradeWorkErrorResponse = {
  error?: string;
  code?: string;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `grade-${Date.now()}`;
};

const engineLabel = (mode: GradeWorkResult["mode"]) =>
  mode === "gemini" ? "Gemini" : "Demo mode";

const engineClassName = (mode: GradeWorkResult["mode"]) =>
  mode === "gemini" ? "state-success" : "state-warning";

const subjectGuidanceLabel = (subject: GradeWorkSubject) =>
  `${eeSubjectLabels[subject]} guidance applied`;

const subjectGuidanceNote = (subject: GradeWorkSubject) =>
  `${eeSubjectLabels[subject]} guidance supports interpretation; the selected EE rubric controls scoring.`;

const criterionAccentClassName = (criterionId: string) =>
  cn(
    "absolute inset-x-0 top-0 h-1",
    criterionId === "A" && "bg-primary/70",
    criterionId === "B" && "bg-sky-400/70",
    criterionId === "C" && "bg-emerald-400/70",
    criterionId === "D" && "bg-amber-400/70",
    criterionId === "E" && "bg-rose-400/70"
  );

const formalCheckClassName = (status: string) =>
  cn(
    "rounded-xl border px-4 py-3",
    status === "present" && "state-success",
    status === "unclear" && "state-warning",
    status === "missing" && "state-danger"
  );

const formalCheckStatusClassName = (status: string) =>
  cn(
    "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
    status === "present" && "state-success",
    status === "unclear" && "state-warning",
    status === "missing" && "state-danger"
  );

const errorTitles: Record<string, string> = {
  request_parse_failed: "Request could not be read",
  validation_failed: "Check the essay input",
  payload_too_large: "Text is too long",
  gemini_unavailable: "Gemini unavailable",
  gemini_timeout: "Gemini timed out",
  gemini_empty_response: "Gemini returned no text",
  response_parse_failed: "Gemini response could not be parsed",
  response_invalid: "Gemini response was incomplete",
  normalization_failed: "Result could not be prepared",
};

const toGradeWorkError = (
  data: GradeWorkErrorResponse | null,
  fallback: string
): GradeWorkErrorState => ({
  title: data?.code ? errorTitles[data.code] ?? "Grading failed" : "Grading failed",
  message: data?.error || fallback,
});

export default function EeGradePage() {
  const { ready } = useRequireAuth();
  const [subject, setSubject] =
    useState<GradeWorkSubject>("computer-science");
  const [rubricVersion, setRubricVersion] =
    useState<EeRubricVersion>("pre-2027");
  const [essayText, setEssayText] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [result, setResult] = useState<GradeWorkResult | null>(null);
  const [history, setHistory] = useState<GradeWorkHistoryItem[]>(() =>
    getGradeWorkHistory()
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<UploadNotice | null>(null);
  const [error, setError] = useState<GradeWorkErrorState | null>(null);

  const canSubmit = useMemo(
    () => essayText.trim().length > 0 && !loading,
    [essayText, loading]
  );

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/grade-work/extract", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        text?: string;
        fileName?: string;
        error?: string;
      };

      if (!response.ok || !data.text) {
        throw new Error(
          data.error ||
            "Could not extract text from this file. Paste the essay text instead."
        );
      }

      setEssayText(data.text);
      setUploadNotice({
        type: "success",
        message: `Extracted text from ${data.fileName ?? file.name}. You can edit it before grading.`,
      });
    } catch (err) {
      setUploadNotice({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not extract text from this file. Paste the essay text instead.",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/grade-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workType: "ee",
          subject,
          rubricVersion,
          essayText,
          reflectionText,
        }),
      });
      let data: GradeWorkResult | GradeWorkErrorResponse | null = null;
      try {
        data = (await response.json()) as
          | GradeWorkResult
          | GradeWorkErrorResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(
          toGradeWorkError(
            data as GradeWorkErrorResponse | null,
            "Unable to grade this essay."
          )
        );
        return;
      }

      if (!data || !("criteria" in data)) {
        setError({
          title: "Response invalid",
          message:
            "The grading response was missing result data. Try again in a moment.",
        });
        return;
      }

      const nextResult = data;
      const nextHistory = [
        {
          id: createId(),
          createdAt: new Date().toISOString(),
          result: nextResult,
        },
        ...history,
      ].slice(0, 10);

      setResult(nextResult);
      setHistory(nextHistory);
      saveGradeWorkHistory(nextHistory);
      addWeaknessEvents(
        nextResult.criteria.flatMap((criterion) =>
          criterion.weaknesses.map((weakness) => ({
            source: "ee" as const,
            subjectId: subject,
            label: weakness,
            detail: `${nextResult.subject} EE · Criterion ${criterion.criterionId}`,
            href: "/grade-work-app/ee",
          }))
        )
      );
    } catch (err) {
      setError({
        title: "Network error",
        message:
          err instanceof Error
            ? err.message
            : "Unable to grade this essay. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card/95 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.16),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="absolute -left-24 bottom-[-140px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),rgba(234,241,255,0)_70%)] blur-3xl" />
          <BackButton className="relative mb-6" />
          <div className="relative space-y-8">
            <header className="max-w-3xl">
              <h1 className="font-heading text-2xl font-semibold text-text-main">
                Extended Essay Feedback
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Estimated rubric-based feedback for Computer Science and
                Mathematics Extended Essays, plus Economics support.
              </p>
            </header>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block rounded-2xl border border-border/60 bg-card/90 p-4 text-sm text-text-secondary shadow-sm transition hover:border-primary/20 hover:shadow">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Subject
                  </span>
                  <span className="state-success rounded-full border px-2.5 py-1 text-[11px] font-semibold">
                    Guidance layer
                  </span>
                </span>
                <select
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value as GradeWorkSubject)
                  }
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="computer-science">Computer Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="economics">Economics</option>
                </select>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  {subjectGuidanceNote(subject)}
                </p>
              </label>

              <label className="block rounded-2xl border border-border/60 bg-card/90 p-4 text-sm text-text-secondary shadow-sm transition hover:border-primary/20 hover:shadow">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Rubric version
                  </span>
                  <span className="rounded-full border border-border bg-card/85 px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                    Scoring framework
                  </span>
                </span>
                <select
                  value={rubricVersion}
                  onChange={(event) =>
                    setRubricVersion(event.target.value as EeRubricVersion)
                  }
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="pre-2027">Pre-2027 EE rubric</option>
                  <option value="first-exams-2027">
                    First exams 2027 EE rubric
                  </option>
                </select>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  Scoring uses this selected EE rubric only, not a second
                  subject rubric.
                </p>
              </label>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-border/60 bg-card/85 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-main">
                      Upload essay file
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Optional: PDF, DOCX, or TXT. Extracted text will fill the
                      essay box below.
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-text-main shadow-sm transition hover:border-primary/30">
                    {uploading ? "Extracting..." : "Choose file"}
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                </div>
                {uploadNotice ? (
                  <p
                    className={cn(
                      "mt-3 rounded-xl border px-4 py-3 text-xs",
                      uploadNotice.type === "success"
                        ? "state-success"
                        : "state-warning"
                    )}
                  >
                    {uploadNotice.message}
                  </p>
                ) : null}
              </div>

              <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Essay text
                </span>
                <textarea
                  value={essayText}
                  onChange={(event) => setEssayText(event.target.value)}
                  rows={12}
                  placeholder="Paste your Extended Essay text..."
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Reflection / RPPF text
                </span>
                <textarea
                  value={reflectionText}
                  onChange={(event) => setReflectionText(event.target.value)}
                  rows={5}
                  placeholder="Optional: paste reflection or RPPF text..."
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </label>

              {error ? (
                <div className="state-danger rounded-2xl border px-4 py-3 text-sm">
                  <p className="font-semibold">{error.title}</p>
                  <p className="mt-1">{error.message}</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  className="shadow"
                  disabled={!canSubmit}
                >
                  {loading ? "Grading..." : "Get feedback"}
                </Button>
                <Button href="/grade-work-app" variant="secondary">
                  Back to Grade Work
                </Button>
              </div>
            </form>

            {result ? (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[24px] border border-border/60 bg-card/85 shadow-sm">
                  <div className="h-1 bg-gradient-to-r from-primary/70 via-emerald-300 to-amber-300" />
                  <div className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                        Estimated result
                      </p>
                      <h2 className="mt-3 font-heading text-3xl font-semibold text-text-main">
                        {result.estimatedTotal}/{result.maxTotal}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-text-main">
                        {result.estimatedLetterGrade
                          ? `Estimated grade ${result.estimatedLetterGrade}`
                          : "Letter grade withheld"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-text-secondary">
                        {result.subject}
                      </span>
                      <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-text-secondary">
                        {result.rubricLabel}
                      </span>
                      <span className="state-success rounded-full border px-3 py-1 text-xs font-semibold">
                        {result.subjectGuidanceLabel ??
                          subjectGuidanceLabel(subject)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-semibold",
                          engineClassName(result.mode)
                        )}
                      >
                        {engineLabel(result.mode)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-border/60 bg-bg/50 px-4 py-3">
                    <p className="text-sm text-text-secondary">
                      {result.overallSummary}
                    </p>
                    <p className="mt-2 text-xs text-text-muted">
                      {result.disclaimer}
                    </p>
                    <p className="mt-2 text-xs text-text-muted">
                      {result.subjectGuidanceNote ??
                        subjectGuidanceNote(subject)}
                    </p>
                  </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {result.criteria.map((criterion) => (
                    <div
                      key={criterion.criterionId}
                      className="relative overflow-hidden rounded-[24px] border border-border/60 bg-card/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow"
                    >
                      <div className={criterionAccentClassName(criterion.criterionId)} />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Criterion {criterion.criterionId}
                          </p>
                          <p className="mt-1 text-base font-semibold text-text-main">
                            {criterion.title}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            {criterion.maxMarks} available marks
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
                            criterion.gradable
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "state-warning"
                          )}
                        >
                          {criterion.gradable
                            ? `${criterion.mark}/${criterion.maxMarks}`
                            : "Not gradable"}
                        </span>
                      </div>
                      <p className="mt-4 rounded-xl border border-border/60 bg-bg/55 px-4 py-3 text-sm leading-relaxed text-text-secondary">
                        {criterion.justification}
                      </p>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-xl border border-border/60 bg-bg/55 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Evidence signals
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {criterion.detectedSignals.map((signal) => (
                              <span
                                key={signal}
                                className="rounded-full border border-border bg-card/85 px-2.5 py-1 text-[11px] font-medium text-text-secondary"
                              >
                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-bg/55 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Snippets
                          </p>
                          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-text-secondary">
                            {criterion.evidenceSnippets.map((snippet) => (
                              <li key={snippet}>- {snippet}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="state-success rounded-xl border px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Strengths
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-text-secondary">
                            {criterion.strengths.map((item) => (
                              <li key={item}>- {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="state-warning rounded-xl border px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Weaknesses
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-text-secondary">
                            {criterion.weaknesses.map((item) => (
                              <li key={item}>- {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                          Next step
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                          {criterion.nextStep}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-text-main">
                      Formal checks
                    </p>
                    <div className="mt-3 space-y-2">
                      {result.formalChecks.map((check) => (
                        <div
                          key={check.id}
                          className={formalCheckClassName(check.status)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-medium text-text-main">
                              {check.label}
                            </p>
                            <span
                              className={formalCheckStatusClassName(
                                check.status
                              )}
                            >
                              {check.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-text-muted">
                            {check.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                      <p className="text-sm font-semibold text-text-main">
                        Top 3 improvements
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                        {result.topImprovements.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                      <p className="text-sm font-semibold text-text-main">
                        Confidence note
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        {result.confidenceNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {history.length ? (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-text-main">
                  Recent EE grading history
                </p>
                <div className="mt-3 space-y-2">
                  {history.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResult(item.result)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-left text-xs text-text-muted transition hover:border-border"
                    >
                      <span>
                        {item.result.rubricLabel} · {engineLabel(item.result.mode)}
                      </span>
                      <span>
                        {item.result.estimatedTotal}/{item.result.maxTotal}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  );
}
