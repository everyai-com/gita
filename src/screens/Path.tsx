import { useEffect, useRef } from "react";
import { GUIDES } from "../content";
import { allLessons, lessonsFor, type Gita } from "../data";
import { Bar, Seal } from "../components";
import { IconCheck, IconChevron } from "../icons";
import { go } from "../router";
import { useStore } from "../store";

// Gentle zig-zag, like a footpath: offsets in px for each node in a chapter.
const WAVE = [0, 44, 72, 44, 0, -44, -72, -44];

export function Path({ gita }: { gita: Gita }) {
  const s = useStore();
  const all = allLessons(gita);
  const nextId = all.find((l) => !s.lessons[l.id])?.id;
  const doneCount = all.filter((l) => s.lessons[l.id]).length;
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="screen path">
      <header className="shead">
        <p className="eyebrow">Your path</p>
        <h1>140 lessons to live by</h1>
        <div className="path__progress">
          <Bar value={doneCount / all.length} />
          <span className="muted small">
            {doneCount}/{all.length} lessons
          </span>
        </div>
      </header>

      {gita.chapters.map((c) => {
        const lessons = lessonsFor(gita, c.n);
        const done = lessons.filter((l) => s.lessons[l.id]).length;
        return (
          <section key={c.n} className="unit">
            <button className="unit__head" onClick={() => go(`chapter/${c.n}`)}>
              <Seal n={c.n} done={done === lessons.length} />
              <span className="unit__text">
                <span className="kicker">Chapter {c.n} · {c.translit}</span>
                <b>{GUIDES[c.n].theme}</b>
                <small>
                  {done}/{lessons.length} lessons · {c.count} verses
                </small>
              </span>
              <IconChevron size={18} />
            </button>
            <ol className="trail">
              {lessons.map((l, i) => {
                const isDone = !!s.lessons[l.id];
                const isNext = l.id === nextId;
                return (
                  <li key={l.id} style={{ transform: `translateX(${WAVE[i % WAVE.length]}px)` }}>
                    <button
                      ref={isNext ? currentRef : undefined}
                      className={`node ${isDone ? "node--done" : ""} ${isNext ? "node--next" : ""}`}
                      onClick={() => go(`lesson/${l.id}`)}
                      aria-label={`Lesson ${l.index}, verses ${l.refs[0]} to ${l.refs[l.refs.length - 1]}${isDone ? ", done" : ""}`}
                    >
                      {isDone ? <IconCheck size={24} /> : <span>{l.index}</span>}
                    </button>
                    {isNext && (
                      <span className="node__tip">
                        {done === 0 && l.index === 1 ? "Start" : "Next"} · {gita.lesson(l.id)?.title ?? `${l.refs[0]}–${l.refs[l.refs.length - 1].split(".")[1]}`}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      <p className="footnote">Every lesson is open. Go in order, or wherever your heart leads.</p>
    </div>
  );
}
