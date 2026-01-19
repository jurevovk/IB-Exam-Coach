"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { isProfileComplete } from "@/lib/storage";

type RequireAuthOptions = {
  requireProfile?: boolean;
  redirectTo?: string;
};

export function useRequireAuth(options: RequireAuthOptions = {}) {
  const { ready, user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (hasRedirected.current) {
      return;
    }

    if (!user) {
      hasRedirected.current = true;
      console.log("redirecting because missing user", {
        path: pathname,
        ready,
        user,
        redirectTo: options.redirectTo ?? "/login",
      });
      router.replace(options.redirectTo ?? "/login");
      return;
    }

    const shouldRequireProfile = options.requireProfile ?? true;
    if (shouldRequireProfile && !isProfileComplete(profile)) {
      hasRedirected.current = true;
      console.log("redirecting because profile incomplete", {
        path: pathname,
        ready,
        user,
      });
      router.replace("/onboarding");
    }
  }, [
    ready,
    user,
    profile,
    router,
    pathname,
    options.redirectTo,
    options.requireProfile,
  ]);

  return { ready, user, profile };
}
