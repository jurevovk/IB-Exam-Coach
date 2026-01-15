"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { isProfileComplete } from "@/lib/storage";

type RequireAuthOptions = {
  requireProfile?: boolean;
  redirectTo?: string;
};

export function useRequireAuth(options: RequireAuthOptions = {}) {
  const { ready, user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      router.replace(options.redirectTo ?? "/login");
      return;
    }

    const shouldRequireProfile = options.requireProfile ?? true;
    if (shouldRequireProfile && !isProfileComplete(profile)) {
      router.replace("/onboarding");
    }
  }, [ready, user, profile, router, options.redirectTo, options.requireProfile]);

  return { ready, user, profile };
}
