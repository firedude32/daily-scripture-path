// Client-side share helper. Builds the URL to the SVG share-card endpoint,
// rasterizes it to a PNG via canvas, and hands the PNG to the iOS share
// sheet via navigator.share. Falls back to opening the SVG in a new tab.

export type ShareKind = "book" | "rank" | "streak" | "gospel" | "nt" | "bible";

export interface ShareParams {
  title?: string;
  subtitle?: string;
  encouragement?: string;
  tier?: "green" | "silver" | "gold";
  streak?: number;
  books?: number;
  chapters?: number;
}

const CAPTIONS: Record<ShareKind, (p: ShareParams) => string> = {
  book: (p) =>
    p.tier === "gold"
      ? `Three times through ${p.title}. Lectio.`
      : p.tier === "silver"
        ? `${p.title}, twice through. Lectio.`
        : `${p.title}, complete. Lectio.`,
  rank: (p) => `New rank: ${p.title}. Lectio.`,
  streak: (p) => `Day ${p.title} of reading. Lectio.`,
  gospel: (p) => `${p.title} — Gospel complete. Lectio.`,
  nt: () => `New Testament complete. Lectio.`,
  bible: () => `The whole Bible. Lectio.`,
};

export function shareCardUrl(
  kind: ShareKind,
  params: ShareParams,
  size: "story" | "square" = "story",
): string {
  const q = new URLSearchParams();
  q.set("size", size);
  if (params.title != null) q.set("title", String(params.title));
  if (params.subtitle != null) q.set("subtitle", params.subtitle);
  if (params.encouragement != null) q.set("encouragement", params.encouragement);
  if (params.tier) q.set("tier", params.tier);
  if (params.streak != null) q.set("streak", String(params.streak));
  if (params.books != null) q.set("books", String(params.books));
  if (params.chapters != null) q.set("chapters", String(params.chapters));
  return `/api/public/share-card/${kind}?${q.toString()}`;
}

async function svgUrlToPngFile(url: string, filename: string): Promise<File | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const svgText = await res.text();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    const blobUrl = URL.createObjectURL(svgBlob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.crossOrigin = "anonymous";
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = blobUrl;
      });

      // Detect dimensions from the SVG viewBox or natural size
      const w = img.naturalWidth || 1080;
      const h = img.naturalHeight || 1920;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, w, h);

      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.95),
      );
      if (!pngBlob) return null;
      return new File([pngBlob], filename, { type: "image/png" });
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch {
    return null;
  }
}

export async function shareMilestone(
  kind: ShareKind,
  params: ShareParams,
  size: "story" | "square" = "story",
): Promise<{ ok: boolean; reason?: string }> {
  const url = shareCardUrl(kind, params, size);
  const absoluteUrl = typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;
  const caption = CAPTIONS[kind](params);
  const filename = `lectio-${kind}-${Date.now()}.png`;

  const file = await svgUrlToPngFile(absoluteUrl, filename);

  // Prefer file share (iOS share sheet → Photos, Messages, Instagram Stories)
  if (file && typeof navigator !== "undefined" && "share" in navigator) {
    const canShareFiles =
      "canShare" in navigator
        ? (navigator as Navigator & { canShare?: (data: ShareData) => boolean }).canShare?.({ files: [file] })
        : false;
    if (canShareFiles) {
      try {
        await navigator.share({ files: [file], title: "Lectio", text: caption });
        return { ok: true };
      } catch (e) {
        const err = e as DOMException;
        if (err?.name === "AbortError") return { ok: true };
      }
    }
  }

  // Fallback: try text+url share
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title: "Lectio", text: caption, url: absoluteUrl });
      return { ok: true };
    } catch (e) {
      const err = e as DOMException;
      if (err?.name === "AbortError") return { ok: true };
    }
  }

  // Final fallback: open in new tab so user can save
  if (typeof window !== "undefined") {
    window.open(absoluteUrl, "_blank", "noopener,noreferrer");
    return { ok: true, reason: "opened_in_tab" };
  }

  return { ok: false, reason: "no_share_api" };
}
