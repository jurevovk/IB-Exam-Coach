"use client";

import { useSearchParams } from "next/navigation";

import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { subjects } from "@/lib/subjects";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function PracticeClient() {
  const { ready } = useRequireAuth();
  const searchParams = useSearchParams();
  const subjectKey = searchParams.get("subject") ?? "Unknown";
  const level = (searchParams.get("level") ?? "hl").toUpperCase();
  const subjectName =
    subjects.find((item) => item.key === subjectKey)?.name ?? subjectKey;

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <BackButton className="mb-6" />
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-text-main">
              Practice: {subjectName} ({level})
            </h1>
            <p className="text-sm text-text-muted">
              This is a placeholder page for practice sessions.
            </p>
          </div>
          <div className="mt-6">
            <Button href="/subjects" variant="secondary">
              Back to Subjects
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
