import { useState } from 'preact/hooks';
import { GameImage } from '../components/GameImage';
import { SpeechLine } from '../components/SpeechLine';
import { heroImage } from '../content/heroes';
import { STAGES } from '../content/stages';
import { useGame } from '../game/GameContext';
import { canSpeak, speak } from '../speech';

type Props = {
  onPlay: (stageId: string) => void;
};

// The party plan: one card per stage, showing what is done and what comes next.
export function HouseMap({ onPlay }: Props) {
  const { save } = useGame();
  const [soonId, setSoonId] = useState<string | null>(null);
  const hero = save.hero!;

  return (
    <main class="screen house-map">
      <GameImage path="backgrounds/bg_title.png" label="Title background" class="screen__bg" />

      <section class="card house-map__card">
        <h1 class="screen-title">Mom's Birthday Plan</h1>
        <SpeechLine en="Get the party ready, one step at a time!" he="מכינים את המסיבה, צעד אחר צעד!" />

        <ol class="stage-list">
          {STAGES.map((s, i) => {
            const progress = save.stages[s.id];
            const status = progress?.done ? 'done' : s.playable ? 'open' : 'soon';
            return (
              <li key={s.id} class={`stage-item stage-item--${status}`}>
                <button
                  type="button"
                  class="stage-item__main"
                  aria-disabled={!s.playable}
                  onClick={() => (s.playable ? onPlay(s.id) : setSoonId(s.id))}
                >
                  <span class="stage-item__num">{status === 'done' ? '✓' : i + 1}</span>
                  <span class="stage-item__title">{s.title.en}</span>
                  <span class="stage-item__status">
                    {status === 'done' ? 'Done!' : status === 'open' ? (progress?.step ? 'Continue' : 'Play') : soonId === s.id ? 'Coming soon!' : '🔒'}
                  </span>
                </button>
                {canSpeak() && (
                  <button
                    type="button"
                    class="btn btn--listen btn--round"
                    aria-label={`Listen to ${s.title.en}`}
                    onClick={() => speak(s.title.en)}
                  >
                    <span aria-hidden="true">🔊</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <figure class="map-hero">
        <GameImage path={heroImage(hero.id)} label={hero.name} class="map-hero__img" />
        <figcaption class="map-hero__name">{hero.name}</figcaption>
      </figure>
    </main>
  );
}
