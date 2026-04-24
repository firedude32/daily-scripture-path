import { cn } from "@/lib/utils";

export function Rule({
  className = "",
  tone = "rule",
  vertical = false,
}: {
  className?: string;
  tone?: "rule" | "ink" | "gold";
  vertical?: boolean;
}) {
  const color =
    tone === "gold"
      ? "var(--color-gold)"
      : tone === "ink"
        ? "var(--color-ink)"
        : "var(--color-rule)";
  return (
    <div
      className={cn(vertical ? "h-full w-px" : "w-full h-px", className)}
      style={{ background: color }}
      role="separator"
    />
  );
}
