// Stage 1, "Dad's Note": a short opening in the kitchen that teaches Listen, tapping
// words and the Hebrew button. Words: home, rooms, family. Structure: Please + verb.
// Hebrew addresses the player in the plural, like the rest of the game.

import type { Step, Text } from './types';

export const NOTE_TITLE: Text = { en: "Dad's Note", he: 'הפתק של אבא' };

export const NOTE_LINES: Text[] = [
  { en: '1. Get the food.', he: '1. להשיג את האוכל.' },
  { en: '2. Bake a cake.', he: '2. לאפות עוגה.' },
  { en: '3. Decorate the house.', he: '3. לקשט את הבית.' },
  { en: '4. Invite friends.', he: '4. להזמין חברים.' },
  { en: '5. Find a gift for Mom.', he: '5. למצוא מתנה לאמא.' },
  { en: "Shh! It's a surprise!", he: 'ששש! זו הפתעה!' },
];

export const STAGE1: Step[] = [
  {
    kind: 'line',
    text: {
      en: "Hi, {name}! I'm here, under the sink.",
      he: 'היי, {name}! אני כאן, מתחת לכיור.',
      short: { en: "Hi, {name}! I'm under the sink.", he: 'היי, {name}! אני מתחת לכיור.' },
    },
    tip: { en: 'Tap a word to hear it.', he: 'לחצו על מילה כדי לשמוע אותה.' },
  },
  {
    kind: 'line',
    text: { en: "Today is Mom's birthday!", he: 'היום יום ההולדת של אמא!' },
    tip: { en: 'Tap Listen to hear the whole sentence.', he: 'לחצו על Listen כדי לשמוע את כל המשפט.' },
  },
  {
    kind: 'line',
    text: {
      en: "Mom is at work. Let's make a surprise party for her!",
      he: 'אמא בעבודה. בואו נכין לה מסיבת הפתעה!',
      short: { en: "Mom is at work. Let's make a party!", he: 'אמא בעבודה. בואו נכין מסיבה!' },
    },
  },
  {
    kind: 'line',
    fx: 'splash',
    text: { en: 'Oh, fiddlesticks! Water on my face!', he: 'אוי, לא! מים לי על הפנים!' },
  },
  {
    kind: 'find',
    target: 'toolbox',
    text: { en: 'Please bring me the toolbox!', he: 'בבקשה תביאו לי את ארגז הכלים!' },
    hint: { en: 'The toolbox is red. It is next to the table.', he: 'ארגז הכלים אדום. הוא ליד השולחן.' },
  },
  {
    kind: 'line',
    text: {
      en: 'Thank you, {name}! Now I can fix the pipe.',
      he: 'תודה, {name}! עכשיו אני יכול לתקן את הצינור.',
      short: { en: 'Thank you, {name}!', he: 'תודה, {name}!' },
    },
  },
  {
    kind: 'choice',
    text: { en: 'Where am I, {name}?', he: 'איפה אני, {name}?' },
    options: [
      { en: 'Under the sink.', he: 'מתחת לכיור.' },
      { en: 'In the garden.', he: 'בגינה.' },
      { en: 'In the bedroom.', he: 'בחדר השינה.' },
      { en: 'On the roof.', he: 'על הגג.' },
    ],
    hint: { en: 'Look at my feet! I am in the kitchen.', he: 'תסתכלו על הרגליים שלי! אני במטבח.' },
  },
  {
    kind: 'find',
    target: 'photo',
    text: { en: "Please look at Mom's photo.", he: 'בבקשה תסתכלו על התמונה של אמא.' },
    hint: { en: 'The photo is next to the sink.', he: 'התמונה ליד הכיור.' },
  },
  {
    kind: 'line',
    text: {
      en: 'Mom is a doctor. She helps sick people at the hospital.',
      he: 'אמא רופאה. היא עוזרת לאנשים חולים בבית החולים.',
      short: { en: 'Mom is a doctor.', he: 'אמא רופאה.' },
    },
  },
  {
    kind: 'choice',
    text: { en: 'Who has a birthday today?', he: 'למי יש יום הולדת היום?' },
    options: [
      { en: 'Mom!', he: 'לאמא!' },
      { en: 'Dad!', he: 'לאבא!' },
      { en: 'Grandma!', he: 'לסבתא!' },
      { en: 'My brother!', he: 'לאח שלי!' },
    ],
    hint: { en: "It's not me! Look at the photo.", he: 'זה לא אני! תסתכלו על התמונה.' },
  },
  {
    kind: 'choice',
    text: { en: "I'm stuck here. Please ___ me!", he: 'אני תקוע כאן. בבקשה ___ לי!' },
    options: [
      { en: 'help', he: 'תעזרו' },
      { en: 'eat', he: 'תאכלו' },
      { en: 'wash', he: 'תשטפו' },
      { en: 'sing', he: 'תשירו' },
    ],
    hint: { en: 'Help, help! I need help!', he: 'הצילו! אני צריך עזרה!' },
  },
  {
    kind: 'find',
    target: 'note',
    text: {
      en: 'Look! There is a note on the wall. Please read it.',
      he: 'תראו! יש פתק על הקיר. בבקשה תקראו אותו.',
      short: { en: 'Look! A note! Please read it.', he: 'תראו! פתק! בבקשה תקראו אותו.' },
    },
    hint: { en: 'Look up! The note is over the green plants.', he: 'תסתכלו למעלה! הפתק מעל הצמחים הירוקים.' },
  },
  { kind: 'note' },
  {
    kind: 'choice',
    text: { en: 'What do we do first?', he: 'מה עושים קודם?' },
    options: [
      { en: 'Get the food.', he: 'להשיג את האוכל.' },
      { en: 'Bake a cake.', he: 'לאפות עוגה.' },
      { en: 'Find a gift.', he: 'למצוא מתנה.' },
      { en: 'Invite friends.', he: 'להזמין חברים.' },
    ],
    hint: { en: 'Look at number one on the note.', he: 'תסתכלו על מספר אחת בפתק.' },
  },
  {
    kind: 'choice',
    text: { en: 'Where do we bake the cake?', he: 'איפה אופים את העוגה?' },
    options: [
      { en: 'In the kitchen.', he: 'במטבח.' },
      { en: 'In the bathroom.', he: 'בחדר האמבטיה.' },
      { en: 'In the bedroom.', he: 'בחדר השינה.' },
      { en: 'In the garden.', he: 'בגינה.' },
    ],
    hint: { en: 'We are in this room!', he: 'אנחנו בחדר הזה!' },
  },
  {
    kind: 'choice',
    text: { en: "Shh! It's a surprise. Please don't tell ___!", he: 'ששש! זו הפתעה. בבקשה אל תספרו ל___!' },
    options: [
      { en: 'Mom', he: 'אמא' },
      { en: 'the sink', he: 'הכיור' },
      { en: 'the toolbox', he: 'ארגז הכלים' },
      { en: 'the water', he: 'המים' },
    ],
    hint: { en: 'Who has a birthday today?', he: 'למי יש יום הולדת היום?' },
  },
  {
    kind: 'line',
    text: {
      en: "Great job, {name}! First, let's get the food.",
      he: 'כל הכבוד, {name}! קודם כול, בואו נשיג את האוכל.',
      short: { en: 'Great job, {name}!', he: 'כל הכבוד, {name}!' },
    },
  },
];
