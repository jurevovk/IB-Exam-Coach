import { Card } from "@/components/ui/Card";

const strengths = [
  "Clear case study usage",
  "Balanced evaluation",
  "Strong conclusion",
];

const lostMarks = [
  "Limited comparative analysis",
  "Need more data evidence",
  "Judgement could be sharper",
];

export function DemoPanel() {
  return (
    <Card className="mx-auto max-w-[1100px] rounded-[28px] border border-border bg-white/80 p-6 shadow-card backdrop-blur-sm md:p-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-bg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Your Answer
            </p>
            <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs text-text-muted">
              Draft
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-3 w-11/12 rounded-full bg-border/70" />
            <div className="h-3 w-10/12 rounded-full bg-border/60" />
            <div className="h-3 w-9/12 rounded-full bg-border/50" />
            <div className="h-24 w-full rounded-xl border border-border/60 bg-white/80" />
            <div className="h-3 w-8/12 rounded-full bg-border/50" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-report p-5 text-white shadow-soft">
          <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Examiner Report
          </p>
          <p className="mt-4 text-3xl font-semibold">16/20 → Grade 6</p>
          <div className="mt-5 divide-y divide-white/10 text-sm">
            <div className="space-y-2 pb-4">
              <p className="text-xs font-semibold uppercase text-white/60">
                Strengths
              </p>
              <ul className="space-y-1 text-white/80">
                {strengths.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 py-4">
              <p className="text-xs font-semibold uppercase text-white/60">
                Lost Marks
              </p>
              <ul className="space-y-1 text-white/70">
                {lostMarks.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-4">
              <p className="text-xs font-semibold uppercase text-white/60">
                Band Jump Plan
              </p>
              <ul className="space-y-1 text-white/70">
                <li>• Add one data point per paragraph.</li>
                <li>• End with a stronger final judgement.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
