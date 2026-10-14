import { useEffect, useMemo, useRef, useState } from "react";
import { ESSENTIALS, GUIDES } from "../content";
import { allLessons, lessonsFor, refOf, type Gita, type Verse } from "../data";
import { Bar, ListenButton, Sanskrit, Translit, Words, meaningOf, speakerLabel } from "../components";
import { IconCheck, IconClose, IconDiya, IconJournal, IconShare, IconSparkle, Mark } from "../icons";
import { shareText, tap } from "../native";
import { back, go } from "../router";
import { stopSpeaking } from "../speech";
import { addJournal, completeLesson, lastWeek, streakOf, toggleInsight, useStore, type Settings } from "../store";
import { NotFound } from "./Chapter";

/**
 * A lesson teaches an idea to live by, not a verse to memorise:
 * intro → verses in simple words → the teaching → apply it → check understanding → reflect → practice.
 */
type Choice = { prompt: string; context?: string; focus?: Verse; options: string[]; answer: number; why?: string; kind: "apply" | "understand" };
type Step =
  | { kind: "intro" }
  | { kind: "verse"; v: Verse }
  | { kind: "teaching" }
  | { kind: "choice"; q: Choice }
  | { kind: "reflect" }
  | { kind: "done" };

/** Small seeded RNG so a lesson's questions stay the same while you take it. */
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffle<T>(a: T[], r: () => number): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const clip = (t: string, n = 140) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(" ", n)) + "…");

/** "Which idea did these verses teach?": this lesson's key idea among others from elsewhere in the Gita. */
function understandQ(g: Gita, lessonId: string, r: () => number): Choice | null {
  const mine = g.lesson(lessonId)?.keyIdea;
  if (!mine) return null;
  const chapter = Number(lessonId.split("-")[0]);
  const others = shuffle(
    allLessons(g).filter((l) => l.chapter !== chapter),
    r,
  )
    .map((l) => g.lesson(l.id)?.keyIdea)
    .filter((k): k is string => !!k && k !== mine)
    .slice(0, 3);
  if (others.length < 3) return null;
  const options = shuffle([mine, ...others], r);
  return { kind: "understand", prompt: "Which idea did these verses teach?", options, answer: options.indexOf(mine) };
}

/** "What is the heart of this verse?": plain meanings, used when no written lesson exists. */
function meaningQ(g: Gita, v: Verse, pool: Verse[], s: Settings, r: () => number): Choice {
  const say = (x: Verse) => clip(g.simple(refOf(x)) ?? meaningOf(x, s));
  const right = say(v);
  const wrong = shuffle(pool.filter((x) => x !== v), r)
    .map(say)
    .filter((t, i, a) => t !== right && a.indexOf(t) === i)
    .slice(0, 3);
  const options = shuffle([right, ...wrong], r);
  return { kind: "understand", prompt: "What is the heart of this verse?", focus: v, options, answer: options.indexOf(right) };
}

