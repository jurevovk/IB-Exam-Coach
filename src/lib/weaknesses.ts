export type WeaknessSource = "practice" | "ia" | "ee";

export type WeaknessEvent = {
  id: string;
  source: WeaknessSource;
  subjectId: string;
  label: string;
  detail: string;
  href: string;
  createdAt: string;
};

const WEAKNESS_EVENTS_KEY = "ibec:weaknessEvents";

const isBrowser = () => typeof window !== "undefined";

const createId = (source: WeaknessSource) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${source}-${Date.now()}`;
};

const readEvents = () => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WEAKNESS_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as WeaknessEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: WeaknessEvent[]) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    WEAKNESS_EVENTS_KEY,
    JSON.stringify(events.slice(0, 100))
  );
};

export const normalizeWeaknessLabel = (value: string) => {
  const lower = value.toLowerCase();

  if (lower.includes("evaluation") || lower.includes("judgement")) {
    return "weak evaluation";
  }
  if (lower.includes("diagram") || lower.includes("graph")) {
    return "diagram weak";
  }
  if (lower.includes("terminology") || lower.includes("definition")) {
    return "weak terminology";
  }
  if (lower.includes("application") || lower.includes("article")) {
    return "poor application to article";
  }
  if (lower.includes("concept")) {
    return "weak key concept integration";
  }
  if (lower.includes("research question")) {
    return "unclear research question";
  }
  if (lower.includes("conclusion")) {
    return "weak conclusion";
  }
  if (lower.includes("stakeholder")) {
    return "poor stakeholder analysis";
  }
  if (lower.includes("data") || lower.includes("evidence")) {
    return "weak data use";
  }
  if (lower.includes("analysis") || lower.includes("descriptive")) {
    return "descriptive not analytical";
  }

  return value.trim().toLowerCase();
};

const displayLabels: Record<string, string> = {
  "weak evaluation": "Evaluation needs sharper judgement",
  "diagram weak": "Diagrams need stronger use",
  "weak terminology": "Subject terminology is shaky",
  "poor application to article": "Real-world application is thin",
  "weak key concept integration": "Key concept link is weak",
  "unclear research question": "Research question needs focus",
  "weak conclusion": "Conclusion needs a clearer answer",
  "poor stakeholder analysis": "Stakeholder analysis is underdeveloped",
  "weak data use": "Evidence and data need stronger use",
  "descriptive not analytical": "Too descriptive, not analytical enough",
};

export const getWeaknessDisplayLabel = (label: string) =>
  displayLabels[label] ??
  label
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

export const getWeaknessSeverity = (count: number) => {
  if (count >= 4) {
    return "high";
  }

  if (count >= 2) {
    return "medium";
  }

  return "low";
};

export const getWeaknessEvents = () => readEvents();

export const addWeaknessEvents = (
  events: Array<Omit<WeaknessEvent, "id" | "createdAt">>
) => {
  if (!events.length) {
    return;
  }

  const timestamp = new Date().toISOString();
  const nextEvents = [
    ...events.map((event) => ({
      ...event,
      id: createId(event.source),
      label: normalizeWeaknessLabel(event.label),
      createdAt: timestamp,
    })),
    ...readEvents(),
  ];

  writeEvents(nextEvents);
};

export const summarizeWeaknessEvents = (events = readEvents()) => {
  const counts = new Map<string, { count: number; latest?: WeaknessEvent }>();

  events.forEach((event) => {
    const current = counts.get(event.label);
    counts.set(event.label, {
      count: (current?.count ?? 0) + 1,
      latest: current?.latest ?? event,
    });
  });

  return Array.from(counts.entries())
    .map(([label, data]) => ({ label, count: data.count, latest: data.latest }))
    .sort((a, b) => b.count - a.count);
};
