"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { SubjectLevelRow } from "@/components/subjects/SubjectLevelRow";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { subjects } from "@/lib/subjects";
import type { Profile } from "@/lib/storage";
import { useRequireAuth } from "@/lib/useRequireAuth";

const sessionOptions = [
  "May 2026",
  "Nov 2026",
  "May 2027",
  "Nov 2027",
  "Custom",
];

export default function SettingsPage() {
  const { ready, profile } = useRequireAuth();
  const { user, updateProfile } = useAuth();

  if (!ready || !profile || !user) {
    return null;
  }

  return (
    <SettingsForm profile={profile} user={user} updateProfile={updateProfile} />
  );
}

type SettingsFormProps = {
  profile: Profile;
  user: string;
  updateProfile: (profile: Profile) => void;
};

function SettingsForm({ profile, user, updateProfile }: SettingsFormProps) {
  const isPreset = sessionOptions.includes(profile.examSession);
  const [name, setName] = useState(profile.name);
  const [sessionChoice, setSessionChoice] = useState(
    isPreset ? profile.examSession : "Custom"
  );
  const [customSession, setCustomSession] = useState(
    isPreset ? "" : profile.examSession
  );
  const [selectedSubjects, setSelectedSubjects] = useState(profile.subjects);
  const [saved, setSaved] = useState(false);

  const effectiveSession =
    sessionChoice === "Custom" ? customSession.trim() : sessionChoice;

  const subjectIconMap = useMemo(
    () => new Map(subjects.map((subject) => [subject.key, subject.icon])),
    []
  );

  const availableSubjects = useMemo(() => {
    const selectedKeys = new Set(selectedSubjects.map((subject) => subject.key));
    return subjects.filter((subject) => !selectedKeys.has(subject.key));
  }, [selectedSubjects]);

  const updateLevel = (key: string, level: "hl" | "sl") => {
    setSelectedSubjects((prev) =>
      prev.map((subject) =>
        subject.key === key ? { ...subject, level } : subject
      )
    );
  };

  const removeSubject = (key: string) => {
    setSelectedSubjects((prev) =>
      prev.filter((subject) => subject.key !== key)
    );
  };

  const addSubject = (key: string, name: string) => {
    setSelectedSubjects((prev) => [...prev, { key, name, level: "hl" }]);
  };

  const handleSave = () => {
    if (!user || !effectiveSession) {
      return;
    }

    updateProfile({
      email: user,
      name: name.trim() || profile.name,
      examSession: effectiveSession,
      subjects: selectedSubjects,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <BackButton />
            <header className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Settings
              </h1>
              <p className="text-sm text-text-secondary">
                Update your exam session and subjects anytime.
              </p>
            </header>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm">
                <p className="text-sm font-medium text-text-secondary">Name</p>
                <div className="mt-4">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm">
                <p className="text-sm font-medium text-text-secondary">
                  Exam session
                </p>
                <div className="mt-4 space-y-3 sm:flex sm:items-center sm:gap-3 sm:space-y-0">
                  <select
                    value={sessionChoice}
                    onChange={(event) => setSessionChoice(event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
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

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-text-secondary">
                  Selected subjects
                </h2>
                {selectedSubjects.length ? (
                  <div className="space-y-3">
                    {selectedSubjects.map((subject) => (
                      <SubjectLevelRow
                        key={subject.key}
                        subject={{
                          ...subject,
                          icon: subjectIconMap.get(subject.key),
                        }}
                        onLevelChange={updateLevel}
                        onRemove={removeSubject}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-white/60 p-6 text-sm text-text-muted">
                    No subjects selected yet. Add one below.
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-text-secondary">
                  Add subjects
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject.key}
                      type="button"
                      onClick={() => addSubject(subject.key, subject.name)}
                      className="rounded-2xl border border-border/60 bg-white/70 p-4 text-left text-sm font-medium text-text-main shadow-sm transition hover:-translate-y-[1px] hover:border-border"
                    >
                      {subject.name}
                    </button>
                  ))}
                  {!availableSubjects.length ? (
                    <div className="rounded-2xl border border-dashed border-border/70 bg-white/60 p-4 text-sm text-text-muted">
                      All subjects added.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              {saved ? (
                <p className="text-sm font-medium text-emerald-600">
                  Settings saved.
                </p>
              ) : (
                <span className="text-xs text-text-muted">
                  Changes apply immediately to your dashboard.
                </span>
              )}
              <Button
                className="w-full shadow sm:w-auto"
                onClick={handleSave}
                disabled={!effectiveSession}
              >
                Save changes
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
