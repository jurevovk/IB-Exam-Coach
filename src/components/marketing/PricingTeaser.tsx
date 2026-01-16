import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function PricingTeaser() {
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-white/80 p-8 text-center shadow-soft md:flex-row md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
              Pricing
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-text-main">
              Ready to build your Band Jump Plan?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Unlock full practice sets, examiner reports, and progress
              insights.
            </p>
          </div>
          <Button href="/pricing" className="shadow">
            View plans
          </Button>
        </div>
      </Container>
    </section>
  );
}
