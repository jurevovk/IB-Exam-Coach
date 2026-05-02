"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DemoPanel } from "@/components/marketing/DemoPanel";
import { TrustBar } from "@/components/marketing/TrustBar";

export function HeroV2() {
  return (
    <section className="min-h-[80vh] pb-16 pt-24">
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Learn · Practice · Grade · Plan
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-text-main sm:text-5xl lg:text-6xl motion-safe:animate-fade-up">
            Your IB study cockpit for the weeks that matter.
          </h1>
          <p className="mx-auto mt-4 max-w-[760px] text-base text-text-muted sm:text-lg motion-safe:animate-fade-up motion-safe:animate-fade-up-delay-1">
            Build a syllabus-aware plan, practise exam-style answers, grade
            coursework, and ask AI for help without losing track of what to fix
            next.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row motion-safe:animate-fade-up motion-safe:animate-fade-up-delay-2">
            <Button href="/signup" className="px-6 py-3 shadow">
              Start free
            </Button>
            <Button
              href="/login"
              variant="secondary"
              className="px-6 py-3"
            >
              Log in →
            </Button>
          </div>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-xs font-semibold text-text-secondary">
            {[
              "Syllabus-aware Learn",
              "AI study coach",
              "Rubric-based grading",
              "Local progress tracking",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/70 bg-card/80 px-3 py-1 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <DemoPanel />
          <TrustBar />
        </div>
      </Container>
    </section>
  );
}