export function LessonScreen({ gita, lessonId, essentialDay }: { gita: Gita; lessonId?: string; essentialDay?: number }) {
  const s = useStore();
  const essential = essentialDay ? ESSENTIALS.find((d) => d.day === essentialDay) : undefined;
  const lesson = lessonId ? allLessons(gita).find((l) => l.id === lessonId) : undefined;
  const content = lessonId ? gita.lesson(lessonId) : undefined;
  const refs = essential?.refs ?? lesson?.refs ?? [];
  const verses = refs.map((r) => gita.get(r)).filter((v): v is Verse => !!v);
  const reflectPrompt = content?.reflect ?? essential?.reflect ?? "What in these verses speaks to your life right now?";
  const practice = content?.practice ?? essential?.practice;

  // App remounts this screen per lesson (keyed), so state starts fresh each time.
  const frozen = useRef(s.settings).current;
  const steps = useMemo<Step[]>(() => {
    if (!verses.length) return [];
    const r = rng(lessonId ?? `e${essentialDay}`);
    const out: Step[] = [{ kind: "intro" }, ...verses.map((v) => ({ kind: "verse" as const, v }))];
    if (content) {
      out.push({ kind: "teaching" });
      const a = content.apply;
      out.push({ kind: "choice", q: { kind: "apply", prompt: a.question, context: a.scenario, options: a.options, answer: a.answer, why: a.why } });
    }
    const pool = gita.verses.filter((x) => Math.abs(x.c - verses[0].c) <= 2);
    const check = (lessonId && understandQ(gita, lessonId, r)) || meaningQ(gita, shuffle(verses, r)[0], pool, frozen, r);
    out.push({ kind: "choice", q: check });
    if (!content && verses.length > 2) out.push({ kind: "choice", q: meaningQ(gita, verses[verses.length - 1], pool, frozen, r) });
    out.push({ kind: "reflect" }, { kind: "done" });
    return out;
    // Built once per lesson; settings are frozen for the lesson.
  }, [lessonId, essentialDay, gita]); // eslint-disable-line react-hooks/exhaustive-deps

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => () => stopSpeaking(), []);

  if (!steps.length) return <NotFound />;
  const step = steps[i];
  const choiceTotal = steps.filter((x) => x.kind === "choice").length;
  const nextStep = () => {
    stopSpeaking();
    tap();
    setPicked(null);
    setI((x) => Math.min(x + 1, steps.length - 1));
  };

  if (step.kind === "done") {
    return (
      <Done
        gita={gita}
        refs={refs}
        lessonId={lessonId}
        essentialDay={essentialDay}
        correct={correct}
        total={choiceTotal}
        practice={practice}
        keyIdea={content?.keyIdea}
      />
    );
  }

  const chapter = gita.chapters.find((c) => c.n === verses[0].c)!;
  const lessonCount = lesson ? lessonsFor(gita, lesson.chapter).length : 0;
  const title = content?.title ?? essential?.title ?? GUIDES[chapter.n].theme;
  const isChoice = step.kind === "choice";
  const right = isChoice && picked === step.q.answer;

  return (
    <div className="lesson">
      <header className="lesson__top">
        <button className="iconbtn" onClick={() => back("path")} aria-label="Close lesson">
          <IconClose />
        </button>
        <Bar value={i / (steps.length - 1)} />
      </header>

      <div className="lesson__body" key={i}>
        {step.kind === "intro" && (
          <div className="intro">
            <div className="intro__art" aria-hidden="true" />
            <span className="kicker">
              {essential ? `Essentials · Day ${essential.day} of 7` : `Chapter ${chapter.n} · Lesson ${lesson!.index} of ${lessonCount}`}
            </span>
            <h1>{title}</h1>
            <p className="lead">{essential?.why ?? GUIDES[chapter.n].oneLine}</p>
            <ul className="intro__plan">
              <li>
                <b>{verses.length}</b> verses ({refs[0]}
                {refs.length > 1 ? ` – ${refs[refs.length - 1]}` : ""}), each in simple words
              </li>
              {content && <li>One teaching to try in your own life</li>}
              <li>A moment to reflect</li>
            </ul>
          </div>
        )}

        {step.kind === "verse" && <VerseStep gita={gita} v={step.v} s={frozen} />}

        {step.kind === "teaching" && content && (
          <div className="teaching">
            <span className="kicker">The teaching</span>
            <h1>{content.title}</h1>
            <p className="teaching__body">{content.teaching}</p>
            <figure className="keyidea">
              <IconSparkle size={22} />
              <blockquote>{content.keyIdea}</blockquote>
              <div className="keyidea__actions">
                <RememberButton lessonId={lessonId!} text={content.keyIdea} />
                <button
                  className="chipbtn"
                  onClick={() => shareText(`“${content.keyIdea}”\n— from the Bhagavad Gita, ${refs[0]}–${refs[refs.length - 1]}`)}
                >
                  <IconShare size={16} /> Share
                </button>
              </div>
            </figure>
          </div>
        )}

        {step.kind === "choice" && (
          <div className="quiz">
            <span className="kicker">{step.q.kind === "apply" ? "Apply it" : "Check your understanding"}</span>
            {step.q.context && <p className="scenario">{step.q.context}</p>}
            <h2>{step.q.prompt}</h2>
            {step.q.focus && (
              <div className="quiz__focus">
                <span className="kicker">Verse {refOf(step.q.focus)}</span>
                {frozen.showSanskrit ? <Sanskrit v={step.q.focus} /> : <Translit v={step.q.focus} />}
              </div>
            )}
            <div className="options" role="radiogroup">
              {step.q.options.map((o, k) => {
                const state = picked === null ? "" : k === step.q.answer ? "is-right" : k === picked ? "is-wrong" : "is-dim";
                return (
                  <button
                    key={k}
                    role="radio"
                    aria-checked={picked === k}
                    className={`option ${state}`}
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(k);
                      const ok = k === step.q.answer;
                      tap(ok ? "success" : "warning");
                      if (ok) setCorrect((c) => c + 1);
                    }}
                  >
                    <span>{o}</span>
                    {state === "is-right" && <IconCheck size={20} />}
                    {state === "is-wrong" && <IconClose size={20} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step.kind === "reflect" && (
          <div className="reflect">
            <span className="kicker">Reflect</span>
            <h2>{reflectPrompt}</h2>
            <p className="muted small">There is no right answer. Write a line or two, or simply think about it.</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write freely. Only you can see this."
              rows={6}
              aria-label="Your reflection"
            />
          </div>
        )}
      </div>

      <footer className={`lesson__foot ${isChoice && picked !== null ? (right ? "is-right" : "is-wrong") : ""}`}>
        {isChoice && picked !== null && (
          <div className="feedback" role="status">
            <b>{right ? (step.q.kind === "apply" ? "That's the Gita's way." : "Exactly.") : "Not quite. Here's the Gita's view."}</b>
            {step.q.why && <p>{step.q.why}</p>}
          </div>
        )}
        {step.kind === "reflect" ? (
          <div className="btnrow">
            <button className="btn btn--secondary" onClick={nextStep}>
              Skip
            </button>
            <button
              className="btn btn--primary"
              disabled={!note.trim()}
              onClick={() => {
                addJournal({ prompt: reflectPrompt, text: note.trim(), lessonId: lessonId ?? `essentials-${essentialDay}`, ref: refs[0] });
                nextStep();
              }}
            >
              <IconJournal size={18} /> Save to journal
            </button>
          </div>
        ) : (
          <button className="btn btn--primary btn--full" disabled={isChoice && picked === null} onClick={nextStep}>
            {step.kind === "intro" ? "Begin" : isChoice && picked === null ? "Choose an answer" : "Continue"}
          </button>
        )}
      </footer>
    </div>
  );
}

function VerseStep({ gita, v, s }: { gita: Gita; v: Verse; s: Settings }) {
  const simple = gita.simple(refOf(v));
  return (
    <div className="learn">
      <div className="learn__head">
        <span className="kicker">Verse {refOf(v)}</span>
        <ListenButton v={v} />
      </div>
      {speakerLabel(v) && <p className="speaker">{speakerLabel(v)}</p>}
      {s.showSanskrit && <Sanskrit v={v} />}
      {s.showTranslit && <Translit v={v} />}
      <div className="simple">
        <span className="simple__label">In simple words</span>
        <p>{simple ?? meaningOf(v, s)}</p>
      </div>
      {simple && (
        <details className="more">
          <summary>Exact translation</summary>
          <p className="prose">{meaningOf(v, s)}</p>
        </details>
      )}
      <details className="more">
        <summary>Word by word</summary>
        <Words v={v} />
      </details>
    </div>
  );
}

function RememberButton({ lessonId, text }: { lessonId: string; text: string }) {
  const { insights } = useStore();
  const on = insights.some((x) => x.lessonId === lessonId);
  return (
    <button
      className={`chipbtn ${on ? "is-on" : ""}`}
      aria-pressed={on}
      onClick={() => {
        tap();
        toggleInsight(lessonId, text);
      }}
    >
      {on ? <IconCheck size={16} /> : <IconSparkle size={16} />} {on ? "Remembered" : "Remember"}
    </button>
  );
}

/** The first unfinished lesson after this one, wrapping to the start of the Gita. */
function nextLessonAfter(g: Gita, id: string | undefined, done: Record<string, string>) {
  const all = allLessons(g);
  const at = all.findIndex((l) => l.id === id);
  return [...all.slice(at + 1), ...all.slice(0, Math.max(0, at))].find((l) => !done[l.id]);
}

function Done({
  gita,
  refs,
  lessonId,
  essentialDay,
  correct,
  total,
  practice,
  keyIdea,
}: {
  gita: Gita;
  refs: string[];
  lessonId?: string;
  essentialDay?: number;
  correct: number;
  total: number;
  practice?: string;
  keyIdea?: string;
}) {
  const s = useStore();
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    completeLesson({ lessonId, essentialDay, refs });
    tap("success");
  }, [lessonId, essentialDay, refs]);

  const streak = streakOf(s.activity);
  const next = essentialDay
    ? ESSENTIALS.find((d) => d.day > essentialDay && !s.essentials.includes(d.day)) ??
      ESSENTIALS.find((d) => d.day !== essentialDay && !s.essentials.includes(d.day))
    : nextLessonAfter(gita, lessonId, s.lessons);

  return (
    <div className="lesson done">
      <div className="done__body">
        <div className="done__mark">
          <Mark size={104} />
        </div>
        <span className="kicker">{essentialDay ? `Essentials · Day ${essentialDay}` : "Lesson complete"}</span>
        <h1>{correct === total ? "Beautifully understood." : "Step taken."}</h1>
        {keyIdea && <p className="done__idea">“{keyIdea}”</p>}
        {practice && (
          <div className="practice">
            <span className="kicker">Try it today</span>
            <p>{practice}</p>
          </div>
        )}
        <div className="stats">
          <div>
            <b>{refs.length}</b>
            <small>verses understood</small>
          </div>
          <div>
            <b>
              {correct}/{total}
            </b>
            <small>answers</small>
          </div>
          <div>
            <b className="stats__streak">
              <IconDiya size={22} /> {streak}
            </b>
            <small>day streak</small>
          </div>
        </div>
        <ol className="week week--center" aria-label="This week">
          {lastWeek(s.activity).map((d) => (
            <li key={d.key} className={`${d.done ? "is-done" : ""} ${d.today ? "is-today" : ""}`}>
              <span>{d.label}</span>
              <i />
            </li>
          ))}
        </ol>
      </div>
      <footer className="lesson__foot">
        {next && (
          <button className="btn btn--primary btn--full" onClick={() => go("id" in next ? `lesson/${next.id}` : `essentials/${next.day}`, { replace: true })}>
            {"id" in next
              ? `Next: ${gita.lesson(next.id)?.title ?? `Lesson ${next.index}`}`
              : `Next: Day ${next.day}, ${next.title}`}
          </button>
        )}
        <button className="btn btn--quiet btn--full" onClick={() => go("today")}>
          Done for today
        </button>
      </footer>
    </div>
  );
}
