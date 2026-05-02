"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import {
  clearLocalStudyData,
  getUserPreferences,
  updateUserPreferences,
  type NotificationCategory,
  type AccountPlan,
  type ThemePreference,
  type UserPreferences,
} from "@/lib/preferences";
import { useRequireAuth } from "@/lib/useRequireAuth";

const themeOptions: ThemePreference[] = ["light", "dark", "system"];
const categoryLabels: Record<NotificationCategory, string> = {
  grading: "Grade reports",
  compliance: "IA / EE risks",
  planning: "Plans and sessions",
};
const planLabels: Record<AccountPlan, string> = {
  free: "Free",
  plus: "Plus",
  pro: "Pro",
};

export default function SettingsPage() {
  const router = useRouter();
  const { ready } = useRequireAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    getUserPreferences()
  );
  const [cleared, setCleared] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const savePreference = (
    updater: (current: UserPreferences) => UserPreferences
  ) => {
    const next = updateUserPreferences(updater);
    setPreferences(next);
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }

    clearLocalStudyData();
    setCleared(true);
    window.setTimeout(() => {
      router.refresh();
      router.push("/dashboard");
    }, 500);
  };

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card/90 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <header className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Account
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Settings
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary">
                Functional preferences for appearance, notifications, exam
                visibility, and local study data.
              </p>
            </header>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-text-main">Theme</p>
                <p className="mt-1 text-xs text-text-muted">
                  Applies across the app. System follows your OS preference.
                </p>
                <div className="mt-4 inline-flex items-center rounded-full border border-border/60 bg-bg/70 p-1 shadow-sm">
                  {themeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        savePreference((current) => ({
                          ...current,
                          theme: option,
                        }))
                      }
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold transition",
                        preferences.theme === option
                          ? "bg-card text-text-main shadow-sm"
                          : "text-text-muted hover:text-text-main"
                      )}
                    >
                      {option[0].toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-text-main">Plan</p>
                <p className="mt-1 text-xs text-text-muted">
                  Local-only account plan for demo/testing. Payments are not
                  connected yet.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Current: {planLabels[preferences.accountPlan]}
                  </span>
                  <Button href="/plan" variant="secondary">
                    {preferences.accountPlan === "free"
                      ? "Upgrade Plan"
                      : "Manage Plan"}
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-text-main">
                  Notifications
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Controls generated local notifications, not critical page
                  errors.
                </p>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-bg/50 px-4 py-3 text-sm">
                    <span className="font-medium text-text-main">
                      Notifications enabled
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.notificationsEnabled}
                      onChange={() =>
                        savePreference((current) => ({
                          ...current,
                          notificationsEnabled: !current.notificationsEnabled,
                        }))
                      }
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                  </label>
                  {(Object.keys(categoryLabels) as NotificationCategory[]).map(
                    (category) => (
                      <label
                        key={category}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-bg/50 px-4 py-3 text-sm"
                      >
                        <span className="text-text-secondary">
                          {categoryLabels[category]}
                        </span>
                        <input
                          type="checkbox"
                          checked={
                            preferences.notificationCategories[category]
                          }
                          disabled={!preferences.notificationsEnabled}
                          onChange={() =>
                            savePreference((current) => ({
                              ...current,
                              notificationCategories: {
                                ...current.notificationCategories,
                                [category]:
                                  !current.notificationCategories[category],
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-border text-primary disabled:opacity-40"
                        />
                      </label>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  savePreference((current) => ({
                    ...current,
                    showExamCountdown: !current.showExamCountdown,
                  }))
                }
                className={cn(
                  "rounded-2xl border p-5 text-left shadow-sm transition hover:border-primary/25",
                  preferences.showExamCountdown
                    ? "border-primary/25 bg-primary/10"
                    : "border-border/60 bg-card/80"
                )}
              >
                <span className="text-sm font-semibold text-text-main">
                  Show exam session on Dashboard
                </span>
                <span className="mt-2 block text-xs text-text-muted">
                  {preferences.showExamCountdown
                    ? "Visible"
                    : "Hidden from Dashboard"}
                </span>
              </button>
            </div>

            <div className="state-danger flex flex-col items-start justify-between gap-3 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold">
                  Clear local study data
                </p>
                <p className="text-xs">
                  Clears chat, topic progress, lesson progress, quick checks,
                  plan topics, practice attempts, notifications, weakness
                  events, and Grade Work history on this device. Account,
                  selected subjects, theme, notifications, and plan choice are
                  kept.
                </p>
              </div>
              <Button variant="secondary" onClick={handleClear}>
                {confirmClear ? "Confirm clear" : "Clear study data"}
              </Button>
            </div>

            {cleared ? (
              <p className="text-sm font-medium text-text-main">
                Local study data cleared. Returning to Dashboard...
              </p>
            ) : null}
            {confirmClear && !cleared ? (
              <p className="text-sm font-medium text-text-main">
                Click Confirm clear to remove local study data. Your account,
                login, and selected subjects will stay.
              </p>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  );
}
