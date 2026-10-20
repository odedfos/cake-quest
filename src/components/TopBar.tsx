import { useGame } from '../game/GameContext';

type Props = {
  onMap?: () => void;
  onNotebook: () => void;
  onSettings: () => void;
};

export function TopBar({ onMap, onNotebook, onSettings }: Props) {
  const { save } = useGame();

  return (
    <nav class="top-bar" aria-label="Game menu">
      {onMap && (
        <button type="button" class="btn btn--bar" onClick={onMap}>
          <span aria-hidden="true">🏠</span> Map
        </button>
      )}
      <span class="top-bar__spacer" />
      <button type="button" class="btn btn--bar" onClick={onNotebook}>
        <span aria-hidden="true">📒</span> Words
        {save.notebook.length > 0 && <span class="badge">{save.notebook.length}</span>}
      </button>
      <button type="button" class="btn btn--bar" aria-label="Settings" onClick={onSettings}>
        <span aria-hidden="true">⚙️</span>
      </button>
    </nav>
  );
}
