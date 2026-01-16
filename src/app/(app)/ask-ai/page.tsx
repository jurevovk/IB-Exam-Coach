"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ChatMessage } from "@/lib/ai/types";

const STORAGE_KEY = "ibec_ask_ai_chat_v1";

export default function AskAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey 👋 I’m your IB Exam Coach AI. Tell me your subject + what you’re stuck on, and I’ll help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore localStorage errors
    }
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function send() {
    if (!canSend) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      const replyText = (data?.reply || "").toString();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText || "No response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Check your dev server and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    const starter: ChatMessage[] = [
      {
        role: "assistant",
        content:
          "Chat cleared ✅ Tell me your subject + what you want to improve.",
      },
    ];
    setMessages(starter);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
    } catch {
      // ignore localStorage errors
    }
  }

  return (
    <main className="min-h-screen py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="rounded-[28px] border border-border bg-white/70 p-6 shadow-soft backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Ask AI
              </p>
              <h1 className="font-heading text-3xl font-semibold text-text-main">
                Your private study chat
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Tell it what subject, what paper, and what command term you
                need.
              </p>
            </div>
            <button
              onClick={clearChat}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-main shadow-sm transition hover:bg-bg"
            >
              Clear chat
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <div
              ref={listRef}
              className="h-[60vh] overflow-y-auto rounded-2xl border border-border bg-bg p-4 sm:p-5"
            >
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-primary text-white"
                            : "bg-white text-text-main"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-text-muted shadow-sm">
                      Thinking…
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") send();
                }}
                placeholder="Ask something like: ‘Econ HL Paper 1 10-mark: how do I evaluate?’"
                className="h-12 flex-1 rounded-2xl border border-border bg-white px-4 text-sm text-text-main outline-none ring-0 placeholder:text-text-muted focus:border-primary/50"
              />
              <button
                onClick={send}
                disabled={!canSend}
                className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
