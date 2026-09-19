# SYSTEM.md — Language Stages

> **This is the single source of truth for any LLM working on this project.**  
> Always read this file first before adding stages, languages, variants, or changing structure.

---

## 1. Project Purpose

**language-stages** is a visual practice tool for learning languages through communicative situations (stages).

- Left side: hierarchical navigation (Levels → Stages)
- Right side: one stage at a time
  - Atmospheric background image
  - Characters (PNG cutouts) + glass speech bubbles
  - Sequential dialogue (step forward / backward)
  - Language toggle + optional register/variant toggle

**This is not a quiz, chat simulator, or game.**  
It is a clean visual representation of real communicative interactions so the user can study the same situation across languages.

---

## 2. Core Philosophy

- **Situation is primary.** Language is a skin.
- **Data over code.** New stages = new JSON + 1–2 images. Almost never new components.
- **Low asset weight.** Optimized WebP backgrounds + simple transparent PNGs for characters.
- **Optional complexity.** Most stages have only one variant. Extra politeness/register variants are added only when they are genuinely useful (especially Japanese).
- **Full ownership.** This project never writes back to the Japanese Learning Garden. It only takes inspiration.

---

## 3. Levels (owned by this project)

```
L00 — Survival          Essential requests & repairs
L01 — Basic Action      Simple concrete actions
L02 — Description       Describing things, people, places
L03 — Interaction       Short back-and-forth exchanges
L04 — Time & Experience Past, frequency, experience
L05 — Plans & Future    Intentions, plans, suggestions
L06 — Conversation      Longer natural dialogue
L07+ — Complex          Nuance, opinions, storytelling
```

These appear as the top-level folders in the sidebar.

---

## 4. Data Model (exact shape)

One file per stage: `data/stages/{level}/{id}.json`

```ts
{
  "id": "ask-for-the-bill",
  "level": "L00",
  "title": {
    "en": "Ask for the bill"
  },
  "circumstance": {
    "en": "You finished eating in a café or restaurant and want to pay and leave."
  },
  "status": "ready",                    // "draft" | "ready"
  "sourceInspiration": "japanese-learning-garden/S011",  // optional
  "languages": {
    "ja": {
      "label": "日本語",
      "defaultVariant": "polite",
      "variants": {
        "polite": {
          "label": "Polite",
          "background": "/assets/backgrounds/ja/cafe-bill.webp",
          "corePhrase": "お会計をください。",
          "romanization": "o-kaikei o kudasai",
          "characters": [                 // optional positions
            {
              "id": "customer",
              "src": "/assets/characters/ja/customer-01.png",
              "position": { "x": 18, "y": 55 }   // % from left/top
            },
            {
              "id": "staff",
              "src": "/assets/characters/ja/staff-01.png",
              "position": { "x": 72, "y": 48 }
            }
          ],
          "dialogue": [
            {
              "speaker": "customer",
              "text": "すみません、お会計をください。",
              "romanization": "sumimasen, o-kaikei o kudasai"
            },
            {
              "speaker": "staff",
              "text": "はい、少々お待ちください。",
              "romanization": "hai, shoushou omachi kudasai"
            }
            // ... more turns
          ]
        },
        "casual": { ... }
      }
    },
    "fr": {
      "label": "Français",
      "defaultVariant": "standard",
      "variants": {
        "standard": {
          "label": "Standard",
          "background": "/assets/backgrounds/fr/cafe-bill.webp",
          "corePhrase": "L'addition, s'il vous plaît.",
          "romanization": null,
          "characters": [ ... ],
          "dialogue": [ ... ]
        }
      }
    }
  }
}
```

### Rules for the model

- `dialogue` is always a **flat ordered array**. This is what the frontend steps through.
- `romanization` is only required for Japanese (or any language that benefits from it). Use `null` otherwise.
- `characters` array is optional. If present, the frontend positions the PNGs and attaches glass speech bubbles to the matching speaker.
- Background path is per variant (usually the same image is reused across variants of the same language).
- Adding a new language = add a new key under `languages` + provide the background image.
- Adding a new variant = add a new key under `variants` of that language.

