import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { subjects } from "@/lib/subjects";

const subjectPapers: Record<string, string[]> = {
  economics: ["Paper 1 - Micro", "Paper 2 - Data response", "Paper 3 - Macro"],
  geography: [
    "Paper 1 - Physical",
    "Paper 2 - Human",
    "Paper 3 - HL extension",
  ],
  "english-b": ["Paper 1 - Text", "Paper 2 - Written response", "Orals prep"],
  "math-aa": ["Paper 1 - No calc", "Paper 2 - Calc", "Paper 3 - HL"],
  "computer-science": ["Paper 1 - Concepts", "Paper 2 - Option", "Paper 3 - HL"],
  biology: ["Paper 1 - MCQ", "Paper 2 - Structured", "Paper 3 - HL"],
  chemistry: ["Paper 1 - MCQ", "Paper 2 - Structured", "Paper 3 - HL"],
  physics: ["Paper 1 - MCQ", "Paper 2 - Extended", "Paper 3 - HL"],
};

const defaultPapers = ["Paper 1", "Paper 2", "Paper 3"];

export default function SubjectsMarketingPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-white/80 p-8 shadow-soft backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="absolute -right-20 top-[-120px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,102,255,0.18),rgba(234,241,255,0)_70%)] blur-3xl" />
          <div className="relative space-y-8">
            <header className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                Subjects
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main sm:text-4xl">
                IB Subjects
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary sm:text-base">
                Explore every supported subject and get examiner-style practice
                prompts in minutes.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => {
                const papers =
                  subjectPapers[subject.key] ?? defaultPapers;

                return (
                  <Card
                    key={subject.key}
                    className="flex h-full flex-col gap-4 rounded-2xl border-border/60 bg-white/80 p-5 shadow-soft transition hover:-translate-y-[1px]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                        <Icon name={subject.icon} size={18} />
                      </span>
                      <div>
                        <h2 className="text-base font-semibold text-text-main">
                          {subject.name}
                        </h2>
                        <p className="text-xs text-text-muted">
                          HL and SL tracks supported
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-border/60 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                        HL
                      </span>
                      <span className="rounded-full border border-border/60 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                        SL
                      </span>
                    </div>

                    <ul className="list-disc space-y-1 pl-5 text-xs text-text-secondary">
                      {papers.map((paper) => (
                        <li key={paper}>{paper}</li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/15 bg-white/80 p-6 shadow-soft sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-text-main">
                  Ready to practice?
                </p>
                <p className="text-xs text-text-muted">
                  Create an account to pick your subjects and start exam-style
                  sessions.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button href="/signup" className="shadow">
                  Sign up
                </Button>
                <Button href="/login" variant="secondary">
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
