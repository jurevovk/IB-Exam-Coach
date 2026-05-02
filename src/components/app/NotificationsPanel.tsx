"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import {
  type NotificationItem,
  getNotifications,
  getUnreadNotificationCount,
  markAllRead,
  markRead,
  seedNotificationsIfEmpty,
} from "@/lib/notifications";

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
};

const kindStyles: Record<string, string> = {
  info: "state-info",
  success: "state-success",
  warning: "state-warning",
  practice: "state-info",
  report: "state-info",
};

const kindIcons: Record<string, string> = {
  info: "M12 8v4m0 4h.01 M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z",
  success: "M20 6L9 17l-5-5",
  warning: "M12 9v4m0 4h.01 M10 3h4l6 18H4L10 3z",
  practice: "M5 4h14v16H5z M8 8h8",
  report: "M6 4h9l3 3v13H6z M9 13h6",
};

const formatTime = (value: string) => {
  const date = new Date(value);
  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - date.getTime()) / 60000)
  );

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffMinutes < 60 * 24) {
    return `${Math.round(diffMinutes / 60)}h ago`;
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export function NotificationsPanel({
  open,
  onClose,
  onUnreadChange,
}: NotificationsPanelProps) {
  const [items, setItems] = useState<NotificationItem[]>(() => {
    seedNotificationsIfEmpty();
    return getNotifications();
  });

  useEffect(() => {
    seedNotificationsIfEmpty();
    const timeout = window.setTimeout(() => {
      setItems(getNotifications());
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    onUnreadChange?.(getUnreadNotificationCount());
  }, [items, onUnreadChange]);

  const grouped = useMemo(() => items, [items]);

  const handleMarkAll = () => {
    setItems(markAllRead());
  };

  const handleMarkRead = (id: string) => {
    setItems(markRead(id));
  };

  return (
    <SlideOver open={open} onClose={onClose} title="Notifications">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Actionable updates
        </p>
        <Button className="px-3 py-2 text-xs" variant="secondary" onClick={handleMarkAll}>
          Mark all read
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {grouped.length ? (
          grouped.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMarkRead(item.id)}
              className="surface-muted flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition hover:border-border"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border ${kindStyles[item.kind] ?? "state-info"}`}
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
                  <path d={kindIcons[item.kind] ?? kindIcons.info} />
                </svg>
              </span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text-main">
                    {item.title}
                  </p>
                  <span className="text-xs text-text-muted">
                    {formatTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{item.body}</p>
              </div>
              {!item.read ? (
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              ) : null}
            </button>
          ))
        ) : (
          <div className="surface-muted rounded-2xl border border-dashed p-6 text-center text-sm text-text-muted">
            You are all caught up.
          </div>
        )}
      </div>
    </SlideOver>
  );
}
