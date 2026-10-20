import { describe, expect, it } from 'vitest';
import { indexAssets } from './assets';

describe('indexAssets', () => {
  it('keys files by their path under assets/', () => {
    const index = indexAssets({ '/assets/backgrounds/bg_title.png': '/x/bg_title-abc.png' });
    expect(index.get('backgrounds/bg_title.png')).toBe('/x/bg_title-abc.png');
    expect(index.get('props/ui_sign.png')).toBeUndefined();
  });
});
