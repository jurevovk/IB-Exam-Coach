"use client";

import { cloneElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessagesPanel } from "@/components/app/MessagesPanel";
import { NotificationsPanel } from "@/components/app/NotificationsPanel";
import { AvatarMenu } from "@/components/app/AvatarMenu";
import { cn } from "@/lib/cn";
import { getUnreadCoachState, seedMessagesIfEmpty } from "@/lib/messages";
import {
  getUnreadNotificationCount,
  seedNotificationsIfEmpty,
} from "@/lib/notifications";
import { useRequireAuth } from "@/lib/useRequireAuth";

type WorkspaceShellProps = {
  sidebar: React.ReactElement<SidebarRenderProps>;
  children: React.ReactNode;
};

type SidebarRenderProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function WorkspaceShell({ sidebar, children }: WorkspaceShellProps) {
  const router = useRouter();
  const { ready, user, profile } = useRequireAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [messageUnread, setMessageUnread] = useState({
    unread: 0,
    hasUnreadCoach: false,
  });

  const refreshUnread = useCallback(() => {
    setUnreadNotifications(getUnreadNotificationCount());
    setMessageUnread(getUnreadCoachState());
  }, []);

  useEffect(() => {
    seedNotificationsIfEmpty();
    seedMessagesIfEmpty();
    const timeout = window.setTimeout(refreshUnread, 0);
    return () => window.clearTimeout(timeout);
  }, [refreshUnread]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-glow text-text-main">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16">
          <div className="surface rounded-2xl border p-6 text-sm text-text-secondary shadow-soft">
            Loading workspace...
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-glow text-text-main">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16">
          <div className="surface rounded-2xl border p-6 text-sm text-text-secondary shadow-soft">
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  const openNotifications = () => {
    setNotificationsOpen(true);
    setMessagesOpen(false);
    setDrawerOpen(false);
  };

  const openMessages = () => {
    setMessagesOpen(true);
    setNotificationsOpen(false);
    setDrawerOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
  };

  const goBack = () => {
    const referrer =
      typeof document !== "undefined" && document.referrer
        ? new URL(document.referrer)
        : null;
    const sameOrigin =
      referrer &&
      typeof window !== "undefined" &&
      referrer.origin === window.location.origin;

    if (sameOrigin && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  };

  const headerActions = (
    <>
      <button
        type="button"
        onClick={goBack}
        className="chip flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold shadow-sm transition hover:text-text-main"
        aria-label="Go back"
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>
      <button
        type="button"
        onClick={openNotifications}
        className="chip relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:text-text-main"
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
        className="chip relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:text-text-main"
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
      <AvatarMenu />
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-glow lg:h-screen lg:overflow-hidden">
      <div className="surface sticky top-0 z-40 border-b backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="chip flex h-10 w-10 items-center justify-center rounded-full border text-text-main shadow-sm"
            aria-label="Open menu"
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
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Workspace
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="chip flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition hover:text-text-main"
              aria-label="Go back"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={openNotifications}
              className="chip relative flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition hover:text-text-main"
              aria-label="Open notifications"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
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
              className="chip relative flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition hover:text-text-main"
              aria-label="Open messages"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
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
            <AvatarMenu compact />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 transition lg:hidden",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-72 rounded-r-[20px] bg-report p-6 shadow-soft transition-transform duration-300",
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Menu
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-full border border-white/20 bg-card/10 px-3 py-1 text-xs font-semibold text-white"
            >
              Close
            </button>
          </div>
          <div className="mt-6 h-[calc(100%-48px)]">
            {cloneElement(sidebar, { collapsed: false })}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:grid lg:h-screen lg:max-h-screen lg:gap-6 lg:px-8 lg:transition-[grid-template-columns]",
          sidebarCollapsed
            ? "lg:grid-cols-[88px_minmax(0,1fr)]"
            : "lg:grid-cols-[260px_minmax(0,1fr)]"
        )}
      >
        <aside
          className={cn(
            "hidden lg:flex lg:h-[calc(100vh-3rem)] lg:min-h-0 lg:flex-col lg:gap-6 lg:rounded-[20px] lg:bg-report lg:shadow-soft",
            sidebarCollapsed ? "lg:p-4" : "lg:p-6"
          )}
        >
          {cloneElement(sidebar, {
            collapsed: sidebarCollapsed,
            onToggleCollapse: toggleSidebar,
          })}
        </aside>
        <div className="w-full lg:flex lg:min-h-0 lg:flex-col">
          <div className="surface hidden shrink-0 items-center justify-between gap-3 rounded-2xl border p-3 shadow-sm backdrop-blur lg:flex">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
              Workspace
            </div>
            <div className="flex items-center gap-2">{headerActions}</div>
          </div>
          <div className="mt-6 w-full lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
            {children}
          </div>
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
