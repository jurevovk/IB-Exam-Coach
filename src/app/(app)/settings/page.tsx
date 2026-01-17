"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { getJSON, setJSON } from "@/lib/storage";
import { useRequireAuth } from "@/lib/useRequireAuth";

const THEME_KEY = "ibec_theme_v1";
const MOTION_KEY = "ibec_reduce_motion_v1";
const CHAT_KEY = "ibec_ask_ai_chat_v1";
const USER_SETTINGS_KEY = "ibec_user_settings_v1";

type ThemeOption = "light" | "dark" | "system";

export default function SettingsPage() {
  const { ready } = useRequireAuth();
  const [theme, setTheme] = useState<ThemeOption>("system");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!ready) {
      return;
    }

    setTheme(getJSON<ThemeOption>(THEME_KEY, "system"));
    setReduceMotion(getJSON<boolean>(MOTION_KEY, false));
  }, [ready]);

  const handleThemeChange = (value: ThemeOption) => {
    setTheme(value);
    setJSON(THEME_KEY, value);
  };

  const toggleReduceMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    setJSON(MOTION_KEY, next);
  };

  const handleClear = () => {
    if (typeof window === "undefined") {
      return;
    }

    [THEME_KEY, MOTION_KEY, CHAT_KEY, USER_SETTINGS_KEY].forEach((key) =>
      window.localStorage.removeItem(key)
    );
    setTheme("system");
    setReduceMotion(false);
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2000);
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
            <header className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Settings
              </h1>
              <p className="text-sm text-text-secondary">
                Tune your experience for focus and comfort.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm">
                <p className="text-sm font-medium text-text-secondary">
                  Theme
                </p>
                <div className="mt-4 inline-flex items-center rounded-full border border-border/60 bg-white/80 p-1 shadow-sm">
                  {(["light", "dark", "system"] as ThemeOption[]).map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleThemeChange(option)}
                        className={cn(
                          "rounded-full px-4 py-2 text-xs font-semibold transition",
                          theme === option
                            ? "bg-white text-text-main shadow-sm"
                            : "text-text-muted hover:text-text-main"
                        )}
                      >
                        {option[0].toUpperCase() + option.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm">
                <p className="text-sm font-medium text-text-secondary">
                  Reduce motion
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Minimize motion effects and transitions.
                  </span>
                  <button
                    type="button"
                    onClick={toggleReduceMotion}
                    className={cn(
                      "inline-flex h-9 w-16 items-center rounded-full border border-border/60 px-1 transition",
                      reduceMotion
                        ? "bg-primary/20 text-primary"
                        : "bg-white/80 text-text-muted"
                    )}
                    aria-pressed={reduceMotion}
                  >
                    <span
                      className={cn(
                        "h-7 w-7 rounded-full bg-white shadow transition",
                        reduceMotion ? "translate-x-6" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-text-main">
                  Clear local data
                </p>
                <p className="text-xs text-text-muted">
                  Resets theme, motion, and chat history for this device.
                </p>
              </div>
              <Button variant="secondary" onClick={handleClear}>
                Clear data
              </Button>
            </div>

            {cleared ? (
              <p className="text-sm font-medium text-emerald-600">
                Local data cleared.
              </p>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  );
}
