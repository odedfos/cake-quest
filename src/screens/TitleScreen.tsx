import { GameImage } from '../components/GameImage';
import { SpeechLine } from '../components/SpeechLine';

type Props = {
  onPlay: () => void;
};

export function TitleScreen({ onPlay }: Props) {
  return (
    <main class="screen title-screen">
      <GameImage path="backgrounds/bg_title.png" label="Title background" class="screen__bg" />

      <header class="title-sign">
        <GameImage path="props/ui_sign.png" label="Wooden sign" class="title-sign__art" />
        <h1 class="title-sign__text">Operation Cake</h1>
      </header>

      <section class="title-card">
        <SpeechLine
          en="It's Mom's birthday! Help Dad make a surprise party."
          he="היום יום ההולדת של אמא! עזרו לאבא להכין מסיבת הפתעה."
        />
        <button type="button" class="btn btn--play" onClick={onPlay}>
          Play
        </button>
      </section>

      <GameImage path="characters/char_kid1_idle.png" label="Meerkat kid" class="title-hero" />
    </main>
  );
}
