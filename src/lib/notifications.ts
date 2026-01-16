import { getJSON, setJSON } from "@/lib/storage";

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

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}`;
};

const seedItems: NotificationItem[] = [
  {
    id: createId(),
    title: "Daily mission ready",
    body: "Complete one timed response to sharpen evaluation.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    read: false,
    kind: "practice",
  },
  {
    id: createId(),
    title: "Examiner report unlocked",
    body: "Your last report includes a Band Jump Plan.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    kind: "report",
  },
  {
    id: createId(),
    title: "Schedule check-in",
    body: "Next exam session is approaching. Update your plan.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
    kind: "info",
  },
  {
    id: createId(),
    title: "Focus streak",
    body: "You are on a 4-day focus streak. Keep the pace.",
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    read: true,
    kind: "success",
  },
  {
    id: createId(),
    title: "Reminder",
    body: "Add a case study for stronger evaluation.",
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    read: true,
    kind: "warning",
  },
];

export const getNotifications = () =>
  getJSON<NotificationItem[]>(STORAGE_KEY, []);

const setNotifications = (items: NotificationItem[]) => {
  setJSON(STORAGE_KEY, items);
};

export const seedNotificationsIfEmpty = () => {
  const existing = getNotifications();
  if (existing.length) {
    return existing;
  }

  setNotifications(seedItems);
  return seedItems;
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
  const items = [item, ...getNotifications()];
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
