import type { LevelRules } from '../game/difficulty';
import type { Text } from './types';

// The wording to show at the current level, with the player's name filled in.
export function resolve(text: Text, rules: LevelRules, name: string): { en: string; he: string } {
  const t = rules.shortLines && text.short ? text.short : text;
  return { en: t.en.replaceAll('{name}', name), he: t.he.replaceAll('{name}', name) };
}
