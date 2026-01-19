"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { subjects } from "@/lib/subjects";
import type { Profile } from "@/lib/storage";
import { getJSON, setJSON } from "@/lib/storage";
import { useRequireAuth } from "@/lib/useRequireAuth";

const STORAGE_KEY = "ibec_user_settings_v1";

const sessionOptions = ["May 2026", "Nov 2026", "May 2027", "Nov 2027"];

type SubjectSetting = {
  name: string;
  level: "HL" | "SL";
  enabled: boolean;
};

type UserSettings = {
  examSession: string;
  subjects: SubjectSetting[];
};

const buildDefaultSettings = (profile?: Profile | null): UserSettings => {
  return {
    examSession: profile?.examSession?.trim() || sessionOptions[0],
    subjects: subjects.map((subject) => {
      const match = profile?.subjects?.find(
        (selected) => selected.key === subject.key
      );

      return {
        name: subject.name,
        level: match?.level === "sl" ? "SL" : "HL",
        enabled: Boolean(match),
      };
    }),
  };
};

export default function EditSubjectsPage() {
  const { ready, profile } = useRequireAuth();
  const { updateProfile } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(
    buildDefaultSettings(profile)
  );
  const [saved, setSaved] = useState(false);

  const subjectMeta = useMemo(
    () => new Map(subjects.map((subject) => [subject.name, subject])),
    []
  );

  useEffect(() => {
    if (!ready) {
      return;
    }

    const base = buildDefaultSettings(profile);
    const stored = getJSON<UserSettings | null>(STORAGE_KEY, null);

    if (stored) {
      const storedMap = new Map(
        stored.subjects.map((subject) => [subject.name, subject])
      );
      const mergedSubjects = base.subjects.map(
        (subject) => storedMap.get(subject.name) ?? subject
      );
      setSettings({
        examSession: stored.examSession || base.examSession,
        subjects: mergedSubjects,
      });
      return;
    }

    setSettings(base);
  }, [ready, profile]);

  const toggleSubject = (name: string) => {
    setSettings((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) =>
        subject.name === name
          ? { ...subject, enabled: !subject.enabled }
          : subject
      ),
    }));
  };

  const updateLevel = (name: string, level: "HL" | "SL") => {
    setSettings((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) =>
        subject.name === name ? { ...subject, level } : subject
      ),
    }));
  };

  const handleSave = () => {
    setJSON(STORAGE_KEY, settings);

    if (profile) {
      const subjectKeyMap = new Map(
        subjects.map((subject) => [subject.name, subject.key])
      );
      const nextSubjects = settings.subjects
        .filter((subject) => subject.enabled)
        .map((subject) => {
          const key = subjectKeyMap.get(subject.name);
          if (!key) {
            return null;
          }

          return {
            key,
            name: subject.name,
            level: subject.level === "SL" ? "sl" : "hl",
          } as const;
        })
        .filter(Boolean);

      updateProfile({
        ...profile,
        examSession: settings.examSession,
        subjects: nextSubjects as Profile["subjects"],
      });
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (!ready || !profile) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <header className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Edit subjects
              </h1>
              <p className="text-sm text-text-secondary">
                Choose what you want to practice and set HL or SL.
              </p>
            </header>

            <div className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm">
              <p className="text-sm font-medium text-text-secondary">
                Exam session
              </p>
              <select
                value={settings.examSession}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    examSession: event.target.value,
                  }))
                }
                className="mt-4 w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
              >
                {sessionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {settings.subjects.map((subject) => {
                const meta = subjectMeta.get(subject.name);
                const isSelected = subject.enabled;

                return (
                  <div
                    key={subject.name}
                    className={cn(
                      "rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm transition",
                      isSelected
                        ? "border-primary/30 bg-white shadow-card"
                        : "hover:border-border"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSubject(subject.name)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary"
                      />
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                        <Icon name={meta?.icon ?? "checkCircle"} size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-main">
                          {subject.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          HL / SL supported
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "mt-4 inline-flex items-center rounded-full border border-border/60 bg-white/80 p-1 shadow-sm",
                        !isSelected && "opacity-40"
                      )}
                    >
                      {(["HL", "SL"] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          disabled={!isSelected}
                          onClick={() => updateLevel(subject.name, level)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium transition",
                            subject.level === level
                              ? "bg-white text-text-main shadow-sm"
                              : "text-text-muted hover:text-text-main"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              {saved ? (
                <p className="text-sm font-medium text-emerald-600">
                  Saved.
                </p>
              ) : (
                <span className="text-xs text-text-muted">
                  Changes apply to your practice flow.
                </span>
              )}
              <Button className="w-full shadow sm:w-auto" onClick={handleSave}>
                Save changes
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
