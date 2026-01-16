import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Subject } from "@/lib/subjects";

type SubjectCardProps = {
  subject: Subject;
  levelLabel: string;
  estGrade?: string;
  onStart?: () => void;
  startHref?: string;
};

export function SubjectCard({
  subject,
  levelLabel,
  estGrade = "5",
  onStart,
  startHref,
}: SubjectCardProps) {
  return (
    <Card className="flex h-full flex-col gap-5 border-border bg-white/70 shadow-card transition-transform duration-200 hover:-translate-y-[1px]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <Icon name={subject.icon} size={20} />
          </span>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-text-main">
              {subject.name}
            </h3>
            <span className="inline-flex rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs font-semibold text-text-muted">
              {levelLabel}
            </span>
          </div>
        </div>
        <span className="rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs font-semibold text-text-muted">
          Est. Grade: {estGrade}
        </span>
      </div>
      <div className="mt-auto">
        <Button
          className="w-full"
          onClick={onStart}
          href={startHref}
        >
          Start Practice
        </Button>
      </div>
    </Card>
  );
}
