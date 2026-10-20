import { tokenize } from '../content/glossary';
import { useGame } from '../game/GameContext';
import { speak } from '../speech';

type Props = {
  text: string;
  class?: string;
};

// An English sentence where every word is a button: tapping it reads the word aloud and
// opens its help bubble (picture, then Hebrew).
export function TapText({ text, class: className = '' }: Props) {
  const { showWord } = useGame();

  return (
    <span class={`tap-text ${className}`}>
      {tokenize(text).map((t, i) =>
        t.word ? (
          <button
            key={i}
            type="button"
            class="word"
            onClick={() => {
              speak(t.text);
              showWord(t.text);
            }}
          >
            {t.text}
          </button>
        ) : (
          // "___" marks the gap in a fill-in sentence.
          <span key={i}>
            {t.text.split(/(___)/).map((part, j) =>
              part === '___' ? <span key={j} class="blank" aria-label="blank" /> : part,
            )}
          </span>
        ),
      )}
    </span>
  );
}
