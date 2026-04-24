// 66 books of the Bible with chapter counts and genre/testament metadata.
export type Genre = "Law" | "History" | "Poetry" | "Prophecy" | "Gospels" | "Epistles";
export type Testament = "OT" | "NT";

export interface Book {
  id: string;
  name: string;
  chapters: number;
  testament: Testament;
  genre: Genre;
}

export const BOOKS: Book[] = [
  // Old Testament — Law
  { id: "gen", name: "Genesis", chapters: 50, testament: "OT", genre: "Law" },
  { id: "exo", name: "Exodus", chapters: 40, testament: "OT", genre: "Law" },
  { id: "lev", name: "Leviticus", chapters: 27, testament: "OT", genre: "Law" },
  { id: "num", name: "Numbers", chapters: 36, testament: "OT", genre: "Law" },
  { id: "deu", name: "Deuteronomy", chapters: 34, testament: "OT", genre: "Law" },
  // History
  { id: "jos", name: "Joshua", chapters: 24, testament: "OT", genre: "History" },
  { id: "jdg", name: "Judges", chapters: 21, testament: "OT", genre: "History" },
  { id: "rut", name: "Ruth", chapters: 4, testament: "OT", genre: "History" },
  { id: "1sa", name: "1 Samuel", chapters: 31, testament: "OT", genre: "History" },
  { id: "2sa", name: "2 Samuel", chapters: 24, testament: "OT", genre: "History" },
  { id: "1ki", name: "1 Kings", chapters: 22, testament: "OT", genre: "History" },
  { id: "2ki", name: "2 Kings", chapters: 25, testament: "OT", genre: "History" },
  { id: "1ch", name: "1 Chronicles", chapters: 29, testament: "OT", genre: "History" },
  { id: "2ch", name: "2 Chronicles", chapters: 36, testament: "OT", genre: "History" },
  { id: "ezr", name: "Ezra", chapters: 10, testament: "OT", genre: "History" },
  { id: "neh", name: "Nehemiah", chapters: 13, testament: "OT", genre: "History" },
  { id: "est", name: "Esther", chapters: 10, testament: "OT", genre: "History" },
  // Poetry
  { id: "job", name: "Job", chapters: 42, testament: "OT", genre: "Poetry" },
  { id: "psa", name: "Psalms", chapters: 150, testament: "OT", genre: "Poetry" },
  { id: "pro", name: "Proverbs", chapters: 31, testament: "OT", genre: "Poetry" },
  { id: "ecc", name: "Ecclesiastes", chapters: 12, testament: "OT", genre: "Poetry" },
  { id: "sng", name: "Song of Solomon", chapters: 8, testament: "OT", genre: "Poetry" },
  // Prophecy
  { id: "isa", name: "Isaiah", chapters: 66, testament: "OT", genre: "Prophecy" },
  { id: "jer", name: "Jeremiah", chapters: 52, testament: "OT", genre: "Prophecy" },
  { id: "lam", name: "Lamentations", chapters: 5, testament: "OT", genre: "Prophecy" },
  { id: "ezk", name: "Ezekiel", chapters: 48, testament: "OT", genre: "Prophecy" },
  { id: "dan", name: "Daniel", chapters: 12, testament: "OT", genre: "Prophecy" },
  { id: "hos", name: "Hosea", chapters: 14, testament: "OT", genre: "Prophecy" },
  { id: "jol", name: "Joel", chapters: 3, testament: "OT", genre: "Prophecy" },
  { id: "amo", name: "Amos", chapters: 9, testament: "OT", genre: "Prophecy" },
  { id: "oba", name: "Obadiah", chapters: 1, testament: "OT", genre: "Prophecy" },
  { id: "jon", name: "Jonah", chapters: 4, testament: "OT", genre: "Prophecy" },
  { id: "mic", name: "Micah", chapters: 7, testament: "OT", genre: "Prophecy" },
  { id: "nam", name: "Nahum", chapters: 3, testament: "OT", genre: "Prophecy" },
  { id: "hab", name: "Habakkuk", chapters: 3, testament: "OT", genre: "Prophecy" },
  { id: "zep", name: "Zephaniah", chapters: 3, testament: "OT", genre: "Prophecy" },
  { id: "hag", name: "Haggai", chapters: 2, testament: "OT", genre: "Prophecy" },
  { id: "zec", name: "Zechariah", chapters: 14, testament: "OT", genre: "Prophecy" },
  { id: "mal", name: "Malachi", chapters: 4, testament: "OT", genre: "Prophecy" },
  // New Testament — Gospels
  { id: "mat", name: "Matthew", chapters: 28, testament: "NT", genre: "Gospels" },
  { id: "mrk", name: "Mark", chapters: 16, testament: "NT", genre: "Gospels" },
  { id: "luk", name: "Luke", chapters: 24, testament: "NT", genre: "Gospels" },
  { id: "jhn", name: "John", chapters: 21, testament: "NT", genre: "Gospels" },
  // History
  { id: "act", name: "Acts", chapters: 28, testament: "NT", genre: "History" },
  // Epistles
  { id: "rom", name: "Romans", chapters: 16, testament: "NT", genre: "Epistles" },
  { id: "1co", name: "1 Corinthians", chapters: 16, testament: "NT", genre: "Epistles" },
  { id: "2co", name: "2 Corinthians", chapters: 13, testament: "NT", genre: "Epistles" },
  { id: "gal", name: "Galatians", chapters: 6, testament: "NT", genre: "Epistles" },
  { id: "eph", name: "Ephesians", chapters: 6, testament: "NT", genre: "Epistles" },
  { id: "php", name: "Philippians", chapters: 4, testament: "NT", genre: "Epistles" },
  { id: "col", name: "Colossians", chapters: 4, testament: "NT", genre: "Epistles" },
  { id: "1th", name: "1 Thessalonians", chapters: 5, testament: "NT", genre: "Epistles" },
  { id: "2th", name: "2 Thessalonians", chapters: 3, testament: "NT", genre: "Epistles" },
  { id: "1ti", name: "1 Timothy", chapters: 6, testament: "NT", genre: "Epistles" },
  { id: "2ti", name: "2 Timothy", chapters: 4, testament: "NT", genre: "Epistles" },
  { id: "tit", name: "Titus", chapters: 3, testament: "NT", genre: "Epistles" },
  { id: "phm", name: "Philemon", chapters: 1, testament: "NT", genre: "Epistles" },
  { id: "heb", name: "Hebrews", chapters: 13, testament: "NT", genre: "Epistles" },
  { id: "jas", name: "James", chapters: 5, testament: "NT", genre: "Epistles" },
  { id: "1pe", name: "1 Peter", chapters: 5, testament: "NT", genre: "Epistles" },
  { id: "2pe", name: "2 Peter", chapters: 3, testament: "NT", genre: "Epistles" },
  { id: "1jn", name: "1 John", chapters: 5, testament: "NT", genre: "Epistles" },
  { id: "2jn", name: "2 John", chapters: 1, testament: "NT", genre: "Epistles" },
  { id: "3jn", name: "3 John", chapters: 1, testament: "NT", genre: "Epistles" },
  { id: "jud", name: "Jude", chapters: 1, testament: "NT", genre: "Epistles" },
  // Prophecy
  { id: "rev", name: "Revelation", chapters: 22, testament: "NT", genre: "Prophecy" },
];

export const TOTAL_CHAPTERS = BOOKS.reduce((s, b) => s + b.chapters, 0);
export const NT_CHAPTERS = BOOKS.filter((b) => b.testament === "NT").reduce((s, b) => s + b.chapters, 0);
export const OT_CHAPTERS = TOTAL_CHAPTERS - NT_CHAPTERS;

export function bookById(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}

// New Testament reading order (traditional canonical)
export const NT_ORDER = BOOKS.filter((b) => b.testament === "NT").map((b) => b.id);
