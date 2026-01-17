"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";

type AvatarMenuProps = {
  compact?: boolean;
  className?: string;
};

export function AvatarMenu({ compact, className }: AvatarMenuProps) {
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

  const initial = profile?.name?.slice(0, 1).toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow",
          compact && "h-9 w-9 text-xs"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
      >
        {initial}
      </button>

      <div
        className={cn(
          "absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border/70 bg-white/95 p-2 text-sm shadow-card backdrop-blur",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
        role="menu"
      >
        <Link
          href="/edit-subjects"
          className="block rounded-lg px-3 py-2 text-text-main transition hover:bg-bg"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Edit Subjects
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
