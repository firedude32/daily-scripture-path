import { Link, useLocation } from "@tanstack/react-router";
import { Home, BarChart3, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function TabBar() {
  const loc = useLocation();
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{
        background: "color-mix(in oklab, var(--color-paper) 92%, transparent)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid var(--color-rule)",
      }}
    >
      <ul className="grid grid-cols-4 px-2 pt-2.5 pb-3">
        {tabs.map((t) => {
          const active = loc.pathname === t.to;
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 transition-colors",
                  active
                    ? "text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-muted)]",
                )}
              >
                <Icon size={20} strokeWidth={active ? 1.75 : 1.25} />
                <span
                  className="font-ui uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    fontWeight: 500,
                  }}
                >
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
