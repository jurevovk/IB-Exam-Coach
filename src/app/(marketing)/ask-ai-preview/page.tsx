import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function AskAiPreviewPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/80 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-16 top-[-120px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Ask AI
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                Your private study chat, unlocked after login
              </h1>
              <p className="text-sm text-text-secondary sm:text-base">
                Ask for essay structure, evaluation tips, or command-term
                guidance. The AI coach is available inside your dashboard.
              </p>
              <Button href="/login" className="mt-4 shadow">
                Log in to use Ask AI
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-bg p-4 shadow-soft">
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-text-main shadow-sm">
                    Tell me your subject and what you&apos;re stuck on.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-white shadow-sm">
                    Econ HL Paper 1: how do I evaluate better?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-text-main shadow-sm">
                    Try using "however" + impact on stakeholders + a short
                    judgment sentence.
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  disabled
                  placeholder="Log in to ask a question..."
                  className="h-12 flex-1 rounded-2xl border border-border bg-white px-4 text-sm text-text-muted"
                />
                <button
                  type="button"
                  disabled
                  className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-white opacity-60"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
