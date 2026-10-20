# Cake Quest (מבצע עוגה)

A web quest game that teaches English to Israeli kids in grades 4–6. The player helps a young meerkat prepare a surprise birthday for Mom while Dad is stuck under the kitchen sink.

## Read first

- `docs/SPEC.md` – the full game spec (Hebrew). Its decisions are settled; ask before changing them.
- `docs/ASSETS.md` – illustration list, file names and image prompts.
- `docs/style-reference.png` – the chosen visual direction.

## Hard rules

- All in-game text is English, including UI and instructions. Hebrew appears only as an on-tap translation, in its own bubble with `dir="rtl"`.
- Text never lives inside images. Illustrations are background/character/prop layers; every word, button and bubble is real HTML so it can be read aloud, translated and adapted.
- Help is tiered: listen → picture → Hebrew translation → Dad's hint after two mistakes, the answer after a third. Mistakes never cost points or lives.
- Read-aloud uses the browser's Web Speech API (`speechSynthesis`, an English voice) for now.
- Tablet and phone first, touch targets at least 44px; must also work on desktop.
- Progress and the player's word notebook are saved locally on the device; there are no accounts.
- Difficulty is adaptive by default (sentence length, number of choices, auto read-aloud), with a fixed level available in settings.

## Assets

Illustrations go in `assets/backgrounds/`, `assets/characters/` and `assets/props/`, named as in `docs/ASSETS.md`. Until a file exists, show a labelled placeholder instead of failing.

`scripts/process_assets.py SOURCE TARGET …` turns raw generated images into game-ready PNGs: backgrounds cropped to 3:2 at 1536×1024, characters and props cut out of their white background at 1024×1024, all compressed.

## Tech stack

- **Vite + TypeScript + Preact.** Builds to a static site in `dist/` with relative URLs, so it can be hosted anywhere (GitHub Pages, Netlify).
- **Plain CSS** with custom properties in `src/styles.css`; no CSS framework.
- **Fonts** are bundled via Fontsource: Andika for English (made for early readers), Baloo 2 for titles, Rubik for Hebrew.
- **Tests:** Vitest with jsdom.

Commands: `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`.

## Code layout

- `src/screens/` – one component per screen; `src/app.tsx` switches between them.
- `src/content/` – everything the player reads: stage scripts (`stage1.ts`), the stage list, heroes, and `glossary.ts` with the Hebrew meaning (and picture) of every tappable word. Tests fail if a word in the content or in a screen's `en="…"` line has no glossary entry.
- `src/game/` – `save.ts` (progress, settings and the word notebook in `localStorage`), `difficulty.ts` (adaptive level rules) and `GameContext.tsx`, which every screen uses through `useGame()`.
- `src/components/GameImage.tsx` – renders an illustration by its `assets/` path, or a labelled placeholder when the file is missing. Use it for every illustration.
- `src/components/SpeechLine.tsx` – an English line with tappable words, Listen and the Hebrew bubble. Use it for every line the player reads.
- `src/components/WordHelp.tsx` – the bubble for a tapped word: Listen, picture, then Hebrew (which adds the word to the notebook).
- `src/assets.ts` – finds the files under `assets/` at build time. If a newly added illustration does not show up, restart the dev server.
- `src/speech.ts` – read-aloud through `speechSynthesis`.
