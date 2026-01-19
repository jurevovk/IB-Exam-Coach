"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

export function MarketingAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user && !hasRedirected.current && !pathname.startsWith("/onboarding")) {
      hasRedirected.current = true;
      console.log("redirecting because logged-in on marketing page", {
        path: pathname,
        ready,
        user,
      });
      router.replace("/dashboard");
    }
  }, [ready, user, router, pathname]);

  if (!ready) {
    return null;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
