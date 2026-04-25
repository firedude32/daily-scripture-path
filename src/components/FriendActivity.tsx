import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flame, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/state/store";
import { listFriendships, type FriendProfile } from "@/lib/friends";
import { bookById } from "@/data/books";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";

type Activity = {
  friend: FriendProfile;
  lastSession?: {
    bookId: string;
    chapter: number;
    completedAt: number;
  };
};

function timeAgo(epoch: number): string {
  const mins = Math.round((Date.now() - epoch) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.round(days / 7)}w ago`;
}

export function FriendActivity() {
  const { userId } = useAppState();
  const [items, setItems] = useState<Activity[] | null>(null);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      try {
        const rows = await listFriendships(userId);
        const accepted = rows.filter((r) => r.friendship.status === "accepted");
        if (accepted.length === 0) {
          if (alive) setItems([]);
          return;
        }
        const ids = accepted.map((r) => r.other.id);
        // Friends' RLS won't let us read their sessions; show streak/XP only.
        // (Reading sessions are private; surface the friend + streak instead.)
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name, username, email, current_streak, xp, last_read_date")
          .in("id", ids);

        const byId: Record<string, Activity> = {};
        for (const r of accepted) {
          byId[r.other.id] = { friend: r.other };
        }
        for (const p of profiles ?? []) {
          if (!byId[p.id]) continue;
          byId[p.id].friend = {
            ...byId[p.id].friend,
            current_streak: p.current_streak ?? 0,
            xp: p.xp ?? 0,
          } as FriendProfile;
          if (p.last_read_date) {
            byId[p.id].lastSession = {
              bookId: "",
              chapter: 0,
              completedAt: new Date(p.last_read_date).getTime(),
            };
          }
        }
        const sorted = Object.values(byId).sort((a, b) => {
          const ta = a.lastSession?.completedAt ?? 0;
          const tb = b.lastSession?.completedAt ?? 0;
          return tb - ta;
        });
        if (alive) setItems(sorted.slice(0, 4));
      } catch (e) {
        console.error(e);
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  if (items === null) return null; // initial: render nothing (no flash)
  if (items.length === 0) return null; // no friends yet — keep Home quiet

  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between mb-4">
        <SmallCaps>Friends Reading</SmallCaps>
        <Link
          to="/friends"
          className="font-ui uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
          style={{ fontSize: 10 }}
        >
          See all
        </Link>
      </div>
      <Link to="/friends" className="block">
        <div>
          {items.map((a, i) => (
            <div
              key={a.friend.id}
              className="flex items-center gap-3 py-3"
              style={{ borderTop: i === 0 ? "1px solid var(--color-rule)" : "1px solid var(--color-rule)" }}
            >
              <div
                className="flex items-center justify-center rounded-full font-display"
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--color-paper-soft)",
                  color: "var(--color-ink)",
                  fontSize: 14,
                  border: "1px solid var(--color-rule)",
                }}
              >
                {(a.friend.name?.[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-[color:var(--color-ink)] truncate" style={{ fontSize: 15 }}>
                  {a.friend.name}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[color:var(--color-ink-muted)]" style={{ fontSize: 12 }}>
                  <span className="flex items-center gap-1">
                    <Flame size={11} strokeWidth={1.5} />
                    <span className="tabular">{a.friend.current_streak}d</span>
                  </span>
                  {a.lastSession && a.lastSession.completedAt > 0 && (
                    <span className="tabular">read {timeAgo(a.lastSession.completedAt)}</span>
                  )}
                </div>
              </div>
              <ChevronRight size={14} strokeWidth={1.5} className="text-[color:var(--color-ink-muted)]" />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}

// Suppress unused warning for `bookById` – kept for future when sessions are exposed
void bookById;
