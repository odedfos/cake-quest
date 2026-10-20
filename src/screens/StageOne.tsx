import { useEffect, useState } from 'preact/hooks';
import { GameImage } from '../components/GameImage';
import { Panel } from '../components/Panel';
import { SpeechLine } from '../components/SpeechLine';
import { TapText } from '../components/TapText';
import { heroImage, type Pose } from '../content/heroes';
import { NOTE_LINES, NOTE_TITLE, STAGE1 } from '../content/stage1';
import { resolve } from '../content/text';
import type { SceneObject, Step } from '../content/types';
import type { LevelRules } from '../game/difficulty';
import { useGame } from '../game/GameContext';
import { playSuccess } from '../sound';
import { canSpeak, speak } from '../speech';

const STAGE_ID = 'note';
const LAST = STAGE1.length - 1;
const FIND_TOOLBOX = STAGE1.findIndex((s) => s.kind === 'find' && s.target === 'toolbox');
const FIND_NOTE = STAGE1.findIndex((s) => s.kind === 'find' && s.target === 'note');
const READ_NOTE = STAGE1.findIndex((s) => s.kind === 'note');

const OBJECTS: { id: SceneObject; path: string; label: string; word: string }[] = [
  { id: 'toolbox', path: 'props/toolbox.png', label: 'Toolbox', word: 'toolbox' },
  { id: 'photo', path: 'props/obj_mom_photo.png', label: "Mom's photo", word: 'photo' },
  { id: 'note', path: 'props/note_paper.png', label: "Dad's note", word: 'note' },
];

const PRAISE = ['Great!', 'Well done!', 'Yes!', 'Super!'];

