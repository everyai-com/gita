import { GUIDES, TOPICS, topicById } from "../content";
import { allLessons, type Gita } from "../data";
import { ListenButton, BookmarkButton, Sanskrit, TopBar, meaningOf } from "../components";
import { IconChevron, TopicIcon } from "../icons";
import { go } from "../router";
import { useStore } from "../store";
import { NotFound } from "./Chapter";

/** Grid of life topics: the Gita by what's on your mind. */
export function TopicGrid({ limit }: { limit?: number }) {
  const { profile } = useStore();
  // Your own reasons first, then the rest.
  const sorted = [...TOPICS].sort((a, b) => Number(profile.reasons.includes(b.id)) - Number(profile.reasons.includes(a.id)));
  return (
    <div className="topics">
      {sorted.slice(0, limit).map((t) => (
        <button key={t.id} className="topic" onClick={() => go(`topic/${t.id}`)}>
          <span className="topic__icon">
            <TopicIcon id={t.id} size={22} />
          </span>
          <b>{t.title}</b>
        </button>
      ))}
    </div>
  );
}

export function TopicScreen({ gita, id }: { gita: Gita; id: string }) {
  const s = useStore();
  const t = topicById(id);
  if (!t) return <NotFound />;
  const lessons = allLessons(gita).filter((l) => l.refs.some((r) => t.refs.includes(r)));
  const chapter = gita.chapters.find((c) => c.n === t.chapter)!;

  return (
    <div className="screen topicpage">
      <TopBar fallback="today" />
      <header className="topicpage__head">
        <span className="topic__icon topic__icon--lg">
          <TopicIcon id={t.id} size={30} />
        </span>
        <p className="eyebrow">Gita for life</p>
        <h1>{t.title}</h1>
        <p className="lead">{t.line}</p>
      </header>

      {t.refs.map((ref) => {
        const v = gita.get(ref);
        if (!v) return null;
        return (
          <article key={ref} className="card tverse">
            <div className="tverse__head">
              <button className="vnum" onClick={() => go(`verse/${v.c}/${v.v}`)}>
                {ref}
              </button>
              <span className="actions">
                <ListenButton v={v} compact />
                <BookmarkButton v={v} />
              </span>
            </div>
            <p className="tverse__simple">{gita.simple(ref) ?? meaningOf(v, s.settings)}</p>
            {s.settings.showSanskrit && <Sanskrit v={v} />}
            <p className="tverse__tr">{meaningOf(v, s.settings)}</p>
          </article>
        );
      })}

      {lessons.length > 0 && (
        <section>
          <h2 className="sectitle">Lessons on this</h2>
          <div className="list">
            {lessons.slice(0, 6).map((l) => (
              <button key={l.id} className="listrow" onClick={() => go(`lesson/${l.id}`)}>
                <span className={`dot ${s.lessons[l.id] ? "dot--done" : ""}`}>{l.chapter}</span>
                <span>
                  <b>{gita.lesson(l.id)?.title ?? `Chapter ${l.chapter}, lesson ${l.index}`}</b>
                  <small>{gita.lesson(l.id)?.keyIdea ?? `Verses ${l.refs[0]} – ${l.refs[l.refs.length - 1]}`}</small>
                </span>
                <IconChevron size={18} />
              </button>
            ))}
          </div>
        </section>
      )}

      <button className="card rowcard" onClick={() => go(`chapter/${chapter.n}`)}>
        <span>
          <b>Go deeper: Chapter {chapter.n}</b>
          <small>
            {chapter.translit} · {GUIDES[chapter.n].theme}
          </small>
        </span>
        <IconChevron size={18} />
      </button>
    </div>
  );
}
