# רשימת איורים – שלב 1

14 איורים מכסים את מסך הפתיחה ואת שלב 1 ("הפתק של אבא"). רקע המטבח והדמויות משמשים גם בשלבים הבאים.

## איך עובדים

1. **סגנון אחיד** – מצרפים לכל פרומפט את בלוק הסגנון שבסעיף הבא, ומעלים את `docs/style-reference.png` כדוגמה, אם הכלי מאפשר.
2. **בלי טקסט באיורים** – כל טקסט, כפתור או בועה נבנה בקוד. אם יצא טקסט באיור, מייצרים מחדש.
3. **רקעים** – יחס 3:2, לפחות 1536×1024, PNG.
4. **דמויות וחפצים** – ריבוע 1024×1024, הדמות שלמה ובמרכז, על רקע לבן אחיד. אחר כך מסירים את הרקע ושומרים PNG שקוף.
5. **שמות קבצים** – לפי העמודה "קובץ" בטבלה. רקעים נשמרים ב-`assets/backgrounds/`, דמויות ב-`assets/characters/`, חפצים ב-`assets/props/`.

## בלוק הסגנון

מדביקים את הבלוק הזה בתחילת כל פרומפט, ואחריו את תיאור האיור מהטבלה.

```text
Style: warm storybook illustration for a children's educational game, soft painterly digital gouache with light paper texture, rounded friendly shapes, gentle soft lighting. Palette: warm sand and cream walls, terracotta and wood browns, sage green, sky blue accents. Characters are cute cartoon meerkats with big dark eye patches, expressive faces, simple clothing. No text, no letters, no logos, no UI elements, no frames.
```

## האיורים

| # | איור | קובץ | סוג | פרומפט |
| --- | --- | --- | --- | --- |
| 1 | רקע מסך פתיחה | `backgrounds/bg_title.png` | רקע 3:2 | Wide scene: the round wooden front door of a cozy meerkat burrow built into a sandy desert hill, potted plants and a small vegetable patch beside it, morning sun, open empty sky in the upper half. No characters. |
| 2 | רקע המטבח | `backgrounds/bg_kitchen.png` | רקע 3:2 | Wide interior: a cozy meerkat burrow kitchen with curved sandy walls, a round window showing desert hills, a wooden counter with a sink on the right half, sage green cabinets below, the cabinet door under the sink wide open and dark inside with a dripping pipe, a small wooden table at the far left, empty floor space on the left. No characters. |
| 3 | ילד 1 | `characters/char_kid1_idle.png` | דמות | A young meerkat boy about 10 years old, standing upright and smiling, arms relaxed, wearing a blue apron over a yellow t-shirt. Full body, front view, centered, plain white background. |
| 4 | ילדה 2 | `characters/char_kid2_idle.png` | דמות | A young meerkat girl about 10 years old, standing upright and smiling, arms relaxed, wearing a red headband and green overalls. Full body, front view, centered, plain white background. |
| 5 | ילד 3 | `characters/char_kid3_idle.png` | דמות | A young meerkat boy about 10 years old, standing upright and smiling, arms relaxed, wearing round glasses and a striped orange shirt. Full body, front view, centered, plain white background. |
| 6 | ילדה 4 | `characters/char_kid4_idle.png` | דמות | A young meerkat girl about 10 years old, standing upright and smiling, arms relaxed, with a small braid tied with a flower and a purple dress with pockets. Full body, front view, centered, plain white background. |
| 7 | ילד 1 שמח | `characters/char_kid1_happy.png` | דמות | The same meerkat boy as the reference image, jumping with joy, both arms up, big smile. Full body, centered, plain white background. |
| 8 | ילד 1 חושב | `characters/char_kid1_think.png` | דמות | The same meerkat boy as the reference image, thinking, one finger on his chin, looking up. Full body, centered, plain white background. |
| 9 | אבא מתחת לכיור | `characters/dad_legs.png` | דמות | The lower half of an adult meerkat lying on his back, side view: legs in blue jeans and brown work boots, a curled tail, upper body cut off at the waist as if hidden inside a cabinet. Plain white background. |
| 10 | הפתק של אבא | `props/note_paper.png` | חפץ | A slightly crumpled sheet of lined notebook paper with a small water stain, completely blank, held by a cactus-shaped fridge magnet. Front view, plain white background. |
| 11 | התזת מים | `props/fx_splash.png` | חפץ | A cartoon splash of blue water droplets bursting outward. Plain white background. |
| 12 | ארגז כלים | `props/toolbox.png` | חפץ | An open red metal toolbox with a few tools sticking out. Three-quarter view, plain white background. |
| 13 | שלט המשחק | `props/ui_sign.png` | חפץ | A blank wooden hanging sign on two ropes, decorated with a few green leaves, empty flat surface for a title. Front view, plain white background. |
| 14 | תמונה של אמא | `props/obj_mom_photo.png` | חפץ | A small wooden picture frame holding a portrait of a smiling adult meerkat mother wearing a white doctor's coat and a stethoscope. Front view, plain white background. |

אחרי שהדמות הראשונה יוצאת טוב, מייצרים את 7–8 (שמח, חושב) גם לשאר הדמויות, באותו נוסח.
