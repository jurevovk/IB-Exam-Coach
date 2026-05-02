import { getEconomicsIaHistory } from "@/lib/economics/ia";
import { getGradeWorkHistory } from "@/lib/grade-work/history";
import {
  getAttemptHistory,
  getJSON,
  getProfile,
  setJSON,
} from "@/lib/storage";
import { getUserPreferences } from "@/lib/preferences";
import {
  getWeaknessDisplayLabel,
  summarizeWeaknessEvents,
  getWeaknessEvents,
} from "@/lib/weaknesses";

export type NotificationKind =
  | "info"
  | "success"
  | "warning"
  | "practice"
  | "report";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: NotificationKind;
};

const STORAGE_KEY = "ibec:notifications";
const NOTIFICATION_COOLDOWN_MS = 1000 * 60 * 60 * 12;

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}`;
};

const generatedId = (key: string) => `generated:${key}`;

const getGeneratedNotifications = () => {
  const now = Date.now();
  const preferences = getUserPreferences();

  if (!preferences.notificationsEnabled) {
    return [];
  }

  const profile = getProfile();
  const attempts = getAttemptHistory();
  const gradeHistory = getGradeWorkHistory();
  const iaHistory = getEconomicsIaHistory();
  const weaknessSummary = summarizeWeaknessEvents(getWeaknessEvents());
  const items: NotificationItem[] = [];

  if (preferences.notificationCategories.planning) {
    items.push({
      id: generatedId("daily-mission"),
      title: "Daily plan ready",
      body: profile?.subjects.length
        ? `Start with one focused task for ${profile.subjects[0].name} ${profile.subjects[0].level.toUpperCase()}.`
        : "Choose one Learn topic and one short practice response today.",
      createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
      read: false,
      kind: "practice",
    });

    if (profile?.examSession) {
      items.push({
        id: generatedId("exam-session"),
        title: "Exam session planning",
        body: `${profile.examSession} is your active session. Keep Learn, Practice, and Grade Work aligned to it.`,
        createdAt: new Date(now - 1000 * 60 * 24).toISOString(),
        read: false,
        kind: "info",
      });
    }
  }

  if (preferences.notificationCategories.planning && weaknessSummary[0]?.count >= 3) {
    items.push({
      id: generatedId("weakness-summary"),
      title: "Weakness pattern updated",
      body: `${getWeaknessDisplayLabel(weaknessSummary[0].label)} is trending. Review Weakness Map when you plan next.`,
      createdAt: new Date(now - 1000 * 60 * 35).toISOString(),
      read: false,
      kind: "warning",
    });
  }

  if (attempts.length >= 5) {
    items.push({
      id: generatedId("practice-milestone"),
      title: "Practice milestone reached",
      body: `${attempts.length} saved practice attempts. Keep the next session balanced across subjects.`,
      createdAt: new Date(now - 1000 * 60 * 58).toISOString(),
      read: true,
      kind: "success",
    });
  }

  const latestIaWarning = iaHistory.find((item) => item.result.warnings.length);
  if (preferences.notificationCategories.compliance && latestIaWarning) {
    items.push({
      id: generatedId(`ia-warning:${latestIaWarning.id}`),
      title: "IA compliance warning",
      body: latestIaWarning.result.warnings[0],
      createdAt: latestIaWarning.createdAt,
      read: false,
      kind: "warning",
    });
  }

  const latestEeReflectionMissing = gradeHistory.find((item) =>
    item.result.criteria.some(
      (criterion) => criterion.criterionId === "E" && !criterion.gradable
    )
  );
  if (preferences.notificationCategories.compliance && latestEeReflectionMissing) {
    items.push({
      id: generatedId(`ee-reflection:${latestEeReflectionMissing.id}`),
      title: "EE reflection missing",
      body: "Criterion E could not be fully graded because reflection/RPPF evidence was missing.",
      createdAt: latestEeReflectionMissing.createdAt,
      read: false,
      kind: "report",
    });
  }

  if (preferences.notificationCategories.grading && gradeHistory[0]) {
    items.push({
      id: generatedId(`grade-report:${gradeHistory[0].id}`),
      title: "New grade report saved",
      body: `${gradeHistory[0].result.subject} EE report saved at ${gradeHistory[0].result.estimatedTotal}/${gradeHistory[0].result.maxTotal}.`,
      createdAt: gradeHistory[0].createdAt,
      read: false,
      kind: "report",
    });
  }

  return items;
};

export const getNotifications = () =>
  getJSON<NotificationItem[]>(STORAGE_KEY, []);

const setNotifications = (items: NotificationItem[]) => {
  setJSON(STORAGE_KEY, items);
};

export const seedNotificationsIfEmpty = () => {
  const existing = getNotifications();
  const generated = getGeneratedNotifications();
  const existingById = new Map(existing.map((item) => [item.id, item]));
  const mergedGenerated = generated.map((item) => ({
    ...item,
    read: existingById.get(item.id)?.read ?? item.read,
  }));

  if (existing.length) {
    const manual = existing.filter((item) => !item.id.startsWith("generated:"));
    const next = [...mergedGenerated, ...manual].slice(0, 30);
    setNotifications(next);
    return next;
  }

  setNotifications(mergedGenerated);
  return mergedGenerated;
};

export const addNotification = (
  notification: Omit<NotificationItem, "id" | "createdAt"> &
    Partial<Pick<NotificationItem, "id" | "createdAt">>
) => {
  const item: NotificationItem = {
    id: notification.id ?? createId(),
    createdAt: notification.createdAt ?? new Date().toISOString(),
    ...notification,
  };
  const existing = getNotifications();
  const duplicate = existing.find((notification) => {
    const sameKind =
      notification.id === item.id ||
      (notification.title === item.title && notification.body === item.body);
    const recent =
      Date.now() - new Date(notification.createdAt).getTime() <
      NOTIFICATION_COOLDOWN_MS;

    return sameKind && recent;
  });

  if (duplicate) {
    return existing;
  }

  const items = [item, ...existing].slice(0, 30);
  setNotifications(items);
  return items;
};

export const markAllRead = () => {
  const items = getNotifications().map((item) => ({
    ...item,
    read: true,
  }));
  setNotifications(items);
  return items;
};

export const markRead = (id: string) => {
  const items = getNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  setNotifications(items);
  return items;
};

export const getUnreadNotificationCount = () =>
  getNotifications().filter((item) => !item.read).length;
