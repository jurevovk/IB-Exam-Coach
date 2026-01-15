"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { isProfileComplete } from "@/lib/storage";

export default function SignupPage() {
  const router = useRouter();
  const { ready, user, profile, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user) {
      router.replace(isProfileComplete(profile) ? "/dashboard" : "/onboarding");
    }
  }, [ready, user, profile, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const result = signup(email, password, name);
    if (!result.ok) {
      setError(result.error ?? "Signup failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-6">
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
        </section>
      </Container>
    </main>
  );
}
