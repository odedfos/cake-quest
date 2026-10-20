import { describe, expect, it } from 'vitest';
import { defaultSave, parseSave } from './save';

describe('parseSave', () => {
  it('starts fresh when nothing is saved or the save is broken', () => {
    expect(parseSave(null)).toEqual(defaultSave());
    expect(parseSave('{not json')).toEqual(defaultSave());
    expect(parseSave('"text"')).toEqual(defaultSave());
  });

  it('keeps valid fields and drops bad ones', () => {
    const save = parseSave(
      JSON.stringify({
        hero: { id: 'kid2', name: 'Lila' },
        difficulty: 'impossible',
        adaptiveLevel: 'hard',
        notebook: ['sink', 3, 'mom'],
        stages: { note: { step: 4, done: false }, bad: { step: 'x' } },
      }),
    );
    expect(save.hero).toEqual({ id: 'kid2', name: 'Lila' });
    expect(save.difficulty).toBe('adaptive');
    expect(save.adaptiveLevel).toBe('hard');
    expect(save.notebook).toEqual(['sink', 'mom']);
    expect(save.stages).toEqual({ note: { step: 4, done: false } });
  });
});
