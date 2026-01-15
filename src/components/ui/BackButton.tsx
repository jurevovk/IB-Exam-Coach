"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";

type BackButtonProps = {
  className?: string;
  fallbackHref?: string;
  label?: string;
};

export function BackButton({
  className,
  fallbackHref = "/",
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3 py-2 text-xs font-semibold text-text-main shadow-sm transition hover:-translate-y-[1px] hover:border-border",
        className
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  );
}
