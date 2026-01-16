"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function DashboardPage() {
  const { profile } = useAuth();

  if (!profile) {
    return null;
  }

  return (
    <Container className="px-0">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
            Dashboard
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Good afternoon, {profile.name} 👋
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Today&apos;s mission: 12 minutes to boost your Paper 2 skills.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Your Progress
            </p>
            <div className="mt-4 space-y-3 text-sm text-text-secondary">
              <div className="flex items-center justify-between">
                <span>Geography</span>
                <span className="font-semibold text-text-main">5 → 6</span>
              </div>
              <div className="flex items-center justify-between">
                <span>English B</span>
                <span className="font-semibold text-text-main">5</span>
              </div>
              <div className="h-2 w-full rounded-full bg-border/60">
                <div className="h-2 w-2/3 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-report p-5 text-white shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Today&apos;s Tasks
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>1. Evaluation Drill</li>
              <li>2. Timed Essay (15 min)</li>
            </ul>
            <Button className="mt-6 w-full shadow">Start</Button>
          </div>

          <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Next Exam
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-3xl font-semibold text-text-main">12 Days</p>
              <p className="text-sm text-text-secondary">Economics Paper 1</p>
              <p className="text-xs text-text-muted">
                {profile.examSession
                  ? `${profile.examSession} session`
                  : "April 15, 2026"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Continue Practice
                </p>
                <p className="mt-3 text-lg font-semibold text-text-main">
                  Geography Paper 2 | Urban Environments
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Resume your last session in under 10 minutes.
                </p>
              </div>
              <Button href="/subjects" className="shadow">
                Resume
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Weakness Overview
            </p>
            <div className="mt-4 space-y-3 text-sm text-text-secondary">
              <div className="flex items-center justify-between">
                <span>No Evaluation</span>
                <span className="font-semibold text-text-main">7x</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Missing Case Study</span>
                <span className="font-semibold text-text-main">5x</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Weak Conclusion</span>
                <span className="font-semibold text-text-main">4x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
