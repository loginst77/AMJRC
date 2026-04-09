export type TranslationCode = "NRP" | "NIV" | "CSLAV";

export type BibleCanon = "old_testament" | "new_testament";

export const VERSIONS: Record<TranslationCode, { id: number; name: string; shortName: string; canons: BibleCanon[] }> = {
  NRP: { id: 143, name: "Новый русский перевод (НРП)", shortName: "NRP", canons: ["old_testament", "new_testament"] },
  NIV: { id: 111, name: "New International Version (NIV)", shortName: "NIV", canons: ["old_testament", "new_testament"] },
  CSLAV: { id: 45, name: "Church Slavonic (CSLAV)", shortName: "CSLAV", canons: ["new_testament"] },
};

const API_BASE = "https://api.youversion.com/v1";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TorahVerse {
  verse: number;
  text: string;
  paragraphStart?: boolean; // true if this verse starts a new paragraph
  chapterRef?: string; // Optional property to record if a verse starts a new chapter
}

export interface TorahPassage {
  reference: string;
  content: string;
  verses: TorahVerse[];
}

// ─── Book name mapping (Russian → YouVersion USFM) ─────────────────────────

const BOOK_MAP: Record<string, string> = {
  // Russian names (various forms)
  бытие: "GEN",
  бытия: "GEN",
  быт: "GEN",
  исход: "EXO",
  исх: "EXO",
  левит: "LEV",
  лев: "LEV",
  числа: "NUM",
  чис: "NUM",
  второзаконие: "DEU",
  втор: "DEU",
  // English fallbacks
  genesis: "GEN",
  gen: "GEN",
  exodus: "EXO",
  exo: "EXO",
  exod: "EXO",
  leviticus: "LEV",
  lev: "LEV",
  numbers: "NUM",
  num: "NUM",
  deuteronomy: "DEU",
  deut: "DEU",
  deu: "DEU",
};

/**
 * Parse a human-readable passage reference into one or more YouVersion passage IDs.
 * Examples:
 *   "Бытия 2:12-29"  → ["GEN.2.12-29"]
 *   "Исход 3"        → ["EXO.3"]
 *   "Бытия 12-13"    → ["GEN.12", "GEN.13"]  (multi-chapter)
 *   "GEN.1.1-5"      → ["GEN.1.1-5"] (passthrough)
 */
export function parsePassageRef(ref: string): string[] {
  const trimmed = ref.trim();

  // Already in USFM format (e.g. "GEN.1.1-5")
  if (/^[A-Z0-9]{2,5}\.\d/.test(trimmed)) {
    return [trimmed];
  }

  // Try multi-chapter: "Book ChapterStart-ChapterEnd"
  const multiMatch = trimmed.match(/^(.+?)\s+(\d+)-(\d+)$/);
  if (multiMatch) {
    const [, bookName, startCh, endCh] = multiMatch;
    const bookId = BOOK_MAP[bookName.toLowerCase().trim()];
    if (!bookId) {
      throw new Error(`Unknown book name: "${bookName}"`);
    }
    const start = parseInt(startCh, 10);
    const end = parseInt(endCh, 10);
    const ids: string[] = [];
    for (let ch = start; ch <= end; ch++) {
      ids.push(`${bookId}.${ch}`);
    }
    return ids;
  }

  // Parse "Book Chapter:VerseStart-VerseEnd" or "Book Chapter"
  const match = trimmed.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) {
    throw new Error(`Cannot parse passage reference: "${ref}"`);
  }

  const [, bookName, chapter, verseStart, verseEnd] = match;
  const bookId = BOOK_MAP[bookName.toLowerCase().trim()];
  if (!bookId) {
    throw new Error(`Unknown book name: "${bookName}"`);
  }

  if (verseStart && verseEnd) {
    return [`${bookId}.${chapter}.${verseStart}-${verseEnd}`];
  }
  if (verseStart) {
    return [`${bookId}.${chapter}.${verseStart}`];
  }
  return [`${bookId}.${chapter}`];
}

// ─── YouVersion API client ──────────────────────────────────────────────────

/**
 * Fetch a passage from YouVersion. Returns raw content and reference.
 */
async function fetchFromYouVersion(passageId: string, bibleId: number): Promise<{ content: string; reference: string }> {
  const apiKey = process.env.YVP_APP_KEY;
  if (!apiKey) {
    throw new Error("YVP_APP_KEY is not configured in .env.local");
  }

  const res = await fetch(`${API_BASE}/bibles/${bibleId}/passages/${passageId}?format=html`, {
    headers: { "X-YVP-App-Key": apiKey },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`YouVersion API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    content: data.content ?? "",
    reference: data.reference ?? passageId,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Parse YouVersion HTML into individual verses with paragraph info.
 * HTML structure:
 *   <div class="p">  — paragraph
 *   <div class="q1"> — poetry line 1
 *   <div class="q2"> — poetry line 2
 *   <span class="yv-v" v="N"> — verse marker
 *   <span class="yv-vlbl">N</span> — verse label
 */
function parseHtmlToVerses(html: string): TorahVerse[] {
  const verses: TorahVerse[] = [];

  // Insert a special marker before each paragraph/poetry block
  // so we can detect paragraph boundaries after splitting by verse
  const PARA_MARKER = "\u0000PARA\u0000";
  const marked = html.replace(/<div class="(?:p|q[12])">/g, PARA_MARKER);

  // Split on verse markers
  const parts = marked.split(/<span class="yv-v" v="(\d+)"><\/span>/);

  for (let i = 1; i < parts.length; i += 2) {
    const verseNum = parseInt(parts[i], 10);
    let text = parts[i + 1] || "";

    // Check if this verse starts a new paragraph
    const paragraphStart = text.indexOf(PARA_MARKER) !== -1 || (i === 1 && parts[0].includes(PARA_MARKER));

    // Strip markers, verse labels, and HTML tags
    text = text.replace(/\u0000PARA\u0000/g, "");
    text = text.replace(/<span class="yv-vlbl">\d+<\/span>/g, "");
    text = text.replace(/<[^>]+>/g, " ");
    text = text.replace(/\s+/g, " ").trim();

    if (text) {
      verses.push({
        verse: verseNum,
        text,
        paragraphStart: paragraphStart || i === 1,
      });
    }
  }

  return verses;
}

/**
 * Fetch a passage by its YouVersion ID (e.g. "GEN.1" or "GEN.2.1-5")
 * or a human-readable reference (e.g. "Бытия 2:12-29", "Бытия 12-13").
 * Supports multi-chapter ranges — each chapter is fetched separately and merged.
 */
export async function fetchPassage(ref: string, bibleId: number = 143): Promise<TorahPassage> {
  const passageIds = parsePassageRef(ref);

  // Fetch all chapters in parallel
  const results = await Promise.all(passageIds.map((id) => fetchFromYouVersion(id, bibleId)));

  // Merge references, content, and verses
  const references = results.map((r) => r.reference);
  const allVerses: TorahVerse[] = [];

  for (const result of results) {
    const chapterVerses = parseHtmlToVerses(result.content);
    // First verse of each new chapter always starts a new paragraph and holds the chapter title
    if (chapterVerses.length > 0) {
      if (allVerses.length > 0) {
        chapterVerses[0].paragraphStart = true;
      }
      chapterVerses[0].chapterRef = result.reference;
    }
    allVerses.push(...chapterVerses);
  }

  const plainText = allVerses.map((v) => v.text).join(" ");

  return {
    reference: references.join("; "),
    content: plainText,
    verses: allVerses,
  };
}
