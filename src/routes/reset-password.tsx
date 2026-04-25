import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Lectio" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("type=recovery")) setMode("update");
  }, []);

  async function requestReset(e: FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return setError(error.message);
    setInfo("Check your email for a reset link.");
  }

  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    setError(null); setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    navigate({ to: "/" });
  }

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-6 pt-12 pb-10">
          <SmallCaps>Lectio</SmallCaps>
          <h1 className="mt-3 font-display text-3xl text-[color:var(--color-ink)]">
            {mode === "update" ? "Set a new password." : "Reset your password."}
          </h1>

          {mode === "request" ? (
            <form onSubmit={requestReset} className="mt-8 space-y-4">
              <input
                type="email" required placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[12px] border border-[color:var(--color-ink)]/15 bg-transparent px-4 py-3 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-ink)]"
              />
              {error && <p className="text-sm text-red-700">{error}</p>}
              {info && <p className="text-sm text-[color:var(--color-ink-muted)]">{info}</p>}
              <EditorialButton type="submit" disabled={busy} fullWidth>
                {busy ? "Sending…" : "Send reset link"}
              </EditorialButton>
            </form>
          ) : (
            <form onSubmit={updatePassword} className="mt-8 space-y-4">
              <input
                type="password" required minLength={6} placeholder="New password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[12px] border border-[color:var(--color-ink)]/15 bg-transparent px-4 py-3 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-ink)]"
              />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <EditorialButton type="submit" disabled={busy} fullWidth>
                {busy ? "Updating…" : "Update password"}
              </EditorialButton>
            </form>
          )}

          <p className="mt-10 text-center text-sm text-[color:var(--color-ink-muted)]">
            <Link to="/login" className="text-[color:var(--color-ink)] underline-offset-2 hover:underline">Back to sign in</Link>
          </p>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
