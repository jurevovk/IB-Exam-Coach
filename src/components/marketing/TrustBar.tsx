import { Icon, type IconName } from "@/components/ui/Icon";

const items: Array<{ label: string; icon: IconName }> = [
  {
    label: "Used by IB students worldwide",
    icon: "checkCircle",
  },
  {
    label: "10 minutes a day",
    icon: "clock",
  },
  {
    label: "Track your progress",
    icon: "chart",
  },
];

export function TrustBar() {
  return (
    <section className="rounded-full border border-border/60 bg-white/70 px-6 py-4 shadow-sm backdrop-blur">
      <div className="flex flex-col items-center justify-center gap-4 text-sm text-text-muted sm:flex-row sm:gap-6">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Icon name={item.icon} size={16} />
            </span>
            <span>{item.label}</span>
            {index < items.length - 1 ? (
              <span className="hidden h-1 w-1 rounded-full bg-text-muted/40 sm:inline-flex" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
