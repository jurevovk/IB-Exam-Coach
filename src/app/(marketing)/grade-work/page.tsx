import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const featureCards = [
  {
    title: "TOK Essay Feedback",
    description:
      "Check your claims, counterclaims, and evaluation depth with rubric-aware prompts.",
  },
  {
    title: "Extended Essay Structure",
    description:
      "Scan structure, argument flow, and evidence quality before final submission.",
  },
  {
    title: "IA Criteria Checklist",
    description:
      "Verify every criterion and highlight missing analysis, evaluation, and reflection.",
  },
];

export default function GradeWorkMarketingPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/80 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.16),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <header className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Grade Work
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Grade TOK, EE, and IA work with confidence
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary sm:text-base">
                Upload your draft and get a structured review aligned to IB
                expectations, so you know exactly what to fix next.
              </p>
            </header>

            <div className="grid gap-4 lg:grid-cols-3">
              {featureCards.map((feature) => (
                <Card
                  key={feature.title}
                  className="rounded-2xl border-border/60 bg-white/80 p-6 shadow-soft"
                >
                  <h2 className="text-base font-semibold text-text-main">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/15 bg-white/80 p-6 shadow-soft sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-text-main">
                  Want feedback on your draft?
                </p>
                <p className="text-xs text-text-muted">
                  Create an account to upload work and get examiner-style notes.
                </p>
              </div>
              <Button href="/signup" className="shadow">
                Create account
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
