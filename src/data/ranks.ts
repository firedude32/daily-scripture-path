export interface Rank {
  name: string;
  xp: number;
  blurb: string;
}

export const RANKS: Rank[] = [
  { name: "Seeker", xp: 0, blurb: "You're starting." },
  { name: "Student", xp: 500, blurb: "A reader, learning the rhythm." },
  { name: "Disciple", xp: 1500, blurb: "Showing up, day after day." },
  { name: "Faithful", xp: 3500, blurb: "The habit is taking root." },
  { name: "Steadfast", xp: 7000, blurb: "Steady. Reliable. Yours." },
  { name: "Scholar", xp: 12000, blurb: "Reading like it matters — because it does." },
  { name: "Scribe", xp: 20000, blurb: "Pages and pages and pages." },
  { name: "Theologian", xp: 32000, blurb: "Depth earned slowly." },
  { name: "Elder", xp: 50000, blurb: "A long obedience in the same direction." },
  { name: "Bible Scholar", xp: 75000, blurb: "There aren't many up here." },
];

export function getRankIndex(xp: number): number {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) idx = i;
  }
  return idx;
}

export function getRank(xp: number): Rank {
  return RANKS[getRankIndex(xp)];
}

export function getNextRank(xp: number): Rank | null {
  const i = getRankIndex(xp);
  return i + 1 < RANKS.length ? RANKS[i + 1] : null;
}
