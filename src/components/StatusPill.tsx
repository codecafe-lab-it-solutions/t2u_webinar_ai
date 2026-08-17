import type { ReactNode } from "react";

const tones = {
  error: "text-error border-error/30 bg-error/10",
  warning: "text-warning border-warning/30 bg-warning/10",
  success: "text-success border-success/30 bg-success/10",
  info: "text-info border-info/30 bg-info/10",
} as const;

export default function StatusPill({
  tone,
  children,
  className = "",
}: {
  tone: keyof typeof tones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] ${tones[tone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
