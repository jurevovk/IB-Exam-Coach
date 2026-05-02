import { MarketingPanel } from "@/components/marketing/MarketingPanel";
import { Button } from "@/components/ui/Button";

const tiers = [
  {
    name: "Free",
    price: "Free",
    description: "Start with the core study cockpit and local progress.",
    features: [
      "Core Learn access",
      "Limited Ask AI usage",
      "Limited practice feedback",
      "Local progress tracking",
    ],
  },
  {
    name: "Plus",
    price: "$10/month",
    description: "Expand practice, feedback, and AI help for weekly study.",
    features: [
      "Unlimited Learn access",
      "Expanded practice feedback",
      "Stronger AI study help",
      "Better progress tools",
    ],
  },
  {
    name: "Pro",
    price: "$15/month",
    description: "Advanced grading and the strongest support for exam season.",
    features: [
      "Everything in Plus",
      "Best AI support",
      "Full advanced grading support",
      "Premium study tools",
    ],
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
            Simple plans for focused exam prep
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Public pricing matches the in-app plan switcher. Payments are not
            active yet; plan switching is local-only for demo use.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex h-full flex-col gap-6 rounded-[28px] border border-border/60 bg-card/90 p-6 shadow-card"
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
              <Button href="/signup" className="mt-auto shadow" variant="secondary">
                Start with {tier.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </MarketingPanel>
  );
}
