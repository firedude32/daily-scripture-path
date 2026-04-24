// Approximate verses-per-chapter, grouped by book id. Used by Advanced
// Analytics to estimate verses read. Approximate is fine for the prototype.
// Source: standard verse counts; values rounded.

const AVG: Record<string, number> = {
  // OT
  gen: 38, exo: 30, lev: 26, num: 35, deu: 28,
  jos: 26, jdg: 27, rut: 21, "1sa": 23, "2sa": 22,
  "1ki": 30, "2ki": 22, "1ch": 28, "2ch": 25, ezr: 22,
  neh: 30, est: 17, job: 22, psa: 18, pro: 22,
  ecc: 13, sng: 14, isa: 21, jer: 30, lam: 36,
  ezk: 28, dan: 30, hos: 12, jol: 18, amo: 13,
  oba: 21, jon: 11, mic: 13, nam: 13, hab: 13,
  zep: 14, hag: 13, zec: 13, mal: 14,
  // NT
  mat: 38, mrk: 36, luk: 49, jhn: 32, act: 30,
  rom: 22, "1co": 26, "2co": 19, gal: 22, eph: 24,
  php: 25, col: 21, "1th": 17, "2th": 14, "1ti": 16,
  "2ti": 19, tit: 13, phm: 25, heb: 24, jas: 16,
  "1pe": 19, "2pe": 16, "1jn": 20, "2jn": 13, "3jn": 14,
  jud: 25, rev: 18,
};

export function avgVersesPerChapter(bookId: string): number {
  return AVG[bookId] ?? 22;
}
