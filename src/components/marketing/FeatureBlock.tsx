import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type FeatureBlockProps = {
  title: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  variant: "left" | "right";
  visualType: "practice" | "report" | "plan" | "map";
};

const visuals: Record<FeatureBlockProps["visualType"], React.ReactNode> = {
  practice: (
    <div className="space-y-3">
      <div className="h-4 w-3/4 rounded-full bg-border/70" />
      <div className="h-4 w-2/3 rounded-full bg-border/60" />
      <div className="h-24 rounded-2xl border border-border/60 bg-bg" />
    </div>
  ),
  report: (
    <div className="rounded-2xl bg-report p-4 text-white">
      <p className="text-xs uppercase text-white/60">Score</p>
      <p className="mt-2 text-2xl font-semibold">16/20</p>
      <div className="mt-4 space-y-2 text-xs text-white/70">
        <div className="h-2 w-full rounded-full bg-white/15" />
        <div className="h-2 w-3/4 rounded-full bg-white/10" />
      </div>
    </div>
  ),
  plan: (
    <div className="space-y-3">
      {["Case study", "Evaluation", "Judgement"].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between rounded-xl border border-border/60 bg-white px-3 py-2 text-xs text-text-secondary"
        >
          <span>{item}</span>
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
      ))}
    </div>
  ),
  map: (
    <div className="grid gap-2 text-xs text-text-secondary">
      <div className="rounded-xl border border-border/60 bg-white px-3 py-2">
        Evaluation (7x)
      </div>
      <div className="rounded-xl border border-border/60 bg-white px-3 py-2">
        Evidence (5x)
      </div>
      <div className="rounded-xl border border-border/60 bg-white px-3 py-2">
        Conclusion (4x)
      </div>
    </div>
  ),
};

export function FeatureBlock({
  title,
  bullets,
  ctaLabel,
  ctaHref,
  variant,
  visualType,
}: FeatureBlockProps) {
  const isLeft = variant === "left";

  return (
    <div
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]",
        !isLeft && "lg:grid-cols-[0.9fr_1.1fr]"
      )}
    >
      <div className={cn("space-y-4", !isLeft && "lg:order-2")}>
        <h3 className="font-heading text-2xl font-semibold text-text-main">
          {title}
        </h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          {bullets.map((bullet) => (
            <li key={bullet}>• {bullet}</li>
          ))}
        </ul>
        <Button href={ctaHref} variant="secondary" className="mt-2">
          {ctaLabel}
        </Button>
      </div>
      <div
        className={cn(
          "rounded-2xl border border-border bg-white/80 p-6 shadow-soft",
          !isLeft && "lg:order-1"
        )}
      >
        {visuals[visualType]}
      </div>
    </div>
  );
}
