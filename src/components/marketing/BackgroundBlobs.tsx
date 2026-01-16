"use client";

export function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-28 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,241,255,0.35),rgba(234,241,255,0)_70%)] opacity-70 blur-[140px] motion-safe:animate-blob-1" />
      <div className="absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,241,255,0.3),rgba(234,241,255,0)_70%)] opacity-60 blur-[120px] motion-safe:animate-blob-2" />
      <div className="absolute bottom-[-220px] left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(234,241,255,0.28),rgba(234,241,255,0)_70%)] opacity-70 blur-[160px] motion-safe:animate-blob-3" />
    </div>
  );
}
