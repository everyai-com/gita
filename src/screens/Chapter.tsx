import { GUIDES } from "../content";
import { lessonsFor, type Gita } from "../data";
import { Bar, Seal, TopBar } from "../components";
import { IconCheck, IconChevron, IconRead } from "../icons";
import { go } from "../router";
import { useStore } from "../store";

export function ChapterScreen({ gita, n }: { gita: Gita; n: number }) {
  const s = useStore();
  const c = gita.chapters.find((x) => x.n === n);
  if (!c) return <NotFound />;
  const g = GUIDES[n];
  const lessons = lessonsFor(gita, n);
  const done = lessons.filter((l) => s.lessons[l.id]).length;
  const next = lessons.find((l) => !s.lessons[l.id]) ?? lessons[0];

  return (
    <div className="screen chapter">
      <TopBar fallback="path" />
      <header className="chapter__hero">
        <Seal n={n} size={64} done={done === lessons.length} />
        <p className="chapter__sa" lang="sa">{c.name}</p>
        <p className="eyebrow">Chapter {n} · {c.translit}</p>
        <h1>{g.theme}</h1>
        <p className="lead">{g.oneLine}</p>
        <div className="path__progress">
          <Bar value={done / lessons.length} />
          <span className="muted small">
            {done}/{lessons.length} lessons
          </span>
        </div>
        <div className="btnrow">
          <button className="btn btn--primary" onClick={() => go(`lesson/${next.id}`)}>
            {done === 0 ? "Start chapter" : done === lessons.length ? "Practise again" : `Continue · Lesson ${next.index}`}
          </button>
          <button className="btn btn--secondary" onClick={() => go(`read/${n}`)}>
            <IconRead size={20} /> Read
          </button>
        </div>
      </header>

      <section className="card">
        <h2 className="sectitle">3 big ideas</h2>
        <ol className="ideas">
          {g.takeaways.map(([idea, ref], i) => (
            <li key={ref}>
              <span className="ideas__n">{i + 1}</span>
              <span>
                <span>{idea}</span>
                <button className="reflink" onClick={() => go(`verse/${ref.replace(".", "/")}`)}>
                  Verse {ref}
                </button>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <details className="card more">
        <summary>The story of this chapter</summary>
        <p className="prose">{s.settings.lang === "hi" ? c.summaryHi : c.summary}</p>
      </details>

      <section>
        <h2 className="sectitle">Lessons</h2>
        <div className="list">
          {lessons.map((l) => (
            <button key={l.id} className="listrow" onClick={() => go(`lesson/${l.id}`)}>
              <span className={`dot ${s.lessons[l.id] ? "dot--done" : ""}`}>{s.lessons[l.id] ? <IconCheck size={16} /> : l.index}</span>
              <span>
                <b>{gita.lesson(l.id)?.title ?? `Lesson ${l.index}`}</b>
                <small>
                  Lesson {l.index} · verses {l.refs[0]} – {l.refs[l.refs.length - 1]}
                </small>
              </span>
              <IconChevron size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="screen">
      <TopBar fallback="today" />
      <div className="empty">
        <h2>That page isn't here.</h2>
        <button className="btn btn--primary" onClick={() => go("today")}>
          Go to Today
        </button>
      </div>
    </div>
  );
}
