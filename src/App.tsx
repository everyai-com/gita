import { useEffect } from "react";
import { useGita } from "./data";
import { Loading } from "./components";
import { IconPath, IconRead, IconToday, IconYou, Mark } from "./icons";
import { go, useRoute } from "./router";
import { useStore } from "./store";
import { ChapterScreen, NotFound } from "./screens/Chapter";
import { LessonScreen } from "./screens/Lesson";
import { Onboarding } from "./screens/Onboarding";
import { Path } from "./screens/Path";
import { Library, Reader, VerseScreen } from "./screens/Read";
import { Today } from "./screens/Today";
import { TopicScreen } from "./screens/Topics";
import { You } from "./screens/You";
import { scheduleReminder, setStatusBarDark } from "./native";

const TABS = [
  { id: "today", label: "Today", Icon: IconToday },
  { id: "path", label: "Path", Icon: IconPath },
  { id: "read", label: "Read", Icon: IconRead },
  { id: "you", label: "You", Icon: IconYou },
] as const;

/** Which tab a route belongs to, for highlighting. */
const TAB_OF: Record<string, string> = { today: "today", path: "path", chapter: "path", read: "read", verse: "read", topic: "read", you: "you" };

export function App() {
  const { gita, error } = useGita();
  const { onboarded, settings } = useStore();
  const [page = "today", a, b] = useRoute();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", settings.theme);
    root.dataset.size = String(settings.textSize);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setStatusBarDark(settings.theme === "dark" || (settings.theme === "system" && media.matches));
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [settings.theme, settings.textSize]);

  // Keep the daily reminder in sync with the setting (native app only).
  useEffect(() => {
    if (onboarded) scheduleReminder(settings.reminder);
  }, [onboarded, settings.reminder]);

  if (error) {
    return (
      <div className="app">
        <div className="empty">
          <Mark size={48} />
          <h2>Couldn't open the Gita.</h2>
          <p className="muted">{error}. Check your connection and try again.</p>
          <button className="btn btn--primary" onClick={() => location.reload()}>Try again</button>
        </div>
      </div>
    );
  }
  if (!gita) return <div className="app"><Loading /></div>;
  if (!onboarded && page !== "verse") return <div className="app"><Onboarding gita={gita} /></div>;

  // Lessons are full-screen, focused flows without the tab bar.
  if (page === "lesson" && a) return <div className="app"><LessonScreen key={a} gita={gita} lessonId={a} /></div>;
  if (page === "essentials" && a) return <div className="app"><LessonScreen key={`e${a}`} gita={gita} essentialDay={+a} /></div>;

  let screen;
  if (page === "today") screen = <Today gita={gita} />;
  else if (page === "path") screen = <Path gita={gita} />;
  else if (page === "chapter" && a) screen = <ChapterScreen gita={gita} n={+a} />;
  else if (page === "read" && a === "topics") screen = <Library gita={gita} view="topics" />;
  else if (page === "topic" && a) screen = <TopicScreen key={a} gita={gita} id={a} />;
  else if (page === "read" && a) screen = <Reader key={a} gita={gita} n={+a} focus={b ? +b : undefined} />;
  else if (page === "read") screen = <Library gita={gita} />;
  else if (page === "verse" && a && b) screen = <VerseScreen gita={gita} c={+a} v={+b} />;
  else if (page === "you") screen = <You gita={gita} />;
  else screen = <NotFound />;

  const current = TAB_OF[page];
  return (
    <div className="app app--tabs">
      <nav className="tabbar" aria-label="Main">
        <div className="webbrand">
          <Mark size={40} />
          <span>
            <b>GITA</b>
            <small>by Sahadeva</small>
          </span>
        </div>
        {TABS.map(({ id, label, Icon }) => (
          <a
            key={id}
            href={`#/${id}`}
            className="tab"
            aria-current={current === id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              go(id);
            }}
          >
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <main className="main">{screen}</main>
    </div>
  );
}
