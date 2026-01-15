
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F7FB",
        glowFrom: "#EAF1FF",
        card: "#FFFFFF",
        border: "#E6EAF2",
        text: {
          main: "#0B1220",
          secondary: "#445064",
          muted: "#7C879B",
        },
        primary: {
          DEFAULT: "#2F66FF",
          hover: "#2456D9",
        },
        report: {
          top: "#0B2A59",
          bottom: "#071A3A",
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
          "radial-gradient(1200px circle at top, #EAF1FF 0%, #F5F7FB 60%)",
        report: "linear-gradient(180deg, #0B2A59 0%, #071A3A 100%)",
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
