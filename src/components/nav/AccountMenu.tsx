"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";

export function AccountMenu() {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const name = profile?.name?.trim() || "Account";
  const initial = name.slice(0, 1).toUpperCase();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-3 py-2 text-sm text-text-main shadow-sm transition hover:-translate-y-[1px]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="hidden text-xs font-semibold sm:inline">{name}</span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("transition-transform", open ? "rotate-180" : "")}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={cn(
          "absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border/70 bg-white/95 p-2 text-sm shadow-card backdrop-blur",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
        role="menu"
      >
        <Link
          href="/dashboard"
          className="block rounded-lg px-3 py-2 text-text-main transition hover:bg-bg"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className="block rounded-lg px-3 py-2 text-text-main transition hover:bg-bg"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Settings
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full rounded-lg px-3 py-2 text-left text-text-main transition hover:bg-bg"
          role="menuitem"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
