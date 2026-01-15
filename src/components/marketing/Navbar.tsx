"use client";

import Image from "next/image";
import Link from "next/link";

import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const { ready, user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between gap-6">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-[16px] shadow-[0_12px_30px_-18px_rgba(47,102,255,0.7)]">
          <Image
            src="/logo.png"
            alt="IB Exam Coach logo"
            width={56}
            height={56}
            className="h-14 w-14 rounded-[16px] object-cover"
            priority
          />
        </span>
        <span className="font-heading text-base font-semibold text-text-main">
          {APP_NAME}
        </span>
      </Link>

      <div className="hidden items-center gap-7 text-sm font-medium text-text-muted md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-md px-1 transition-colors hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {!ready ? null : user ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-text-muted transition-colors hover:text-text-main"
            >
              Dashboard
            </Link>
            <Button
              className="px-4 py-2 text-xs sm:px-5 sm:py-3 sm:text-sm"
              variant="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            href="/login"
            className="px-4 py-2 text-xs shadow sm:px-5 sm:py-3 sm:text-sm"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
