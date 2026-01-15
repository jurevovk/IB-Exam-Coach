import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type IconName =
  | "check"
  | "checkCircle"
  | "x"
  | "flame"
  | "clock"
  | "chart";

type IconProps = HTMLAttributes<SVGElement> & {
  name: IconName;
  size?: number;
  title?: string;
};

export function Icon({ name, size = 18, title, className, ...props }: IconProps) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": title ? undefined : true,
    className: cn("shrink-0", className),
    ...props,
  };

  if (name === "check") {
    return (
      <svg {...shared}>
        {title ? <title>{title}</title> : null}
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }

  if (name === "checkCircle") {
    return (
      <svg {...shared}>
        {title ? <title>{title}</title> : null}
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...shared}>
        {title ? <title>{title}</title> : null}
        <path d="M6 6l12 12" />
        <path d="M18 6l-12 12" />
      </svg>
    );
  }

  if (name === "flame") {
    return (
      <svg {...shared}>
        {title ? <title>{title}</title> : null}
        <path d="M12 3c2 3 1 5 0 6 2-1 4-3 4-6 3 3 4 8 1 12-2 3-8 4-11 1-3-3-2-8 1-11 0 3 2 4 5 5-1-2-1-4 0-7z" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...shared}>
        {title ? <title>{title}</title> : null}
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      {title ? <title>{title}</title> : null}
      <path d="M4 19h16" />
      <path d="M6 17V9" />
      <path d="M12 17V5" />
      <path d="M18 17v-7" />
    </svg>
  );
}
