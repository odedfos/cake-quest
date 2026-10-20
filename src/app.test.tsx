import { describe, expect, it } from 'vitest';
import { STAGE1 } from './content/stage1';
import { loadSave } from './game/save';
import { button, click, mountApp, type } from './test-utils';

const firstChoice = STAGE1.findIndex((s) => s.kind === 'choice');
const findToolbox = STAGE1.findIndex((s) => s.kind === 'find' && s.target === 'toolbox');
const hero = { id: 'kid2', name: 'Lila' };

describe('a new player', () => {
  it('chooses a meerkat, renames it and reaches Stage 1', () => {
    const el = mountApp();
    click(button(el, 'Play'));
    expect(el.querySelector('h1')?.textContent).toBe('Choose your meerkat');

    click(el.querySelectorAll('.hero-option')[2]);
    type(el.querySelector('input')!, 'Dana');
    click(button(el, "Let's go!"));

    expect(el.querySelector('h1')?.textContent).toBe("Mom's Birthday Plan");
    expect(loadSave().hero).toEqual({ id: 'kid3', name: 'Dana' });

    click(el.querySelector('.stage-item--open .stage-item__main'));
    expect(el.querySelector('.dialog')?.textContent).toContain("Hi, Dana! I'm here, under the sink.");
  });
});

describe('Stage 1', () => {
  function startAt(step: number, extra = {}) {
    const el = mountApp({ hero, stages: { note: { step, done: false } }, ...extra });
    click(button(el, 'Play'));
    click(el.querySelector('.stage-item--open .stage-item__main'));
    return el;
  }

  it('resumes where the player stopped and saves each step', () => {
    const el = startAt(1);
    expect(el.querySelector('.dialog')?.textContent).toContain("Today is Mom's birthday!");
    click(button(el, /Next/));
    expect(loadSave().stages.note).toEqual({ step: 2, done: false });
  });

  it('gives Dad’s hint after two mistakes and shows the answer after a third', () => {
    const el = startAt(firstChoice, { difficulty: 'hard' });
    const wrong = () => [...el.querySelectorAll<HTMLButtonElement>('.choice__btn')].filter((b) => b.textContent !== 'Under the sink.' && !b.disabled);
    expect(el.querySelectorAll('.choice')).toHaveLength(4);

    click(wrong()[0]);
    expect(el.querySelector('.feedback')?.textContent).toBe('Try again!');
    expect(el.querySelector('.hint')).toBeNull();

    click(wrong()[0]);
    expect(el.querySelector('.hint')?.textContent).toContain('Look at my feet!');

    click(wrong()[0]);
    expect(el.querySelector('.choice.is-reveal')?.textContent).toContain('Under the sink.');
    expect(button(el, /Next/)).toBeUndefined();

    click(button(el, 'Under the sink.'));
    expect(el.querySelector('.choice.is-right')).not.toBeNull();
    expect(button(el, /Next/)).toBeDefined();
  });

  it('shows two answers at the easy level', () => {
    const el = startAt(firstChoice, { difficulty: 'easy' });
    expect(el.querySelectorAll('.choice')).toHaveLength(2);
  });

  it('asks the player to find things in the kitchen', () => {
    const el = startAt(findToolbox);
    click(el.querySelector('[data-obj="photo"]'));
    click(el.querySelector('[data-obj="photo"]'));
    expect(el.querySelector('.hint')?.textContent).toContain('The toolbox is red.');
    click(el.querySelector('[data-obj="toolbox"]'));
    expect(el.querySelector('[data-obj="toolbox"]')?.classList).toContain('scene__obj--with-dad');
  });

  it('adds a word to the notebook when the player opens its Hebrew meaning', () => {
    const el = startAt(0);
    click(button(el, 'sink'));
    expect(el.querySelector('.word-help')?.textContent).toContain('sink');
    click(el.querySelector('.word-help .btn--hebrew'));
    expect(el.querySelector('.word-help .he-bubble')?.textContent).toBe('כיור');
    expect(loadSave().notebook).toEqual(['sink']);

    click(button(el, /Words/));
    expect(el.querySelector('.notebook__word')?.textContent).toBe('sink');
  });

  it('finishes the stage and marks it done on the map', () => {
    const el = startAt(STAGE1.length - 1);
    click(button(el, /Finish/));
    expect(el.querySelector('.stage-done')?.textContent).toContain('Stage 1 done!');
    click(button(el, 'Back to the map'));
    expect(el.querySelector('.stage-item--done')?.textContent).toContain("Dad's Note");
    expect(loadSave().stages.note.done).toBe(true);
  });
});
