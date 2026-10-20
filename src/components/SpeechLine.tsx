import { useState } from 'preact/hooks';
import { useGame } from '../game/GameContext';
import { canSpeak, speak } from '../speech';
import { TapText } from './TapText';

type Props = {
  en: string;
  he: string;
  class?: string;
};

// An English line with its help tiers: tap a word, Listen to the whole line, then the
// Hebrew translation in its own bubble.
export function SpeechLine({ en, he, class: className = '' }: Props) {
  const [showHebrew, setShowHebrew] = useState(false);
  const { noteHebrew } = useGame();

  return (
    <div class={`speech-line ${className}`}>
      <p class="speech-line__text">
        <TapText text={en} />
      </p>
      <div class="speech-line__actions">
        {canSpeak() && (
          <button type="button" class="btn btn--listen" onClick={() => speak(en)}>
            <span aria-hidden="true">🔊</span> Listen
          </button>
        )}
        <button
          type="button"
          class="btn btn--hebrew"
          lang="he"
          dir="rtl"
          aria-label="Hebrew translation"
          aria-pressed={showHebrew}
          onClick={() => {
            if (!showHebrew) noteHebrew();
            setShowHebrew(!showHebrew);
          }}
        >
          עברית
        </button>
      </div>
      {showHebrew && (
        <p class="he-bubble" lang="he" dir="rtl">
          {he}
        </p>
      )}
    </div>
  );
}
