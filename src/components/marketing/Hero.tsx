import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-7 text-center">
      <span className="rounded-full border border-border/60 bg-white/70 px-4 py-1 text-xs font-medium text-text-muted shadow-sm backdrop-blur">
        New: Examiner-style reports
      </span>
      <div className="space-y-4">
        <h1 className="mx-auto max-w-[760px] font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-text-main sm:text-5xl lg:text-[64px]">
          Stop guessing. Hit the markband.
        </h1>
        <p className="mx-auto max-w-[640px] text-base text-text-secondary sm:text-lg">
          Write answers &rarr; Get examiner-style feedback &rarr; Jump to higher
          marks.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button href="#" className="shadow">
          Grade My Answer (Free)
        </Button>
        <Button href="#" variant="secondary">
          Try a Timed Mini Exam &rarr;
        </Button>
      </div>
    </section>
  );
}
