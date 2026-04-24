// Centralized motion vocabulary for Lectio.
// Default 250–350ms ease-out. Springs reserved for celebrations.

import type { Variants, Transition } from "framer-motion";

export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Slow horizontal page-turn — onboarding transitions, entering Active Reading. */
export const pageTurn: Variants = {
  initial: { opacity: 0, x: 24, skewY: 0.4 },
  animate: { opacity: 1, x: 0, skewY: 0 },
  exit: { opacity: 0, x: -24, skewY: -0.4 },
};

export const pageTurnTransition: Transition = {
  duration: 0.45,
  ease: EASE_OUT,
};

/** Fade + 8px up; use with custom delay (`0.08 * i`) for staggered rows. */
export const staggerUp = (i = 0) =>
  ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: i * 0.08, ease: EASE_OUT },
  }) as const;

/** Breathing dot — opacity 40%↔100% over 2s, repeats forever. */
export const breath = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
};

/** Per-letter cascade for rank-name reveal. 60ms per character. */
export function letterReveal(text: string) {
  return text.split("").map((ch, i) => ({
    char: ch === " " ? "\u00A0" : ch,
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.4 + i * 0.06, ease: EASE_OUT },
  }));
}

/** Slow, considered fade for celebration entrances. */
export const celebrationFade: Transition = { duration: 0.7, ease: EASE_OUT };
