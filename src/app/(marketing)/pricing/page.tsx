import { MarketingPanel } from "@/components/marketing/MarketingPanel";
import { Button } from "@/components/ui/Button";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Try examiner-style feedback with sample drills.",
    features: ["Limited practice sets", "Basic feedback", "Community support"],
  },
  {
    name: "Core",
    price: "$12/mo",
    description: "Full access to subject practice and examiner reports.",
    features: ["All subjects", "Examiner reports", "Progress tracking"],
  },
  {
    name: "Pro",
    price: "$24/mo",
    description: "Personalized plans and priority feedback.",
    features: ["Everything in Core", "Priority feedback", "Study roadmap"],
  },
];

export default function PricingPage() {
  return (
    <MarketingPanel>
      <div className="space-y-10">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Pricing
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Simple plans for every IB student
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Pick the plan that matches your study rhythm and goals.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex h-full flex-col gap-6 rounded-2xl border border-border/60 bg-white/70 p-6 shadow-card"
            >
              <div>
                <p className="text-sm font-semibold text-text-main">
                  {tier.name}
                </p>
                <p className="mt-2 text-3xl font-semibold text-text-main">
                  {tier.price}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  {tier.description}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-text-muted">
                {tier.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button className="mt-auto shadow" variant="secondary">
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </MarketingPanel>
  );
}