---

## 5. How to Add Content (LLM workflow)

### Path A — From Japanese Learning Garden (inspiration)

1. User points to a completed sprint (e.g. “take S011”).
2. Extract: circumstance, core phrase, variations, natural dialogue flow.
3. Create the stage under the correct level (`L00`, `L01`, …).
4. Start with Japanese only (polite + casual if useful).
5. User approves.
6. Later add other languages one by one.

### Path B — Pure new stage or translation

1. User describes the situation or says “add French to the bill stage”.
2. Follow the exact data model above.
3. Place background images in `public/assets/backgrounds/{lang}/`.
4. Place character PNGs in `public/assets/characters/` (shared pool is fine).

**Never** invent deep nesting or change the shape of `dialogue`.  
**Never** write back to the Japanese repo.

---

## 6. Frontend Responsibilities (keep minimal)

- Load all stages and group by level for the sidebar.
- When a stage is selected:
  - Pick language (default or last used) → its `defaultVariant`.
  - Show background.
  - Render characters (if defined) + speech bubbles for turns up to `currentStep`.
  - Show core phrase + romanization.
  - Provide Prev / Next controls (and keyboard support).
- Language switcher: only show languages that exist on the current stage. Switching resets `currentStep` to 0.
- Variant switcher: only appears if the current language has > 1 variant. Switching also resets step to 0.

Active state the UI holds:

```ts
{
  stageId: string
  language: string
  variant: string
  currentStep: number
}
```

---

## 7. Design System (locked)

**Structure** → Swiss International  
Clean grid, strong hierarchy, generous whitespace, high legibility.

**Surfaces** → Glassmorphism  
Speech bubbles, control panels, sidebar (when open) use frosted glass (backdrop-blur + transparency + subtle border).

**Accents** → Controlled Vaporwave / Cyberpunk  
Neon cyan / magenta glows, soft gradients, subtle energy. Never chaotic. Used for focus states, active language, progress, micro-interactions.

**Themes** → Light + Dark supported.  
Dark mode benefits strongly from the neon accents.

**Typography**  
- Display / headings: something with character (Satoshi, Cabinet Grotesk, or similar).  
- Body / UI: highly legible modern sans (Inter, Geist, or system fallback stack).

**Motion**  
Personality is welcome (Framer Motion or Motion One):  
- Stage change transitions  
- Dialogue turn appearance (fade + slight slide)  
- Language / variant switch  
- Micro-interactions on buttons and hover  
Respect `prefers-reduced-motion`.

**Responsive**  
Mobile-first.  
- Mobile: sidebar becomes a drawer / sheet.  
- Desktop: fixed collapsible sidebar + large stage area.

---

## 8. Folder Conventions

```
language-stages/
├── SYSTEM.md                 ← this file (LLM source of truth)
├── README.md                 ← human overview
├── data/
│   └── stages/
│       ├── L00/
│       │   └── ask-for-the-bill.json
│       ├── L01/
│       └── ...
├── public/
│   └── assets/
│       ├── backgrounds/
│       │   ├── ja/
│       │   └── fr/
│       └── characters/       ← shared pool of transparent PNGs
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   ├── StageView/
│   │   ├── LanguageSwitcher.tsx
│   │   └── VariantSwitcher.tsx
│   ├── types/
│   │   └── stage.ts
│   └── ...
└── tools/                    ← optional scaffolding scripts later
```

---

## 9. What NOT to do

- Do not turn this into a quiz or input-based exercise.
- Do not add a backend.
- Do not create deep nested dialogue structures.
- Do not force every stage to have multiple variants.
- Do not make the UI busy. Clarity and study focus come first.
- Do not write into the Japanese Learning Garden repo.

---

## 10. Current Status

- Stack: Astro + React (islands) + TypeScript + Tailwind
- Rendering: SSG + selective hydration
- First stage: L00 / ask-for-the-bill (Japanese polite + casual + French standard)

When in doubt, re-read this file and keep the data model and interaction model simple.
