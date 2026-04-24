import { motion } from "framer-motion";

/**
 * Placeholder Lectio mascot — a small flat-Gold line-art lamb.
 * Used in onboarding only. Designed to be swapped for the real mascot later.
 */
export function Mascot({ size = 96 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {/* Wool body */}
      <path d="M18 60 Q 14 48 22 42 Q 18 32 28 30 Q 30 22 40 24 Q 46 18 56 22 Q 66 22 68 30 Q 78 32 76 42 Q 84 48 78 60 Q 78 70 68 70 L 28 70 Q 18 70 18 60 Z" />
      {/* Face */}
      <ellipse cx="48" cy="44" rx="10" ry="11" />
      {/* Eyes */}
      <circle cx="44" cy="42" r="0.8" fill="var(--color-gold)" />
      <circle cx="52" cy="42" r="0.8" fill="var(--color-gold)" />
      {/* Mouth */}
      <path d="M45 49 Q 48 51 51 49" />
      {/* Ears */}
      <path d="M40 36 Q 36 32 38 28" />
      <path d="M56 36 Q 60 32 58 28" />
      {/* Legs */}
      <path d="M30 70 L 30 78" />
      <path d="M40 70 L 40 80" />
      <path d="M56 70 L 56 80" />
      <path d="M66 70 L 66 78" />
    </motion.svg>
  );
}
