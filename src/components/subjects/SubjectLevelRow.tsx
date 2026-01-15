import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type SubjectLevelRowProps = {
  subject: {
    key: string;
    name: string;
    level: "hl" | "sl";
    icon?: IconName;
  };
  onLevelChange: (key: string, level: "hl" | "sl") => void;
  onRemove?: (key: string) => void;
};

const levels: Array<{ value: "hl" | "sl"; label: string }> = [
  { value: "hl", label: "HL" },
  { value: "sl", label: "SL" },
];

export function SubjectLevelRow({
  subject,
  onLevelChange,
  onRemove,
}: SubjectLevelRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-white/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
          <Icon name={subject.icon ?? "checkCircle"} size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-text-main">{subject.name}</p>
          <p className="text-xs text-text-muted">HL / SL supported</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-white/70 p-1 shadow-sm">
          {levels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onLevelChange(subject.key, level.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                subject.level === level.value
                  ? "bg-white text-text-main shadow-sm"
                  : "text-text-muted hover:text-text-main"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove(subject.key)}
            className="text-xs font-medium text-text-muted transition hover:text-text-main"
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}
