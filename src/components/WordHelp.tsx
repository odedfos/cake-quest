import { useEffect, useState } from 'preact/hooks';
import { displayWord, GLOSSARY, lookupWord } from '../content/glossary';
import { assetUrl } from '../assets';
import { useGame } from '../game/GameContext';
import { canSpeak, speak } from '../speech';
import { GameImage } from './GameImage';

// The bubble for the word the player tapped: the word, Listen, its picture when there is
// one, and the Hebrew meaning on request. Opening the Hebrew adds the word to the notebook.
export function WordHelp() {
  const { openWord, showWord, noteHebrew } = useGame();
  const [showHebrew, setShowHebrew] = useState(false);

  useEffect(() => setShowHebrew(false), [openWord]);

  useEffect(() => {
    if (!openWord) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && showWord(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openWord, showWord]);

  if (!openWord) return null;
  const key = lookupWord(openWord);
  const entry = key ? GLOSSARY[key] : undefined;
  const word = key ? displayWord(key) : openWord;
  const picture = entry?.picture && assetUrl(entry.picture) ? entry.picture : undefined;

  return (
    <div class="word-help" role="dialog" aria-label={`Help for ${word}`}>
      <div class="word-help__head">
        <span class="word-help__word">{word}</span>
        {canSpeak() && (
          <button type="button" class="btn btn--listen btn--round" aria-label={`Listen to ${word}`} onClick={() => speak(word)}>
            <span aria-hidden="true">🔊</span>
          </button>
        )}
        <button type="button" class="btn btn--close" aria-label="Close" onClick={() => showWord(null)}>
          ✕
        </button>
      </div>
      {picture && <GameImage path={picture} label={word} class="word-help__picture" alt={word} />}
      {entry && (
        <>
          <button
            type="button"
            class="btn btn--hebrew"
            lang="he"
            dir="rtl"
            aria-label="Hebrew translation"
            aria-pressed={showHebrew}
            onClick={() => {
              if (!showHebrew && key) noteHebrew(key);
              setShowHebrew(!showHebrew);
            }}
          >
            עברית
          </button>
          {showHebrew && (
            <p class="he-bubble" lang="he" dir="rtl">
              {entry.he}
            </p>
          )}
        </>
      )}
    </div>
  );
}
