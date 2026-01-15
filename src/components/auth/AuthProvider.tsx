"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Profile, UserRecord } from "@/lib/storage";
import {
  addUser,
  clearSession,
  getFallbackName,
  getProfile,
  getSession,
  getUsers,
  setProfile,
  setSession,
} from "@/lib/storage";

type AuthResult = {
  ok: boolean;
  error?: string;
};

type AuthContextValue = {
  ready: boolean;
  user: string | null;
  profile: Profile | null;
  login: (email: string, password: string) => AuthResult;
  signup: (email: string, password: string, name: string) => AuthResult;
  logout: () => void;
  updateProfile: (profile: Profile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const ensureProfileName = (profile: Profile, email: string) => {
  if (profile.name?.trim()) {
    return profile;
  }

  return {
    ...profile,
    name: getFallbackName(email),
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const session = getSession();
    const email = session?.email ?? null;
    const storedProfile = getProfile();

    if (email) {
      setUser(email);
      if (storedProfile?.email === email) {
        const normalized = ensureProfileName(storedProfile, email);
        setProfileState(normalized);
        if (normalized.name !== storedProfile.name) {
          setProfile(normalized);
        }
      }
    }

    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback((email: string, password: string): AuthResult => {
    const normalized = normalizeEmail(email);
    const users = getUsers();
    const match = users.find(
      (record) => record.email === normalized && record.password === password
    );

    if (!match) {
      return { ok: false, error: "Invalid email or password." };
    }

    setSession({ email: normalized });
    setUser(normalized);

    const storedProfile = getProfile();
    if (storedProfile?.email === normalized) {
      const normalizedProfile = ensureProfileName(storedProfile, normalized);
      setProfileState(normalizedProfile);
      if (normalizedProfile.name !== storedProfile.name) {
        setProfile(normalizedProfile);
      }
    } else {
      setProfileState(null);
    }

    return { ok: true };
  }, []);

  const signup = useCallback(
    (email: string, password: string, name: string): AuthResult => {
    const normalized = normalizeEmail(email);
    const users = getUsers();
    const exists = users.some((record) => record.email === normalized);

    if (exists) {
      return { ok: false, error: "Account already exists. Please log in." };
    }

    const newUser: UserRecord = { email: normalized, password };
    addUser(newUser);
    setSession({ email: normalized });
    setUser(normalized);

    const nextProfile: Profile = {
      email: normalized,
      name: name.trim() || getFallbackName(normalized),
      examSession: "",
      subjects: [],
    };
    setProfile(nextProfile);
    setProfileState(nextProfile);

    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setProfileState(null);
  }, []);

  const updateProfile = useCallback((nextProfile: Profile) => {
    setProfile(nextProfile);
    setProfileState(nextProfile);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      user,
      profile,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [ready, user, profile, login, signup, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
