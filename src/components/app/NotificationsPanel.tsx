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
  info: "bg-sky-100 text-sky-600",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-amber-100 text-amber-600",
  practice: "bg-blue-100 text-blue-600",
  report: "bg-indigo-100 text-indigo-600",
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
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function NotificationsPanel({
  open,
  onClose,
  onUnreadChange,
}: NotificationsPanelProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    seedNotificationsIfEmpty();
    setItems(getNotifications());
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
          Latest updates
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
              className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-white/80 p-4 text-left shadow-sm transition hover:border-border"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${kindStyles[item.kind] ?? "bg-gray-100 text-gray-600"}`}
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
          <div className="rounded-2xl border border-dashed border-border/60 bg-white/70 p-6 text-center text-sm text-text-muted">
            You are all caught up.
          </div>
        )}
      </div>
    </SlideOver>
  );
}
