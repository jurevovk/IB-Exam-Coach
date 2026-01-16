"use client";

import Image from "next/image";
import Link from "next/link";

import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const { ready, user, profile } = useAuth();
  const isLoggedIn = ready && Boolean(user);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] shadow-[0_12px_30px_-18px_rgba(47,102,255,0.7)]">
            <Image
              src="/logo.png"
              alt="IB Exam Coach logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-[14px] object-cover"
              priority
            />
          </span>
          <span className="font-heading text-base font-semibold text-text-main">
            {APP_NAME}
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-text-muted md:flex">
          {NAV_LINKS.map((link) => {
            const resolvedHref =
              !isLoggedIn && link.requiresAuth ? "/login" : link.href;

            return (
              <Link
                key={link.label}
                href={resolvedHref}
                className="rounded-md px-1 transition-colors hover:text-text-main"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-3 py-2 text-sm text-text-main shadow-sm transition hover:-translate-y-[1px]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {profile?.name?.slice(0, 1).toUpperCase() ?? "U"}
              </span>
              <span className="hidden text-xs font-semibold sm:inline">
                Account
              </span>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ) : (
            <Button href="/login" className="px-5 py-3 shadow">
              Start Practicing
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
