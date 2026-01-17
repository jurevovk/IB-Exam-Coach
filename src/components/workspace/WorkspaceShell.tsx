"use client";

import { useCallback, useEffect, useState } from "react";
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
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export function WorkspaceShell({ sidebar, children }: WorkspaceShellProps) {
  const { ready, profile } = useRequireAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    refreshUnread();
  }, [refreshUnread]);

  if (!ready || !profile) {
    return null;
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

  const headerActions = (
    <>
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
      <AvatarMenu />
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-glow">
      <div className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/80 text-text-main shadow-sm"
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
              onClick={openNotifications}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/80 text-text-muted shadow-sm transition hover:text-text-main"
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
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/80 text-text-muted shadow-sm transition hover:text-text-main"
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
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
            >
              Close
            </button>
          </div>
          <div className="mt-6 h-[calc(100%-48px)]">{sidebar}</div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-6 lg:px-8">
        <aside className="hidden lg:flex lg:flex-col lg:gap-6 lg:rounded-[20px] lg:bg-report lg:p-6 lg:shadow-soft">
          {sidebar}
        </aside>
        <div className="w-full">
          <div className="hidden items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/80 p-3 shadow-sm backdrop-blur lg:flex">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
              Workspace
            </div>
            <div className="flex items-center gap-2">{headerActions}</div>
          </div>
          <div className="mt-6 w-full">{children}</div>
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
