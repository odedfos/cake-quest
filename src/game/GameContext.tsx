import { createContext, type ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { adapt, RULES, type Level, type LevelRules, type Outcome } from './difficulty';
import { clearSave, defaultSave, loadSave, writeSave, type DifficultySetting, type SaveData } from './save';

type Game = {
  save: SaveData;
  level: Level;
  rules: LevelRules;
  chooseHero: (id: string, name: string) => void;
  setDifficulty: (d: DifficultySetting) => void;
  // Feeds one finished task into adaptive difficulty.
  recordOutcome: (o: Outcome) => void;
  // Called whenever the player opens a Hebrew translation; tasks compare it before and
  // after to know whether the player needed Hebrew.
  hebrewUses: () => number;
  noteHebrew: (wordKey?: string) => void;
  setStageStep: (stage: string, step: number) => void;
  finishStage: (stage: string) => void;
  startOver: () => void;
  // The word whose help bubble is open, if any.
  openWord: string | null;
  showWord: (word: string | null) => void;
};

const GameContext = createContext<Game | null>(null);

export function GameProvider({ children, initial }: { children: ComponentChildren; initial?: SaveData }) {
  const [save, setSave] = useState<SaveData>(() => initial ?? loadSave());
  const [openWord, showWord] = useState<string | null>(null);
  const history = useRef<Outcome[]>([]);
  const hebrewCount = useRef(0);

  useEffect(() => writeSave(save), [save]);

  const level = save.difficulty === 'adaptive' ? save.adaptiveLevel : save.difficulty;

  const update = useCallback((fn: (s: SaveData) => SaveData) => setSave((s) => fn(s)), []);

  const recordOutcome = useCallback(
    (o: Outcome) =>
      update((s) => {
        if (s.difficulty !== 'adaptive') return s;
        const next = adapt(s.adaptiveLevel, history.current, o);
        history.current = next.history;
        return next.level === s.adaptiveLevel ? s : { ...s, adaptiveLevel: next.level };
      }),
    [update],
  );

  const noteHebrew = useCallback(
    (wordKey?: string) => {
      hebrewCount.current += 1;
      if (wordKey) {
        update((s) => (s.notebook.includes(wordKey) ? s : { ...s, notebook: [...s.notebook, wordKey] }));
      }
    },
    [update],
  );

  const game = useMemo<Game>(
    () => ({
      save,
      level,
      rules: RULES[level],
      chooseHero: (id, name) => update((s) => ({ ...s, hero: { id, name } })),
      setDifficulty: (difficulty) => update((s) => ({ ...s, difficulty })),
      recordOutcome,
      hebrewUses: () => hebrewCount.current,
      noteHebrew,
      setStageStep: (stage, step) =>
        update((s) => ({ ...s, stages: { ...s.stages, [stage]: { done: s.stages[stage]?.done ?? false, step } } })),
      finishStage: (stage) => update((s) => ({ ...s, stages: { ...s.stages, [stage]: { step: 0, done: true } } })),
      startOver: () => {
        clearSave();
        history.current = [];
        setSave(defaultSave());
      },
      openWord,
      showWord,
    }),
    [save, level, update, recordOutcome, noteHebrew, openWord],
  );

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGame(): Game {
  const game = useContext(GameContext);
  if (!game) throw new Error('useGame must be used inside GameProvider');
  return game;
}
