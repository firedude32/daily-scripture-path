import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: search.redirect });
  },
  head: () => ({ meta: [{ title: "Sign in — Lectio" }] }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError(error.message);
    navigate({ to: search.redirect });
  }

  async function oauth(provider: "google" | "apple") {
    setError(null);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message ?? "Sign-in failed.");
  }

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-6 pt-12 pb-10">
          <SmallCaps>Lectio</SmallCaps>
          <h1 className="mt-3 font-display text-3xl text-[color:var(--color-ink)]">Welcome back.</h1>
          <p className="mt-2 text-sm text-[color:var(--color-ink-muted)]">Sign in to continue your reading.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[12px] border border-[color:var(--color-ink)]/15 bg-transparent px-4 py-3 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-ink)]"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[12px] border border-[color:var(--color-ink)]/15 bg-transparent px-4 py-3 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-ink)]"
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <EditorialButton type="submit" disabled={busy} fullWidth>
              {busy ? "Signing in…" : "Sign In"}
            </EditorialButton>
          </form>

          <div className="mt-3 text-right">
            <Link to="/reset-password" className="font-ui text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
              Forgot password?
            </Link>
          </div>

          <div className="my-8"><Rule /></div>

          <div className="space-y-3">
            <button
              onClick={() => oauth("google")}
              className="w-full rounded-[12px] border border-[color:var(--color-ink)]/20 px-4 py-3 font-ui text-[13px] uppercase tracking-[0.14em] text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)]/5"
            >
              Continue with Google
            </button>
            <button
              onClick={() => oauth("apple")}
              className="w-full rounded-[12px] border border-[color:var(--color-ink)]/20 px-4 py-3 font-ui text-[13px] uppercase tracking-[0.14em] text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)]/5"
            >
              Continue with Apple
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-[color:var(--color-ink-muted)]">
            New here?{" "}
            <Link to="/signup" className="text-[color:var(--color-ink)] underline-offset-2 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
