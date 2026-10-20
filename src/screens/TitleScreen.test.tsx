import { describe, expect, it, vi } from 'vitest';
import { click, mount } from '../test-utils';
import { TitleScreen } from './TitleScreen';

describe('TitleScreen', () => {
  it('shows the illustrations, now that they exist', () => {
    const el = mount(<TitleScreen onPlay={() => {}} />);
    expect(el.querySelector('.placeholder')).toBeNull();
    expect(el.querySelectorAll('img')).toHaveLength(3);
  });

  it('keeps the title as real text', () => {
    expect(mount(<TitleScreen onPlay={() => {}} />).querySelector('h1')?.textContent).toBe('Operation Cake');
  });

  it('shows the Hebrew translation in its own RTL bubble on tap', () => {
    const el = mount(<TitleScreen onPlay={() => {}} />);
    expect(el.querySelector('.he-bubble')).toBeNull();
    click(el.querySelector('.btn--hebrew'));
    const bubble = el.querySelector('.he-bubble');
    expect(bubble?.getAttribute('dir')).toBe('rtl');
    expect(bubble?.getAttribute('lang')).toBe('he');
  });

  it('calls onPlay from the Play button', () => {
    const onPlay = vi.fn();
    const el = mount(<TitleScreen onPlay={onPlay} />);
    click(el.querySelector('.btn--play'));
    expect(onPlay).toHaveBeenCalledOnce();
  });
});
