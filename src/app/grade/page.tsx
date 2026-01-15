import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

type PageProps = {
  searchParams?: {
    subject?: string | string[];
    level?: string | string[];
  };
};

const resolveParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default function GradePage({ searchParams }: PageProps) {
  const subject = resolveParam(searchParams?.subject) ?? "Unknown";
  const level = (resolveParam(searchParams?.level) ?? "hl").toUpperCase();

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <Card className="border-border bg-white/70 shadow-soft">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-text-main">
              Grade: {subject} ({level})
            </h1>
            <p className="text-sm text-text-muted">
              This is a placeholder page for grading answers.
            </p>
          </div>
          <div className="mt-6">
            <Button href="/subjects" variant="secondary">
              Back to Subjects
            </Button>
          </div>
        </Card>
      </Container>
    </main>
  );
}
