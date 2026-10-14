import { useEffect, useRef, useState } from "react";
import { GUIDES, LEVELS, REASONS, topicById } from "../content";
import type { Gita } from "../data";
import { Bar, Seal, meaningOf } from "../components";
import { IconBack, IconBell, IconCheck, IconDiya, Mark, TopicIcon } from "../icons";
import { scheduleReminder, setStatusBarOverArt, tap } from "../native";
import { go } from "../router";
import { setProfile, setSetting, update, useStore, type Settings } from "../store";

/**
 * First run, in the spirit of Liven/Noom personalisation and Sahadeva's
 * Welcome → Reveal: why you came, where to start, a plan, and a sankalpa.
 */
const STEPS = ["welcome", "language", "reasons", "level", "rhythm", "preparing", "reveal", "sankalpa"] as const;
type Step = (typeof STEPS)[number];

export function Onboarding({ gita }: { gita: Gita }) {
  const { settings, profile } = useStore();
  const [step, setStep] = useState<Step>("welcome");
  const i = STEPS.indexOf(step);
  const next = () => {
    tap();
    setStep(STEPS[i + 1]);
  };
  const prev = () => setStep(STEPS[Math.max(0, i - 1)]);
  const quizStep = i >= 1 && i <= 4;
  useEffect(() => {
    setStatusBarOverArt(step === "welcome");
    return () => setStatusBarOverArt(false);
  }, [step]);

  return (
    <div className="onboard" key={step}>
      {quizStep && (
        <header className="onboard__top">
          <button className="iconbtn" onClick={prev} aria-label="Back">
            <IconBack />
          </button>
          <Bar value={i / 5} />
        </header>
      )}
      {step === "welcome" && <Welcome onNext={next} />}
      {step === "language" && <Language settings={settings} onNext={next} />}
      {step === "reasons" && <Reasons gita={gita} reasons={profile.reasons} onNext={next} />}
      {step === "level" && <Level level={profile.level} onNext={next} />}
      {step === "rhythm" && <Rhythm settings={settings} onNext={next} />}
      {step === "preparing" && <Preparing reasons={profile.reasons} onDone={next} />}
      {step === "reveal" && <Reveal gita={gita} onNext={next} />}
      {step === "sankalpa" && <Sankalpa minutes={settings.dailyGoal * 5} />}
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="onboard--welcome">
      <div className="onboard__art" aria-hidden="true" />
      <div className="onboard__body">
        <Mark size={44} />
        <h1>The Gita, for your life.</h1>
        <p className="lead">All 700 verses, made simple. Not to memorise, but to live by: one small lesson a day.</p>
        <p className="freeline">Free forever · No ads · No sign-up</p>
        <button className="btn btn--primary btn--full" onClick={onNext}>
          Begin the journey
        </button>
        <button
          className="btn btn--quiet btn--full"
          onClick={() => {
            // Readers who skip the journey are not asked about reminders.
            update((s) => ({ ...s, onboarded: true, settings: { ...s.settings, reminder: "off" } }));
            go("read");
          }}
        >
          Just let me read
        </button>
      </div>
    </div>
  );
}

function Language({ settings, onNext }: { settings: Settings; onNext: () => void }) {
  const pick = (l: Settings["lang"]) => {
    setSetting("lang", l);
    onNext();
  };
  return (
    <div className="onboard__body onboard__body--form onboard--rings">
      <Mark size={56} className="center-mark" />
      <h1 className="center">Which language feels like home?</h1>
      <p className="muted center">Verses stay in Sanskrit. Meanings appear in your language.</p>
      <div className="langbtns">
        <button className="langbtn" aria-pressed={settings.lang === "en"} onClick={() => pick("en")}>
          <span className="langbtn__native">English</span>
        </button>
        <button className="langbtn" aria-pressed={settings.lang === "hi"} onClick={() => pick("hi")}>
          <span className="langbtn__native" lang="hi">हिन्दी</span>
          <span className="langbtn__roman">Hindi</span>
        </button>
      </div>
      <p className="footnote">Lessons are in English for now; verse meanings are available in both.</p>
    </div>
  );
}

