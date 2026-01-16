import { getJSON, setJSON } from "@/lib/storage";

export type MessageRole = "user" | "coach";

export type MessageItem = {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: string;
  read: boolean;
};

const STORAGE_KEY = "ibec:messages";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}`;
};

const seedMessages: MessageItem[] = [
  {
    id: createId(),
    role: "coach",
    text: "Welcome to IB Exam Coach. Tell me what topic you want to improve today.",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read: false,
  },
];

export const getMessages = () => getJSON<MessageItem[]>(STORAGE_KEY, []);

const setMessages = (items: MessageItem[]) => {
  setJSON(STORAGE_KEY, items);
};

export const seedMessagesIfEmpty = () => {
  const existing = getMessages();
  if (existing.length) {
    return existing;
  }

  setMessages(seedMessages);
  return seedMessages;
};

export const addUserMessage = (text: string) => {
  const message: MessageItem = {
    id: createId(),
    role: "user",
    text,
    createdAt: new Date().toISOString(),
    read: true,
  };
  const items = [...getMessages(), message];
  setMessages(items);
  return items;
};

export const addCoachMessage = (text: string) => {
  const message: MessageItem = {
    id: createId(),
    role: "coach",
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const items = [...getMessages(), message];
  setMessages(items);
  return items;
};

export const markAllCoachRead = () => {
  const items = getMessages().map((message) =>
    message.role === "coach" ? { ...message, read: true } : message
  );
  setMessages(items);
  return items;
};

export const getUnreadCoachState = () => {
  const items = getMessages();
  const unread = items.filter(
    (message) => message.role === "coach" && !message.read
  ).length;
  const last = items[items.length - 1];
  return {
    unread,
    hasUnreadCoach: unread > 0 && last?.role === "coach",
  };
};

export const cannedCoachReply =
  "Got it. Aim for one evaluative sentence per paragraph and finish with a clear judgement.";
