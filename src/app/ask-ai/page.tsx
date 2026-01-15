"use client";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function AskAiPage() {
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
              <h1 className="font-heading text-3xl font-semibold text-text-main">
                Ask AI
              </h1>
              <p className="text-sm text-text-secondary">
                Brainstorm, refine explanations, or ask for exam tips.
              </p>
            </header>

            <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm">
              <div className="flex min-h-[280px] items-center justify-center text-sm text-text-muted">
                Your AI chat history will appear here.
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Ask something about your IB subject..."
                className="flex-1 rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              />
              <Button className="shadow">Send</Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
