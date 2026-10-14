import { useEffect, useMemo, useRef, useState } from "react";
import { GUIDES } from "../content";
import { refOf, type Gita, type Verse } from "../data";
import {
  BookmarkButton,
  ListenButton,
  Sanskrit,
  Seal,
  ShareButton,
  TopBar,
  Translit,
  Words,
  meaningOf,
  speakerLabel,
} from "../components";
import { IconBack, IconChevron, IconSearch, IconText } from "../icons";
import { go } from "../router";
import { markRead, useStore } from "../store";
import { NotFound } from "./Chapter";
import { ReadingSettings, Sheet } from "./Settings";
import { TopicGrid } from "./Topics";

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Library({ gita, view }: { gita: Gita; view?: string }) {
  const s = useStore();
  const topics = view === "topics";
  const [q, setQ] = useState("");
  const results = useMemo(() => search(gita, q), [gita, q]);

  return (
    <div className="screen library">
      <header className="shead">
        <p className="eyebrow">Bhagavad Gita</p>
        <h1>All 700 verses</h1>
      </header>
      <div className="seg seg--wide" role="tablist" aria-label="Browse by">
        <button role="tab" aria-checked={!topics} onClick={() => go("read")}>
          18 chapters
        </button>
        <button role="tab" aria-checked={topics} onClick={() => go("read/topics")}>
          Life topics
        </button>
      </div>
      <label className="search">
        <IconSearch size={20} />
        <input
          type="search"
          placeholder="Search a word, or jump to 2.47"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search the Gita"
        />
      </label>

      {topics && !q.trim() ? (
        <TopicGrid />
      ) : q.trim() ? (
        <div className="results">
          <p className="muted small">{results.length ? `${results.length}${results.length === 40 ? "+" : ""} verses` : "No verses found. Try another word."}</p>
          {results.map((v) => (
            <button key={refOf(v)} className="result" onClick={() => go(`verse/${v.c}/${v.v}`)}>
              <span className="kicker">Verse {refOf(v)}</span>
              <span>{gita.simple(refOf(v)) ?? meaningOf(v, s.settings)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="list">
          {gita.chapters.map((c) => (
            <button key={c.n} className="listrow listrow--chapter" onClick={() => go(`read/${c.n}`)}>
              <Seal n={c.n} size={44} />
              <span>
                <b>{c.translit}</b>
                <small>
                  {GUIDES[c.n].theme} · {c.count} verses
                </small>
              </span>
              <IconChevron size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function search(g: Gita, raw: string): Verse[] {
  const q = raw.trim();
  if (!q) return [];
  const ref = q.match(/^(\d{1,2})\s*[.:\s]\s*(\d{1,2})$/);
  if (ref) {
    const v = g.get(`${+ref[1]}.${+ref[2]}`);
    return v ? [v] : [];
  }
  // Match from the start of a word, so "anger" does not find "danger".
  const re = new RegExp(`(^|[^a-z])${fold(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  const out: Verse[] = [];
  for (const v of g.verses) {
    if (re.test(fold(v.en)) || re.test(fold(v.en2)) || re.test(fold(v.tr)) || v.hi.includes(q) || v.sa.includes(q)) {
      out.push(v);
      if (out.length === 40) break;
    }
  }
  return out;
}

export function Reader({ gita, n, focus }: { gita: Gita; n: number; focus?: number }) {
  const s = useStore();
  const [aa, setAa] = useState(false);
  const c = gita.chapters.find((x) => x.n === n);
  const verses = gita.byChapter.get(n) ?? [];
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = focus ? document.getElementById(`v-${n}-${focus}`) : null;
    if (!el) {
      root.current?.scrollTo({ top: 0 });
      return;
    }
    el.scrollIntoView({ block: "start" });
    // Web fonts change line heights; re-anchor once they have loaded.
    document.fonts?.ready.then(() => el.scrollIntoView({ block: "start" }));
  }, [n, focus]);

  // Remember the verse at the top of the screen for "Continue reading".
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.find((e) => e.isIntersecting);
        if (top) markRead((top.target as HTMLElement).dataset.ref!);
      },
      { root: root.current, rootMargin: "0px 0px -70% 0px" },
    );
    root.current?.querySelectorAll("[data-ref]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [n]);

  if (!c) return <NotFound />;

  return (
    <div className="screen reader" ref={root}>
      <TopBar fallback="read" title={<span className="kicker">Chapter {n}</span>}>
        <button className="iconbtn" onClick={() => setAa(true)} aria-label="Reading settings">
          <IconText />
        </button>
      </TopBar>
      <header className="reader__head">
        <p className="chapter__sa" lang="sa">{c.name}</p>
        <h1>{c.translit}</h1>
        <p className="lead">{GUIDES[n].oneLine}</p>
      </header>

      {verses.map((v) => (
        <article key={v.v} id={`v-${v.c}-${v.v}`} data-ref={refOf(v)} className="rverse">
          <div className="rverse__head">
            <button className="vnum" onClick={() => go(`verse/${v.c}/${v.v}`)}>
              {refOf(v)}
            </button>
            {speakerLabel(v) && <span className="speaker">{speakerLabel(v)}</span>}
            <span className="actions">
              <ListenButton v={v} compact />
              <BookmarkButton v={v} />
            </span>
          </div>
          {s.settings.showSanskrit && <Sanskrit v={v} />}
          {s.settings.showTranslit && <Translit v={v} />}
          <p className="meaning">{meaningOf(v, s.settings)}</p>
          {s.settings.showSimple && gita.simple(refOf(v)) && (
            <p className="rsimple">
              <span>In simple words</span>
              {gita.simple(refOf(v))}
            </p>
          )}
        </article>
      ))}

      <nav className="pager">
        {n > 1 ? (
          <button className="btn btn--secondary" onClick={() => go(`read/${n - 1}`)}>
            <IconBack size={18} /> Chapter {n - 1}
          </button>
        ) : <span />}
        {n < 18 && (
          <button className="btn btn--primary" onClick={() => go(`read/${n + 1}`)}>
            Chapter {n + 1} <IconChevron size={18} />
          </button>
        )}
      </nav>

      {aa && (
        <Sheet title="Reading" onClose={() => setAa(false)}>
          <ReadingSettings />
        </Sheet>
      )}
    </div>
  );
}

export function VerseScreen({ gita, c, v: vn }: { gita: Gita; c: number; v: number }) {
  const s = useStore();
  const v = gita.get(`${c}.${vn}`);
  const [aa, setAa] = useState(false);
  useEffect(() => {
    if (v) markRead(refOf(v));
    document.querySelector(".verse")?.scrollTo({ top: 0 });
  }, [v]);
  if (!v) return <NotFound />;
  const list = gita.byChapter.get(c)!;
  const i = list.indexOf(v);
  const prev = i > 0 ? list[i - 1] : gita.byChapter.get(c - 1)?.at(-1);
  const next = i < list.length - 1 ? list[i + 1] : gita.byChapter.get(c + 1)?.[0];
  const other = s.settings.lang === "hi" ? v.en : s.settings.translation === "en2" ? v.en : v.en2;

  return (
    <div className="screen verse">
      <TopBar fallback={`read/${c}`} title={<span className="kicker">Chapter {c} · Verse {vn}</span>}>
        <button className="iconbtn" onClick={() => setAa(true)} aria-label="Reading settings">
          <IconText />
        </button>
      </TopBar>

      <div className="verse__main">
        {speakerLabel(v) && <p className="speaker">{speakerLabel(v)}</p>}
        <Sanskrit v={v} size="lg" />
        {s.settings.showTranslit && <Translit v={v} />}
        <p className="verse__meaning">{meaningOf(v, s.settings)}</p>
        {gita.simple(refOf(v)) && (
          <div className="simple simple--center">
            <span className="simple__label">In simple words</span>
            <p>{gita.simple(refOf(v))}</p>
          </div>
        )}
        <div className="actions actions--bar">
          <ListenButton v={v} />
          <BookmarkButton v={v} />
          <ShareButton v={v} />
        </div>
      </div>

      <section className="card">
        <h2 className="sectitle">Word by word</h2>
        <Words v={v} />
      </section>

      {other && (
        <section className="card">
          <h2 className="sectitle">{s.settings.lang === "hi" ? "In English" : "Another translation"}</h2>
          <p className="prose">{other}</p>
          <p className="credit">{s.settings.lang === "hi" || s.settings.translation === "en2" ? "Swami Sivananda" : "Shri Purohit Swami"}</p>
        </section>
      )}
      {s.settings.lang === "en" && v.hi && (
        <details className="card more">
          <summary>हिन्दी में अर्थ</summary>
          <p className="prose" lang="hi">{v.hi}</p>
        </details>
      )}

      <nav className="pager">
        {prev ? (
          <button className="btn btn--secondary" onClick={() => go(`verse/${prev.c}/${prev.v}`)}>
            <IconBack size={18} /> {refOf(prev)}
          </button>
        ) : <span />}
        {next && (
          <button className="btn btn--primary" onClick={() => go(`verse/${next.c}/${next.v}`)}>
            {refOf(next)} <IconChevron size={18} />
          </button>
        )}
      </nav>

      {aa && (
        <Sheet title="Reading" onClose={() => setAa(false)}>
          <ReadingSettings />
        </Sheet>
      )}
    </div>
  );
}
