"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { MessagesPanel } from "@/components/app/MessagesPanel";
import { NotificationsPanel } from "@/components/app/NotificationsPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { APP_NAME } from "@/lib/constants";
import {
  getUnreadNotificationCount,
  seedNotificationsIfEmpty,
} from "@/lib/notifications";
import {
  getUnreadCoachState,
  seedMessagesIfEmpty,
} from "@/lib/messages";
import { useRequireAuth } from "@/lib/useRequireAuth";

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
  dashboard: "M4 13h7V4H4v9zm9 7h7V11h-7v9zM4 20h7v-5H4v5zm9-16v5h7V4h-7z",
  practice: "M5 4h14v16H5z",
  simulator: "M4 6h16v12H4z M8 10h8",
  weakness: "M4 20h16 M6 16V9 M12 16V5 M18 16v-7",
  examples: "M6 4h9l3 3v13H6z M9 12h6 M9 16h6",
  plan: "M4 7h16 M4 12h16 M4 17h10",
  grade: "M6 4h9l3 3v13H6z M9 13h6 M9 17h6",
  chat: "M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h6",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, profile } = useRequireAuth();
  const { logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [messageUnread, setMessageUnread] = useState({
    unread: 0,
    hasUnreadCoach: false,
  });

  if (!ready || !profile) {
    return null;
  }

  const refreshUnread = useCallback(() => {
    setUnreadNotifications(getUnreadNotificationCount());
    setMessageUnread(getUnreadCoachState());
  }, []);

  useEffect(() => {
    seedNotificationsIfEmpty();
    seedMessagesIfEmpty();
    refreshUnread();
  }, [refreshUnread]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const openNotifications = () => {
    setNotificationsOpen(true);
    setMessagesOpen(false);
  };

  const openMessages = () => {
    setMessagesOpen(true);
    setNotificationsOpen(false);
  };

  return (
    <div className="min-h-screen bg-glow py-6">
      <div className="relative mx-auto w-full max-w-[1400px] px-6">
        <aside className="mb-6 w-full rounded-[20px] bg-report p-6 shadow-soft lg:fixed lg:left-6 lg:top-6 lg:mb-0 lg:flex lg:h-[calc(100vh-3rem)] lg:w-[260px] lg:flex-col lg:gap-6">
          <div>
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-[0.3em] text-white/60"
            >
              {APP_NAME}
            </Link>
            <p className="mt-2 text-lg font-semibold text-white">
              Command Center
            </p>
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
            Focus streak: <span className="font-semibold text-white">4</span>{" "}
            days
          </div>
        </aside>

        <div className="lg:ml-[284px]">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/80 p-3 shadow-sm backdrop-blur-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
              Workspace
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openNotifications}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/80 text-text-muted shadow-sm transition hover:text-text-main"
                aria-label="Open notifications"
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
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                </svg>
                {unreadNotifications > 0 ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                ) : null}
              </button>
              <button
                type="button"
                onClick={openMessages}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/80 text-text-muted shadow-sm transition hover:text-text-main"
                aria-label="Open messages"
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
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h6" />
                </svg>
                {messageUnread.hasUnreadCoach ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                ) : null}
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow">
                {profile.name.slice(0, 1).toUpperCase()}
              </div>
              <Button
                className="px-4 py-2 text-xs"
                variant="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onUnreadChange={setUnreadNotifications}
      />
      <MessagesPanel
        open={messagesOpen}
        onClose={() => setMessagesOpen(false)}
        onUnreadChange={setMessageUnread}
      />
    </div>
  );
}
