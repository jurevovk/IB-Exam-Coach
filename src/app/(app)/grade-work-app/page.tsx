"use client";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useRequireAuth } from "@/lib/useRequireAuth";

const gradeAreas = [
  {
    key: "tok",
    title: "TOK",
    description: "Polish your TOK essays and presentations.",
    icon: "idea",
  },
  {
    key: "ee",
    title: "Extended Essay",
    description: "Get feedback on structure, argument, and evidence.",
    icon: "research",
  },
  {
    key: "ia",
    title: "Internal Assessment",
    description: "Review one Economics IA commentary.",
    icon: "chart",
  },
] as const;

const iconPaths: Record<(typeof gradeAreas)[number]["icon"], string[]> = {
  idea: [
    "M12 3a6 6 0 0 0-3.4 10.9c.6.5.9 1.1.9 1.8V17h5v-1.3c0-.7.3-1.3.9-1.8A6 6 0 0 0 12 3Z",
    "M10 21h4M9.5 18.5h5",
  ],
  research: [
    "M6 4h8l4 4v12H6z",
    "M14 4v4h4M9 12h6M9 15h6M9 18h4",
  ],
  chart: [
    "M4 19h16",
    "M7 16V9M12 16V5M17 16v-4",
    "M6 8l4-3 4 6 4-3",
  ],
};

export default function GradeWorkPage() {
  const { ready, profile } = useRequireAuth();
  const hasEconomics = Boolean(
    profile?.subjects.some((subject) => subject.key === "economics")
  );

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card/80 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-6">
            <BackButton />
            <header className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Grade Work
              </h1>
              <p className="text-sm text-text-secondary">
                Choose the type of work you want to review.
              </p>
            </header>

            <div className="grid gap-5 lg:grid-cols-3">
              {gradeAreas.map((area) => (
                <div
                  key={area.key}
                  className="group flex h-full flex-col gap-5 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-soft"
                >
                  <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border/60 bg-[linear-gradient(135deg,rgb(var(--color-elevated)/0.92),rgb(var(--color-info-bg)/0.42))]">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-border/70 bg-card/85 text-primary shadow-sm transition group-hover:scale-105">
                      <svg
                        viewBox="0 0 24 24"
                        width="34"
                        height="34"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {iconPaths[area.icon].map((path) => (
                          <path key={path} d={path} />
                        ))}
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h2 className="text-base font-semibold text-text-main">
                      {area.title}
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                      {area.description}
                    </p>
                    {area.key === "ia" ? (
                      <p className="mt-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2 text-xs text-text-muted">
                        {hasEconomics
                          ? "Economics IA Studio is available. Other subject IA workflows can be added into this launcher later."
                          : "Subject-specific IA studios are added as your selected subjects are supported."}
                      </p>
                    ) : null}
                    {area.key === "ee" ? (
                      <p className="mt-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2 text-xs text-text-muted">
                        Choose subject and rubric version inside the EE flow.
                      </p>
                    ) : null}
                  </div>
                  <Button href={`/grade-work-app/${area.key}`} className="shadow">
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
