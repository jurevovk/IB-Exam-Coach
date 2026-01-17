"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const resolveParam = (value?: string | null) => value ?? "Unknown";

export default function ChatClient() {
  const searchParams = useSearchParams();
  const subject = resolveParam(searchParams.get("subject"));
  const level = (searchParams.get("level") ?? "hl").toUpperCase();

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <Card className="border-border bg-white/70 shadow-soft">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-text-main">
              Ask AI: {subject} ({level})
            </h1>
            <p className="text-sm text-text-muted">
              This is a placeholder page for AI chat.
            </p>
          </div>
          <div className="mt-6">
            <Button href="/practice" variant="secondary">
              Back to Practice
            </Button>
          </div>
        </Card>
      </Container>
    </main>
  );
}