function Reasons({ gita, reasons, onNext }: { gita: Gita; reasons: string[]; onNext: () => void }) {
  const last = REASONS.find((r) => r.topic === reasons[reasons.length - 1]);
  const v = last ? gita.get(last.ref) : undefined;
  const toggle = (t: string) => {
    tap();
    setProfile({ reasons: reasons.includes(t) ? reasons.filter((x) => x !== t) : [...reasons, t].slice(-3) });
  };
  return (
    <>
      <div className="onboard__body onboard__body--form">
        <span className="kicker">Step 2 of 4</span>
        <h1>What brings you to the Gita?</h1>
        <p className="muted">Choose up to three. We'll shape your path around them.</p>
        <div className="reasons">
          {REASONS.map((r) => (
            <div key={r.topic} className="reasons__item">
              <button className="reason" aria-pressed={reasons.includes(r.topic)} onClick={() => toggle(r.topic)}>
                <TopicIcon id={r.topic} size={22} />
                <span>{r.label}</span>
                {reasons.includes(r.topic) && <IconCheck size={18} />}
              </button>
              {/* Like Liven: a gentle reply right under the option you just chose. */}
              {last?.topic === r.topic && v && (
                <aside className="notalone">
                  <b>You're not alone.</b>
                  <p>{last.reply}</p>
                  <p className="notalone__verse">
                    “{gita.simple(last.ref) ?? v.en}” <span>Gita {last.ref}</span>
                  </p>
                </aside>
              )}
            </div>
          ))}
        </div>
      </div>
      <footer className="onboard__cta">
        <button className="btn btn--primary btn--full" disabled={!reasons.length} onClick={onNext}>
          {reasons.length ? "Continue" : "Choose at least one"}
        </button>
      </footer>
    </>
  );
}

function Level({ level, onNext }: { level: string; onNext: () => void }) {
  return (
    <>
      <div className="onboard__body onboard__body--form">
        <span className="kicker">Step 3 of 4</span>
        <h1>How well do you know the Gita?</h1>
        <div className="choices" role="radiogroup">
          {LEVELS.map((l) => (
            <button key={l.id} role="radio" aria-checked={level === l.id} className="choice" onClick={() => setProfile({ level: l.id })}>
              <b>{l.label}</b>
              <small>{l.sub}</small>
            </button>
          ))}
        </div>
      </div>
      <footer className="onboard__cta">
        <button className="btn btn--primary btn--full" onClick={onNext}>
          Continue
        </button>
      </footer>
    </>
  );
}

const GOALS: [Settings["dailyGoal"], string, string][] = [
  [1, "5 minutes", "One lesson a day · the whole Gita in about 5 months"],
  [2, "10 minutes", "Two lessons a day · about 10 weeks"],
  [3, "15 minutes", "Three lessons a day · about 7 weeks"],
];

