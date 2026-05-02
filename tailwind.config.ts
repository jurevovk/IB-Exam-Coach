
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        glowFrom: "rgb(var(--color-glow-from) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: {
          main: "rgb(var(--color-text-main) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
        },
        report: {
          top: "rgb(var(--color-report-top) / <alpha-value>)",
          bottom: "rgb(var(--color-report-bottom) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "0 40px 120px -70px rgba(15, 23, 42, 0.45)",
        card: "0 24px 80px -55px rgba(15, 23, 42, 0.4)",
      },
      borderRadius: {
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      backgroundImage: {
        glow:
          "radial-gradient(1200px circle at top, rgb(var(--color-glow-from)) 0%, rgb(var(--color-bg)) 60%)",
        report:
          "linear-gradient(180deg, rgb(var(--color-report-top)) 0%, rgb(var(--color-report-bottom)) 100%)",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
