import { createFileRoute } from "@tanstack/react-router";

// Lectio share card renderer. Returns an SVG sized for either Instagram
// Stories (1080×1920) or feed/square (1080×1080). Pure SVG — no fonts to
// fetch, no Node-only deps. The client-side share helper rasterizes this
// SVG to a PNG via canvas before handing to the iOS share sheet.

type Kind = "book" | "rank" | "streak" | "gospel" | "nt" | "bible";

const PAPER = "#F4EFE6";
const PAPER_LIGHT = "#FAF7F2";
const INK = "#2A2722";
const INK_SOFT = "#4A453E";
const INK_MUTED = "#8A8378";
const GOLD = "#B8860B";
const SILVER = "#9A9389";
const GREEN = "#4A6B4E";

function tierColor(tier?: string | null): string {
  if (tier === "gold") return GOLD;
  if (tier === "silver") return SILVER;
  return GREEN;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Simple Lucide-style glyphs per kind (24px viewBox, stroke 1.5).
const GLYPHS: Record<string, string> = {
  book: `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>`,
  rank: `<circle cx="12" cy="8" r="6"/><path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.12"/>`,
  streak: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
  gospel: `<path d="M6.5 6.5h11"/><path d="M6.5 12h11"/><path d="M6.5 17.5h11"/><path d="M4 4v16"/><path d="M20 4v16"/>`,
  nt: `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 7h6"/>`,
  bible: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>`,
};

interface CardConfig {
  width: number;
  height: number;
  kind: Kind;
  title: string;
  subtitle: string;
  eyebrow: string;
  encouragement: string;
  tier?: string | null;
  streakDays?: number;
  booksRead?: number;
  chapters?: number;
}

function renderSvg(cfg: CardConfig): string {
  const { width: W, height: H } = cfg;
  const isStory = H > W;
  const accent = cfg.kind === "rank" ? GOLD : tierColor(cfg.tier);

  // Layout proportions
  const centerY = isStory ? H * 0.42 : H * 0.48;
  const glyphSize = isStory ? 200 : 160;
  const titleSize = isStory ? Math.min(160, 1500 / Math.max(cfg.title.length, 8)) : 110;
  const eyebrowSize = isStory ? 32 : 26;
  const subtitleSize = isStory ? 40 : 32;
  const encSize = isStory ? 38 : 30;
  const metaSize = isStory ? 26 : 22;

  const glyphPath = GLYPHS[cfg.kind] ?? GLYPHS.book;

  // Bottom stats row
  const statsParts: string[] = [];
  if (cfg.streakDays && cfg.streakDays > 0) statsParts.push(`${cfg.streakDays} DAY STREAK`);
  if (cfg.booksRead && cfg.booksRead > 0) statsParts.push(`${cfg.booksRead} BOOK${cfg.booksRead === 1 ? "" : "S"}`);
  if (cfg.chapters && cfg.chapters > 0) statsParts.push(`${cfg.chapters} CHAPTERS`);
  const stats = statsParts.join("   ·   ");

  // Use widely-available system serifs/sans for max compatibility.
  const SERIF = "'Cormorant Garamond', 'EB Garamond', Garamond, 'Times New Roman', Georgia, serif";
  const SANS = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="wash" cx="50%" cy="${isStory ? "32%" : "40%"}" r="65%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${PAPER_LIGHT}"/>
      <stop offset="100%" stop-color="${PAPER}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#wash)"/>

  <!-- Wordmark top -->
  <text x="${W / 2}" y="${isStory ? 130 : 90}" text-anchor="middle"
    font-family="${SERIF}" font-size="${isStory ? 44 : 36}" font-style="italic"
    fill="${INK_SOFT}" letter-spacing="6">Lectio</text>

  <!-- Eyebrow -->
  <text x="${W / 2}" y="${centerY - glyphSize / 2 - 80}" text-anchor="middle"
    font-family="${SANS}" font-size="${eyebrowSize}" font-weight="500"
    fill="${accent}" letter-spacing="${eyebrowSize * 0.18}">${esc(cfg.eyebrow.toUpperCase())}</text>

  <!-- Glyph -->
  <g transform="translate(${(W - glyphSize) / 2} ${centerY - glyphSize / 2 - 20})">
    <svg width="${glyphSize}" height="${glyphSize}" viewBox="0 0 24 24"
      fill="none" stroke="${accent}" stroke-width="0.8"
      stroke-linecap="round" stroke-linejoin="round">
      ${glyphPath}
    </svg>
  </g>

  <!-- Title (focal) -->
  <text x="${W / 2}" y="${centerY + glyphSize / 2 + titleSize * 0.35}" text-anchor="middle"
    font-family="${SERIF}" font-size="${titleSize}" font-weight="300"
    fill="${INK}" letter-spacing="-2">${esc(cfg.title)}</text>

  <!-- Hairline rule -->
  <line x1="${W / 2 - 60}" y1="${centerY + glyphSize / 2 + titleSize + 50}"
    x2="${W / 2 + 60}" y2="${centerY + glyphSize / 2 + titleSize + 50}"
    stroke="${accent}" stroke-width="2"/>

  <!-- Subtitle -->
  <text x="${W / 2}" y="${centerY + glyphSize / 2 + titleSize + 130}" text-anchor="middle"
    font-family="${SERIF}" font-size="${subtitleSize}" font-style="italic"
    fill="${INK_SOFT}">${esc(cfg.subtitle)}</text>

  <!-- Encouragement -->
  <text x="${W / 2}" y="${centerY + glyphSize / 2 + titleSize + 130 + encSize + 40}" text-anchor="middle"
    font-family="${SERIF}" font-size="${encSize}" font-style="italic"
    fill="${INK_SOFT}">${esc(cfg.encouragement)}</text>

  <!-- Bottom meta -->
  ${stats ? `<text x="${W / 2}" y="${H - (isStory ? 140 : 80)}" text-anchor="middle"
    font-family="${SANS}" font-size="${metaSize}" font-weight="500"
    fill="${INK_MUTED}" letter-spacing="${metaSize * 0.2}">${esc(stats)}</text>` : ""}

  <!-- Bottom hairline -->
  <line x1="${W * 0.3}" y1="${H - (isStory ? 90 : 50)}" x2="${W * 0.7}" y2="${H - (isStory ? 90 : 50)}"
    stroke="${INK_MUTED}" stroke-width="1" opacity="0.4"/>
  <text x="${W / 2}" y="${H - (isStory ? 50 : 25)}" text-anchor="middle"
    font-family="${SANS}" font-size="${metaSize * 0.75}" font-weight="500"
    fill="${INK_MUTED}" letter-spacing="${metaSize * 0.18}">lectio.live</text>
</svg>`;
}

function buildConfig(kind: Kind, q: URLSearchParams): CardConfig {
  const size = q.get("size") ?? "story";
  const isStory = size !== "square";
  const W = 1080;
  const H = isStory ? 1920 : 1080;

  const title = q.get("title") ?? "";
  const tier = q.get("tier");
  const streakDays = q.get("streak") ? Number(q.get("streak")) : undefined;
  const booksRead = q.get("books") ? Number(q.get("books")) : undefined;
  const chapters = q.get("chapters") ? Number(q.get("chapters")) : undefined;

  let eyebrow = "Quietly";
  let subtitle = "";
  let encouragement = "";

  switch (kind) {
    case "book":
      eyebrow = tier === "gold" ? "Third Completion" : tier === "silver" ? "Second Completion" : "First Completion";
      subtitle = chapters ? `${chapters} chapters · complete` : "Complete";
      encouragement =
        tier === "gold" ? "Three times. The book lives in you."
        : tier === "silver" ? "Twice through. Quiet, real depth."
        : "One book closer.";
      break;
    case "rank":
      eyebrow = "New Rank";
      subtitle = q.get("subtitle") ?? "";
      encouragement = q.get("encouragement") ?? "Earned with time.";
      break;
    case "streak":
      eyebrow = "Streak";
      subtitle = `Day ${title}`;
      encouragement = Number(title) >= 30 ? "A month of showing up." : "A week of showing up.";
      break;
    case "gospel":
      eyebrow = "Gospel Complete";
      subtitle = `The book of ${title}`;
      encouragement = "A whole Gospel read through.";
      break;
    case "nt":
      eyebrow = "New Testament";
      subtitle = "Complete";
      encouragement = "Twenty-seven books. One long read.";
      break;
    case "bible":
      eyebrow = "The Whole Bible";
      subtitle = "Sixty-six books";
      encouragement = "Cover to cover.";
      break;
  }

  return {
    width: W,
    height: H,
    kind,
    title: title || subtitle || eyebrow,
    subtitle: kind === "book" ? subtitle : (kind === "rank" ? subtitle : ""),
    eyebrow,
    encouragement,
    tier,
    streakDays,
    booksRead,
    chapters,
  };
}

export const Route = createFileRoute("/api/public/share-card/$kind")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const kind = (params.kind as Kind);
        if (!["book", "rank", "streak", "gospel", "nt", "bible"].includes(kind)) {
          return new Response("Unknown card kind", { status: 404 });
        }
        const url = new URL(request.url);
        const cfg = buildConfig(kind, url.searchParams);
        const svg = renderSvg(cfg);
        return new Response(svg, {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
