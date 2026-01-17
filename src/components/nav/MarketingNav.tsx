"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { APP_NAME } from "@/lib/constants";

const navLinks = [
  { label: "Subjects", href: "/subjects" },
  { label: "Pricing", href: "/pricing" },
  { label: "Grade Work", href: "/grade-work" },
  { label: "Ask AI", href: "/ask-ai-preview" },
];

export function MarketingNav() {
  const { ready, user } = useAuth();
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
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-1 transition-colors hover:text-text-main"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button href="/dashboard" variant="secondary" className="px-5 py-3">
              Dashboard
            </Button>
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
