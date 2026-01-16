import { Container } from "@/components/ui/Container";
import { FeatureBlock } from "@/components/marketing/FeatureBlock";

const blocks = [
  {
    title: "Practice Mode",
    bullets: [
      "Pick subject, paper, and goal mode instantly.",
      "Get prompts matched to your mark allocation.",
      "Stay focused with clean, exam-style UI.",
    ],
    ctaLabel: "Start a session",
    ctaHref: "/practice/setup",
    variant: "left" as const,
    visualType: "practice" as const,
  },
  {
    title: "Examiner Report",
    bullets: [
      "Receive a clear score and grade band.",
      "See strengths and missed marks fast.",
      "Know exactly what to fix next.",
    ],
    ctaLabel: "View a report",
    ctaHref: "/practice/report",
    variant: "right" as const,
    visualType: "report" as const,
  },
  {
    title: "Band Jump Plan",
    bullets: [
      "Target the 2-3 changes that move your score.",
      "Checklist format keeps you focused.",
      "Rewrite with guidance in one click.",
    ],
    ctaLabel: "See the plan",
    ctaHref: "/practice/report",
    variant: "left" as const,
    visualType: "plan" as const,
  },
  {
    title: "Weakness Map",
    bullets: [
      "Spot repeated gaps across topics.",
      "Compare evaluation, evidence, and structure.",
      "Build a smarter weekly practice plan.",
    ],
    ctaLabel: "Explore insights",
    ctaHref: "/weakness-map",
    variant: "right" as const,
    visualType: "map" as const,
  },
];

export function FeaturesStory() {
  return (
    <section className="py-16">
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Feature story
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Everything you need to jump a grade band
          </h2>
        </div>

        <div className="mt-12 space-y-12">
          {blocks.map((block) => (
            <FeatureBlock key={block.title} {...block} />
          ))}
        </div>
      </Container>
    </section>
  );
}
