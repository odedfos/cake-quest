import { useState } from 'preact/hooks';
import { NotebookPanel } from './components/NotebookPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { TopBar } from './components/TopBar';
import { WordHelp } from './components/WordHelp';
import { GameProvider, useGame } from './game/GameContext';
import type { SaveData } from './game/save';
import { HeroSelect } from './screens/HeroSelect';
import { HouseMap } from './screens/HouseMap';
import { StageOne } from './screens/StageOne';
import { TitleScreen } from './screens/TitleScreen';

type Screen = 'title' | 'choose-hero' | 'map' | 'stage';

export function App({ initial }: { initial?: SaveData }) {
  return (
    <GameProvider initial={initial}>
      <Game />
    </GameProvider>
  );
}

function Game() {
  const { save, startOver, showWord } = useGame();
  const [screen, setScreen] = useState<Screen>('title');
  const [panel, setPanel] = useState<'notebook' | 'settings' | null>(null);

  const go = (s: Screen) => {
    showWord(null);
    setPanel(null);
    setScreen(s);
  };

  const withBar = screen === 'map' || screen === 'stage';

  return (
    <>
      {withBar && (
        <TopBar
          onMap={screen === 'stage' ? () => go('map') : undefined}
          onNotebook={() => setPanel('notebook')}
          onSettings={() => setPanel('settings')}
        />
      )}

      {screen === 'title' && <TitleScreen onPlay={() => go(save.hero ? 'map' : 'choose-hero')} />}
      {screen === 'choose-hero' && <HeroSelect onDone={() => go('map')} />}
      {screen === 'map' && <HouseMap onPlay={() => go('stage')} />}
      {screen === 'stage' && <StageOne onExit={() => go('map')} />}

      {panel === 'notebook' && <NotebookPanel onClose={() => setPanel(null)} />}
      {panel === 'settings' && (
        <SettingsPanel
          onClose={() => setPanel(null)}
          onChangeHero={() => go('choose-hero')}
          onStartOver={() => {
            startOver();
            go('title');
          }}
        />
      )}

      <WordHelp />
    </>
  );
}
