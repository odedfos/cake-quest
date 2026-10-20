// Adaptive difficulty. The game starts at medium and quietly moves up after a run of
// clean answers, or down after a couple of tasks that needed a lot of help.

export type Level = 'easy' | 'medium' | 'hard';

const ORDER: Level[] = ['easy', 'medium', 'hard'];

// How one task went.
export type Outcome = {
  mistakes: number;
  usedHebrew: boolean;
};

export type LevelRules = {
  // Answer options shown in a choice task.
  choices: number;
  // Read each new line aloud without waiting for the Listen button.
  autoRead: boolean;
  // Use the shorter wording of a line when it has one.
  shortLines: boolean;
};

export const RULES: Record<Level, LevelRules> = {
  easy: { choices: 2, autoRead: true, shortLines: true },
  medium: { choices: 3, autoRead: true, shortLines: false },
  hard: { choices: 4, autoRead: false, shortLines: false },
};

const UP_AFTER = 3;
const DOWN_AFTER = 2;

function isClean(o: Outcome) {
  return o.mistakes === 0 && !o.usedHebrew;
}

function struggled(o: Outcome) {
  return o.mistakes >= 2 || (o.mistakes >= 1 && o.usedHebrew);
}

// Returns the new level and the outcomes to remember. History restarts after every change,
// so one level change needs a fresh run of evidence before the next.
export function adapt(level: Level, history: Outcome[], latest: Outcome): { level: Level; history: Outcome[] } {
  const next = [...history, latest];
  const i = ORDER.indexOf(level);

  const recentClean = next.slice(-UP_AFTER);
  if (i < ORDER.length - 1 && recentClean.length === UP_AFTER && recentClean.every(isClean)) {
    return { level: ORDER[i + 1], history: [] };
  }

  const recentHard = next.slice(-DOWN_AFTER);
  if (i > 0 && recentHard.length === DOWN_AFTER && recentHard.every(struggled)) {
    return { level: ORDER[i - 1], history: [] };
  }

  return { level, history: next.slice(-UP_AFTER) };
}
