import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AuthClientLayout } from "@/components/auth/AuthClientLayout";
import "./globals.css";

const themeInitScript = `
(() => {
  try {
    const raw = localStorage.getItem("ibec:preferences");
    const legacyTheme = localStorage.getItem("ibec_theme_v1");
    const parsed = raw ? JSON.parse(raw) : {};
    const themePreference = parsed.theme || (legacyTheme ? JSON.parse(legacyTheme) : "system");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.dataset.theme = themePreference === "system" ? (systemDark ? "dark" : "light") : themePreference;
    document.documentElement.dataset.themePreference = themePreference;
    document.documentElement.dataset.reduceMotion = systemReduceMotion ? "true" : "false";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export const metadata: Metadata = {
  title: "Exam Coach",
  description: "Examiner-style feedback to help IB students jump markbands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AuthClientLayout>
          {children}
          <Analytics />
        </AuthClientLayout>
      </body>
    </html>
  );
}
