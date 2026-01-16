import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type MarketingPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingPanel({ children, className }: MarketingPanelProps) {
  return (
    <main className="py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/80 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className={cn("relative space-y-8", className)}>
            {children}
          </div>
        </section>
      </Container>
    </main>
  );
}
