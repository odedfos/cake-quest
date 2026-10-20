import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { TitleScreen } from './TitleScreen';

let root: HTMLElement;

function mount(onPlay = () => {}) {
  root = document.createElement('div');
  document.body.append(root);
  act(() => render(<TitleScreen onPlay={onPlay} />, root));
  return root;
}

afterEach(() => {
  render(null, root);
  root.remove();
});

describe('TitleScreen', () => {
  it('shows labelled placeholders for illustrations that do not exist yet', () => {
    const el = mount();
    const paths = [...el.querySelectorAll('.placeholder')].map((p) => p.getAttribute('data-asset'));
    expect(paths).toEqual(['backgrounds/bg_title.png', 'props/ui_sign.png', 'characters/char_kid1_idle.png']);
  });

  it('keeps the title as real text', () => {
    expect(mount().querySelector('h1')?.textContent).toBe('Operation Cake');
  });

  it('shows the Hebrew translation in its own RTL bubble on tap', () => {
    const el = mount();
    expect(el.querySelector('.he-bubble')).toBeNull();
    act(() => (el.querySelector('.btn--hebrew') as HTMLButtonElement).click());
    const bubble = el.querySelector('.he-bubble');
    expect(bubble?.getAttribute('dir')).toBe('rtl');
    expect(bubble?.getAttribute('lang')).toBe('he');
  });

  it('calls onPlay from the Play button', () => {
    const onPlay = vi.fn();
    const el = mount(onPlay);
    act(() => (el.querySelector('.btn--play') as HTMLButtonElement).click());
    expect(onPlay).toHaveBeenCalledOnce();
  });
});
