export type ThemePreference = "light" | "dark" | "system";

export type NotificationCategory =
  | "grading"
  | "compliance"
  | "planning";

export type AccountPlan = "free" | "plus" | "pro";

export type UserPreferences = {
  theme: ThemePreference;
  notificationsEnabled: boolean;
  notificationCategories: Record<NotificationCategory, boolean>;
  showExamCountdown: boolean;
  accountPlan: AccountPlan;
};

export const PREFERENCES_KEY = "ibec:preferences";

export const defaultPreferences: UserPreferences = {
  theme: "system",
  notificationsEnabled: true,
  notificationCategories: {
    grading: true,
    compliance: true,
    planning: true,
  },
  showExamCountdown: true,
  accountPlan: "free",
};

const legacyKeys = {
  theme: "ibec_theme_v1",
};

const isBrowser = () => typeof window !== "undefined";

const readJSON = <T>(key: string): T | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const getUserPreferences = (): UserPreferences => {
  const stored = readJSON<Partial<UserPreferences>>(PREFERENCES_KEY) ?? {};
  const legacyTheme = readJSON<ThemePreference>(legacyKeys.theme);

  return {
    ...defaultPreferences,
    ...stored,
    theme: stored.theme ?? legacyTheme ?? defaultPreferences.theme,
    notificationCategories: {
      ...defaultPreferences.notificationCategories,
      ...stored.notificationCategories,
    },
  };
};

export const saveUserPreferences = (preferences: UserPreferences) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

const resolveTheme = (theme: ThemePreference) => {
  if (!isBrowser()) {
    return "light";
  }

  if (theme !== "system") {
    return theme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyUserPreferences = (preferences = getUserPreferences()) => {
  if (!isBrowser()) {
    return;
  }

  const root = document.documentElement;
  const systemReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  root.dataset.theme = resolveTheme(preferences.theme);
  root.dataset.themePreference = preferences.theme;
  root.dataset.reduceMotion = systemReducedMotion ? "true" : "false";
};

export const updateUserPreferences = (
  updater: (current: UserPreferences) => UserPreferences
) => {
  const next = updater(getUserPreferences());
  saveUserPreferences(next);
  applyUserPreferences(next);
  window.dispatchEvent(new CustomEvent("ibec:preferences-changed"));
  return next;
};

export const clearLocalStudyData = () => {
  if (!isBrowser()) {
    return;
  }

  [
    "ibec_ask_ai_chat_v1",
    "ibec:askAiDraft",
    "ibec:lastSession",
    "ibec:lastAttempt",
    "ibec:attemptHistory",
    "ibec:rewriteMode",
    "ibec:learnProgress",
    "ibec:lessonProgress",
    "ibec:quickCheckAttempts",
    "ibec:planTopics",
    "ibec:planTaskState",
    "ibec:weaknessEvents",
    "ibec:notifications",
    "ibec:messages",
    "ibec:gradeWork:eeHistory",
    "ibec:economicsIaHistory",
  ].forEach((key) => window.localStorage.removeItem(key));
};
