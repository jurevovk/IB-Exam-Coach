"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { MarkdownText } from "@/components/ui/MarkdownText";
import type { ChatMessage } from "@/lib/ai/types";
import { getPlanSignals } from "@/lib/learn/insights";
import { getWeaknessDisplayLabel } from "@/lib/weaknesses";

const STORAGE_KEY = "ibec_ask_ai_chat_v1";
const DRAFT_KEY = "ibec:askAiDraft";

const getInitialDraft = () => {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const draft = window.localStorage.getItem(DRAFT_KEY) ?? "";
    window.localStorage.removeItem(DRAFT_KEY);
    return draft;
  } catch {
    return "";
  }
};

export default function AskAIPage() {
  const { profile } = useAuth();
  const planSignals = useMemo(() => getPlanSignals(), []);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey 👋 I’m your Exam Coach AI. Tell me your subject + what you’re stuck on, and I’ll help.",
    },
  ]);
  const [input, setInput] = useState(() => getInitialDraft());
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
  const quickPrompts = useMemo(() => {
    const subject = profile?.subjects[0];
    const pinned = planSignals.pinnedTopics[0];
    const weakness = planSignals.weaknessTags[0];
    const prompts = [
      subject
        ? `Make me a 20-minute study plan for IB ${subject.name} ${subject.level.toUpperCase()} today.`
        : "Make me a 20-minute IB study plan for today.",
      pinned
        ? `Explain ${pinned.subtopicTitle} for IB ${pinned.subjectName} ${pinned.level.toUpperCase()} with one exam-style example.`
        : "Explain one difficult topic using simple steps and an exam-style example.",
      weakness
        ? `Help me fix this weakness: ${getWeaknessDisplayLabel(weakness.label)}. Give me a checklist and one practice prompt.`
        : "Give me a checklist for writing stronger evaluation in IB answers.",
    ];

    return Array.from(new Set(prompts));
  }, [planSignals, profile]);

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
        <div className="rounded-[28px] border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8">
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
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-text-main shadow-sm transition hover:bg-bg"
            >
              Clear chat
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Starter actions
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-primary/25 hover:text-text-main"
                  >
                    {prompt.length > 72 ? `${prompt.slice(0, 69)}...` : prompt}
                  </button>
                ))}
              </div>
            </div>

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
                            : "bg-card text-text-main"
                        }`}
                      >
                        {isUser ? (
                          <span className="whitespace-pre-wrap">
                            {message.content}
                          </span>
                        ) : (
                          <MarkdownText content={message.content} />
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-card px-4 py-3 text-sm text-text-muted shadow-sm">
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
                className="h-12 flex-1 rounded-2xl border border-border bg-card px-4 text-sm text-text-main outline-none ring-0 placeholder:text-text-muted focus:border-primary/50"
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
