import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function PricingTeaser() {
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 rounded-[28px] border border-border bg-card/90 p-8 text-center shadow-soft md:flex-row md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Free · Plus · Pro
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-text-main">
              Start free. Upgrade when your prep gets serious.
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Plans match the in-app account page: Free, Plus at $10/month,
              and Pro at $15/month.
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
