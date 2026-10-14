import { useState, type ReactNode } from "react";
import { bodyLines, refOf, speaker, type Verse } from "./data";
import { IconBack, IconBookmark, IconListen, IconShare, IconStop } from "./icons";
import { back } from "./router";
import { shareText } from "./native";
import { canSpeak, speak, useSpeaking } from "./speech";
import { toggleBookmark, useStore, type Settings } from "./store";

export function meaningOf(v: Verse, s: Settings): string {
  if (s.lang === "hi" && v.hi) return v.hi;
  return (s.translation === "en2" && v.en2) || v.en;
}

/** Speaker label like "Krishna said" in plain words. */
export function speakerLabel(v: Verse): string | null {
  const sp = speaker(v);
  if (!sp) return null;
  if (sp.startsWith("śhrī bhagavān")) return "Krishna says";
  if (sp.startsWith("arjuna")) return "Arjuna says";
  if (sp.startsWith("sañjaya")) return "Sanjaya says";
  if (sp.startsWith("dhṛitarāśhtra")) return "Dhritarashtra says";
  return null;
}

export function Sanskrit({ v, size = "md" }: { v: Verse; size?: "md" | "lg" }) {
  return (
    <p className={`sanskrit sanskrit--${size}`} lang="sa">
      {bodyLines(v.sa, v).map((l, i) => (
        <span key={i}>{l.replace(/[।|]+\s*$/, "")}</span>
      ))}
    </p>
  );
}

export function Translit({ v }: { v: Verse }) {
  return (
    <p className="translit">
      {bodyLines(v.tr, v).map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </p>
  );
}

export function Words({ v }: { v: Verse }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!v.wm.length) return null;
  return (
    <div className="words">
      <div className="words__list">
        {v.wm.map(([w, m], i) => (
          <button key={i} className="word" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <b>{w}</b>
            {open === i && <small>{m}</small>}
          </button>
        ))}
      </div>
      <p className="words__hint">Tap a word to see its meaning</p>
    </div>
  );
}

export function ListenButton({ v, compact }: { v: Verse; compact?: boolean }) {
  const { settings } = useStore();
  const id = refOf(v);
  const on = useSpeaking(id);
  if (!canSpeak()) return null;
  const play = () =>
    speak(id, [
      { text: bodyLines(v.sa, v).join(" "), lang: "hi-IN" },
      { text: meaningOf(v, settings), lang: settings.lang === "hi" ? "hi-IN" : "en-IN" },
    ]);
  return (
    <button className={`iconbtn ${compact ? "" : "iconbtn--label"} ${on ? "is-on" : ""}`} onClick={play} aria-label={on ? "Stop" : "Listen"}>
      {on ? <IconStop size={20} /> : <IconListen size={20} />}
      {!compact && <span>{on ? "Stop" : "Listen"}</span>}
    </button>
  );
}

export function BookmarkButton({ v }: { v: Verse }) {
  const { bookmarks } = useStore();
  const saved = bookmarks.includes(refOf(v));
  return (
    <button
      className={`iconbtn ${saved ? "is-on" : ""}`}
      onClick={() => toggleBookmark(refOf(v))}
      aria-label={saved ? "Remove from saved" : "Save verse"}
      aria-pressed={saved}
    >
      <IconBookmark size={20} filled={saved} />
    </button>
  );
}

export function ShareButton({ v }: { v: Verse }) {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const text = `${bodyLines(v.sa, v).join("\n")}\n\n“${meaningOf(v, settings)}”\n— Bhagavad Gita ${refOf(v)}`;
    if ((await shareText(text)) === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  return (
    <button className="iconbtn" onClick={share} aria-label="Share verse">
      <IconShare size={20} />
      {copied && <span className="toast">Copied</span>}
    </button>
  );
}

/** Chapter number inside a copper ring, echoing the Sahadeva mark. */
export function Seal({ n, done, size = 48 }: { n: number | string; done?: boolean; size?: number }) {
  return (
    <span className={`seal ${done ? "seal--done" : ""}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22.5" />
        <circle cx="24" cy="24" r="18" className="seal__inner" />
      </svg>
      <b>{n}</b>
    </span>
  );
}

export function Ring({ value, size = 56, stroke = 5, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ring__track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="ring__value"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, Math.max(0, value)))}
        />
      </svg>
      <span className="ring__label">{children}</span>
    </span>
  );
}

export function Bar({ value }: { value: number }) {
  return (
    <span className="bar" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.min(100, value * 100)}%` }} />
    </span>
  );
}

export function TopBar({ fallback, title, children }: { fallback: string; title?: ReactNode; children?: ReactNode }) {
  return (
    <header className="topbar">
      <button className="iconbtn" onClick={() => back(fallback)} aria-label="Back">
        <IconBack />
      </button>
      <div className="topbar__title">{title}</div>
      <div className="topbar__actions">{children}</div>
    </header>
  );
}

export function Loading() {
  return (
    <div className="loading" role="status">
      <span />
      <p>Opening the Gita…</p>
    </div>
  );
}
