"use client";

import Link from "next/link";

import { BackButton } from "@/components/ui/BackButton";
import { Container } from "@/components/ui/Container";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function ExamplesPage() {
  const { ready } = useRequireAuth();

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <BackButton className="mb-6" />
          <h1 className="font-heading text-2xl font-semibold text-text-main">
            Examples Vault
          </h1>
          <p className="mt-2 text-sm text-text-muted">Coming soon.</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex text-sm font-medium text-text-muted transition hover:text-text-main"
          >
            Back to Dashboard
          </Link>
        </section>
      </Container>
    </main>
  );
}
