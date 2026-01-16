import Link from "next/link";

import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/70 py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 text-center text-sm text-text-muted sm:flex-row sm:text-left">
          <div>
            <p className="font-semibold text-text-main">IB Exam Coach</p>
            <p className="mt-1 text-xs">
              Not affiliated with International Baccalaureate®.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-text-muted">
            <Link href="/pricing" className="hover:text-text-main">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-text-main">
              Login
            </Link>
            <Link href="/signup" className="hover:text-text-main">
              Sign Up
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
