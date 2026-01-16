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
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Examiner-style feedback
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-text-main sm:text-5xl lg:text-6xl motion-safe:animate-fade-up">
            Stop guessing. Hit the markband with confidence.
          </h1>
          <p className="mx-auto mt-4 max-w-[760px] text-base text-text-muted sm:text-lg motion-safe:animate-fade-up motion-safe:animate-fade-up-delay-1">
            Practice IB questions, get examiner-style reports, and build a Band
            Jump Plan you can use immediately.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row motion-safe:animate-fade-up motion-safe:animate-fade-up-delay-2">
            <Button href="/login" className="px-6 py-3 shadow">
              Grade My Answer (Free)
            </Button>
            <Button
              href="/practice/setup"
              variant="secondary"
              className="px-6 py-3"
            >
              Try a Timed Mini Exam →
            </Button>
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
