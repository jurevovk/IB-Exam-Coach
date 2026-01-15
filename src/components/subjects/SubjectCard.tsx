import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Subject } from "@/lib/subjects";

type SubjectCardProps = {
  subject: Subject;
  level: "hl" | "sl";
};

export function SubjectCard({ subject, level }: SubjectCardProps) {
  const query = `?subject=${encodeURIComponent(subject.key)}&level=${level}`;

  return (
    <Card className="flex h-full flex-col gap-5 border-border bg-white/70 shadow-card transition-transform duration-200 hover:-translate-y-[1px]">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
          <Icon name={subject.icon} size={20} />
        </span>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-text-main">
            {subject.name}
          </h3>
          <p className="text-sm text-text-muted">
            Level: {level.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <Button href={`/practice${query}`}>Start Practice</Button>
      </div>
    </Card>
  );
}
