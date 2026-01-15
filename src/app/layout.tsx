import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { AuthClientLayout } from "@/components/auth/AuthClientLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IB Exam Coach",
  description: "Examiner-style feedback to help IB students jump markbands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased">
        <AuthClientLayout>{children}</AuthClientLayout>
      </body>
    </html>
  );
}
