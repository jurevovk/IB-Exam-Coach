import { DemoBlock } from "@/components/marketing/DemoBlock";
import { Hero } from "@/components/marketing/Hero";
import { Navbar } from "@/components/marketing/Navbar";
import { TrustBar } from "@/components/marketing/TrustBar";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="min-h-screen py-10 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/70 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-24 top-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-12">
            <Navbar />
            <Hero />
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-6 -top-8 h-36 rounded-[999px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(47,102,255,0.18)_0%,rgba(234,241,255,0)_70%)] blur-2xl" />
              <div className="relative">
                <DemoBlock />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              <span className="h-1 w-1 rounded-full bg-text-muted/60" />
              Scroll
              <span className="h-1 w-1 rounded-full bg-text-muted/60" />
            </div>
            <TrustBar />
          </div>
        </section>
      </Container>
    </main>
  );
}
