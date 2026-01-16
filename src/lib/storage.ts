export type Session = {
  email: string;
};

export type UserRecord = {
  email: string;
  password: string;
};

export type ProfileSubject = {
  key: string;
  name: string;
  level: "hl" | "sl";
};

export type Profile = {
  email: string;
  name: string;
  examSession: string;
  subjects: ProfileSubject[];
};

export type PracticeSession = {
  id: string;
  subject: string;
  level: "hl" | "sl";
  paper: string;
  topic: string;
  marks: number;
  mode: "timed" | "untimed";
  difficulty: "easy" | "medium" | "hard";
  commandTerm: string;
  goalMode: "band-jump" | "consistency";
  questionId?: string;
};

export type PracticeAttempt = {
  id: string;
  sessionId: string;
  draftText: string;
  submittedText: string;
  wordCount: number;
  timeSpent: number;
  score: number;
  gradeBand: number;
  strengths: string[];
  lostMarks: string[];
  bandJumpPlan: string[];
};

const SESSION_KEY = "ibec_session";
const USERS_KEY = "ibec_users";
const PROFILE_KEY = "ibec_profile";
const LAST_SESSION_KEY = "ibec:lastSession";
const LAST_ATTEMPT_KEY = "ibec:lastAttempt";
const ATTEMPT_HISTORY_KEY = "ibec:attemptHistory";
const REWRITE_MODE_KEY = "ibec:rewriteMode";

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

const writeJSON = (key: string, value: unknown) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getJSON = <T>(key: string, fallback: T): T => {
  const value = readJSON<T>(key);
  return value ?? fallback;
};

export const setJSON = (key: string, value: unknown) => {
  writeJSON(key, value);
};

export const getSession = () => readJSON<Session>(SESSION_KEY);

export const setSession = (session: Session) => {
  writeJSON(SESSION_KEY, session);
};

export const clearSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
};

export const getUsers = () => readJSON<UserRecord[]>(USERS_KEY) ?? [];

export const setUsers = (users: UserRecord[]) => {
  writeJSON(USERS_KEY, users);
};

export const addUser = (user: UserRecord) => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};

export const getProfile = () => readJSON<Profile>(PROFILE_KEY);

export const setProfile = (profile: Profile) => {
  writeJSON(PROFILE_KEY, profile);
};

export const isProfileComplete = (profile?: Profile | null) => {
  if (!profile) {
    return false;
  }

  return Boolean(profile.examSession?.trim()) && profile.subjects.length > 0;
};

export const getFallbackName = (email: string) =>
  email.split("@")[0] ?? "Student";

export const isLoggedIn = () => {
  const session = getSession();
  return Boolean(session?.email);
};

export const getLastSession = () =>
  readJSON<PracticeSession>(LAST_SESSION_KEY);

export const setLastSession = (session: PracticeSession) => {
  writeJSON(LAST_SESSION_KEY, session);
};

export const getLastAttempt = () =>
  readJSON<PracticeAttempt>(LAST_ATTEMPT_KEY);

export const setLastAttempt = (attempt: PracticeAttempt) => {
  writeJSON(LAST_ATTEMPT_KEY, attempt);
};

export const getAttemptHistory = () =>
  readJSON<PracticeAttempt[]>(ATTEMPT_HISTORY_KEY) ?? [];

export const setAttemptHistory = (attempts: PracticeAttempt[]) => {
  writeJSON(ATTEMPT_HISTORY_KEY, attempts);
};

export const addAttemptToHistory = (attempt: PracticeAttempt) => {
  const history = getAttemptHistory();
  history.unshift(attempt);
  setAttemptHistory(history.slice(0, 50));
};

export const getRewriteMode = () =>
  readJSON<boolean>(REWRITE_MODE_KEY) ?? false;

export const setRewriteMode = (value: boolean) => {
  writeJSON(REWRITE_MODE_KEY, value);
};
