/**
 * Lectio motifs — flat-gold Lucide icons. One per screen at most.
 * The same `dailyMotif` and `bookMotif` selectors keep working.
 */
import {
  Leaf,
  Wheat,
  Cookie,
  Bookmark,
  Fish,
  Bird,
  DoorOpen,
  Award,
  Lamp,
  type LucideIcon,
} from "lucide-react";

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

const ICON_MAP: Record<MotifName, LucideIcon> = {
  olive: Leaf,
  wheat: Wheat,
  loaf: Cookie,
  bookmark: Bookmark,
  fish: Fish,
  dove: Bird,
  gate: DoorOpen,
  laurel: Award,
  sheaf: Wheat,
  lamp: Lamp,
};

interface Props {
  name: MotifName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function GoldMotif({
  name,
  size = 32,
  className = "",
  strokeWidth = 1.25,
}: Props) {
  const Icon = ICON_MAP[name];
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={{ color: "var(--color-gold)" }}
      aria-hidden
    />
  );
}

const ROTATION: MotifName[] = [
  "olive",
  "wheat",
  "loaf",
  "bookmark",
  "fish",
  "dove",
  "lamp",
];

/** Pick a motif for "today" so Home rotates daily. */
export function dailyMotif(d = new Date()): MotifName {
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return ROTATION[dayOfYear % ROTATION.length];
}

/** Pick a celebration motif for a book id. Stable per book. */
export function bookMotif(bookId: string): MotifName {
  const celebrationSet: MotifName[] = [
    "gate",
    "laurel",
    "sheaf",
    "olive",
    "loaf",
    "wheat",
    "dove",
    "lamp",
  ];
  let h = 0;
  for (let i = 0; i < bookId.length; i++)
    h = (h * 31 + bookId.charCodeAt(i)) >>> 0;
  return celebrationSet[h % celebrationSet.length];
}
