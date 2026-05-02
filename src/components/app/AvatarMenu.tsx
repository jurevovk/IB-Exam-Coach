"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import { getUserPreferences } from "@/lib/preferences";

type AvatarMenuProps = {
  compact?: boolean;
  className?: string;
};

export function AvatarMenu({ compact, className }: AvatarMenuProps) {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [accountPlan, setAccountPlan] = useState(() =>
    getUserPreferences().accountPlan
  );
  const [menuPosition, setMenuPosition] = useState({ right: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setMenuPosition({
        right: Math.max(16, window.innerWidth - rect.right),
        top: rect.bottom + 8,
      });
    };

    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    const handlePreferencesChange = () => {
      setAccountPlan(getUserPreferences().accountPlan);
    };

    handlePreferencesChange();
    window.addEventListener("ibec:preferences-changed", handlePreferencesChange);
    return () => {
      window.removeEventListener(
        "ibec:preferences-changed",
        handlePreferencesChange
      );
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!open || !containerRef.current) {
        return;
      }

      const target = event.target as Node;
      if (
        !containerRef.current.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
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
  }, [open]);

  const initial = profile?.name?.slice(0, 1).toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
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

      {typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              className={cn(
                "surface-strong fixed z-[9999] w-52 origin-top-right rounded-2xl border p-2 text-sm shadow-card backdrop-blur transition",
                open
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              )}
              style={{
                right: menuPosition.right,
                top: menuPosition.top,
              }}
              role="menu"
            >
              <Link
                href="/edit-subjects"
                className="block rounded-xl px-3 py-2 text-text-main transition hover:bg-bg"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Edit Subjects
              </Link>
              <Link
                href="/settings"
                className="block rounded-xl px-3 py-2 text-text-main transition hover:bg-bg"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="/plan"
                className="block rounded-xl px-3 py-2 text-text-main transition hover:bg-bg"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {accountPlan === "free" ? "Upgrade Plan" : "Manage Plan"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-xl px-3 py-2 text-left text-text-main transition hover:bg-bg"
                role="menuitem"
              >
                Logout
              </button>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
