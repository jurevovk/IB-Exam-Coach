"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Navbar } from "@/components/marketing/Navbar";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { Container } from "@/components/ui/Container";
import type { Subject } from "@/lib/subjects";
import { subjects } from "@/lib/subjects";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function SubjectsPage() {
  const { ready, profile } = useRequireAuth();

  const subjectMap = useMemo(
    () => new Map(subjects.map((subject) => [subject.key, subject])),
    []
  );

  const personalizedSubjects = useMemo(() => {
    if (!profile?.subjects?.length) {
      return [];
    }

    return profile.subjects
      .map((selected) => {
        const base = subjectMap.get(selected.key);
        if (!base) {
          return null;
        }

        return { ...base, level: selected.level };
      })
      .filter(
        (subject): subject is Subject & { level: "hl" | "sl" } =>
          subject !== null
      );
  }, [profile, subjectMap]);

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-10">
            <Navbar />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <header className="space-y-2">
                <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                  Your subjects
                </h1>
                <p className="text-sm text-text-secondary sm:text-base">
                  Choose a subject to start practicing.
                </p>
              </header>
              <Link
                href="/settings"
                className="text-sm font-medium text-text-muted transition hover:text-text-main"
              >
                Manage subjects
              </Link>
            </div>

            {personalizedSubjects.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {personalizedSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.key}
                    subject={subject}
                    level={subject.level}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-white/60 p-8 text-center text-sm text-text-muted">
                You have not selected any subjects yet.
                <div className="mt-4">
                  <Link
                    href="/settings"
                    className="inline-flex rounded-full border border-border/60 bg-white/80 px-4 py-2 text-xs font-semibold text-text-main shadow-sm transition hover:-translate-y-[1px]"
                  >
                    Pick subjects
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
