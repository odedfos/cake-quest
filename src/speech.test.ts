import { describe, expect, it } from 'vitest';
import { pickEnglishVoice } from './speech';

const voice = (lang: string, extra: Partial<SpeechSynthesisVoice> = {}) =>
  ({ lang, name: lang, localService: false, default: false, voiceURI: lang, ...extra }) as SpeechSynthesisVoice;

describe('pickEnglishVoice', () => {
  it('returns nothing when no English voice exists', () => {
    expect(pickEnglishVoice([voice('he-IL'), voice('fr-FR')])).toBeUndefined();
  });

  it('prefers US or UK English over other English variants', () => {
    const us = voice('en-US');
    expect(pickEnglishVoice([voice('en-IN'), us, voice('he-IL')])).toBe(us);
  });

  it('prefers an on-device voice', () => {
    const local = voice('en_GB', { localService: true });
    expect(pickEnglishVoice([voice('en-US'), local])).toBe(local);
  });
});
