"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { APP_NAME } from "@/lib/constants";

type NavItem = {
  label: string;
  href: string;
  icon:
    | "dashboard"
    | "learn"
    | "practice"
    | "simulator"
    | "weakness"
    | "examples"
    | "plan"
    | "grade"
    | "chat";
  matches?: string[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Learn", href: "/learn", icon: "learn" },
  {
    label: "Practice",
    href: "/practice",
    icon: "practice",
    matches: ["/practice"],
  },
  { label: "Exam Simulator", href: "/exam-simulator", icon: "simulator" },
  { label: "Weakness Map", href: "/weakness-map", icon: "weakness" },
  { label: "Examples Vault", href: "/examples", icon: "examples" },
  { label: "My Plan", href: "/my-plan", icon: "plan" },
  { label: "Grade Work", href: "/grade-work-app", icon: "grade" },
  { label: "Ask AI", href: "/ask-ai", icon: "chat" },
];

const iconPaths: Record<NavItem["icon"], string> = {
  dashboard:
    "M4 13h7V4H4v9zm9 7h7V11h-7v9zM4 20h7v-5H4v5zm9-16v5h7V4h-7z",
  learn: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z M4 5.5A2.5 2.5 0 0 1 6.5 8H20",
  practice: "M5 4h14v16H5z",
  simulator: "M4 6h16v12H4z M8 10h8",
  weakness: "M4 20h16 M6 16V9 M12 16V5 M18 16v-7",
  examples: "M6 4h9l3 3v13H6z M9 12h6 M9 16h6",
  plan: "M4 7h16 M4 12h16 M4 17h10",
  grade: "M6 4h9l3 3v13H6z M9 13h6 M9 17h6",
  chat: "M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h6",
};

type WorkspaceSidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function WorkspaceSidebar({
  collapsed = false,
  onToggleCollapse,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col text-white",
        collapsed ? "items-center gap-4" : "gap-6"
      )}
    >
      <div
        className={cn(
          "flex w-full items-start",
          collapsed ? "justify-center" : "justify-between gap-3"
        )}
      >
        {collapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/10 text-sm font-semibold text-white">
            EC
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              {APP_NAME}
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Command Center
            </p>
          </div>
        )}
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-card/10 text-white/70 transition hover:bg-card/15 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
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
              <path d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
            </svg>
          </button>
        ) : null}
      </div>

      <nav className={cn("flex min-h-0 flex-col gap-2", collapsed && "items-center")}>
        {navItems.map((item) => {
          const matches = item.matches ?? [item.href];
          const isActive = matches.some(
            (match) => pathname === match || pathname.startsWith(`${match}/`)
          );

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl text-sm transition",
                collapsed ? "h-11 w-11 justify-center" : "gap-3 px-3 py-2",
                isActive
                  ? "bg-card/15 text-white"
                  : "text-white/70 hover:bg-card/10 hover:text-white"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/10">
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
                  <path d={iconPaths[item.icon]} />
                </svg>
              </span>
              {collapsed ? null : item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0" />
    </div>
  );
}
