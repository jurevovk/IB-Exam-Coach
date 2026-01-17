"use client";

import Link from "next/link";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useRequireAuth } from "@/lib/useRequireAuth";

const gradeAreas = [
  {
    key: "tok",
    title: "TOK",
    description: "Polish your TOK essays and presentations.",
  },
  {
    key: "ee",
    title: "Extended Essay",
    description: "Get feedback on structure, argument, and evidence.",
  },
  {
    key: "ia",
    title: "Internal Assessment",
    description: "Improve clarity, analysis, and reflection.",
  },
];

export default function GradeWorkPage() {
  const { ready } = useRequireAuth();

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-6">
            <BackButton />
            <header className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Grade Work
              </h1>
              <p className="text-sm text-text-secondary">
                Paste your TOK, EE, or IA draft and get targeted feedback.
              </p>
            </header>

            <div className="grid gap-5 lg:grid-cols-3">
              {gradeAreas.map((area) => (
                <div
                  key={area.key}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-text-main">
                        {area.title}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {area.description}
                      </p>
                    </div>
                    <Link
                      href={`/grade-work-app/${area.key}`}
                      className="text-xs font-medium text-text-muted underline underline-offset-4 hover:text-text-main"
                    >
                      Open
                    </Link>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Paste your work..."
                    className="w-full flex-1 rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                  <Button className="shadow">Get feedback</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
