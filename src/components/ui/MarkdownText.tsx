import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type MarkdownTextProps = {
  content: string;
  className?: string;
};

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index): ReactNode => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
};

export function MarkdownText({ content, className }: MarkdownTextProps) {
  const normalized = content.replace(/\r/g, "").trim();

  if (!normalized) {
    return null;
  }

  const blocks = normalized.split(/\n{2,}/).map((block) => block.trim());

  return (
    <div className={cn("space-y-2", className)}>
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line));

        if (lines.length > 0 && bulletLines.length === lines.length) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {bulletLines.map((line, lineIndex) => (
                <li key={`${blockIndex}-${lineIndex}`}>
                  {renderInline(line.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={`${blockIndex}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
