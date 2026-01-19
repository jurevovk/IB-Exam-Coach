"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { MarketingPanel } from "@/components/marketing/MarketingPanel";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { isProfileComplete } from "@/lib/storage";

export default function SignupPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user, profile, signup } = useAuth();
  const hasRedirected = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log("redirecting because already authenticated on signup", {
        path: pathname,
        ready,
        user,
      });
      router.replace(isProfileComplete(profile) ? "/dashboard" : "/onboarding");
    }
  }, [ready, user, profile, router, pathname]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const result = signup(email, password, name);
    if (!result.ok) {
      setError(result.error ?? "Signup failed. Try again.");
    }
  };

  return (
    <MarketingPanel>
      <div className="space-y-6">
        <BackButton />
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-3xl font-semibold text-text-main">
              Create your account
            </h1>
            <p className="text-sm text-text-secondary">
              Start building your IB study plan in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="w-full rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full shadow">
              Sign up
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-text-main underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MarketingPanel>
  );
}
