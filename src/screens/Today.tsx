import { ESSENTIALS, GUIDES, verseOfTheDay, dayKey } from "../content";
import { TopicGrid } from "./Topics";
import { allLessons, type Gita } from "../data";
import { BookmarkButton, ListenButton, Ring, Sanskrit, ShareButton, meaningOf, speakerLabel } from "../components";
import { IconChevron, IconDiya, IconRead, Mark } from "../icons";
import { go } from "../router";
import { lastWeek, streakOf, useStore } from "../store";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Peaceful night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** What the "Continue" card should open next. */
export function nextStep(g: Gita, s: ReturnType<typeof useStore>) {
  const nextEssential = ESSENTIALS.find((d) => !s.essentials.includes(d.day));
  const startedPath = Object.keys(s.lessons).length > 0;
  if (nextEssential && !startedPath && s.profile.level !== "deep") return { kind: "essential" as const, day: nextEssential };
  const lesson = allLessons(g).find((l) => !s.lessons[l.id]);
  return lesson ? { kind: "lesson" as const, lesson } : null;
}

export function Today({ gita }: { gita: Gita }) {
  const s = useStore();
  const streak = streakOf(s.activity);
  const doneToday = s.activity[dayKey()] ?? 0;
  const week = lastWeek(s.activity);
  const next = nextStep(gita, s);
  const vod = gita.get(verseOfTheDay())!;
  const learnedCount = Object.keys(s.learned).length;
  const goalMet = doneToday >= s.settings.dailyGoal;
  // The practice from the most recent lesson finished today or yesterday.
  const lastLesson = Object.entries(s.lessons).sort((a, b) => b[1].localeCompare(a[1]))[0];
  const lastEssential = s.essentials[s.essentials.length - 1];
  const practice =
    (lastLesson && gita.lesson(lastLesson[0])?.practice) ?? (lastEssential ? ESSENTIALS[lastEssential - 1].practice : undefined);

  return (
    <div className="screen today">
      <header className="today__head">
        <div className="brandrow">
          <Mark size={30} />
          <span className="eyebrow">{greeting()}</span>
        </div>
        <span className={`pill ${streak ? "pill--lit" : ""}`} title="Day streak">
          <IconDiya size={18} />
          <b>{streak}</b>
        </span>
      </header>

      <h1 className="today__title">
        {goalMet ? "Today's step is done." : "One small step today."}
      </h1>

      <ol className="week" aria-label="This week">
        {week.map((d) => (
          <li key={d.key} className={`${d.done ? "is-done" : ""} ${d.today ? "is-today" : ""}`}>
            <span>{d.label}</span>
            <i aria-label={d.done ? "practised" : "not yet"} />
          </li>
        ))}
      </ol>

      {next && (
        <button
          className="hero"
          onClick={() => go(next.kind === "essential" ? `essentials/${next.day.day}` : `lesson/${next.lesson.id}`)}
        >
          <span className="hero__art" aria-hidden="true" />
          <span className="hero__body">
            {next.kind === "essential" ? (
              <>
                <span className="kicker">Start here · Essentials day {next.day.day} of 7</span>
                <span className="hero__title">{next.day.title}</span>
                <span className="hero__meta">{next.day.why} {next.day.refs.length} verses · 3 min</span>
              </>
            ) : (
              <>
                <span className="kicker">
                  Chapter {next.lesson.chapter} · Lesson {next.lesson.index}
                </span>
                <span className="hero__title">{gita.lesson(next.lesson.id)?.title ?? GUIDES[next.lesson.chapter].theme}</span>
                <span className="hero__meta">
                  Verses {next.lesson.refs[0]}–{next.lesson.refs[next.lesson.refs.length - 1].split(".")[1]} · {next.lesson.refs.length} verses · 4 min
                </span>
              </>
            )}
            <span className="btn btn--primary btn--full">{goalMet ? "Keep going" : Object.keys(s.learned).length ? "Continue" : "Begin"}</span>
          </span>
        </button>
      )}

      <section className="card goal">
        <Ring value={doneToday / s.settings.dailyGoal} size={58}>
          <b>{Math.min(doneToday, s.settings.dailyGoal)}</b>/{s.settings.dailyGoal}
        </Ring>
        <div>
          <h3>{goalMet ? "Daily goal reached" : "Daily goal"}</h3>
          <p className="muted small">
            {goalMet
              ? streak > 1 ? `${streak} days in a row. Keep the lamp lit.` : "Come back tomorrow to grow your streak."
              : `${s.settings.dailyGoal} lesson${s.settings.dailyGoal > 1 ? "s" : ""} a day · about ${s.settings.dailyGoal * 4} minutes`}
          </p>
        </div>
      </section>

      {practice && (
        <section className="card practicecard">
          <span className="kicker">Your practice today</span>
          <p>{practice}</p>
        </section>
      )}

      <section>
        <div className="sechead">
          <h2 className="sectitle">What's on your mind?</h2>
          <button className="linkrow linkrow--sm" onClick={() => go("read/topics")}>
            All topics <IconChevron size={16} />
          </button>
        </div>
        <TopicGrid limit={6} />
      </section>

      <section className="card vod">
        <div className="vod__head">
          <span className="kicker">Verse of the day · {vod.c}.{vod.v}</span>
          <div className="actions">
            <ListenButton v={vod} compact />
            <BookmarkButton v={vod} />
            <ShareButton v={vod} />
          </div>
        </div>
        {s.settings.showSanskrit && <Sanskrit v={vod} />}
        {speakerLabel(vod) && <p className="speaker">{speakerLabel(vod)}</p>}
        <p className="vod__meaning">{gita.simple(verseOfTheDay()) ?? meaningOf(vod, s.settings)}</p>
        {gita.simple(verseOfTheDay()) && <p className="vod__tr">{meaningOf(vod, s.settings)}</p>}
        <button className="linkrow" onClick={() => go(`verse/${vod.c}/${vod.v}`)}>
          Understand this verse <IconChevron size={18} />
        </button>
      </section>

      {s.essentials.length < ESSENTIALS.length && (
        <section>
          <h2 className="sectitle">7-day Essentials</h2>
          <div className="days">
            {ESSENTIALS.map((d) => (
              <button key={d.day} className={`day ${s.essentials.includes(d.day) ? "is-done" : ""}`} onClick={() => go(`essentials/${d.day}`)}>
                <b>{d.day}</b>
                <span>{d.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {s.lastRead && (
        <button className="card rowcard" onClick={() => go(`read/${s.lastRead!.split(".")[0]}/${s.lastRead!.split(".")[1]}`)}>
          <IconRead />
          <span>
            <b>Continue reading</b>
            <small>Chapter {s.lastRead.split(".")[0]}, verse {s.lastRead.split(".")[1]}</small>
          </span>
          <IconChevron size={18} />
        </button>
      )}

      <p className="footnote">
        {learnedCount} of {gita.verses.length} verses learned
      </p>
    </div>
  );
}
