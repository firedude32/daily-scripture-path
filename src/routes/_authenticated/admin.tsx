import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { EditorialCard } from "@/components/ui-lectio/EditorialCard";
import {
  checkAdminAccess,
  getAdminOverview,
  getAdminUsers,
  getAdminReports,
  getRecentSessions,
  updateReportStatus,
  deleteReport,
  adminResetUserStreak,
  adminDeleteUserData,
} from "@/lib/admin.functions";
import { bookById, NT_ORDER } from "@/data/books";
import {
  adminTriggerBookCelebration,
  adminTriggerRankUp,
  adminTriggerSilverGoldUnlock,
  setPendingMilestone,
  setForceTodaysNoteVariant,
} from "@/state/store";
import { RANKS } from "@/data/ranks";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Lectio" }] }),
  component: AdminPage,
});

type Tab = "overview" | "users" | "reports" | "sessions" | "celebrations";


function AdminPage() {
  const check = useServerFn(checkAdminAccess);
  const [authed, setAuthed] = useState<null | boolean>(null);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    check()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, [check]);

  if (authed === null) {
    return (
      <PhoneFrame>
        <Screen>
          <div className="px-7 pt-20">
            <Loading />
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  if (!authed) {
    return (
      <PhoneFrame>
        <Screen>
          <div className="px-7 pt-20">
            <SmallCaps>Restricted</SmallCaps>
            <h1
              className="mt-3 font-display text-[color:var(--color-ink)]"
              style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.1 }}
            >
              Admin
            </h1>
            <p className="mt-4 font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 15 }}>
              Your account does not have admin access.
            </p>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-12 pb-10">
          <SmallCaps>Admin</SmallCaps>
          <h1
            className="mt-2 font-display text-[color:var(--color-ink)]"
            style={{ fontSize: 32, fontWeight: 400 }}
          >
            Control Room
          </h1>

          <div className="mt-5 flex gap-1.5 overflow-x-auto -mx-1 px-1">
            {(["overview", "celebrations", "reports", "users", "sessions"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5 whitespace-nowrap"
                style={{
                  background: tab === t ? "var(--color-ink)" : "transparent",
                  color: tab === t ? "var(--color-paper)" : "var(--color-ink-muted)",
                  border: "1px solid var(--color-rule)",
                  borderRadius: 999,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6"><Rule /></div>

          <div className="mt-6">
            {tab === "overview" && <OverviewTab />}
            {tab === "celebrations" && <CelebrationsTab />}
            {tab === "reports" && <ReportsTab />}
            {tab === "users" && <UsersTab />}
            {tab === "sessions" && <SessionsTab />}
          </div>

        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <EditorialCard padding="md">
      <div className="font-ui uppercase tracking-[0.16em] text-[10px] text-[color:var(--color-ink-muted)]">
        {label}
      </div>
      <div
        className="mt-2 font-display tabular text-[color:var(--color-ink)]"
        style={{ fontSize: 32, fontWeight: 300, lineHeight: 1 }}
      >
        {value}
      </div>
    </EditorialCard>
  );
}

function OverviewTab() {
  const fn = useServerFn(getAdminOverview);
  const [data, setData] = useState<Awaited<ReturnType<typeof fn>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fn()
      .then(setData)
      .finally(() => setLoading(false));
  }, [fn]);

  if (loading || !data) return <Loading />;
  const t = data.totals;
  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat label="Users" value={t.users} />
      <Stat label="Onboarded" value={t.onboarded} />
      <Stat label="Sessions" value={t.sessions} />
      <Stat label="Last 24h" value={t.sessionsLast24h} />
      <Stat label="Last 7 days" value={t.sessionsLast7} />
      <Stat label="Books Done" value={t.booksCompleted} />
      <div className="col-span-2">
        <Stat label="Open Reports" value={t.openReports} />
      </div>
    </div>
  );
}

function ReportsTab() {
  const fn = useServerFn(getAdminReports);
  const upd = useServerFn(updateReportStatus);
  const del = useServerFn(deleteReport);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "all" | "resolved">("open");

  async function refresh() {
    setLoading(true);
    const r = await fn();
    setReports(r.reports);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = reports.filter((r) =>
    filter === "all" ? true : r.status === filter,
  );

  if (loading) return <Loading />;
  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        {(["open", "resolved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5"
            style={{
              background: filter === f ? "var(--color-gold)" : "transparent",
              color: filter === f ? "var(--color-ink)" : "var(--color-ink-muted)",
              border: "1px solid var(--color-rule)",
              borderRadius: 999,
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="font-body text-[color:var(--color-ink-muted)]" style={{ fontSize: 14 }}>
          No reports.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {visible.map((r) => {
          const book = bookById(r.book_id);
          return (
            <EditorialCard key={r.id} padding="md">
              <div className="flex items-baseline justify-between gap-2">
                <SmallCaps tone="ink">
                  {book?.name ?? r.book_id} {r.chapter} · {r.reason}
                </SmallCaps>
                <span
                  className="font-ui text-[10px] uppercase tracking-wider"
                  style={{
                    color: r.status === "open" ? "var(--color-gold)" : "var(--color-ink-muted)",
                  }}
                >
                  {r.status}
                </span>
              </div>
              <p
                className="mt-2 font-body text-[color:var(--color-ink)]"
                style={{ fontSize: 14, lineHeight: 1.45 }}
              >
                {r.question}
              </p>
              {r.note && (
                <p
                  className="mt-2 font-body italic text-[color:var(--color-ink-soft)]"
                  style={{ fontSize: 13 }}
                >
                  "{r.note}"
                </p>
              )}
              <p
                className="mt-2 font-ui text-[10px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
              >
                {new Date(r.created_at).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                {r.status === "open" ? (
                  <button
                    onClick={async () => {
                      await upd({ data: { id: r.id, status: "resolved" } });
                      refresh();
                    }}
                    className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5"
                    style={{
                      border: "1px solid var(--color-rule)",
                      borderRadius: 999,
                      color: "var(--color-ink)",
                    }}
                  >
                    Resolve
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await upd({ data: { id: r.id, status: "open" } });
                      refresh();
                    }}
                    className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5"
                    style={{
                      border: "1px solid var(--color-rule)",
                      borderRadius: 999,
                      color: "var(--color-ink)",
                    }}
                  >
                    Reopen
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!confirm("Delete this report?")) return;
                    await del({ data: { id: r.id } });
                    refresh();
                  }}
                  className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5"
                  style={{
                    border: "1px solid var(--color-rule)",
                    borderRadius: 999,
                    color: "var(--color-ink-muted)",
                  }}
                >
                  Delete
                </button>
              </div>
            </EditorialCard>
          );
        })}
      </div>
    </div>
  );
}

function UsersTab() {
  const fn = useServerFn(getAdminUsers);
  const resetStreak = useServerFn(adminResetUserStreak);
  const deleteData = useServerFn(adminDeleteUserData);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function refresh() {
    setLoading(true);
    const r = await fn({ data: {} });
    setUsers(r.users);
    setLoading(false);
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;
  const visible = users.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.name ?? "").toLowerCase().includes(q) ||
      (u.username ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, username…"
        className="w-full p-2.5 mb-4 font-body outline-none"
        style={{
          fontSize: 14,
          border: "1px solid var(--color-rule)",
          borderRadius: 8,
          background: "transparent",
        }}
      />
      <p className="mb-3 font-ui text-[10px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
        {visible.length} of {users.length} users
      </p>
      <div className="flex flex-col gap-2">
        {visible.map((u) => (
          <EditorialCard key={u.id} padding="md">
            <div className="font-body text-[color:var(--color-ink)]" style={{ fontSize: 15 }}>
              {u.name || u.username || "Unnamed"}
            </div>
            <div className="font-ui text-[11px] text-[color:var(--color-ink-muted)] mt-0.5">
              {u.email}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-ui text-[11px] text-[color:var(--color-ink-soft)]">
              <span>XP {u.xp}</span>
              <span>Streak {u.current_streak}</span>
              <span>Best {u.longest_streak}</span>
              <span>Goal {u.daily_goal}</span>
              <span>{u.translation}</span>
              {!u.onboarded && <span style={{ color: "var(--color-gold)" }}>not onboarded</span>}
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={async () => {
                  if (!confirm(`Reset streak for ${u.email}?`)) return;
                  await resetStreak({ data: { userId: u.id } });
                  refresh();
                }}
                className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5"
                style={{ border: "1px solid var(--color-rule)", borderRadius: 999 }}
              >
                Reset Streak
              </button>
              <button
                onClick={async () => {
                  if (!confirm(`Wipe ALL reading data for ${u.email}? This cannot be undone.`)) return;
                  await deleteData({ data: { userId: u.id } });
                  refresh();
                }}
                className="font-ui uppercase tracking-[0.14em] text-[10px] px-3 py-1.5"
                style={{ border: "1px solid var(--color-rule)", borderRadius: 999, color: "#b14747" }}
              >
                Wipe Data
              </button>
            </div>
          </EditorialCard>
        ))}
      </div>
    </div>
  );
}

function SessionsTab() {
  const fn = useServerFn(getRecentSessions);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fn()
      .then((r) => setSessions(r.sessions))
      .finally(() => setLoading(false));
  }, [fn]);

  if (loading) return <Loading />;
  return (
    <div className="flex flex-col gap-2">
      {sessions.map((s) => {
        const book = bookById(s.book_id);
        return (
          <EditorialCard key={s.id} padding="md">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-body text-[color:var(--color-ink)]" style={{ fontSize: 14 }}>
                {book?.name ?? s.book_id} {s.chapter}
              </span>
              <span className="font-ui text-[10px] tabular text-[color:var(--color-ink-muted)]">
                {Math.round(s.duration_sec)}s · +{s.xp_earned} xp
              </span>
            </div>
            <div className="mt-1 font-ui text-[10px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
              {new Date(s.completed_at).toLocaleString()} · {s.user_id.slice(0, 8)}
            </div>
          </EditorialCard>
        );
      })}
    </div>
  );
}

function Loading() {
  return (
    <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
      Loading…
    </p>
  );
}
