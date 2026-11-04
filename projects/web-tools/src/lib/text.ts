export interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingMinutes: number;
  speakingMinutes: number;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  longestWord: string;
  letters: number;
  digits: number;
}

const WORD_RE = /[\p{L}\p{N}'ـ]+/gu;

export function words(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

export function countWords(text: string): number {
  return words(text.trim()).length;
}

export function countSentences(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  const parts = t.split(/[.!?。！？\u061F\n]+/).filter((s) => s.trim().length > 0);
  return parts.length;
}

export function countParagraphs(text: string): number {
  return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
}

export function textStats(text: string): TextStats {
  const w = words(text);
  const wordCount = w.length;
  const lower = w.map((x) => x.toLocaleLowerCase());
  const unique = new Set(lower);
  const sentences = countSentences(text);
  const letters = (text.match(/[\p{L}]/gu) ?? []).length;
  const digits = (text.match(/[\p{N}]/gu) ?? []).length;
  let longest = "";
  for (const x of w) if (x.length > longest.length) longest = x;
  return {
    words: wordCount,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, "").length,
    sentences,
    paragraphs: countParagraphs(text),
    lines: text.length ? text.split(/\n/).length : 0,
    readingMinutes: wordCount / 200,
    speakingMinutes: wordCount / 130,
    uniqueWords: unique.size,
    avgWordLength: wordCount ? w.reduce((a, x) => a + x.length, 0) / wordCount : 0,
    avgSentenceLength: sentences ? wordCount / sentences : 0,
    longestWord: longest,
    letters,
    digits,
  };
}

export function topWords(text: string, n = 10): { word: string; count: number }[] {
  const freq = new Map<string, number>();
  for (const raw of words(text)) {
    const w = raw.toLocaleLowerCase();
    if (w.length < 2) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

export function toTitleCase(text: string): string {
  return text.replace(
    /[\p{L}\p{N}]+/gu,
    (w) => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()
  );
}

export function toSentenceCase(text: string): string {
  const lower = text.toLocaleLowerCase();
  return lower.replace(
    /(\p{L}[\p{L}\p{N}']*)/gu,
    (w, _m, offset: number) => {
      const before = lower.slice(0, offset);
      if (before.trim().length === 0 || /[.!?\u061F。！？]\s*$/.test(before)) {
        return w.charAt(0).toLocaleUpperCase() + w.slice(1);
      }
      return w;
    }
  );
}

export function toAlternatingCase(text: string): string {
  let i = 0;
  return text
    .split("")
    .map((c) => {
      if (!/[\p{L}\p{N}]/u.test(c)) return c;
      const out = i % 2 === 0 ? c.toLocaleLowerCase() : c.toLocaleUpperCase();
      i++;
      return out;
    })
    .join("");
}

export interface CleanOptions {
  trimLines: boolean;
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  normalizeBreaks: boolean;
  removeZeroWidth: boolean;
}

export function cleanWhitespace(text: string, o: CleanOptions): string {
  let out = text;
  if (o.normalizeBreaks) out = out.replace(/\r\n?/g, "\n");
  if (o.removeZeroWidth) out = out.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "");
  if (o.collapseSpaces) out = out.replace(/[ \t\u00A0]{2,}/g, " ");
  if (o.trimLines) out = out.split("\n").map((l) => l.trim()).join("\n");
  if (o.removeEmptyLines) out = out.split("\n").filter((l) => l.trim() !== "").join("\n");
  return out;
}
