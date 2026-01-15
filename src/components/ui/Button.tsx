import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps =
  | (BaseProps &
      ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (BaseProps &
      AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_18px_40px_-26px_rgba(47,102,255,0.7)] hover:-translate-y-[1px] hover:bg-primary-hover active:translate-y-[1px] active:bg-primary-hover",
  secondary:
    "border border-border/70 bg-white/70 text-text-main shadow-sm hover:-translate-y-[1px] hover:border-border hover:bg-white active:translate-y-[1px]",
  ghost:
    "text-text-secondary hover:-translate-y-[1px] hover:bg-white/70 hover:text-text-main active:translate-y-[1px]",
};

export function Button({
  variant = "primary",
  className,
  href,
  ...props
}: ButtonProps) {
  const styles = cn(baseStyles, variants[variant], className);

  if (href) {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <Link className={styles} href={href} {...linkProps}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  const { type, ...rest } = buttonProps;

  return (
    <button className={styles} type={type ?? "button"} {...rest}>
      {props.children}
    </button>
  );
}
