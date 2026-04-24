import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SmallCaps({
  children,
  className = "",
  tone = "muted",
  size = "md",
  as: As = "span",
}: {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "ink" | "gold";
  size?: "sm" | "md";
  as?: "span" | "p" | "div" | "h2";
}) {
  const color =
    tone === "gold"
      ? "text-[color:var(--color-gold)]"
      : tone === "ink"
        ? "text-[color:var(--color-ink)]"
        : "text-[color:var(--color-ink-muted)]";
  const sizeCls = size === "sm" ? "smallcaps-sm" : "smallcaps";
  return <As className={cn(sizeCls, color, className)}>{children}</As>;
}
