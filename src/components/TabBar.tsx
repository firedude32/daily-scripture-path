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
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-4 px-2 pt-2 pb-3">
        {tabs.map((t) => {
          const active = loc.pathname === t.to;
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
                <span className="text-[10px] font-medium tracking-wide uppercase">
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
