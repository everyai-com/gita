import { useState } from "react";
import { allLessons, lessonsFor, type Gita } from "../data";
import { Seal, meaningOf } from "../components";
import { IconBell, IconBookmark, IconChevron, IconDiya, IconJournal, IconSparkle, Mark } from "../icons";
import { go } from "../router";
import { deleteJournal, setSetting, streakOf, update, useStore, type Settings } from "../store";
import { ReadingSettings } from "./Settings";

type Tab = "insights" | "journal" | "saved";

export function You({ gita }: { gita: Gita }) {
  const s = useStore();
  const [tab, setTab] = useState<Tab>("insights");
  const [confirmReset, setConfirmReset] = useState(false);
  const lessons = allLessons(gita);
  const learned = Object.keys(s.learned).length;

  return (
    <div className="screen you">
      <header className="shead">
        <p className="eyebrow">Your journey</p>
        <h1>
          {learned >= gita.verses.length / 100
            ? `${Math.round((learned / gita.verses.length) * 100)}% of the Gita`
            : learned
              ? `${learned} verses understood`
              : "Just beginning"}
        </h1>
      </header>

      <div className="statgrid">
        <div className="card stat">
          <b className="stat__streak">
            <IconDiya size={24} /> {streakOf(s.activity)}
          </b>
          <small>day streak</small>
        </div>
        <div className="card stat">
          <b>{learned}</b>
          <small>of {gita.verses.length} verses</small>
        </div>
        <div className="card stat">
          <b>{Object.keys(s.lessons).length}</b>
          <small>of {lessons.length} lessons</small>
        </div>
        <div className="card stat">
          <b>{s.journal.length}</b>
          <small>reflections</small>
        </div>
      </div>

      <section>
        <h2 className="sectitle">18 chapters</h2>
        <div className="seals">
          {gita.chapters.map((c) => {
            const ls = lessonsFor(gita, c.n);
            const done = ls.filter((l) => s.lessons[l.id]).length;
            return (
              <button key={c.n} className="sealbtn" onClick={() => go(`chapter/${c.n}`)} aria-label={`Chapter ${c.n}: ${done} of ${ls.length} lessons`}>
                <Seal n={c.n} size={44} done={done === ls.length} />
                <i style={{ width: `${(done / ls.length) * 100}%` }} />
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="seg seg--wide" role="tablist">
          <button role="tab" aria-checked={tab === "insights"} onClick={() => setTab("insights")}>
            Insights
          </button>
          <button role="tab" aria-checked={tab === "journal"} onClick={() => setTab("journal")}>
            Journal
          </button>
          <button role="tab" aria-checked={tab === "saved"} onClick={() => setTab("saved")}>
            Saved
          </button>
        </div>

        {tab === "insights" &&
          (s.insights.length ? (
            <div className="insights">
              {s.insights.map((x) => (
                <button key={x.lessonId} className="insight" onClick={() => go(`lesson/${x.lessonId}`)}>
                  <IconSparkle size={18} />
                  <span>
                    <b>{x.text}</b>
                    <small>{gita.lesson(x.lessonId)?.title} · Chapter {x.lessonId.split("-")[0]}</small>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Empty icon={<IconSparkle />} text="Tap Remember on a lesson's key idea to keep it here: your personal book of wisdom." />
          ))}

        {tab === "journal" &&
          (s.journal.length ? (
            <div className="journal">
              {s.journal.map((j) => (
                <article key={j.id} className="card entry">
                  <header>
                    <span className="kicker">
                      {new Date(j.at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                      {j.ref ? ` · Verse ${j.ref}` : ""}
                    </span>
                    <button className="linkrow linkrow--sm" onClick={() => deleteJournal(j.id)}>
                      Delete
                    </button>
                  </header>
                  <p className="entry__prompt">{j.prompt}</p>
                  <p className="entry__text">{j.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <Empty icon={<IconJournal />} text="Each lesson ends with a reflection. What you write stays here, only on this device." />
          ))}

        {tab === "saved" &&
          (s.bookmarks.length ? (
            <div className="list">
              {s.bookmarks.map((ref) => {
                const v = gita.get(ref);
                if (!v) return null;
                return (
                  <button key={ref} className="listrow" onClick={() => go(`verse/${v.c}/${v.v}`)}>
                    <span className="dot">
                      <IconBookmark size={16} filled />
                    </span>
                    <span>
                      <b>Verse {ref}</b>
                      <small className="clamp">{gita.simple(ref) ?? meaningOf(v, s.settings)}</small>
                    </span>
                    <IconChevron size={18} />
                  </button>
                );
              })}
            </div>
          ) : (
            <Empty icon={<IconBookmark />} text="Tap the bookmark on any verse to keep it here." />
          ))}
      </section>

      <section>
        <h2 className="sectitle">Daily rhythm</h2>
        <div className="card settings">
          <div className="setting">
            <span>Time each day</span>
            <div className="seg" role="radiogroup" aria-label="Daily goal">
              {([1, 2, 3] as Settings["dailyGoal"][]).map((g) => (
                <button key={g} role="radio" aria-checked={s.settings.dailyGoal === g} onClick={() => setSetting("dailyGoal", g)}>
                  {g * 5}m
                </button>
              ))}
            </div>
          </div>
          <div className="setting">
            <span className="withicon">
              <IconBell size={18} /> Reminder
            </span>
            <div className="seg" role="radiogroup" aria-label="Reminder">
              {(
                [
                  ["morning", "7am"],
                  ["evening", "8pm"],
                  ["off", "Off"],
                ] as [Settings["reminder"], string][]
              ).map(([r, l]) => (
                <button key={r} role="radio" aria-checked={s.settings.reminder === r} onClick={() => setSetting("reminder", r)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="sectitle">Reading</h2>
        <div className="card">
          <ReadingSettings />
        </div>
      </section>

      <section className="about">
        <Mark size={36} />
        <p className="small muted">
          Gita · a Sahadeva companion. Sanskrit, transliteration and word meanings from the public-domain{" "}
          <a href="https://github.com/gita/gita" target="_blank" rel="noreferrer">
            gita/gita
          </a>{" "}
          dataset. Translations by Swami Sivananda (Clear), Shri Purohit Swami (Poetic) and Swami Tejomayananda (Hindi). Lessons and simple
          explanations are written for this app.
        </p>
        <p className="freeline">Free forever · No ads · No account · No tracking</p>
        <p className="small muted">
          Your progress, journal and saved verses are kept only on this device. Nothing is sent anywhere.{" "}
          <a href="https://gita.everyai-com.workers.dev/privacy" target="_blank" rel="noreferrer">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="https://gita.everyai-com.workers.dev/support" target="_blank" rel="noreferrer">
            Support
          </a>
        </p>
        {confirmReset ? (
          <div className="btnrow">
            <button
              className="btn btn--danger"
              onClick={() => {
                update((x) => ({ ...x, learned: {}, lessons: {}, essentials: [], activity: {}, lastRead: null }));
                setConfirmReset(false);
              }}
            >
              Erase progress
            </button>
            <button className="btn btn--secondary" onClick={() => setConfirmReset(false)}>
              Keep it
            </button>
          </div>
        ) : (
          <button className="btn btn--quiet" onClick={() => setConfirmReset(true)}>
            Reset progress
          </button>
        )}
      </section>
    </div>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="card emptycard">
      {icon}
      <p className="muted small">{text}</p>
    </div>
  );
}
