/**
 * Icons in the Sahadeva glyph grammar: 24px grid, 1.6–1.7 stroke, round caps,
 * currentColor. Sunrise and mantra are taken from the Sahadeva asset library.
 */
type P = { size?: number; className?: string };

const Svg = ({ size = 22, className, children }: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/** Sūryodaya (Sahadeva timing/sunrise). */
export const IconToday = (p: P) => (
  <Svg {...p}>
    <path d="M3 18h18M5 14h14M12 4v4M5 8l3 3M19 8l-3 3M8 14a4 4 0 0 1 8 0" />
  </Svg>
);

/** A winding path with three stops. */
export const IconPath = (p: P) => (
  <Svg {...p}>
    <path d="M7 20c6 0 10-2.2 10-5s-10-2.5-10-5.5S11 4 17 4" />
    <circle cx="7" cy="20" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="17" cy="4" r="1.6" />
  </Svg>
);

/** Open book. */
export const IconRead = (p: P) => (
  <Svg {...p}>
    <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5ZM12 6.5v13" />
  </Svg>
);

/** The seeker: calm centre held in a ring (echo of the Sahadeva mark). */
export const IconYou = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="9" r="3.5" />
    <path d="M5 20c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5" />
  </Svg>
);

/** Diya (oil lamp) for streaks. */
export const IconDiya = (p: P) => (
  <Svg {...p}>
    <path d="M12 3c1.8 2.2 2.4 3.8 2.4 5a2.4 2.4 0 0 1-4.8 0c0-1.2.6-2.8 2.4-5Z" />
    <path d="M3.5 13h17c-.8 3.8-4.2 6-8.5 6s-7.7-2.2-8.5-6Z" />
  </Svg>
);

/** Mantra waves (Sahadeva remedy/mantra) for audio. */
export const IconListen = (p: P) => (
  <Svg {...p}>
    <path d="M5 8c4-4 10-4 14 0M5 12c4-4 10-4 14 0M5 16c4-4 10-4 14 0" />
  </Svg>
);

export const IconStop = (p: P) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </Svg>
);

export const IconBookmark = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p}>
    <path d="M6.5 4h11v16L12 16l-5.5 4V4Z" fill={filled ? "currentColor" : "none"} />
  </Svg>
);

export const IconShare = (p: P) => (
  <Svg {...p}>
    <path d="M12 15V4M8 8l4-4 4 4M5 12v7h14v-7" />
  </Svg>
);

export const IconBack = (p: P) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const IconChevron = (p: P) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);

export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Svg>
);

export const IconText = (p: P) => (
  <Svg {...p}>
    <path d="M3 18 7.5 6 12 18M4.6 14h5.8M14 18l3-8 3 8M15 15.5h4" />
  </Svg>
);

export const IconLock = (p: P) => (
  <Svg {...p}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </Svg>
);

/** Lotus: completion. */
export const IconLotus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5c2.2 2.2 3 4.6 3 7s-1 4.6-3 6c-2-1.4-3-3.6-3-6s.8-4.8 3-7Z" />
    <path d="M9.2 9.2C6.6 8.6 4.6 9 3 9.8c.6 4.8 4 8.2 9 8.2M14.8 9.2c2.6-.6 4.6-.2 6.2.6-.6 4.8-4 8.2-9 8.2" />
  </Svg>
);

export const IconSparkle = (p: P) => (
  <Svg {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2L12 8.5Z" />
  </Svg>
);

/** Sahadeva brand mark, from the asset library. */
export const Mark = ({ size = 40, className }: P) => (
  <img className={className} src={`${import.meta.env.BASE_URL}brand/mark.svg`} width={size} height={size} alt="" aria-hidden="true" />
);

/** Topic glyphs. Paths marked (lib) come straight from the Sahadeva asset library. */
const TOPIC_PATHS: Record<string, React.ReactNode> = {
  peace: <path d="M3 10c3-2 6-2 9 0s6 2 9 0M3 15c3-2 6-2 9 0s6 2 9 0" />,
  work: <path d="M5 20V9h14v11M9 9V5h6v4M3 20h18M9 14h6" />, // lib: career
  purpose: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  mind: (
    <>
      <path d="M12 3c1.8 2.2 2.4 3.8 2.4 5a2.4 2.4 0 0 1-4.8 0c0-1.2.6-2.8 2.4-5Z" />
      <path d="M3.5 13h17c-.8 3.8-4.2 6-8.5 6s-7.7-2.2-8.5-6Z" />
    </>
  ),
  anger: <path d="M6 20h12l2-5H4l2 5ZM12 14c-4-3-2-6 1-10 0 4 5 4 2 10" />, // lib: homa
  love: <path d="M12 20S4 15 4 9c0-5 6-6 8-2 2-4 8-3 8 2 0 6-8 11-8 11Z" />, // lib: love
  grief: <path d="M12 3c5 4 7 8 7 12a7 7 0 0 1-14 0c0-4 2-8 7-12ZM9 15h6" />, // lib: vrata
  fear: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3ZM9 12l2 2 4-4" />,
  success: <path d="M12 4v16M7 20h10M4 8h16M4 8l-2.5 6h5L4 8ZM20 8l-2.5 6h5L20 8Z" />,
  self: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="8.5" />
    </>
  ),
  faith: <path d="M6 19h12M8 16h8M10 13h4M12 13V6M9 7c0-3 6-3 6 0" />, // lib: puja
  kind: <path d="M4 12h6l2 2h8M4 12v5c4 3 10 3 16 0v-3M7 9c0-4 5-5 5-1 0-4 5-3 5 1 0 3-5 5-5 5S7 12 7 9Z" />, // lib: dana
  balance: (
    <>
      <path d="M12 3v18M3 12h18" />
      <circle cx="12" cy="12" r="7" />
    </>
  ), // lib: health
  doubt: <path d="m3 9 9-5 9 5-9 5-9-5ZM6 11v6c4 3 8 3 12 0v-6" />, // lib: education
  lead: <path d="M4 13h5l3 3 8-6M4 13v5c5 3 10 3 16 0" />, // lib: seva
  death: <path d="M3 15h18M5 19h14M12 4v4M8 15a4 4 0 0 1 8 0" />, // lib: sunset
};

export const TopicIcon = ({ id, ...p }: P & { id: string }) => <Svg {...p}>{TOPIC_PATHS[id] ?? TOPIC_PATHS.self}</Svg>;

export const IconJournal = (p: P) => (
  <Svg {...p}>
    <path d="M6 3.5h10.5A1.5 1.5 0 0 1 18 5v14.5H6.5A1.5 1.5 0 0 1 5 18V4.5a1 1 0 0 1 1-1ZM8.5 8h6M8.5 11.5h6M5 17h13" />
  </Svg>
);

export const IconBell = (p: P) => (
  <Svg {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20.5h4" />
  </Svg>
);

export const IconEye = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
