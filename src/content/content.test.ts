import { describe, expect, it } from 'vitest';
import { lookupWord, tokenize, GLOSSARY } from './glossary';
import { NOTE_LINES, NOTE_TITLE, STAGE1 } from './stage1';
import { STAGES } from './stages';
import type { Text } from './types';

function allTexts(): Text[] {
  const texts: Text[] = [NOTE_TITLE, ...NOTE_LINES, ...STAGES.map((s) => s.title)];
  for (const step of STAGE1) {
    if (step.kind === 'note') continue;
    texts.push(step.text);
    if (step.kind === 'line' && step.tip) texts.push(step.tip);
    if (step.kind !== 'line') texts.push(step.hint);
    if (step.kind === 'choice') texts.push(...step.options);
  }
  return texts;
}

function englishWords(texts: Text[]): string[] {
  return texts
    .flatMap((t) => [t.en, t.short?.en ?? ''])
    .flatMap((en) => tokenize(en.replace('{name}', '')))
    .filter((t) => t.word)
    .map((t) => t.text);
}

describe('tokenize', () => {
  it('keeps words, contractions and punctuation apart', () => {
    expect(tokenize("Hi, I'm here!")).toEqual([
      { text: 'Hi', word: true },
      { text: ', ', word: false },
      { text: "I'm", word: true },
      { text: ' ', word: false },
      { text: 'here', word: true },
      { text: '!', word: false },
    ]);
  });
});

describe('lookupWord', () => {
  it('finds words regardless of case and possessive', () => {
    expect(lookupWord('Mom’s')).toBe('mom');
    expect(lookupWord("Let's")).toBe("let's");
    expect(lookupWord('zebra')).toBeUndefined();
  });
});

// English lines written straight into screens and components, e.g. <SpeechLine en="…" />.
const sources = import.meta.glob<string>('../**/*.tsx', { query: '?raw', import: 'default', eager: true });
const screenLines = Object.entries(sources)
  .filter(([file]) => !file.includes('.test.'))
  .flatMap(([, src]) => [...src.matchAll(/\sen=\{?[`"]([^`"]+)[`"]/g)].map((m) => m[1].replace(/\$\{[^}]+\}/g, '')));

describe('screen text', () => {
  it('finds the lines written in screens', () => {
    expect(screenLines).toContain('Who will help Dad today?');
  });

  it('has a Hebrew meaning for every word in those lines', () => {
    const words = screenLines.flatMap((en) => tokenize(en)).filter((t) => t.word).map((t) => t.text);
    expect([...new Set(words.filter((w) => !lookupWord(w)))]).toEqual([]);
  });
});

describe('Stage 1 content', () => {
  it('has a Hebrew meaning for every English word the player can tap', () => {
    const missing = englishWords(allTexts()).filter((w) => !lookupWord(w));
    expect([...new Set(missing)]).toEqual([]);
  });

  it('gives every line a Hebrew translation', () => {
    for (const t of allTexts()) {
      expect(t.he.trim(), t.en).not.toBe('');
      if (t.short) expect(t.short.he.trim(), t.short.en).not.toBe('');
    }
  });

  it('offers four options for every choice, so the hard level has enough', () => {
    for (const step of STAGE1) {
      if (step.kind === 'choice') expect(step.options, step.text.en).toHaveLength(4);
    }
  });

  it('only points glossary pictures at files named in docs/ASSETS.md', () => {
    for (const entry of Object.values(GLOSSARY)) {
      if (entry.picture) expect(entry.picture).toMatch(/^(backgrounds|characters|props)\/[a-z0-9_]+\.png$/);
    }
  });
});
