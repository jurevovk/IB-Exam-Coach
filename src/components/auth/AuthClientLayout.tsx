"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";

export function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
