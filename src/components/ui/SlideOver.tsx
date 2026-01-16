"use client";

import { useEffect } from "react";

type SlideOverProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute right-0 top-0 flex h-full w-full max-w-md"
      >
        <div className="relative ml-auto flex h-full w-full flex-col rounded-l-2xl border border-border bg-white/90 shadow-card">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <h2 className="text-sm font-semibold text-text-main">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border/60 bg-white/80 px-2 py-1 text-xs font-semibold text-text-muted transition hover:text-text-main"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
