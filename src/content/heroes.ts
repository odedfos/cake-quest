export type Pose = 'idle' | 'happy' | 'think';

export type Hero = {
  id: string;
  name: string;
};

// The four ready-made meerkats from docs/ASSETS.md, with default names the player can change.
export const HEROES: Hero[] = [
  { id: 'kid1', name: 'Miko' },
  { id: 'kid2', name: 'Lila' },
  { id: 'kid3', name: 'Tomi' },
  { id: 'kid4', name: 'Nala' },
];

export function heroImage(id: string, pose: Pose = 'idle'): string {
  return `characters/char_${id}_${pose}.png`;
}
