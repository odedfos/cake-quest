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

## Tech stack

Not chosen yet. Prefer something simple to host as a static site.