function Rhythm({ settings, onNext }: { settings: Settings; onNext: () => void }) {
  return (
    <>
      <div className="onboard__body onboard__body--form">
        <span className="kicker">Step 4 of 4</span>
        <h1>Your daily rhythm</h1>
        <div className="choices" role="radiogroup" aria-label="Daily time">
          {GOALS.map(([g, title, sub]) => (
            <button key={g} role="radio" aria-checked={settings.dailyGoal === g} className="choice" onClick={() => setSetting("dailyGoal", g)}>
              <b>{title}</b>
              <small>{sub}</small>
            </button>
          ))}
        </div>
        <h2 className="sectitle sectitle--icon">
          <IconBell size={18} /> A gentle reminder
        </h2>
        <div className="seg seg--wide" role="radiogroup" aria-label="Reminder">
          {(
            [
              ["morning", "7 am"],
              ["evening", "8 pm"],
              ["off", "No thanks"],
            ] as [Settings["reminder"], string][]
          ).map(([r, label]) => (
            <button key={r} role="radio" aria-checked={settings.reminder === r} onClick={() => setSetting("reminder", r)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <footer className="onboard__cta">
        <button
          className="btn btn--primary btn--full"
          onClick={() => {
            scheduleReminder(settings.reminder);
            onNext();
          }}
        >
          Build my path
        </button>
      </footer>
    </>
  );
}

function Preparing({ reasons, onDone }: { reasons: string[]; onDone: () => void }) {
  const lines = [
    "Reading all 700 verses",
    `Choosing teachings for ${reasons.map((r) => topicById(r)?.title.toLowerCase()).filter(Boolean).join(", ") || "you"}`,
    "Arranging 140 short lessons",
    "Lighting your lamp",
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= lines.length) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN(n + 1), 700);
    return () => clearTimeout(t);
  }, [n, lines.length, onDone]);
  return (
    <div className="onboard__body onboard__body--center">
      <div className="preparing__mark">
        <Mark size={88} />
      </div>
      <h2>Preparing your path…</h2>
      <ul className="checklist">
        {lines.map((l, k) => (
          <li key={k} className={k < n ? "is-done" : k === n ? "is-now" : ""}>
            <span>{k < n ? <IconCheck size={16} /> : null}</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reveal({ gita, onNext }: { gita: Gita; onNext: () => void }) {
  const { profile, settings } = useStore();
  const topic = topicById(profile.reasons[0] ?? "self") ?? topicById("self")!;
  const chapter = gita.chapters.find((c) => c.n === topic.chapter)!;
  const verse = gita.get(topic.refs[0])!;
  const startWithEssentials = profile.level !== "deep";
  return (
    <>
      <div className="onboard__body onboard__body--form reveal">
        <span className="kicker">Your path is ready</span>
        <div className="reveal__chapter">
          <Seal n={chapter.n} size={72} />
          <p className="chapter__sa" lang="sa">{chapter.name}</p>
          <h1>{GUIDES[chapter.n].theme}</h1>
          <p className="muted">
            Your guiding chapter · Chapter {chapter.n}, {chapter.translit}
          </p>
        </div>
        <blockquote className="reveal__quote">
          “{gita.simple(topic.refs[0]) ?? meaningOf(verse, settings)}”
          <cite>Gita {topic.refs[0]}</cite>
        </blockquote>
        <ol className="plan">
          {startWithEssentials && (
            <li>
              <b>Week 1</b>
              <span>7 Essentials: the most loved teachings, 3 verses a day</span>
            </li>
          )}
          <li>
            <b>{startWithEssentials ? "Then" : "Start"}</b>
            <span>The whole Gita: 140 short lessons, chapter by chapter, all 700 verses</span>
          </li>
          <li>
            <b>Anytime</b>
            <span>
              “{topic.title}” and 15 more life topics, whenever you need them
            </span>
          </li>
        </ol>
      </div>
      <footer className="onboard__cta">
        <button className="btn btn--primary btn--full" onClick={onNext}>
          Continue
        </button>
      </footer>
    </>
  );
}

function Sankalpa({ minutes }: { minutes: number }) {
  const { profile } = useStore();
  const [held, setHeld] = useState(0);
  const [lit, setLit] = useState(false);
  const timer = useRef<number | null>(null);

  const start = () => {
    if (lit || timer.current) return;
    tap();
    const t0 = performance.now();
    const loop = () => {
      const p = Math.min(1, (performance.now() - t0) / 1200);
      setHeld(p);
      if (p >= 1) {
        setLit(true);
        tap("success");
        // Let the lit lamp breathe for a moment before leaving onboarding.
        setTimeout(() => {
          go(profile.level === "deep" ? "lesson/1-1" : "essentials/1");
          update((s) => ({ ...s, onboarded: true, profile: { ...s.profile, sankalpaAt: new Date().toISOString() } }));
        }, 1600);
        return;
      }
      timer.current = requestAnimationFrame(loop);
    };
    timer.current = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (timer.current) cancelAnimationFrame(timer.current);
    timer.current = null;
    if (!lit) setHeld(0);
  };

  return (
    <div className="onboard__body onboard__body--center sankalpa">
      <span className="kicker">Sankalpa · a sacred resolve</span>
      <h1>{lit ? "Your lamp is lit." : "Make a small promise to yourself."}</h1>
      <p className="lead">
        For the next 7 days, I will give {minutes} quiet minutes to the Gita, and try one of its lessons in my life.
      </p>
      <button
        className={`diya ${lit ? "is-lit" : ""}`}
        style={{ ["--held" as string]: held }}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => !e.repeat && (e.key === " " || e.key === "Enter") && start()}
        onKeyUp={stop}
        aria-label="Press and hold to take your sankalpa"
      >
        <svg viewBox="0 0 120 120" className="diya__ring" aria-hidden="true">
          <circle cx="60" cy="60" r="56" />
          <circle cx="60" cy="60" r="56" className="diya__progress" style={{ strokeDashoffset: 352 * (1 - held) }} />
        </svg>
        <span className="diya__flame" aria-hidden="true" />
        <IconDiya size={44} />
      </button>
      <p className="muted small">{lit ? "Beginning Day 1…" : "Press and hold the lamp"}</p>
    </div>
  );
}
