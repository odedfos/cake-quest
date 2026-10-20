import { useState } from 'preact/hooks';
import { useGame } from '../game/GameContext';
import type { DifficultySetting } from '../game/save';
import { Panel } from './Panel';

const OPTIONS: { value: DifficultySetting; label: string; about: string }[] = [
  { value: 'adaptive', label: 'Adaptive', about: 'The game changes to fit you. (Best choice)' },
  { value: 'easy', label: 'Easy', about: 'Short sentences, two answers, read aloud.' },
  { value: 'medium', label: 'Medium', about: 'Three answers, read aloud.' },
  { value: 'hard', label: 'Hard', about: 'Four answers. Tap Listen to hear.' },
];

type Props = {
  onClose: () => void;
  onChangeHero: () => void;
  onStartOver: () => void;
};

export function SettingsPanel({ onClose, onChangeHero, onStartOver }: Props) {
  const { save, level, setDifficulty } = useGame();
  const [confirming, setConfirming] = useState(false);

  return (
    <Panel title="Settings" onClose={onClose} class="settings">
      <fieldset class="settings__group">
        <legend>Level</legend>
        {OPTIONS.map((o) => (
          <label key={o.value} class="settings__option">
            <input
              type="radio"
              name="difficulty"
              value={o.value}
              checked={save.difficulty === o.value}
              onChange={() => setDifficulty(o.value)}
            />
            <span>
              <strong>{o.label}</strong>
              <small>{o.about}</small>
            </span>
          </label>
        ))}
        {save.difficulty === 'adaptive' && (
          <p class="settings__now">
            Now playing at: <strong>{level[0].toUpperCase() + level.slice(1)}</strong>
          </p>
        )}
      </fieldset>

      <div class="settings__actions">
        <button type="button" class="btn btn--soft" onClick={onChangeHero}>
          Change meerkat
        </button>
        {confirming ? (
          <div class="settings__confirm">
            <p>Start over? Your progress and words will be deleted.</p>
            <button type="button" class="btn btn--danger" onClick={onStartOver}>
              Yes, start over
            </button>
            <button type="button" class="btn btn--soft" onClick={() => setConfirming(false)}>
              No
            </button>
          </div>
        ) : (
          <button type="button" class="btn btn--soft" onClick={() => setConfirming(true)}>
            Start over
          </button>
        )}
      </div>
    </Panel>
  );
}
