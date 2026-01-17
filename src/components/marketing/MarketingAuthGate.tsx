"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

export function MarketingAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, user } = useAuth();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user) {
      router.replace("/dashboard");
    }
  }, [ready, user, router]);

  if (!ready) {
    return null;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
