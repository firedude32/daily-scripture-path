import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Screen } from "@/components/Screen";
import { RESOURCES } from "@/data/friends";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Other Resources — Bible Reading Habit Tracker" },
      { name: "description", content: "A small, curated set of partners and tools." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <PhoneFrame>
      <Screen>
        <div className="px-6 pt-12 pb-8">
          <Link to="/profile" className="inline-flex items-center gap-1 -ml-2 p-2 text-muted-foreground text-sm">
            <ArrowLeft size={16} /> Profile
          </Link>
          <h1 className="mt-4 font-serif text-3xl text-foreground">Other Resources</h1>
          <p className="mt-2 text-sm text-muted-foreground">A short list. Curated, not crowded.</p>

          <div className="mt-8 space-y-3">
            {RESOURCES.map((r) => (
              <div key={r.name} className="rounded-2xl bg-surface border border-border p-4 flex items-center gap-4">
                <div
                  className="rounded-xl flex items-center justify-center font-serif text-base text-primary-foreground shrink-0"
                  style={{ width: 48, height: 48, background: "var(--color-primary)" }}
                >
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground inline-flex items-center gap-1"
                >
                  Visit <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </PhoneFrame>
  );
}
