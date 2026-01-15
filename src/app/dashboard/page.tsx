"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { isProfileComplete } from "@/lib/storage";
import { useRequireAuth } from "@/lib/useRequireAuth";

type NavItem = {
  label: string;
  href: string;
  icon: "dashboard" | "practice" | "simulator" | "weakness" | "examples" | "plan";
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Practice", href: "/subjects", icon: "practice" },
  { label: "Exam Simulator", href: "/exam-simulator", icon: "simulator" },
  { label: "Weakness Map", href: "/weakness-map", icon: "weakness" },
  { label: "Examples Vault", href: "/examples", icon: "examples" },
  { label: "My Plan", href: "/my-plan", icon: "plan" },
];

const iconPaths: Record<NavItem["icon"], string> = {
  dashboard: "M4 13h7V4H4v9zm9 7h7V11h-7v9zM4 20h7v-5H4v5zm9-16v5h7V4h-7z",
  practice: "M5 4h14v16H5z",
  simulator: "M4 6h16v12H4z M8 10h8",
  weakness: "M4 20h16 M6 16V9 M12 16V5 M18 16v-7",
  examples: "M6 4h9l3 3v13H6z M9 12h6 M9 16h6",
  plan: "M4 7h16 M4 12h16 M4 17h10",
};

export default function DashboardPage() {
  const { ready, profile } = useRequireAuth();
  const { user } = useAuth();

  if (!ready || !profile || !user || !isProfileComplete(profile)) {
    return null;
  }

  return (
    <main className="min-h-screen bg-glow py-6">
      <div className="relative mx-auto w-full max-w-[1400px] px-6">
        <aside className="hidden h-[calc(100vh-3rem)] w-[260px] rounded-[20px] bg-report p-6 shadow-soft lg:fixed lg:left-6 lg:top-6 lg:flex lg:flex-col lg:gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              IB Exam Coach
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Command Center
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = item.href === "/dashboard";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={iconPaths[item.icon]} />
                    </svg>
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/15 bg-white/10 p-4 text-xs text-white/70">
            Focus streak: <span className="font-semibold text-white">4</span>{" "}
            days
          </div>
        </aside>

        <section className="lg:ml-[284px]">
          <Container className="px-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
                    Dashboard
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                    Good afternoon, {profile.name} 👋
                  </h1>
                  <p className="mt-2 text-sm text-text-secondary">
                    Today&apos;s mission: 12 minutes to boost your Paper 2
                    skills.
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {[
                    "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5",
                    "M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h6",
                    "M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z",
                    "M4 7h16M4 12h16M4 17h16",
                  ].map((path, index) => (
                    <button
                      key={path}
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/80 text-text-muted shadow-sm transition hover:text-text-main"
                      aria-label={`Toolbar item ${index + 1}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={path} />
                      </svg>
                    </button>
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow">
                    {profile.name.slice(0, 1).toUpperCase()}
                  </div>
                </div>
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
                    <p className="text-3xl font-semibold text-text-main">
                      12 Days
                    </p>
                    <p className="text-sm text-text-secondary">
                      Economics Paper 1
                    </p>
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
        </section>
      </div>
    </main>
  );
}
