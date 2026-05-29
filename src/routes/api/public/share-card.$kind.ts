import { createFileRoute } from "@tanstack/react-router";

// Lectio share card renderer. Returns an SVG sized for either Instagram
// Stories (1080×1920) or feed/square (1080×1080). Pure SVG, no external
// fonts. Layout uses a vertical stack with fixed gaps so nothing overlaps
// regardless of text length.

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

// Lucide-style glyphs (24px viewBox).
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
  eyebrow: string;
  encouragement: string;
  tier?: string | null;
  streakDays?: number;
  booksRead?: number;
  chapters?: number;
}

const SERIF = "'Cormorant Garamond', 'EB Garamond', Garamond, 'Times New Roman', Georgia, serif";
const SANS = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fitTitleSize(title: string, maxWidth: number, isStory: boolean): number {
  // Rough heuristic: serif at weight 300 ~0.48em per char average.
  const baseMax = isStory ? 180 : 130;
  const baseMin = isStory ? 64 : 48;
  const estPerChar = 0.48;
  const sizeForWidth = maxWidth / Math.max(title.length, 1) / estPerChar;
  return Math.max(baseMin, Math.min(baseMax, Math.floor(sizeForWidth)));
}

function renderSvg(cfg: CardConfig): string {
  const { width: W, height: H } = cfg;
  const isStory = H > W;
  const accent = cfg.kind === "rank" ? GOLD : tierColor(cfg.tier);

  // Padding
  const padX = isStory ? 90 : 70;
  const safeTop = isStory ? 110 : 70;
  const safeBottom = isStory ? 150 : 90;
  const contentWidth = W - padX * 2;

  // Build stats list (always include streak; only show others if non-zero)
  const stats: Array<{ label: string; value: string }> = [];
  if (cfg.streakDays != null && cfg.streakDays > 0) {
    stats.push({ label: cfg.streakDays === 1 ? "Day" : "Days", value: String(cfg.streakDays) });
  }
  if (cfg.chapters != null && cfg.chapters > 0) {
    stats.push({ label: "Chapters", value: String(cfg.chapters) });
  }
  if (cfg.booksRead != null && cfg.booksRead > 0) {
    stats.push({ label: cfg.booksRead === 1 ? "Book" : "Books", value: String(cfg.booksRead) });
  }

  // Vertical stack with fixed gaps. Start from top safe-area and lay out.
  let y = safeTop;
  const parts: string[] = [];

  // Background
  parts.push(
    `<defs>
       <radialGradient id="wash" cx="50%" cy="${isStory ? "34%" : "42%"}" r="${isStory ? "62%" : "58%"}">
         <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
         <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
       </radialGradient>
       <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="${PAPER_LIGHT}"/>
         <stop offset="100%" stop-color="${PAPER}"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#paper)"/>
     <rect width="${W}" height="${H}" fill="url(#wash)"/>`,
  );

  // 1. Wordmark
  const wordmarkSize = isStory ? 42 : 34;
  parts.push(
    `<text x="${W / 2}" y="${y + wordmarkSize * 0.8}" text-anchor="middle"
       font-family="${SERIF}" font-size="${wordmarkSize}" font-style="italic"
       fill="${INK_SOFT}" letter-spacing="6">Lectio</text>`,
  );
  y += wordmarkSize + (isStory ? 100 : 60);

  // 2. Eyebrow chip
  const eyebrowSize = isStory ? 28 : 22;
  parts.push(
    `<text x="${W / 2}" y="${y + eyebrowSize}" text-anchor="middle"
       font-family="${SANS}" font-size="${eyebrowSize}" font-weight="600"
       fill="${accent}" letter-spacing="${eyebrowSize * 0.22}">${esc(cfg.eyebrow.toUpperCase())}</text>`,
  );
  y += eyebrowSize + (isStory ? 70 : 50);

  // 3. Glyph
  const glyphSize = isStory ? 160 : 120;
  const glyphPath = GLYPHS[cfg.kind] ?? GLYPHS.book;
  parts.push(
    `<g transform="translate(${(W - glyphSize) / 2} ${y})">
       <svg width="${glyphSize}" height="${glyphSize}" viewBox="0 0 24 24"
         fill="none" stroke="${accent}" stroke-width="0.9"
         stroke-linecap="round" stroke-linejoin="round">${glyphPath}</svg>
     </g>`,
  );
  y += glyphSize + (isStory ? 70 : 50);

  // 4. Title (focal)
  const titleSize = fitTitleSize(cfg.title, contentWidth, isStory);
  parts.push(
    `<text x="${W / 2}" y="${y + titleSize * 0.78}" text-anchor="middle"
       font-family="${SERIF}" font-size="${titleSize}" font-weight="300"
       fill="${INK}" letter-spacing="-1">${esc(cfg.title)}</text>`,
  );
  y += titleSize + (isStory ? 50 : 36);

  // 5. Hairline rule
  parts.push(
    `<line x1="${W / 2 - 70}" y1="${y}" x2="${W / 2 + 70}" y2="${y}"
       stroke="${accent}" stroke-width="2"/>`,
  );
  y += isStory ? 60 : 40;

  // 6. Encouragement (single line, italic, may wrap to 2)
  const encSize = isStory ? 36 : 28;
  const enc = cfg.encouragement;
  // Simple wrap: if too long, break at midpoint near a space.
  const encMaxChars = Math.floor(contentWidth / (encSize * 0.42));
  let encLines: string[] = [enc];
  if (enc.length > encMaxChars) {
    const mid = Math.floor(enc.length / 2);
    let split = enc.lastIndexOf(" ", mid + 8);
    if (split < mid - 8 || split < 0) split = enc.indexOf(" ", mid);
    if (split > 0) encLines = [enc.slice(0, split).trim(), enc.slice(split).trim()];
  }
  encLines.forEach((line, i) => {
    parts.push(
      `<text x="${W / 2}" y="${y + encSize * 0.8 + i * encSize * 1.25}" text-anchor="middle"
         font-family="${SERIF}" font-size="${encSize}" font-style="italic"
         fill="${INK_SOFT}">${esc(line)}</text>`,
    );
  });
  y += encSize * (encLines.length * 1.25) + (isStory ? 30 : 20);

  // 7. Stats grid pinned to bottom area (anchored from bottom)
  const statsY = H - safeBottom - (isStory ? 80 : 60);
  const footerY = H - safeBottom + (isStory ? 40 : 24);

  if (stats.length > 0) {
    const cols = stats.length;
    const colWidth = contentWidth / cols;
    const valueSize = isStory ? 64 : 48;
    const labelSize = isStory ? 22 : 18;
    stats.forEach((s, i) => {
      const cx = padX + colWidth * i + colWidth / 2;
      parts.push(
        `<text x="${cx}" y="${statsY}" text-anchor="middle"
           font-family="${SERIF}" font-size="${valueSize}" font-weight="300"
           fill="${INK}" letter-spacing="-1">${esc(s.value)}</text>`,
        `<text x="${cx}" y="${statsY + labelSize + 14}" text-anchor="middle"
           font-family="${SANS}" font-size="${labelSize}" font-weight="500"
           fill="${INK_MUTED}" letter-spacing="${labelSize * 0.22}">${esc(s.label.toUpperCase())}</text>`,
      );
      // Vertical separator between columns
      if (i > 0) {
        const sepX = padX + colWidth * i;
        parts.push(
          `<line x1="${sepX}" y1="${statsY - valueSize * 0.75}" x2="${sepX}" y2="${statsY + labelSize + 22}"
             stroke="${INK_MUTED}" stroke-width="1" opacity="0.3"/>`,
        );
      }
    });
  }

  // 8. Footer wordmark
  parts.push(
    `<line x1="${W * 0.38}" y1="${footerY - (isStory ? 24 : 16)}"
       x2="${W * 0.62}" y2="${footerY - (isStory ? 24 : 16)}"
       stroke="${INK_MUTED}" stroke-width="1" opacity="0.35"/>
     <text x="${W / 2}" y="${footerY + (isStory ? 18 : 12)}" text-anchor="middle"
       font-family="${SANS}" font-size="${isStory ? 22 : 18}" font-weight="500"
       fill="${INK_MUTED}" letter-spacing="${(isStory ? 22 : 18) * 0.22}">LECTIO.LIVE</text>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
${parts.join("\n")}
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
  let encouragement = "";
  let resolvedTitle = title;

  switch (kind) {
    case "book":
      eyebrow =
        tier === "gold" ? "Third Completion"
        : tier === "silver" ? "Second Completion"
        : "Book Complete";
      encouragement =
        tier === "gold" ? "Three times. The book lives in you."
        : tier === "silver" ? "Twice through. Quiet, real depth."
        : "One book closer.";
      break;
    case "rank":
      eyebrow = "New Rank";
      encouragement = q.get("encouragement") ?? "Earned with time.";
      break;
    case "streak": {
      const n = Number(title) || streakDays || 0;
      eyebrow = "A Streak";
      resolvedTitle = `Day ${n}`;
      encouragement = n >= 30 ? "A month of showing up." : "A week of showing up.";
      break;
    }
    case "gospel":
      eyebrow = "Gospel Complete";
      resolvedTitle = title || "Gospel";
      encouragement = "A whole Gospel, read through.";
      break;
    case "nt":
      eyebrow = "New Testament";
      resolvedTitle = "Complete";
      encouragement = "Twenty-seven books. One long read.";
      break;
    case "bible":
      eyebrow = "The Whole Bible";
      resolvedTitle = "Sixty-six";
      encouragement = "Cover to cover.";
      break;
  }

  return {
    width: W,
    height: H,
    kind,
    title: resolvedTitle || eyebrow,
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
        const kind = params.kind as Kind;
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
