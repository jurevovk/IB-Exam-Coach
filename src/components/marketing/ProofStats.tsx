import { Container } from "@/components/ui/Container";

const stats = [
  { label: "Reports generated", value: "12,400+" },
  { label: "Avg. grade lift", value: "+1.2" },
  { label: "Active IB learners", value: "4,800" },
  { label: "Weekly practice streaks", value: "3,200" },
];

export function ProofStats() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[18px] border border-border bg-white p-5 shadow-soft transition hover:-translate-y-[2px]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-text-main">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
