"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import {
  getUserPreferences,
  updateUserPreferences,
  type AccountPlan,
  type UserPreferences,
} from "@/lib/preferences";
import { useRequireAuth } from "@/lib/useRequireAuth";

type PlanCard = {
  id: AccountPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
};

const plans: PlanCard[] = [
  {
    id: "free",
    name: "Free",
    price: "Free",
    description: "Core study tools for trying the workspace.",
    features: [
      "Core Learn access",
      "Limited Ask AI usage",
      "Limited practice feedback",
      "Local progress tracking",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: "$10/month",
    description: "A stronger daily study workflow for active IB prep.",
    features: [
      "Unlimited Learn access",
      "Expanded practice feedback",
      "Stronger AI help",
      "Better progress tools",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$15/month",
    description: "The most complete coaching layer for serious exam prep.",
    features: [
      "Everything in Plus",
      "Best AI support",
      "Full advanced grading support",
      "Premium study tools",
    ],
  },
];

export default function PlanPage() {
  const { ready } = useRequireAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    getUserPreferences()
  );

  const selectPlan = (plan: AccountPlan) => {
    const next = updateUserPreferences((current) => ({
      ...current,
      accountPlan: plan,
    }));
    setPreferences(next);
  };

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card/90 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgb(var(--color-primary)/0.18),rgb(var(--color-info-bg)/0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                  Account Plan
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                  Choose your Exam Coach plan
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                  Local demo state only. This page is ready for a later billing
                  integration, but no payment is collected here.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
                Current plan:{" "}
                <span className="font-semibold text-text-main">
                  {plans.find((plan) => plan.id === preferences.accountPlan)?.name ??
                    "Free"}
                </span>
              </div>
            </header>

            <div className="grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => {
                const isCurrent = preferences.accountPlan === plan.id;
                const isPro = plan.id === "pro";

                return (
                  <article
                    key={plan.id}
                    className={cn(
                      "flex min-h-full flex-col rounded-[24px] border p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft",
                      isCurrent
                        ? "border-primary/30 bg-primary/10"
                        : "border-border/60 bg-card/85",
                      isPro && !isCurrent && "bg-card/95"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-2xl font-semibold text-text-main">
                          {plan.name}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {plan.description}
                        </p>
                      </div>
                      {isCurrent ? (
                        <span className="state-success rounded-full border px-3 py-1 text-xs font-semibold">
                          Current
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-6 text-3xl font-semibold text-text-main">
                      {plan.price}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2 text-sm text-text-secondary">
                      {plan.features.map((feature) => (
                        <li key={feature}>- {feature}</li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => selectPlan(plan.id)}
                      className={cn(
                        "mt-6 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                        isCurrent
                          ? "chip cursor-default"
                          : "border-primary/20 bg-primary text-white shadow-sm hover:bg-primary-hover"
                      )}
                      disabled={isCurrent}
                    >
                      {isCurrent
                        ? "Selected"
                        : plan.id === "free"
                          ? "Switch to Free"
                          : `Choose ${plan.name}`}
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/80 p-5 text-sm text-text-secondary">
              <span className="font-semibold text-text-main">
                Implementation note:
              </span>{" "}
              plan choice is stored in local preferences for now. It does not
              unlock or restrict production features yet.
            </div>

            <Button href="/settings" variant="secondary">
              Back to Settings
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
