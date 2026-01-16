import { Container } from "@/components/ui/Container";

const testimonials = [
  {
    quote:
      "The examiner report tells me exactly what to fix. I jumped from a 4 to a 6 in two weeks.",
    name: "Lina P.",
    detail: "Economics HL",
  },
  {
    quote:
      "The Band Jump Plan is clear and calm. It feels like a coach sitting next to me.",
    name: "Marco S.",
    detail: "Geography SL",
  },
  {
    quote:
      "I finally understand what evaluation language looks like. My essays sound sharper now.",
    name: "Ayesha R.",
    detail: "English B HL",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Student voices
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-text-main sm:text-4xl">
            Trusted by ambitious IB students
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white/80 p-6 shadow-soft"
            >
              <blockquote className="text-sm text-text-secondary">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs font-semibold text-text-main">
                {item.name} ·{" "}
                <span className="font-normal text-text-muted">
                  {item.detail}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
