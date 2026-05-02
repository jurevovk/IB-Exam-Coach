"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { isProfileComplete } from "@/lib/storage";

export function MarketingAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user, profile } = useAuth();
  const hasRedirected = useRef(false);
  const redirectTarget = isProfileComplete(profile) ? "/dashboard" : "/onboarding";

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user && !hasRedirected.current && !pathname.startsWith("/onboarding")) {
      hasRedirected.current = true;
      router.replace(redirectTarget);
    }
  }, [ready, user, router, pathname, redirectTarget]);

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-6 text-sm text-text-muted">
        Loading...
      </div>
    );
  }

  if (user && !pathname.startsWith("/onboarding")) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-6 text-sm text-text-muted">
        Redirecting to your {redirectTarget === "/dashboard" ? "dashboard" : "setup"}...
      </div>
    );
  }

  return <>{children}</>;
}
