// An English line and its Hebrew translation. `short` is a simpler wording used at the
// easy level. "{name}" is replaced with the player's meerkat's name.
export type Text = {
  en: string;
  he: string;
  short?: { en: string; he: string };
};

export type SceneObject = 'toolbox' | 'photo' | 'note';

export type Step =
  // Dad says something; the player taps Next.
  | { kind: 'line'; text: Text; tip?: Text; fx?: 'splash' }
  // Dad asks for something in the kitchen; the player taps it.
  | { kind: 'find'; text: Text; target: SceneObject; hint: Text }
  // Dad asks a question; the player picks an answer. The first option is the right one.
  | { kind: 'choice'; text: Text; options: Text[]; hint: Text }
  // The player reads Dad's note.
  | { kind: 'note' };
