import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";

export const Route = createFileRoute("/signup")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Create account — Lectio" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name: name.trim() || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) {
      navigate({ to: "/" });
    } else {
      setInfo("Check your email to confirm your account.");
    }
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
          <h1 className="mt-3 font-display text-3xl text-[color:var(--color-ink)]">Begin a habit.</h1>
          <p className="mt-2 text-sm text-[color:var(--color-ink-muted)]">Create your account to start reading.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[12px] border border-[color:var(--color-ink)]/15 bg-transparent px-4 py-3 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-ink)]"
            />
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
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[12px] border border-[color:var(--color-ink)]/15 bg-transparent px-4 py-3 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-ink)]"
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            {info && <p className="text-sm text-[color:var(--color-ink-muted)]">{info}</p>}
            <EditorialButton type="submit" disabled={busy} fullWidth>
              {busy ? "Creating…" : "Create Account"}
            </EditorialButton>
          </form>

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
            Already have an account?{" "}
            <Link to="/login" className="text-[color:var(--color-ink)] underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
