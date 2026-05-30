import { useEffect, useState } from "react";

/**
 * Calm skeleton block — parchment surface, hairline border, gentle 2s pulse.
 * No shimmer (clashes with Lectio's quiet aesthetic).
 */
export function Skeleton({
  className,
  style,
  pulse = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  pulse?: boolean;
}) {
  // Avoid SSR/client mismatch on the animation by mounting opacity client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div
      className={className}
      style={{
        background: "var(--color-paper-soft)",
        border: "1px solid var(--color-rule)",
        borderRadius: 12,
        opacity: pulse && mounted ? undefined : 0.5,
        animation: pulse && mounted ? "lectio-skeleton-pulse 2s ease-in-out infinite" : undefined,
        ...style,
      }}
    />
  );
}

export function SkeletonText({
  width = "100%",
  height = 12,
  className,
  style,
}: {
  width?: number | string;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Skeleton
      className={className}
      style={{
        width,
        height,
        borderRadius: 4,
        border: "none",
        background: "var(--color-rule)",
        ...style,
      }}
    />
  );
}
