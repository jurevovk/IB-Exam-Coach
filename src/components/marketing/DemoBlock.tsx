import { Icon } from "@/components/ui/Icon";

export function DemoBlock() {
  return (
    <section className="rounded-xl border border-border/70 bg-card shadow-soft">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 lg:p-10">
        <div className="space-y-5">
          <p className="text-sm font-semibold text-text-secondary">Your Answer</p>
          <div className="space-y-4 rounded-xl border border-border/60 bg-[#F7F9FC] p-5 shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]">
            <p className="text-sm text-text-secondary">
              The case study shows how incentives can shift student study
              patterns, but it also creates short-term motivation that fades
              after the policy ends.
            </p>
            <div className="space-y-2">
              <div className="h-2 w-4/5 rounded-full bg-border/70" />
              <div className="h-2 w-2/3 rounded-full bg-border/70" />
              <div className="h-2 w-3/5 rounded-full bg-border/70" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-2/3 rounded-full bg-border/70" />
            <div className="h-2 w-1/2 rounded-full bg-border/70" />
            <div className="h-2 w-3/4 rounded-full bg-border/70" />
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-sm font-semibold text-text-secondary">
            Examiner Report
          </p>
          <div className="relative overflow-hidden rounded-xl bg-report p-6 text-white shadow-soft">
            <div className="pointer-events-none absolute -right-6 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="relative space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Examiner Report
                </p>
                <p className="text-3xl font-semibold">
                  16/20 &rarr; Grade 6
                </p>
              </div>
              <div className="divide-y divide-white/10 text-sm text-white/80">
                <div className="flex items-start gap-3 py-4 first:pt-0">
                  <span className="mt-0.5 rounded-md bg-white/10 p-2 text-emerald-300">
                    <Icon name="checkCircle" size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Strengths</p>
                    <p>Good use of case study.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-4">
                  <span className="mt-0.5 rounded-md bg-white/10 p-2 text-rose-300">
                    <Icon name="x" size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Lost Marks</p>
                    <p>Lacks evaluation of impacts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-4">
                  <span className="mt-0.5 rounded-md bg-white/10 p-2 text-amber-300">
                    <Icon name="flame" size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-white">Band Jump Plan</p>
                    <p>
                      Add 2 points of comparison. Write a final judgement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
