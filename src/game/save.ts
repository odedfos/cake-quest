// Progress, settings and the word notebook, saved on this device only.

import type { Level } from './difficulty';

export type DifficultySetting = 'adaptive' | Level;

export type SaveData = {
  hero: { id: string; name: string } | null;
  difficulty: DifficultySetting;
  // The level the adaptive mode has settled on; used when difficulty is 'adaptive'.
  adaptiveLevel: Level;
  // Glossary keys of the words the player translated, oldest first.
  notebook: string[];
  // Per stage: the step to resume at, and whether the stage is finished.
  stages: Record<string, { step: number; done: boolean }>;
};

const KEY = 'cake-quest:v1';

export function defaultSave(): SaveData {
  return { hero: null, difficulty: 'adaptive', adaptiveLevel: 'medium', notebook: [], stages: {} };
}

// Accepts anything that came out of storage and keeps only the fields that look right,
// so an old or damaged save never breaks the game.
export function parseSave(raw: string | null): SaveData {
  const save = defaultSave();
  if (!raw) return save;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return save;
  }
  if (!data || typeof data !== 'object') return save;
  const d = data as Record<string, unknown>;

  const hero = d.hero as Record<string, unknown> | null | undefined;
  if (hero && typeof hero.id === 'string' && typeof hero.name === 'string') {
    save.hero = { id: hero.id, name: hero.name };
  }
  if (d.difficulty === 'adaptive' || isLevel(d.difficulty)) save.difficulty = d.difficulty;
  if (isLevel(d.adaptiveLevel)) save.adaptiveLevel = d.adaptiveLevel;
  if (Array.isArray(d.notebook)) save.notebook = d.notebook.filter((w): w is string => typeof w === 'string');
  if (d.stages && typeof d.stages === 'object') {
    for (const [id, s] of Object.entries(d.stages as Record<string, Record<string, unknown>>)) {
      if (s && typeof s.step === 'number' && typeof s.done === 'boolean') {
        save.stages[id] = { step: s.step, done: s.done };
      }
    }
  }
  return save;
}

function isLevel(v: unknown): v is Level {
  return v === 'easy' || v === 'medium' || v === 'hard';
}

export function loadSave(): SaveData {
  try {
    return parseSave(localStorage.getItem(KEY));
  } catch {
    return defaultSave();
  }
}

export function writeSave(save: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Private mode or storage full: the game still works, it just won't remember.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
