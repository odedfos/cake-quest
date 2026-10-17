import { useState } from 'preact/hooks';
import { canSpeak, speak } from '../speech';

type Props = {
  en: string;
  he: string;
};

// An English line with its first two help tiers: Listen, then the Hebrew translation.
export function SpeechLine({ en, he }: Props) {
  const [showHebrew, setShowHebrew] = useState(false);

  return (
    <div class="speech-line">
      <p class="speech-line__text">{en}</p>
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
          onClick={() => setShowHebrew(!showHebrew)}
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
