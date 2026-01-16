"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const steps = [
  {
    title: "Pick",
    body: "Choose a subject, paper, and goal mode. We serve a curated prompt.",
  },
  {
    title: "Write",
    body: "Work in a clean exam-style editor with command term guidance.",
  },
  {
    title: "Improve",
    body: "Get a report, then follow a Band Jump Plan to raise marks.",
  },
];

export function HowItWorks() {
  const [visible, setVisible] = useState<boolean[]>(
    () => new Array(steps.length).fill(false)
  );
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setVisible(new Array(steps.length).fill(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const index = Number(entry.target.getAttribute("data-index"));
          setVisible((prev) => {
            if (prev[index]) {
              return prev;
            }
            const next = [...prev];
            next[index] = true;
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16">
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            A calm, repeatable practice flow
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-sm text-text-secondary sm:text-base">
            Move from choosing a prompt to improving with data-driven feedback.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              data-index={index}
              className={cn(
                "rounded-2xl border border-border bg-white/80 p-6 shadow-soft transition-all duration-700",
                visible[index]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-text-main">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