// The state of the current step. It is reset when the player moves on, and keeps the
// level rules from the step's start so the options don't change if the level does.
type Task = {
  rules: LevelRules;
  // Option indexes in display order (choice steps).
  order: number[];
  mistakes: number;
  // Wrong option indexes or object ids, so they can be marked.
  wrong: (number | SceneObject)[];
  solved: boolean;
  hebrewAtStart: number;
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newTask(step: Step, rules: LevelRules, hebrewUses: number): Task {
  const order = step.kind === 'choice' ? shuffle(step.options.slice(0, rules.choices).map((_, i) => i)) : [];
  return { rules, order, mistakes: 0, wrong: [], solved: false, hebrewAtStart: hebrewUses };
}

type Props = {
  onExit: () => void;
};

export function StageOne({ onExit }: Props) {
  const game = useGame();
  const { save, recordOutcome, hebrewUses, setStageStep, finishStage } = game;
  const hero = save.hero!;

  const [index, setIndex] = useState(() => {
    const p = save.stages[STAGE_ID];
    return p && !p.done ? Math.min(p.step, LAST) : 0;
  });
  const step = STAGE1[index];
  const [task, setTask] = useState(() => newTask(step, game.rules, hebrewUses()));
  const [noteOpen, setNoteOpen] = useState(step.kind === 'note');
  const [finished, setFinished] = useState(false);
  const [lastWrong, setLastWrong] = useState(false);

  const line = step.kind === 'note' ? resolve(NOTE_TITLE, task.rules, hero.name) : resolve(step.text, task.rules, hero.name);
  const hint = step.kind === 'find' || step.kind === 'choice' ? resolve(step.hint, task.rules, hero.name) : null;
  const showHint = hint && task.mistakes >= 2 && !task.solved;
  const reveal = task.mistakes >= 3 && !task.solved;

  // Fill the gap in a fill-in sentence once it is answered.
  const shownLine =
    step.kind === 'choice' && task.solved ? { ...line, en: line.en.replace('___', step.options[0].en) } : line;

  useEffect(() => {
    if (!task.rules.autoRead || step.kind === 'note' || finished) return;
    const t = setTimeout(() => speak(line.en), 350);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (showHint && task.rules.autoRead && task.mistakes === 2) speak(hint.en);
  }, [task.mistakes]);

  const solve = () => {
    setTask({ ...task, solved: true });
    setLastWrong(false);
    playSuccess();
    recordOutcome({ mistakes: task.mistakes, usedHebrew: hebrewUses() > task.hebrewAtStart });
  };

  const miss = (what: number | SceneObject) => {
    setTask({ ...task, mistakes: task.mistakes + 1, wrong: [...task.wrong, what] });
    setLastWrong(true);
  };

  const advance = () => {
    if (index === LAST) {
      finishStage(STAGE_ID);
      setFinished(true);
      return;
    }
    const next = index + 1;
    setIndex(next);
    setStageStep(STAGE_ID, next);
    setTask(newTask(STAGE1[next], game.rules, hebrewUses()));
    setLastWrong(false);
    setNoteOpen(STAGE1[next].kind === 'note');
  };

  const tapObject = (id: SceneObject) => {
    if (step.kind === 'find' && !task.solved) {
      // Every wrong tap counts, so Dad's hint comes even when there is only one wrong object.
      if (id === step.target) solve();
      else miss(id);
      return;
    }
    speak(OBJECTS.find((o) => o.id === id)!.word);
  };

  const visible = (id: SceneObject) => id !== 'note' || index >= FIND_NOTE;
  const toolboxWithDad = index > FIND_TOOLBOX || (index === FIND_TOOLBOX && task.solved);
  const noteSeen = index > READ_NOTE;

  const pose: Pose = finished || (task.solved && step.kind !== 'line') ? 'happy' : step.kind === 'find' || step.kind === 'choice' ? 'think' : 'idle';
  const canGoOn = step.kind === 'line' || step.kind === 'note' || task.solved;

  return (
    <div class="stage">
      <div class="scene">
        <GameImage path="backgrounds/bg_kitchen.png" label="Kitchen" class="scene__bg" />
        <GameImage
          path="characters/dad_legs.png"
          label="Dad under the sink"
          class={`scene__dad ${step.kind === 'line' && step.fx === 'splash' ? 'scene__dad--wiggle' : ''}`}
        />
        {step.kind === 'line' && step.fx === 'splash' && (
          <GameImage key={index} path="props/fx_splash.png" label="Splash" class="scene__splash" />
        )}

        {OBJECTS.filter((o) => visible(o.id)).map((o) => (
          <button
            key={o.id}
            type="button"
            data-obj={o.id}
            class={[
              'scene__obj',
              `scene__obj--${o.id}`,
              o.id === 'toolbox' && toolboxWithDad ? 'scene__obj--with-dad' : '',
              o.id === 'note' && index === FIND_NOTE && !task.solved ? 'scene__obj--appear' : '',
              reveal && step.kind === 'find' && step.target === o.id ? 'is-reveal' : '',
              task.wrong.includes(o.id) ? 'is-wrong' : '',
              task.solved && step.kind === 'find' && step.target === o.id ? 'is-right' : '',
            ].join(' ')}
            aria-label={o.label}
            onClick={() => tapObject(o.id)}
          >
            <GameImage path={o.path} label={o.label} class="scene__obj-img" />
          </button>
        ))}

        <GameImage path={heroImage(hero.id, pose)} label={hero.name} class="scene__hero" />
      </div>

      <section class="dialog" aria-live="polite">
        <div class="dialog__speaker">{step.kind === 'note' ? hero.name : 'Dad'}</div>

        {step.kind === 'note' ? (
          <SpeechLine en="Let's read Dad's note." he="בואו נקרא את הפתק של אבא." />
        ) : (
          <SpeechLine key={`${index}-${task.solved}`} en={shownLine.en} he={shownLine.he} />
        )}

        {step.kind === 'line' && step.tip && (
          <div class="tip">
            <span class="tip__label" aria-hidden="true">💡</span>
            <SpeechLine en={step.tip.en} he={step.tip.he} class="speech-line--small" />
          </div>
        )}

        {showHint && (
          <div class="hint">
            <span class="hint__label">Dad's hint</span>
            <SpeechLine en={hint.en} he={hint.he} class="speech-line--small" />
          </div>
        )}

        {step.kind === 'choice' && (
          <div class="choices" role="group" aria-label="Answers">
            {task.order.map((i) => {
              const opt = step.options[i];
              const isRight = i === 0;
              const state = task.solved && isRight ? 'is-right' : task.wrong.includes(i) ? 'is-wrong' : reveal && isRight ? 'is-reveal' : '';
              return (
                <div key={i} class={`choice ${state}`}>
                  <button
                    type="button"
                    class="choice__btn"
                    disabled={task.solved || task.wrong.includes(i) || (reveal && !isRight)}
                    onClick={() => (isRight ? solve() : miss(i))}
                  >
                    {opt.en}
                  </button>
                  {canSpeak() && (
                    <button type="button" class="choice__listen" aria-label={`Listen to ${opt.en}`} onClick={() => speak(opt.en)}>
                      <span aria-hidden="true">🔊</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div class="dialog__footer">
          <p class="feedback" role="status">
            {task.solved && step.kind !== 'line' && step.kind !== 'note'
              ? PRAISE[index % PRAISE.length]
              : reveal
                ? step.kind === 'find'
                  ? 'Here it is! Tap it.'
                  : 'This one! Tap it.'
                : lastWrong
                  ? 'Try again!'
                  : step.kind === 'find'
                    ? 'Tap it in the kitchen.'
                    : ''}
          </p>
          {(noteSeen || step.kind === 'note') && (
            <button type="button" class="btn btn--soft" onClick={() => setNoteOpen(true)}>
              <span aria-hidden="true">📝</span> Note
            </button>
          )}
          {canGoOn && (
            <button type="button" class="btn btn--next" onClick={advance}>
              {index === LAST ? 'Finish' : 'Next'} <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </section>

      {noteOpen && <NotePanel onClose={() => setNoteOpen(false)} />}

      {finished && (
        <div class="panel-backdrop">
          <section class="panel stage-done" role="dialog" aria-modal="true" aria-label="Stage complete">
            <GameImage path={heroImage(hero.id, 'happy')} label={hero.name} class="stage-done__hero" />
            <h2 class="screen-title">Stage 1 done!</h2>
            <SpeechLine
              en={`Well done, ${hero.name}! You found Dad's note. Next, get the food!`}
              he={`כל הכבוד, ${hero.name}! מצאתם את הפתק של אבא. הבא בתור: להשיג את האוכל!`}
            />
            <button type="button" class="btn btn--play" onClick={onExit}>
              Back to the map
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function NotePanel({ onClose }: { onClose: () => void }) {
  const { noteHebrew } = useGame();
  const [showHebrew, setShowHebrew] = useState(false);
  const all = NOTE_LINES.map((l) => l.en).join(' ');

  return (
    <Panel title={NOTE_TITLE.en} onClose={onClose} class="note-panel">
      <div class="note-paper">
        <ul class="note-paper__lines">
          {NOTE_LINES.map((l) => (
            <li key={l.en}>
              <TapText text={l.en} />
            </li>
          ))}
        </ul>
      </div>
      <div class="speech-line__actions">
        {canSpeak() && (
          <button type="button" class="btn btn--listen" onClick={() => speak(all)}>
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
        <div class="he-bubble" lang="he" dir="rtl">
          {NOTE_LINES.map((l) => (
            <p key={l.he}>{l.he}</p>
          ))}
        </div>
      )}
      <button type="button" class="btn btn--next" onClick={onClose}>
        Done reading
      </button>
    </Panel>
  );
}
