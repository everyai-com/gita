# Gita · by Sahadeva

Learn the whole Bhagavad Gita (all 18 chapters, 701 verses), one small step a day.
It's a mobile-first web app that can be installed as an app (PWA), styled with the Sahadeva design language.

## Run

```bash
npm install
npm run dev        # http://localhost:5199
npm run build      # production build in dist/
```

## What's inside

| Tab | What it does |
| --- | --- |
| **Today** | Greeting, streak (diya), week strip, one big "Continue" card, daily goal ring, verse of the day |
| **Path** | Duolingo-style trail: 18 chapters, 140 lessons of ~5 verses, each ending in a 3-question check |
| **Read** | Full Gita reader, search (words or `2.47`), Sanskrit / transliteration / meaning, listen, save, share |
| **You** | Progress, saved verses, daily goal, reading settings (English/हिन्दी, translation, text size, theme) |

New users start with **7-day Essentials**: 21 of the most loved verses.

## iOS app

```bash
npm run build && LANG=en_US.UTF-8 npx cap sync ios
open ios/App/App.xcworkspace
```

Capacitor wraps the web app (`com.everyai.gita`, team M359MD8CXK). It adds haptics, a native share sheet, daily reminders and `gita://verse/2/47` deep links. App Store listing copy is in `metadata/` (`asc metadata validate --dir ./metadata`).

## Learning content

Every verse has a plain-language explanation, and each of the 140 lessons has a teaching, a key idea, a real-life scenario, a reflection and a practice. Sources are in `content/out/ch-XX.json`; merge them with:

```bash
python3 -I scripts/build-lessons.py
```

## Data

`public/data/gita.json` is generated from the public-domain [gita/gita](https://github.com/gita/gita) dataset:

```bash
python3 -I scripts/build-data.py <folder with verse.json, translation.json, chapters.json>
```

The script also repairs legacy Devanagari typing errors in the source.
English translations: Swami Sivananda ("Clear") and Shri Purohit Swami ("Poetic").
The Hindi translation, chapter summaries (`content/hi/ch-XX.json`) and word-by-word meanings (`content/wm/ch-XX.json`) are original to this app, the Hindi translated from the public-domain Sivananda English. Merge them after `build-data.py` with `python3 -I scripts/apply-hindi.py`.
Chapter themes, takeaways and the Essentials path are original content in `src/content.ts`.

## Sound effects

Short UI sounds (tap, select, right/wrong answer, temple bell for the lamp and lesson complete) are CC0 sounds by Kenney from the [soundcn](https://github.com/kapishdima/soundcn) registry, embedded in `src/sounds.ts` and played by `src/sound.ts`. They follow the haptics in `tap()`, respect the silent switch, and can be turned off in reading settings.

## Design

- Tokens and components are copied from `everyai-com/sahadeva-asset-library` (`src/styles/sahadeva-*.css`).
- The brand mark, app icons and Krishna illustration come from the same library (`public/brand`, `public/icons`).
- The icons in `src/icons.tsx` follow the Sahadeva glyph grammar; sunrise and mantra are taken directly from the library.
