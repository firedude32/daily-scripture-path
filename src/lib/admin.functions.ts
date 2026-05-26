import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PASSWORD = "admin123";

function checkPassword(password: string) {
  if (password !== ADMIN_PASSWORD) {
    throw new Error("Invalid admin password");
  }
}

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true };
  });

export const getAdminOverview = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);

    const since7 = new Date(Date.now() - 7 * 86400_000).toISOString();
    const since1 = new Date(Date.now() - 86400_000).toISOString();

    const [
      profilesCount,
      sessionsCount,
      sessions7,
      sessions1,
      reportsOpen,
      onboardedAgg,
      booksAgg,
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("reading_sessions").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("reading_sessions").select("*", { count: "exact", head: true }).gte("completed_at", since7),
      supabaseAdmin.from("reading_sessions").select("*", { count: "exact", head: true }).gte("completed_at", since1),
      supabaseAdmin.from("quiz_reports").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("onboarded", true),
      supabaseAdmin.from("book_progress").select("*", { count: "exact", head: true }).gte("read_throughs", 1),
    ]);

    return {
      totals: {
        users: profilesCount.count ?? 0,
        onboarded: onboardedAgg.count ?? 0,
        sessions: sessionsCount.count ?? 0,
        sessionsLast7: sessions7.count ?? 0,
        sessionsLast24h: sessions1.count ?? 0,
        booksCompleted: booksAgg.count ?? 0,
        openReports: reportsOpen.count ?? 0,
      },
    };
  });

export const getAdminUsers = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const limit = Math.min(data.limit ?? 100, 500);
    const { data: rows, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, name, username, current_streak, longest_streak, xp, daily_goal, translation, onboarded, last_read_date, created_at")
      .order("xp", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return { users: rows ?? [] };
  });

export const getAdminReports = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("quiz_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { reports: rows ?? [] };
  });

export const updateReportStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; id: string; status: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin
      .from("quiz_reports")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteReport = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; id: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin.from("quiz_reports").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getRecentSessions = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("reading_sessions")
      .select("id, user_id, book_id, chapter, duration_sec, xp_earned, completed_at")
      .order("completed_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { sessions: rows ?? [] };
  });

export const adminResetUserStreak = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; userId: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ current_streak: 0, longest_streak: 0 })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteUserData = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; userId: string }) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const uid = data.userId;
    await supabaseAdmin.from("reading_sessions").delete().eq("user_id", uid);
    await supabaseAdmin.from("book_progress").delete().eq("user_id", uid);
    await supabaseAdmin.from("favorites").delete().eq("user_id", uid);
    await supabaseAdmin.from("profiles").update({
      current_streak: 0,
      longest_streak: 0,
      xp: 0,
      last_read_date: null,
      onboarded: false,
      silver_gold_unlocked: false,
      silver_gold_acknowledged: false,
    }).eq("id", uid);
    return { ok: true };
  });
