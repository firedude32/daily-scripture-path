/**
 * Hand-drawn flat-gold line motifs. Loose ink-sketch feel, never photographic,
 * never cartoon. One motif per screen at most. Stroke = Gold, no fill.
 */

export type MotifName =
  | "olive"
  | "wheat"
  | "loaf"
  | "bookmark"
  | "fish"
  | "dove"
  | "gate"
  | "laurel"
  | "sheaf"
  | "lamp";

interface Props {
  name: MotifName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const STROKE = "var(--color-gold)";

export function GoldMotif({ name, size = 48, className = "", strokeWidth = 1.25 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: STROKE,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "olive":
      return (
        <svg {...common}>
          <path d="M10 50 Q 32 14 54 50" />
          <ellipse cx="20" cy="34" rx="5" ry="2.5" transform="rotate(-30 20 34)" />
          <ellipse cx="28" cy="26" rx="5" ry="2.5" transform="rotate(-18 28 26)" />
          <ellipse cx="36" cy="24" rx="5" ry="2.5" transform="rotate(10 36 24)" />
          <ellipse cx="44" cy="30" rx="5" ry="2.5" transform="rotate(28 44 30)" />
          <circle cx="32" cy="20" r="1.6" />
          <circle cx="40" cy="34" r="1.6" />
          <circle cx="24" cy="40" r="1.6" />
        </svg>
      );
    case "wheat":
      return (
        <svg {...common}>
          <path d="M32 6 L 32 58" />
          <path d="M32 14 Q 22 18 24 26 Q 32 22 32 22" />
          <path d="M32 14 Q 42 18 40 26 Q 32 22 32 22" />
          <path d="M32 24 Q 22 28 24 36 Q 32 32 32 32" />
          <path d="M32 24 Q 42 28 40 36 Q 32 32 32 32" />
          <path d="M32 34 Q 22 38 24 46 Q 32 42 32 42" />
          <path d="M32 34 Q 42 38 40 46 Q 32 42 32 42" />
        </svg>
      );
    case "loaf":
      return (
        <svg {...common}>
          <path d="M10 38 Q 10 24 22 22 Q 32 14 42 22 Q 54 24 54 38 Q 54 48 44 50 L 20 50 Q 10 48 10 38 Z" />
          <path d="M22 26 L 24 34" />
          <path d="M30 22 L 30 32" />
          <path d="M38 24 L 38 34" />
          <path d="M46 28 L 44 36" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path d="M18 8 L 46 8 L 46 56 L 32 46 L 18 56 Z" />
          <path d="M24 20 L 40 20" />
          <path d="M24 28 L 40 28" />
        </svg>
      );
    case "fish":
      return (
        <svg {...common}>
          <path d="M8 32 Q 22 14 40 22 Q 54 28 54 32 Q 54 36 40 42 Q 22 50 8 32 Z" />
          <path d="M50 32 L 60 22 L 60 42 Z" />
          <circle cx="20" cy="30" r="1.5" />
        </svg>
      );
    case "dove":
      return (
        <svg {...common}>
          <path d="M14 36 Q 22 22 36 24 Q 48 26 54 18 Q 50 32 40 36 L 26 38 Q 18 40 14 36 Z" />
          <path d="M36 38 L 44 50 L 32 46 Z" />
          <circle cx="50" cy="22" r="1.2" />
        </svg>
      );
    case "gate":
      return (
        <svg {...common}>
          <path d="M14 56 L 14 30 Q 14 16 32 16 Q 50 16 50 30 L 50 56" />
          <path d="M14 30 L 50 30" />
          <path d="M32 16 L 32 56" />
          <path d="M22 30 L 22 56" />
          <path d="M42 30 L 42 56" />
        </svg>
      );
    case "laurel":
      return (
        <svg {...common}>
          <path d="M14 54 Q 14 22 32 12" />
          <path d="M50 54 Q 50 22 32 12" />
          <ellipse cx="18" cy="42" rx="4" ry="2" transform="rotate(-30 18 42)" />
          <ellipse cx="18" cy="32" rx="4" ry="2" transform="rotate(-50 18 32)" />
          <ellipse cx="22" cy="22" rx="4" ry="2" transform="rotate(-65 22 22)" />
          <ellipse cx="46" cy="42" rx="4" ry="2" transform="rotate(30 46 42)" />
          <ellipse cx="46" cy="32" rx="4" ry="2" transform="rotate(50 46 32)" />
          <ellipse cx="42" cy="22" rx="4" ry="2" transform="rotate(65 42 22)" />
        </svg>
      );
    case "sheaf":
      return (
        <svg {...common}>
          <path d="M22 8 L 28 50" />
          <path d="M32 6 L 32 52" />
          <path d="M42 8 L 36 50" />
          <path d="M14 38 L 50 38" />
          <path d="M16 44 L 48 44" />
          <path d="M22 8 Q 26 14 22 18" />
          <path d="M32 6 Q 36 12 32 16" />
          <path d="M42 8 Q 46 14 42 18" />
        </svg>
      );
    case "lamp":
      return (
        <svg {...common}>
          <path d="M14 40 Q 14 30 24 28 L 44 28 Q 54 30 54 40 Q 54 48 44 48 L 24 48 Q 14 48 14 40 Z" />
          <path d="M44 36 L 56 32 L 56 44 L 44 40 Z" />
          <path d="M56 32 Q 60 28 60 24" />
        </svg>
      );
  }
}

const ROTATION: MotifName[] = ["olive", "wheat", "loaf", "bookmark", "fish", "dove", "lamp"];

/** Pick a motif for "today" so Home rotates daily. */
export function dailyMotif(d = new Date()): MotifName {
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return ROTATION[dayOfYear % ROTATION.length];
}

/** Pick a celebration motif for a book id. Stable per book. */
export function bookMotif(bookId: string): MotifName {
  const celebrationSet: MotifName[] = ["gate", "laurel", "sheaf", "olive", "loaf", "wheat", "dove", "lamp"];
  let h = 0;
  for (let i = 0; i < bookId.length; i++) h = (h * 31 + bookId.charCodeAt(i)) >>> 0;
  return celebrationSet[h % celebrationSet.length];
}
