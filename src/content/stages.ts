import type { Text } from './types';

export type StageInfo = {
  id: string;
  title: Text;
  // Only stages with content can be played; the rest show as coming soon.
  playable: boolean;
};

export const STAGES: StageInfo[] = [
  { id: 'note', title: { en: "Dad's Note", he: 'הפתק של אבא' }, playable: true },
  { id: 'food', title: { en: 'Get the Food', he: 'להשיג את האוכל' }, playable: false },
  { id: 'cake', title: { en: 'Bake a Cake', he: 'לאפות עוגה' }, playable: false },
  { id: 'decorate', title: { en: 'Decorate the House', he: 'לקשט את הבית' }, playable: false },
  { id: 'invite', title: { en: 'Invite Friends', he: 'להזמין חברים' }, playable: false },
  { id: 'gift', title: { en: 'Find a Gift', he: 'למצוא מתנה' }, playable: false },
  { id: 'surprise', title: { en: 'Surprise!', he: 'הפתעה!' }, playable: false },
];
