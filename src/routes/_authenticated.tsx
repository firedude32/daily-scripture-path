import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useHydrateStore, useAppState } from "@/state/store";

// TEMPORARY: dev auto-signin so the agent can walk through the preview
// without a real login. Remove this block when done.
async function devAutoSignIn() {
  const email = "dev-walkthrough@lectio.test";
  const password = "DevWalkthrough!2026";
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: "Dev Walkthrough" } },
    });
  }
}

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    let { data } = await supabase.auth.getSession();
    if (!data.session) {
      await devAutoSignIn();
      ({ data } = await supabase.auth.getSession());
    }
    if (!data.session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  useHydrateStore();
  const { hydrated } = useAppState();
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-paper)" }}>
        <div className="font-ui text-[12px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">Loading…</div>
      </div>
    );
  }
  return <Outlet />;
}
