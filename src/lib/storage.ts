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

const SESSION_KEY = "ibec_session";
const USERS_KEY = "ibec_users";
const PROFILE_KEY = "ibec_profile";

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
