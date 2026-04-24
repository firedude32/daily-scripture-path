import { motion } from "framer-motion";

/**
 * 2px Gold line on a Rule track. Optional small numerals at the ends:
 * `4 ——————— 4 / 16`. Animates fill width on mount.
 */
export function HairlineProgress({
  value,
  max,
  showCaps = true,
  animated = true,
  delay = 0,
  height = 2,
}: {
  value: number;
  max: number;
  showCaps?: boolean;
  animated?: boolean;
  delay?: number;
  height?: number;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        {showCaps && (
          <span className="font-ui text-[11px] tabular text-[color:var(--color-ink)] tracking-wider">
            {value}
          </span>
        )}
        <div
          className="flex-1 relative"
          style={{ background: "var(--color-rule)", height }}
        >
          <motion.div
            initial={{ width: animated ? 0 : `${pct}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay }}
            className="absolute inset-y-0 left-0"
            style={{ background: "var(--color-gold)" }}
          />
        </div>
        {showCaps && (
          <span className="font-ui text-[11px] tabular text-[color:var(--color-ink-muted)] tracking-wider">
            {value} / {max}
          </span>
        )}
      </div>
    </div>
  );
}
