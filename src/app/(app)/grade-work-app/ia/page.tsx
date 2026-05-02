"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import {
  economicsIaUnits,
  economicsKeyConcepts,
  getEconomicsIaHistory,
  saveEconomicsIaHistory,
  type EconomicsIaHistoryItem,
  type EconomicsIaRequest,
  type EconomicsIaResult,
  type EconomicsIaUnit,
} from "@/lib/economics/ia";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { addWeaknessEvents } from "@/lib/weaknesses";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `econ-ia-${Date.now()}`;
};

const criterionAccentClassName = (criterionId: string) =>
  cn(
    "absolute inset-x-0 top-0 h-1",
    criterionId === "A" && "bg-sky-400/80",
    criterionId === "B" && "bg-primary/70",
    criterionId === "C" && "bg-emerald-400/80",
    criterionId === "D" && "bg-amber-400/80",
    criterionId === "E" && "bg-rose-400/80"
  );

const portfolioClassName = (status: string) =>
  cn(
    "rounded-xl border px-4 py-3",
    status === "ok" && "state-success",
    status === "warning" && "state-warning",
    status === "missing" && "state-danger"
  );

export default function IaGradePage() {
  const { ready } = useRequireAuth();
  const [history, setHistory] = useState<EconomicsIaHistoryItem[]>(() =>
    getEconomicsIaHistory()
  );
  const [input, setInput] = useState<EconomicsIaRequest>({
    articleTitle: "",
    source: "",
    datePublished: "",
    unit: "microeconomics",
    keyConcept: "intervention",
    commentaryText: "",
    articleUrl: "",
    articleText: "",
  });
  const [result, setResult] = useState<EconomicsIaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateInput = <K extends keyof EconomicsIaRequest>(
    key: K,
    value: EconomicsIaRequest[K]
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const handleArticleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setNotice(null);
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
        throw new Error(data.error || "Could not extract article text.");
      }

      updateInput("articleText", data.text);
      setNotice(`Extracted article text from ${data.fileName ?? file.name}.`);
    } catch (uploadError) {
      setNotice(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not extract article text. Paste it manually instead."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.commentaryText.trim()) {
      setError("Paste your IA commentary before requesting feedback.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/economics/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          history: history.map((item) => ({ input: item.input })),
        }),
      });
      const data = (await response.json()) as EconomicsIaResult & {
        error?: string;
      };

      if (!response.ok || !data.criteria) {
        throw new Error(data.error || "Unable to grade this commentary.");
      }

      const nextItem: EconomicsIaHistoryItem = {
        id: createId(),
        createdAt: new Date().toISOString(),
        input,
        result: data,
      };
      const nextHistory = [nextItem, ...history].slice(0, 10);

      setResult(data);
      setHistory(nextHistory);
      saveEconomicsIaHistory(nextHistory);
      addWeaknessEvents(
        data.weaknessTags.map((tag) => ({
          source: "ia",
          subjectId: "economics",
          label: tag,
          detail: `${input.unit} · ${input.keyConcept}`,
          href: "/grade-work-app/ia",
        }))
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to grade this commentary."
      );
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
          <BackButton className="relative mb-6" />
          <div className="relative space-y-8">
            <header className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Grade Work
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main">
                Economics IA Studio
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Grade one commentary at a time, then track portfolio compliance
                across your saved commentaries.
              </p>
            </header>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:grid-cols-3">
                <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Unit
                  </span>
                  <select
                    value={input.unit}
                    onChange={(event) =>
                      updateInput("unit", event.target.value as EconomicsIaUnit)
                    }
                    className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  >
                    {economicsIaUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Key concept
                  </span>
                  <select
                    value={input.keyConcept}
                    onChange={(event) =>
                      updateInput("keyConcept", event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  >
                    {economicsKeyConcepts.map((concept) => (
                      <option key={concept} value={concept}>
                        {concept}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Article date
                  </span>
                  <input
                    type="date"
                    value={input.datePublished}
                    onChange={(event) =>
                      updateInput("datePublished", event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Article title
                  </span>
                  <input
                    value={input.articleTitle}
                    onChange={(event) =>
                      updateInput("articleTitle", event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Source
                  </span>
                  <input
                    value={input.source}
                    onChange={(event) => updateInput("source", event.target.value)}
                    className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>

              <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Article URL
                </span>
                <input
                  value={input.articleUrl ?? ""}
                  onChange={(event) =>
                    updateInput("articleUrl", event.target.value)
                  }
                  placeholder="Optional"
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <div className="rounded-2xl border border-border/60 bg-card/85 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-main">
                      Optional article upload
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      PDF, DOCX, or TXT. Extracted text fills the article box.
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-text-main shadow-sm transition hover:border-primary/30">
                    {uploading ? "Extracting..." : "Choose file"}
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={handleArticleUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                </div>
                {notice ? (
                  <p className="state-warning mt-3 rounded-xl border px-4 py-3 text-xs">
                    {notice}
                  </p>
                ) : null}
              </div>

              <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Pasted article text
                </span>
                <textarea
                  value={input.articleText ?? ""}
                  onChange={(event) =>
                    updateInput("articleText", event.target.value)
                  }
                  rows={5}
                  placeholder="Optional article extract..."
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block rounded-2xl border border-border/60 bg-card/85 p-4 text-sm text-text-secondary shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Commentary text
                </span>
                <textarea
                  value={input.commentaryText}
                  onChange={(event) =>
                    updateInput("commentaryText", event.target.value)
                  }
                  rows={12}
                  placeholder="Paste one Economics IA commentary..."
                  className="mt-3 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
                <span className="mt-2 block text-xs text-text-muted">
                  {input.commentaryText.trim()
                    ? `${input.commentaryText.trim().split(/\s+/).length} words`
                    : "0 words"}{" "}
                  / 800 recommended limit
                </span>
              </label>

              {error ? (
                <p className="state-danger rounded-2xl border px-4 py-3 text-sm">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center">
                <Button type="submit" className="shadow" disabled={loading}>
                  {loading ? "Grading..." : "Grade commentary"}
                </Button>
                <Button href="/grade-work-app" variant="secondary">
                  Back to Grade Work
                </Button>
              </div>
            </form>

            {result ? (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[24px] border border-border/60 bg-card/90 shadow-sm">
                  <div className="h-1 bg-gradient-to-r from-primary/70 via-emerald-300 to-amber-300" />
                  <div className="p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                          Estimated commentary score
                        </p>
                        <h2 className="mt-3 font-heading text-3xl font-semibold text-text-main">
                          {result.estimatedTotal}/{result.maxTotal}
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                          Commentary criteria A-E only. Criterion F is tracked
                          at portfolio level.
                        </p>
                      </div>
                      <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-text-secondary">
                        {result.mode === "gemini" ? "Gemini" : "Demo mode"}
                      </span>
                    </div>
                    <p className="mt-4 rounded-xl border border-border/60 bg-bg/50 px-4 py-3 text-xs text-text-muted">
                      {result.disclaimer}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {result.criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="relative overflow-hidden rounded-[24px] border border-border/60 bg-card/90 p-5 shadow-sm"
                    >
                      <div className={criterionAccentClassName(criterion.id)} />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Criterion {criterion.id}
                          </p>
                          <p className="mt-1 text-base font-semibold text-text-main">
                            {criterion.title}
                          </p>
                        </div>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {criterion.mark}/{criterion.maxMarks}
                        </span>
                      </div>
                      <p className="mt-4 text-sm text-text-secondary">
                        {criterion.justification}
                      </p>
                      <p className="mt-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs text-text-secondary">
                        Next: {criterion.nextStep}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-text-main">
                      Portfolio checks
                    </p>
                    <div className="mt-3 space-y-2">
                      {result.portfolioChecks.map((check) => (
                        <div
                          key={check.label}
                          className={portfolioClassName(check.status)}
                        >
                          <p className="text-xs font-semibold text-text-main">
                            {check.label}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            {check.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
                      <p className="text-sm font-semibold text-text-main">
                        Diagram guidance
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        {result.diagramGuidance}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
                      <p className="text-sm font-semibold text-text-main">
                        Evaluation guidance
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        {result.evaluationGuidance}
                      </p>
                    </div>
                  </div>
                </div>

                {result.warnings.length ? (
                  <div className="state-warning rounded-2xl border p-5 text-sm">
                    <p className="font-semibold">Warnings</p>
                    <ul className="mt-2 space-y-1">
                      {result.warnings.map((warning) => (
                        <li key={warning}>- {warning}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {history.length ? (
              <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm">
                <p className="text-sm font-semibold text-text-main">
                  Portfolio tracker
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {history.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResult(item.result)}
                      className="rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-left text-xs text-text-muted transition hover:border-primary/20"
                    >
                      <span className="block font-semibold text-text-main">
                        {item.input.unit}
                      </span>
                      <span className="mt-1 block">
                        {item.input.keyConcept} · {item.input.source}
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
