import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/beta")({
  head: () => ({
    meta: [
      { title: "Thank You — Lectio" },
      { name: "description", content: "A note to our earliest readers." },
    ],
  }),
  component: BetaPage,
});

const GOAL = 1000;

function BetaPage() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from("public_profiles")
        .select("*", { count: "exact", head: true });
      if (!cancelled && typeof count === "number") setCount(count);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = count ?? 0;
  const pct = Math.min(100, Math.round((shown / GOAL) * 100));

  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-12">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 -ml-2 p-2 font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
          >
            <ArrowLeft size={14} /> Profile
          </Link>

          <SmallCaps as="div" tone="gold" className="mt-4">
            A Note From Us
          </SmallCaps>
          <h1
            className="mt-3 font-display text-[color:var(--color-ink)]"
            style={{ fontSize: 34, fontWeight: 400, lineHeight: 1.15 }}
          >
            Thank you for reading with us.
          </h1>

          <div className="mt-8">
            <Rule />
          </div>

          <div className="mt-7 space-y-5 font-body text-[color:var(--color-ink)]" style={{ fontSize: 16, lineHeight: 1.7 }}>
            <p>
              You are one of the first people ever to open Lectio. That isn't a
              small thing to us. Every chapter you finish, every morning you
              come back, every quiet evening you spend with the Scriptures —
              we see it, and we are grateful.
            </p>
            <p className="font-body italic text-[color:var(--color-ink-soft)]">
              We built this for people who have tried before and stopped. The
              fact that you're still here means more than we can say.
            </p>
            <p>
              Lectio is in open beta while we earn the trust — and the funding —
              to bring it to the App Store. When we reach{" "}
              <span className="font-display tabular text-[color:var(--color-ink)]">1,000</span>{" "}
              readers, we'll have what we need to make that next step.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <SmallCaps>Readers So Far</SmallCaps>
              <span
                className="font-display tabular text-[color:var(--color-ink)]"
                style={{ fontSize: 20 }}
              >
                {count === null ? "—" : shown.toLocaleString()}{" "}
                <span
                  className="font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)]"
                >
                  / {GOAL.toLocaleString()}
                </span>
              </span>
            </div>
            <div className="mt-3" style={{ height: 1.5, background: "var(--color-rule)" }}>
              <div
                style={{
                  height: 1.5,
                  background: "var(--color-gold)",
                  width: `${pct}%`,
                  transition: "width 800ms ease-out",
                }}
              />
            </div>
            <p className="mt-3 font-body italic text-[color:var(--color-ink-soft)]" style={{ fontSize: 13 }}>
              Every reader brings us closer. If Lectio has helped you, telling
              one friend is the kindest thing you could do for us.
            </p>
          </div>

          <div className="mt-12">
            <Rule />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Heart
              size={18}
              strokeWidth={1.25}
              style={{ color: "var(--color-gold)" }}
              aria-hidden
            />
            <p
              className="font-body italic text-[color:var(--color-ink-soft)]"
              style={{ fontSize: 14 }}
            >
              With gratitude — the Lectio team.
            </p>
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
