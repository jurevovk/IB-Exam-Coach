"use client";

import { useEffect, useState } from "react";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { applyUserPreferences } from "@/lib/preferences";

export function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setPreferenceVersion] = useState(0);

  useEffect(() => {
    applyUserPreferences();

    const handleChange = () => {
      applyUserPreferences();
      setPreferenceVersion((version) => version + 1);
    };
    const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    window.addEventListener("ibec:preferences-changed", handleChange);
    themeMedia.addEventListener("change", handleChange);
    motionMedia.addEventListener("change", handleChange);
    return () => {
      window.removeEventListener("ibec:preferences-changed", handleChange);
      themeMedia.removeEventListener("change", handleChange);
      motionMedia.removeEventListener("change", handleChange);
    };
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
