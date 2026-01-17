"use client";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function TokGradePage() {
  const { ready } = useRequireAuth();

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <BackButton className="mb-6" />
          <h1 className="font-heading text-2xl font-semibold text-text-main">
            TOK Feedback
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            This is a placeholder for TOK grading.
          </p>
          <div className="mt-6">
            <Button href="/grade-work-app" variant="secondary">
              Back to Grade Work
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
