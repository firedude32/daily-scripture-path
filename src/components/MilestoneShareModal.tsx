import { BottomSheet } from "@/components/ui-lectio/BottomSheet";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { useAppState, clearPendingMilestone } from "@/state/store";
import { shareMilestone, shareCardUrl, type ShareKind } from "@/lib/share";

const TITLES: Record<string, { eyebrow: string; title: string; blurb: string }> = {
  streak: {
    eyebrow: "Quietly",
    title: "A streak worth marking",
    blurb: "A small designed card you can share — no scores, no charts.",
  },
  gospel: {
    eyebrow: "Quietly",
    title: "A Gospel, finished",
    blurb: "One of the four. The whole thing read through.",
  },
  nt: {
    eyebrow: "Quietly",
    title: "New Testament — complete",
    blurb: "Twenty-seven books. Worth noting.",
  },
  bible: {
    eyebrow: "Quietly",
    title: "The whole Bible",
    blurb: "Sixty-six books, cover to cover.",
  },
};

export function MilestoneShareModal() {
  const state = useAppState();
  const m = state.pendingMilestone;
  if (!m) return null;
  const meta = TITLES[m.kind] ?? TITLES.streak;
  const kind = m.kind as ShareKind;
  const previewUrl = shareCardUrl(
    kind,
    { title: m.title, streak: m.streak, books: m.books },
    "square",
  );

  return (
    <BottomSheet
      open
      onClose={clearPendingMilestone}
      eyebrow={meta.eyebrow}
      title={meta.title}
    >
      <p
        className="font-body text-[color:var(--color-ink-soft)]"
        style={{ fontSize: 15, lineHeight: 1.55 }}
      >
        {meta.blurb}
      </p>

      <div
        className="mt-5 rounded-[12px] overflow-hidden border"
        style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-light)" }}
      >
        <img
          src={previewUrl}
          alt="Share card preview"
          className="w-full h-auto block"
          style={{ aspectRatio: "1 / 1" }}
        />
      </div>

      <div className="mt-3">
        <SmallCaps>1080 × 1920 · Stories</SmallCaps>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3">
        <EditorialButton
          variant="primary"
          onClick={async () => {
            await shareMilestone(
              kind,
              { title: m.title, streak: m.streak, books: m.books },
              "story",
            );
            clearPendingMilestone();
          }}
        >
          Share
        </EditorialButton>
        <EditorialButton variant="secondary" onClick={clearPendingMilestone}>
          Not now
        </EditorialButton>
      </div>
    </BottomSheet>
  );
}
