import type { LucideIcon } from "lucide-react";

const TONES = {
  accent: "border-brand-accent/30 bg-brand-accent/10 text-brand-accent",
  primary: "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
  error: "border-error/30 bg-error/10 text-error",
  success: "border-success/30 bg-success/10 text-success",
} as const;

export default function IconBadge({
  icon: Icon,
  tone = "accent",
  size = "md",
  className = "",
}: {
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? 15 : 18;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border ${box} ${TONES[tone]} ${className}`}
    >
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  );
}
