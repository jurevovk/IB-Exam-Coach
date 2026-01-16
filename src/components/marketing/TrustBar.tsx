const items = [
  {
    label: "Used by IB students worldwide",
    icon: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z",
  },
  {
    label: "10 minutes a day",
    icon: "M12 7v6l4 2",
  },
  {
    label: "Track your progress",
    icon: "M6 16V9 M12 16V5 M18 16v-7",
  },
];

export function TrustBar() {
  return (
    <section className="rounded-full border border-border/60 bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
      <div className="flex flex-col items-center justify-center gap-4 text-sm text-text-muted sm:flex-row sm:gap-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
