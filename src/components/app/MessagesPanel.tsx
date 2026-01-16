"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import {
  addCoachMessage,
  addUserMessage,
  cannedCoachReply,
  getMessages,
  getUnreadCoachState,
  markAllCoachRead,
  seedMessagesIfEmpty,
  type MessageItem,
} from "@/lib/messages";

type MessagesPanelProps = {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (state: { unread: number; hasUnreadCoach: boolean }) => void;
};

export function MessagesPanel({
  open,
  onClose,
  onUnreadChange,
}: MessagesPanelProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    seedMessagesIfEmpty();
    setMessages(getMessages());
  }, [open]);

  useEffect(() => {
    if (open) {
      const updated = markAllCoachRead();
      setMessages(updated);
      onUnreadChange?.(getUnreadCoachState());
    }
  }, [open, onUnreadChange]);

  useEffect(() => {
    onUnreadChange?.(getUnreadCoachState());
  }, [messages, onUnreadChange]);

  useEffect(() => {
    if (!threadRef.current) {
      return;
    }

    threadRef.current.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    setDraft("");
    setMessages(addUserMessage(trimmed));

    window.setTimeout(() => {
      setMessages(addCoachMessage(cannedCoachReply));
      if (open) {
        setMessages(markAllCoachRead());
      }
    }, 300);
  };

  const canSend = useMemo(() => draft.trim().length > 0, [draft]);

  return (
    <SlideOver open={open} onClose={onClose} title="Messages">
      <div
        ref={threadRef}
        className="flex h-[60vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-border/60 bg-white/80 p-4 shadow-sm"
      >
        {messages.length ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-white text-text-main"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-text-muted">
            Start a conversation with your coach.
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about your next essay..."
          className="flex-1 rounded-xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
        />
        <Button className="px-4 py-3" onClick={handleSend} disabled={!canSend}>
          Send
        </Button>
      </div>
    </SlideOver>
  );
}
