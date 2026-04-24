import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { RESOURCES } from "@/data/friends";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { Rule } from "@/components/ui-lectio/Rule";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Other Resources — Lectio" },
      { name: "description", content: "A short, curated set of partners and tools." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <PhoneFrame>
      <Screen>
        <div className="px-7 pt-14 pb-10">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 -ml-2 p-2 font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
          >
            <ArrowLeft size={14} /> Profile
          </Link>
          <SmallCaps as="div" className="mt-4">Other Resources</SmallCaps>
          <h1 className="mt-2 font-display text-[color:var(--color-ink)]" style={{ fontSize: 32, fontWeight: 400 }}>
            A short list.
          </h1>
          <p className="mt-2 font-body italic text-[color:var(--color-ink-soft)]" style={{ fontSize: 15 }}>
            Curated, not crowded.
          </p>

          <div className="mt-8">
            <Rule />
            {RESOURCES.map((r) => (
              <div key={r.name}>
                <div className="py-5 flex items-center gap-4">
                  <div
                    className="flex items-center justify-center shrink-0 font-display"
                    style={{
                      width: 48,
                      height: 48,
                      background: "var(--color-paper-light)",
                      border: "1px solid var(--color-rule)",
                      color: "var(--color-ink)",
                      fontSize: 16,
                      fontWeight: 400,
                    }}
                  >
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[color:var(--color-ink)]" style={{ fontSize: 17, fontWeight: 400 }}>
                      {r.name}
                    </p>
                    <p className="mt-1 font-body text-[color:var(--color-ink-soft)]" style={{ fontSize: 13, lineHeight: 1.4 }}>
                      {r.description}
                    </p>
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-ink)] hover:text-[color:var(--color-gold)]"
                  >
                    Visit
                  </a>
                </div>
                <Rule />
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
