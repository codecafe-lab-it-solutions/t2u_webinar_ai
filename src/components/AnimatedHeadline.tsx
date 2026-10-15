import type { CSSProperties } from "react";

export default function AnimatedHeadline({ lines, className, delay = 0 }: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  return (
    <h1 className={className}>
      {lines.map((line, index) => (
        <span key={index} className="reveal hero-headline-line text-gradient-animate block"
          style={{ "--reveal-delay": `${delay + index * 0.1}s` } as CSSProperties}>
          {line}{index < lines.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}
