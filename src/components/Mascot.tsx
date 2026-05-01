import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

/**
 * Lectio's onboarding mark — a calm sprout in flat gold. Used on the
 * onboarding intro screen only. Gentle bob to feel alive.
 */
export function Mascot({ size = 96 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
      style={{ display: "inline-block", color: "var(--color-gold)" }}
    >
      <Sprout size={size} strokeWidth={1.25} />
    </motion.div>
  );
}
