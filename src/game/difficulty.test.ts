import { describe, expect, it } from 'vitest';
import { adapt, type Outcome } from './difficulty';

const clean: Outcome = { mistakes: 0, usedHebrew: false };
const hard: Outcome = { mistakes: 2, usedHebrew: false };
const translated: Outcome = { mistakes: 0, usedHebrew: true };

function run(start: 'easy' | 'medium' | 'hard', outcomes: Outcome[]) {
  let state = { level: start, history: [] as Outcome[] };
  for (const o of outcomes) state = adapt(state.level, state.history, o);
  return state.level;
}

describe('adapt', () => {
  it('moves up after three clean answers in a row', () => {
    expect(run('medium', [clean, clean])).toBe('medium');
    expect(run('medium', [clean, clean, clean])).toBe('hard');
  });

  it('moves down after two tasks that needed a lot of help', () => {
    expect(run('medium', [hard])).toBe('medium');
    expect(run('medium', [hard, hard])).toBe('easy');
  });

  it('does not count a Hebrew lookup alone as struggling, but it is not clean either', () => {
    expect(run('medium', [translated, translated, translated])).toBe('medium');
  });

  it('needs fresh evidence after each change', () => {
    expect(run('easy', [clean, clean, clean, clean])).toBe('medium');
  });

  it('stays inside the level range', () => {
    expect(run('hard', [clean, clean, clean])).toBe('hard');
    expect(run('easy', [hard, hard])).toBe('easy');
  });
});
