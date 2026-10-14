import { useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { dayKey } from "./content";

export type Settings = {
  lang: "en" | "hi";
  translation: "en" | "en2";
  showSanskrit: boolean;
  showTranslit: boolean;
  textSize: 0 | 1 | 2;
  theme: "system" | "light" | "dark";
  dailyGoal: 1 | 2 | 3; // lessons per day
  showSimple: boolean; // "in simple words" under every verse
  reminder: "morning" | "evening" | "off";
};

export type JournalEntry = { id: string; at: string; prompt: string; text: string; lessonId?: string; ref?: string };
export type Insight = { lessonId: string; text: string; at: string };
export type Profile = { reasons: string[]; level: "new" | "some" | "deep"; sankalpaAt: string | null };

export type State = {
  onboarded: boolean;
  settings: Settings;
  learned: Record<string, string>; // verse ref -> day learned
  lessons: Record<string, string>; // lesson id -> day completed
  essentials: number[]; // completed essential days
  bookmarks: string[]; // verse refs, newest first
  lastRead: string | null; // verse ref
  activity: Record<string, number>; // day -> lessons completed that day
  profile: Profile;
  journal: JournalEntry[]; // newest first
  insights: Insight[]; // remembered key ideas, newest first
};

const KEY = "gita.v1";

const DEFAULT: State = {
  onboarded: false,
  settings: { lang: "en", translation: "en", showSanskrit: true, showTranslit: true, textSize: 1, theme: "system", dailyGoal: 1, showSimple: true, reminder: "morning" },
  learned: {},
  lessons: {},
  essentials: [],
  bookmarks: [],
  lastRead: null,
  activity: {},
  profile: { reasons: [], level: "new", sankalpaAt: null },
  journal: [],
  insights: [],
};

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const saved = JSON.parse(raw) as Partial<State>;
    return { ...DEFAULT, ...saved, settings: { ...DEFAULT.settings, ...saved.settings }, profile: { ...DEFAULT.profile, ...saved.profile } };
  } catch {
    return DEFAULT;
  }
}

let state = read();
const listeners = new Set<() => void>();

/**
 * Progress lives only on this device: no account, no server.
 * On iOS it is also mirrored to native storage (UserDefaults), because the
 * system may clear a web view's localStorage when the phone is low on space.
 */
export function update(fn: (s: State) => State) {
  state = fn(state);
  const json = JSON.stringify(state);
  try {
    localStorage.setItem(KEY, json);
  } catch {
    // Private mode or storage full: progress still works for this session.
  }
  if (Capacitor.isNativePlatform()) Preferences.set({ key: KEY, value: json }).catch(() => {});
  listeners.forEach((l) => l());
}

/** On launch in the iOS app, restore progress from native storage if the web view lost it. */
export async function restoreFromDevice() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { value } = await Preferences.get({ key: KEY });
    if (!value) {
      if (state !== DEFAULT) await Preferences.set({ key: KEY, value: JSON.stringify(state) });
      return;
    }
    if (!localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, value);
      state = read();
      listeners.forEach((l) => l());
    }
  } catch {
    // Native storage unavailable: localStorage still holds progress.
  }
}

export function useStore(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) =>
  update((s) => ({ ...s, settings: { ...s.settings, [key]: value } }));

export function toggleBookmark(ref: string) {
  update((s) => ({
    ...s,
    bookmarks: s.bookmarks.includes(ref) ? s.bookmarks.filter((r) => r !== ref) : [ref, ...s.bookmarks],
  }));
}

export function markRead(ref: string) {
  if (state.lastRead !== ref) update((s) => ({ ...s, lastRead: ref }));
}

/** Records a finished lesson (or essentials day) and the verses in it. */
export function completeLesson(opts: { lessonId?: string; essentialDay?: number; refs: string[] }) {
  const today = dayKey();
  update((s) => {
    const learned = { ...s.learned };
    for (const r of opts.refs) learned[r] ??= today;
    return {
      ...s,
      learned,
      lessons: opts.lessonId ? { ...s.lessons, [opts.lessonId]: s.lessons[opts.lessonId] ?? today } : s.lessons,
      essentials:
        opts.essentialDay && !s.essentials.includes(opts.essentialDay) ? [...s.essentials, opts.essentialDay] : s.essentials,
      activity: { ...s.activity, [today]: (s.activity[today] ?? 0) + 1 },
    };
  });
}

/** Consecutive days with at least one lesson, counting today or yesterday as the latest. */
export function streakOf(activity: Record<string, number>): number {
  const d = new Date();
  if (!activity[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (activity[dayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Last 7 days, oldest first, for the week strip. */
export function lastWeek(activity: Record<string, number>) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: d.toLocaleDateString(undefined, { weekday: "narrow" }), done: (activity[dayKey(d)] ?? 0) > 0, today: i === 6 };
  });
}

export function addJournal(entry: Omit<JournalEntry, "id" | "at">) {
  const now = new Date().toISOString();
  update((s) => ({ ...s, journal: [{ ...entry, id: now, at: now }, ...s.journal] }));
}

export function deleteJournal(id: string) {
  update((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== id) }));
}

export function toggleInsight(lessonId: string, text: string) {
  update((s) => ({
    ...s,
    insights: s.insights.some((i) => i.lessonId === lessonId)
      ? s.insights.filter((i) => i.lessonId !== lessonId)
      : [{ lessonId, text, at: new Date().toISOString() }, ...s.insights],
  }));
}

export const setProfile = (p: Partial<Profile>) => update((s) => ({ ...s, profile: { ...s.profile, ...p } }));
