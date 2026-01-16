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
  {
    label: "Practice",
    href: "/subjects",
    icon: "practice",
    matches: ["/subjects", "/practice"],
  },
  { label: "Exam Simulator", href: "/exam-simulator", icon: "simulator" },
  { label: "Weakness Map", href: "/weakness-map", icon: "weakness" },
  { label: "Examples Vault", href: "/examples", icon: "examples" },
  { label: "My Plan", href: "/my-plan", icon: "plan" },
  { label: "Grade Work", href: "/grade-work", icon: "grade" },
  { label: "Ask AI", href: "/ask-ai", icon: "chat" },
];

const iconPaths: Record<NavItem["icon"], string> = {
  dashboard:
    "M4 13h7V4H4v9zm9 7h7V11h-7v9zM4 20h7v-5H4v5zm9-16v5h7V4h-7z",
  practice: "M5 4h14v16H5z",
  simulator: "M4 6h16v12H4z M8 10h8",
  weakness: "M4 20h16 M6 16V9 M12 16V5 M18 16v-7",
  examples: "M6 4h9l3 3v13H6z M9 12h6 M9 16h6",
  plan: "M4 7h16 M4 12h16 M4 17h10",
  grade: "M6 4h9l3 3v13H6z M9 13h6 M9 17h6",
  chat: "M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h6",
};

export function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          {APP_NAME}
        </p>
        <p className="mt-2 text-lg font-semibold text-white">Command Center</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const matches = item.matches ?? [item.href];
          const isActive = matches.some(
            (match) => pathname === match || pathname.startsWith(`${match}/`)
          );

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
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
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/15 bg-white/10 p-4 text-xs text-white/70">
        Focus streak: <span className="font-semibold text-white">4</span> days
      </div>
    </div>
  );
}
