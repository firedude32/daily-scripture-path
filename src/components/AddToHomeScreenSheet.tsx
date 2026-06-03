import { useEffect, useState, useSyncExternalStore } from "react";
import { BottomSheet } from "@/components/ui-lectio/BottomSheet";
import { EditorialButton } from "@/components/ui-lectio/EditorialButton";
import { Rule } from "@/components/ui-lectio/Rule";
import { detectPlatform, type Platform } from "@/lib/platform";
import {
  canShowA2HS,
  dismissForever,
  hasNativeInstallPrompt,
  initA2HS,
  markShown,
  subscribeA2HS,
  triggerNativeInstall,
} from "@/lib/a2hs";
import { toast } from "sonner";

const SHOW_DELAY_MS = 6000;

function useNativePromptAvailable(): boolean {
  return useSyncExternalStore(
    (cb) => subscribeA2HS(cb),
    () => hasNativeInstallPrompt(),
    () => false,
  );
}

export function AddToHomeScreenSheet() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const native = useNativePromptAvailable();

  useEffect(() => {
    initA2HS();
    const p = detectPlatform();
    setPlatform(p);

    if (p === "desktop" || p === "unknown") return;
    if (!canShowA2HS()) return;

    const t = window.setTimeout(() => {
      if (!canShowA2HS()) return;
      markShown();
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
  }

  function neverAgain() {
    dismissForever();
    setOpen(false);
  }

  async function onInstall() {
    const outcome = await triggerNativeInstall();
    if (outcome === "accepted") {
      dismissForever();
    }
    setOpen(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://lectio.live");
      toast.success("Link copied. Open it in Safari.");
    } catch {
      toast.error("Could not copy. The link is lectio.live");
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={close}
      eyebrow="A small ritual"
      title="Keep Lectio close."
    >
      <p
        className="font-body text-[color:var(--color-ink-soft)]"
        style={{ fontSize: 15, lineHeight: 1.55 }}
      >
        Add it to your home screen so it's one tap away — no app store, no
        account to set up again.
      </p>

      <div className="my-6"><Rule /></div>

      <Instructions platform={platform} native={native} onCopyLink={copyLink} />

      <div className="mt-8 space-y-3">
        {native && (platform === "android-chrome") ? (
          <EditorialButton variant="gold" onClick={onInstall}>
            Install Lectio
          </EditorialButton>
        ) : null}
        <EditorialButton variant="secondary" onClick={close}>
          Maybe later
        </EditorialButton>
        <EditorialButton variant="text" onClick={neverAgain}>
          Don't show again
        </EditorialButton>
      </div>
    </BottomSheet>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span
        className="font-display tabular shrink-0"
        style={{ fontSize: 22, color: "var(--color-gold)", fontWeight: 300, lineHeight: 1.1 }}
      >
        {n}
      </span>
      <span
        className="font-body text-[color:var(--color-ink)]"
        style={{ fontSize: 15, lineHeight: 1.55 }}
      >
        {children}
      </span>
    </li>
  );
}

function ShareGlyph() {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      className="inline -mt-0.5 mx-0.5 align-middle"
      aria-hidden
    >
      <path
        d="M7 1v11M3.5 4.5L7 1l3.5 3.5M1.5 8.5v7h11v-7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsGlyph() {
  return (
    <span
      aria-hidden
      className="inline-block mx-0.5 align-middle"
      style={{ fontSize: 18, lineHeight: 1, letterSpacing: 0 }}
    >
      ⋮
    </span>
  );
}

function Instructions({
  platform,
  native,
  onCopyLink,
}: {
  platform: Platform;
  native: boolean;
  onCopyLink: () => void;
}) {
  if (platform === "ios-safari" || platform === "ipados") {
    return (
      <ol className="space-y-5">
        <Step n={1}>
          Tap the Share icon <ShareGlyph /> at the bottom of Safari.
        </Step>
        <Step n={2}>Scroll and tap "Add to Home Screen."</Step>
        <Step n={3}>Tap "Add."</Step>
      </ol>
    );
  }

  if (platform === "ios-other") {
    return (
      <div className="space-y-5">
        <p
          className="font-body text-[color:var(--color-ink)]"
          style={{ fontSize: 15, lineHeight: 1.55 }}
        >
          On iPhone, this only works from Safari. Open{" "}
          <span className="font-display italic">lectio.live</span> in Safari,
          then use Share <ShareGlyph /> → Add to Home Screen.
        </p>
        <button
          onClick={onCopyLink}
          className="font-ui uppercase tracking-[0.14em] text-[11px] text-[color:var(--color-gold)] hover:opacity-80"
        >
          Copy link
        </button>
      </div>
    );
  }

  if (platform === "android-chrome") {
    if (native) {
      return (
        <p
          className="font-body text-[color:var(--color-ink)]"
          style={{ fontSize: 15, lineHeight: 1.55 }}
        >
          Tap Install Lectio below — your browser will add it to your home
          screen.
        </p>
      );
    }
    return (
      <ol className="space-y-5">
        <Step n={1}>
          Tap the menu <DotsGlyph /> at the top right of your browser.
        </Step>
        <Step n={2}>Tap "Add to Home screen" (or "Install app").</Step>
        <Step n={3}>Tap "Add."</Step>
      </ol>
    );
  }

  if (platform === "android-firefox") {
    return (
      <ol className="space-y-5">
        <Step n={1}>
          Tap the menu <DotsGlyph /> in Firefox.
        </Step>
        <Step n={2}>Tap "Install."</Step>
      </ol>
    );
  }

  return null;
}
