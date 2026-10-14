import { useEffect, useState } from "react";

export type Verse = {
  c: number;
  v: number;
  sa: string; // Sanskrit (Devanagari)
  tr: string; // transliteration
  wm: [string, string][]; // word-by-word meanings
  en: string; // Swami Sivananda
  en2: string; // Shri Purohit Swami
  hi: string; // Swami Tejomayananda
};

export type Chapter = {
  n: number;
  name: string;
  translit: string;
  title: string;
  count: number;
  summary: string;
  summaryHi: string;
};

export type LessonContent = {
  title: string;
  teaching: string;
  keyIdea: string;
  apply: { scenario: string; question: string; options: string[]; answer: number; why: string };
  reflect: string;
  practice: string;
};

export type Gita = {
  chapters: Chapter[];
  verses: Verse[];
  byChapter: Map<number, Verse[]>;
  get: (ref: string) => Verse | undefined;
  /** Plain-language meaning of a verse ("in simple words"). */
  simple: (ref: string) => string | undefined;
  /** Written lesson: teaching, real-life scenario, reflection, practice. */
  lesson: (id: string) => LessonContent | undefined;
};

export const LESSON_SIZE = 5;

/** "2.47" style reference. */
export const refOf = (v: { c: number; v: number }) => `${v.c}.${v.v}`;

export type Lesson = { id: string; chapter: number; index: number; refs: string[] };

/** Splits a chapter into lessons of ~5 verses, never leaving a lonely 1–2 verse tail. */
export function lessonsFor(g: Gita, chapter: number): Lesson[] {
  const verses = g.byChapter.get(chapter) ?? [];
  const count = Math.max(1, Math.round(verses.length / LESSON_SIZE));
  const lessons: Lesson[] = [];
  for (let i = 0; i < count; i++) {
    const start = Math.round((i * verses.length) / count);
    const end = Math.round(((i + 1) * verses.length) / count);
    lessons.push({ id: `${chapter}-${i + 1}`, chapter, index: i + 1, refs: verses.slice(start, end).map(refOf) });
  }
  return lessons;
}

export function allLessons(g: Gita): Lesson[] {
  return g.chapters.flatMap((c) => lessonsFor(g, c.n));
}

let cache: Promise<Gita> | null = null;

export function loadGita(): Promise<Gita> {
  if (!cache) {
    const base = import.meta.env.BASE_URL;
    const text = fetch(`${base}data/gita.json`).then((r) => {
      if (!r.ok) throw new Error(`Could not load the Gita (${r.status})`);
      return r.json() as Promise<{ chapters: Chapter[]; verses: Verse[] }>;
    });
    // Learning content is optional: the Gita still opens without it.
    const learning = fetch(`${base}data/lessons.json`)
      .then((r) => (r.ok ? (r.json() as Promise<{ simple: Record<string, string>; lessons: Record<string, LessonContent> }>) : null))
      .catch(() => null);
    cache = Promise.all([text, learning]).then(([{ chapters, verses }, extra]) => {
      const byChapter = new Map<number, Verse[]>();
      const byRef = new Map<string, Verse>();
      for (const v of verses) {
        if (!byChapter.has(v.c)) byChapter.set(v.c, []);
        byChapter.get(v.c)!.push(v);
        byRef.set(refOf(v), v);
      }
      return {
        chapters,
        verses,
        byChapter,
        get: (ref: string) => byRef.get(ref),
        simple: (ref: string) => extra?.simple[ref],
        lesson: (id: string) => extra?.lessons[id],
      };
    });
    cache.catch(() => (cache = null));
  }
  return cache;
}

export function useGita(): { gita: Gita | null; error: string | null } {
  const [gita, setGita] = useState<Gita | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    loadGita().then(
      (g) => live && setGita(g),
      (e: Error) => live && setError(e.message),
    );
    return () => {
      live = false;
    };
  }, []);
  return { gita, error };
}

/** First line of the Sanskrit, without the speaker line ("श्रीभगवानुवाच"). */
export function speaker(v: Verse): string | null {
  const first = v.tr.split("\n")[0].trim();
  return /uvācha$/.test(first) ? first : null;
}

export function bodyLines(text: string, v: Verse): string[] {
  const lines = text.split("\n");
  return speaker(v) && lines.length > 1 ? lines.slice(1) : lines;
}
