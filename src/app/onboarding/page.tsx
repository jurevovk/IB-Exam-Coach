"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { SubjectLevelRow } from "@/components/subjects/SubjectLevelRow";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { subjects } from "@/lib/subjects";
import { getFallbackName, isProfileComplete } from "@/lib/storage";
import { useRequireAuth } from "@/lib/useRequireAuth";

type Step = 1 | 2 | 3;

const sessionOptions = [
  "May 2026",
  "Nov 2026",
  "May 2027",
  "Nov 2027",
  "Custom",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, profile } = useRequireAuth({ requireProfile: false });
  const { user, updateProfile, profile: authProfile } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [sessionChoice, setSessionChoice] = useState(sessionOptions[0]);
  const [customSession, setCustomSession] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<
    Array<{ key: string; name: string; level: "hl" | "sl" }>
  >([]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (isProfileComplete(profile)) {
      router.replace("/dashboard");
    }
  }, [ready, profile, router]);

  const effectiveSession =
    sessionChoice === "Custom" ? customSession.trim() : sessionChoice;

  const selectedKeys = useMemo(
    () => new Set(selectedSubjects.map((subject) => subject.key)),
    [selectedSubjects]
  );

  const subjectIconMap = useMemo(
    () => new Map(subjects.map((subject) => [subject.key, subject.icon])),
    []
  );

  const toggleSubject = (key: string, name: string) => {
    setSelectedSubjects((prev) => {
      if (prev.some((subject) => subject.key === key)) {
        return prev.filter((subject) => subject.key !== key);
      }

      return [...prev, { key, name, level: "hl" }];
    });
  };

  const updateLevel = (key: string, level: "hl" | "sl") => {
    setSelectedSubjects((prev) =>
      prev.map((subject) =>
        subject.key === key ? { ...subject, level } : subject
      )
    );
  };

  const handleSave = () => {
    if (!user || !effectiveSession) {
      return;
    }

    updateProfile({
      email: user,
      name: authProfile?.name ?? getFallbackName(user),
      examSession: effectiveSession,
      subjects: selectedSubjects,
    });

    router.replace("/dashboard");
  };

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <BackButton />
            <header className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Step {step} of 3
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Build your IB plan
              </h1>
              <p className="text-sm text-text-secondary sm:text-base">
                Tell us your exam session and subjects so we can personalize
                practice.
              </p>
            </header>

            {step === 1 ? (
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                <div className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm">
                  <p className="text-sm font-medium text-text-secondary">
                    When is your next IB exam session?
                  </p>
                  <div className="mt-4 space-y-3">
                    <select
                      value={sessionChoice}
                      onChange={(event) => setSessionChoice(event.target.value)}
                      className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    >
                      {sessionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {sessionChoice === "Custom" ? (
                      <input
                        value={customSession}
                        onChange={(event) =>
                          setCustomSession(event.target.value)
                        }
                        placeholder="e.g. May 2028"
                        className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-text-secondary">
                    Choose your subjects
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {subjects.map((subject) => {
                    const isSelected = selectedKeys.has(subject.key);

                    return (
                      <button
                        key={subject.key}
                        type="button"
                        onClick={() => toggleSubject(subject.key, subject.name)}
                        className={cn(
                          "rounded-2xl border border-border/60 bg-white/70 p-4 text-left shadow-sm transition hover:-translate-y-[1px]",
                          isSelected
                            ? "border-primary/40 bg-white shadow-card"
                            : "hover:border-border"
                        )}
                      >
                        <p className="text-sm font-semibold text-text-main">
                          {subject.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          HL / SL supported
                        </p>
                      </button>
                    );
                  })}
                </div>
                {!selectedSubjects.length ? (
                  <p className="text-center text-xs text-text-muted">
                    Select at least one subject to continue.
                  </p>
                ) : null}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-text-secondary">
                    Choose HL or SL for each subject
                  </p>
                </div>
                <div className="space-y-3">
                  {selectedSubjects.map((subject) => (
                    <SubjectLevelRow
                      key={subject.key}
                      subject={{
                        ...subject,
                        icon: subjectIconMap.get(subject.key),
                      }}
                      onLevelChange={updateLevel}
                    />
                  ))}
                </div>
                {!selectedSubjects.length ? (
                  <p className="text-center text-xs text-text-muted">
                    Go back and select at least one subject.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
                disabled={step === 1}
              >
                Back
              </Button>

              {step < 3 ? (
                <Button
                  className="w-full shadow sm:w-auto"
                  onClick={() => setStep((prev) => (prev + 1) as Step)}
                  disabled={
                    (step === 1 && !effectiveSession) ||
                    (step === 2 && !selectedSubjects.length)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="w-full shadow sm:w-auto"
                  onClick={handleSave}
                  disabled={!selectedSubjects.length || !effectiveSession}
                >
                  Save &amp; Continue
                </Button>
              )}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
