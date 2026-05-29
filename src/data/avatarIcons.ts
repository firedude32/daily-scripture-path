import {
  Cross,
  Bird,
  Wheat,
  Leaf,
  Flame,
  Lamp,
  Fish,
  BookOpen,
  Crown,
  Mountain,
  type LucideIcon,
} from "lucide-react";

export type AvatarIconKey =
  | "cross"
  | "dove"
  | "wheat"
  | "olive"
  | "flame"
  | "lamp"
  | "fish"
  | "scripture"
  | "crown"
  | "mountain";

export const AVATAR_ICONS: { key: AvatarIconKey; label: string; Icon: LucideIcon }[] = [
  { key: "cross", label: "Cross", Icon: Cross },
  { key: "dove", label: "Dove", Icon: Bird },
  { key: "wheat", label: "Wheat", Icon: Wheat },
  { key: "olive", label: "Olive Branch", Icon: Leaf },
  { key: "flame", label: "Flame", Icon: Flame },
  { key: "lamp", label: "Lamp", Icon: Lamp },
  { key: "fish", label: "Fish", Icon: Fish },
  { key: "scripture", label: "Scripture", Icon: BookOpen },
  { key: "crown", label: "Crown", Icon: Crown },
  { key: "mountain", label: "Mountain", Icon: Mountain },
];

export function avatarIconByKey(key: string | null | undefined) {
  if (!key) return null;
  return AVATAR_ICONS.find((i) => i.key === key) ?? null;
}
