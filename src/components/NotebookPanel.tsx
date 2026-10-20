import { useState } from 'preact/hooks';
import { assetUrl } from '../assets';
import { displayWord, GLOSSARY } from '../content/glossary';
import { useGame } from '../game/GameContext';
import { canSpeak, speak } from '../speech';
import { GameImage } from './GameImage';
import { Panel } from './Panel';
import { SpeechLine } from './SpeechLine';

// The meerkat's word notebook: every word the player looked up in Hebrew.
export function NotebookPanel({ onClose }: { onClose: () => void }) {
  const { save } = useGame();

  return (
    <Panel title="My Words" onClose={onClose} class="notebook">
      {save.notebook.length === 0 ? (
        <SpeechLine
          en="Tap a word, then tap the Hebrew button. The word goes into your notebook."
          he="לחצו על מילה ואז על כפתור העברית. המילה תיכנס למחברת שלכם."
        />
      ) : (
        <ul class="notebook__list">
          {save.notebook.map((key) => (
            <NotebookWord key={key} wordKey={key} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

function NotebookWord({ wordKey }: { wordKey: string }) {
  const [showHebrew, setShowHebrew] = useState(false);
  const entry = GLOSSARY[wordKey];
  if (!entry) return null;
  const word = displayWord(wordKey);

  return (
    <li class="notebook__item">
      {entry.picture && assetUrl(entry.picture) ? (
        <GameImage path={entry.picture} label={word} class="notebook__picture" />
      ) : (
        <span class="notebook__picture notebook__picture--empty" aria-hidden="true" />
      )}
      <span class="notebook__word">{word}</span>
      {canSpeak() && (
        <button type="button" class="btn btn--listen btn--round" aria-label={`Listen to ${word}`} onClick={() => speak(word)}>
          <span aria-hidden="true">🔊</span>
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
      {showHebrew && (
        <p class="he-bubble notebook__he" lang="he" dir="rtl">
          {entry.he}
        </p>
      )}
    </li>
  );
}
