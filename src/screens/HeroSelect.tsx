import { useState } from 'preact/hooks';
import { GameImage } from '../components/GameImage';
import { SpeechLine } from '../components/SpeechLine';
import { HEROES, heroImage } from '../content/heroes';
import { useGame } from '../game/GameContext';

type Props = {
  onDone: () => void;
};

export function HeroSelect({ onDone }: Props) {
  const { save, chooseHero } = useGame();
  const [heroId, setHeroId] = useState(save.hero?.id ?? HEROES[0].id);
  const defaultName = (id: string) => HEROES.find((h) => h.id === id)!.name;
  const [name, setName] = useState(save.hero?.name ?? defaultName(heroId));
  // Picking another meerkat brings its default name, unless the player typed their own.
  const [typedName, setTypedName] = useState(Boolean(save.hero));

  const pick = (id: string) => {
    setHeroId(id);
    if (!typedName) setName(defaultName(id));
  };

  const finalName = name.trim() || defaultName(heroId);

  return (
    <main class="screen hero-select">
      <GameImage path="backgrounds/bg_title.png" label="Title background" class="screen__bg" />

      <section class="card hero-select__card">
        <h1 class="screen-title">Choose your meerkat</h1>
        <SpeechLine en="Who will help Dad today?" he="מי יעזור לאבא היום?" />

        <div class="hero-grid" role="radiogroup" aria-label="Meerkats">
          {HEROES.map((h) => (
            <button
              key={h.id}
              type="button"
              role="radio"
              aria-checked={heroId === h.id}
              class="hero-option"
              onClick={() => pick(h.id)}
            >
              <GameImage path={heroImage(h.id)} label={h.name} class="hero-option__img" alt="" />
              <span class="hero-option__name">{heroId === h.id ? finalName : h.name}</span>
            </button>
          ))}
        </div>

        <label class="name-field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            maxLength={12}
            autoComplete="off"
            spellcheck={false}
            onInput={(e) => {
              setName(e.currentTarget.value);
              setTypedName(true);
            }}
          />
        </label>

        <button
          type="button"
          class="btn btn--play"
          onClick={() => {
            chooseHero(heroId, finalName);
            onDone();
          }}
        >
          Let's go!
        </button>
      </section>
    </main>
  );
}
