"use client";

import { useMemo, useState } from "react";

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
const MAX_SUBJECTS = 6;

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
  const derivedSettings = useMemo(() => {
    const base = buildDefaultSettings(profile);
    const stored = ready ? getJSON<UserSettings | null>(STORAGE_KEY, null) : null;

    if (!stored) {
      return base;
    }

    const storedMap = new Map(
      stored.subjects.map((subject) => [subject.name, subject])
    );
    const mergedSubjects = base.subjects.map(
      (subject) => storedMap.get(subject.name) ?? subject
    );

    return {
      examSession: stored.examSession || base.examSession,
      subjects: mergedSubjects,
    };
  }, [ready, profile]);
  const [settingsDraft, setSettingsDraft] = useState<UserSettings | null>(null);
  const settings = settingsDraft ?? derivedSettings;
  const [saved, setSaved] = useState(false);
  const selectedCount = settings.subjects.filter(
    (subject) => subject.enabled
  ).length;

  const subjectMeta = useMemo(
    () => new Map(subjects.map((subject) => [subject.name, subject])),
    []
  );

  const toggleSubject = (name: string) => {
    const target = settings.subjects.find((subject) => subject.name === name);

    if (!target?.enabled && selectedCount >= MAX_SUBJECTS) {
      return;
    }

    setSettingsDraft((prev) => ({
      ...(prev ?? settings),
      subjects: (prev ?? settings).subjects.map((subject) =>
        subject.name === name
          ? { ...subject, enabled: !subject.enabled }
          : subject
      ),
    }));
  };

  const updateLevel = (name: string, level: "HL" | "SL") => {
    setSettingsDraft((prev) => ({
      ...(prev ?? settings),
      subjects: (prev ?? settings).subjects.map((subject) =>
        subject.name === name ? { ...subject, level } : subject
      ),
    }));
  };

  const updateExamSession = (examSession: string) => {
    setSettingsDraft((prev) => ({
      ...prev,
      ...(prev ?? settings),
      examSession,
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
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card/80 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <header className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Preferences
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Subject preferences
              </h1>
              <p className="text-sm text-text-secondary">
                Choose up to {MAX_SUBJECTS} IB subjects and set HL or SL.
                These choices power Dashboard, Learn, Practice, My Plan, and
                notifications.
              </p>
            </header>

            <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
              <p className="text-sm font-medium text-text-secondary">
                Exam session
              </p>
              <select
                value={settings.examSession}
                onChange={(event) => updateExamSession(event.target.value)}
                className="mt-4 w-full rounded-xl border border-border/70 bg-card/85 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
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
                      "rounded-2xl border p-5 shadow-sm transition",
                      isSelected
                        ? "border-primary/30 bg-primary/5 shadow-card"
                        : selectedCount >= MAX_SUBJECTS
                          ? "border-border/40 bg-card/45 opacity-60"
                          : "border-border/60 bg-card/80 hover:border-border"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!isSelected && selectedCount >= MAX_SUBJECTS}
                        onChange={() => toggleSubject(subject.name)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary"
                      />
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                        <Icon name={meta?.icon ?? "checkCircle"} size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-main">
                          {subject.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {isSelected
                            ? "Selected"
                            : selectedCount >= MAX_SUBJECTS
                              ? "Maximum reached"
                              : "Available"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "mt-4 inline-flex items-center rounded-full border border-border/60 bg-card/85 p-1 shadow-sm",
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
                              ? "bg-card text-text-main shadow-sm"
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

            <div className="sticky bottom-4 z-20 flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-card backdrop-blur sm:flex-row sm:justify-between">
              {saved ? (
                <p className="text-sm font-medium text-emerald-600">
                  Saved
                </p>
              ) : (
                <span className="text-xs text-text-muted">
                  {selectedCount}/{MAX_SUBJECTS} subjects selected. Changes
                  apply across the app after saving.
                </span>
              )}
              <Button
                className="w-full shadow sm:w-auto"
                onClick={handleSave}
                disabled={selectedCount === 0}
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
