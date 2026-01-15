import { Container } from "@/components/ui/Container";

type RouteFallbackProps = {
  title: string;
  subtitle?: string;
};

export function RouteFallback({ title, subtitle }: RouteFallbackProps) {
  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <div className="space-y-4">
            <div className="h-4 w-20 rounded-full bg-border/60" />
            <div className="space-y-2">
              <div className="h-6 w-56 rounded-full bg-border/70" />
              <div className="h-4 w-72 rounded-full bg-border/60" />
            </div>
            <div className="rounded-2xl border border-border/60 bg-white/80 p-4">
              <div className="text-sm font-semibold text-text-main">
                {title}
              </div>
              <div className="mt-2 text-xs text-text-muted">
                {subtitle ?? "Loading your workspace..."}
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
