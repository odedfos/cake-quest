import { useState } from 'preact/hooks';
import { TitleScreen } from './screens/TitleScreen';
import { ComingSoon } from './screens/ComingSoon';

type Screen = 'title' | 'choose-hero';

export function App() {
  const [screen, setScreen] = useState<Screen>('title');

  switch (screen) {
    case 'title':
      return <TitleScreen onPlay={() => setScreen('choose-hero')} />;
    case 'choose-hero':
      return <ComingSoon title="Choose your meerkat" onBack={() => setScreen('title')} />;
  }
}
