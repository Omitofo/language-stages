# CONTEXT.md — Full Project Memory for Future Chats

> **If you are a new chat / new LLM session**, read this file + `SYSTEM.md` first.  
> Together they contain everything needed to continue the project without prior conversation history.

---

## What this project is

**language-stages** is a personal visual language-learning tool.

- Left: hierarchical sidebar (Levels → Stages)
- Right: one communicative situation (stage) at a time
- Background image + characters (PNG) + glass speech bubbles
- Step forward / backward through a short dialogue
- Instant language switch (and optional politeness/register variants)
- Same situation, different language surface

**Not** a quiz, chat bot, game, or full course.  
Pure visual sequential study of real communicative interactions.

Inspired by (but fully independent from) the user’s Japanese Learning Garden:
https://github.com/Omitofo/japanese-learning-garden

---

## Locked decisions (do not re-debate unless user asks)

| Decision | Value |
|----------|-------|
| Repo name | `language-stages` |
| Owner | Omitofo |
| Stack | Astro 5 + React 19 (islands) + TypeScript + Tailwind 3 |
| Rendering | SSG (static) + selective React hydration |
| Data | Static JSON files under `data/stages/{level}/` |
| Design | Swiss structure + Glassmorphism surfaces + controlled cyberpunk/vaporwave accents |
| Themes | Light + Dark |
| UI language | English |
| Characters | Transparent PNGs + glass speech bubbles (Option B) |
| Motion | Personality allowed (Framer Motion ready), purposeful |
| Sidebar | Collapsible file-tree style |
| Mobile | First-class, drawer on small screens |

---

## Key files every LLM must know

| File | Purpose |
|------|---------|
| `SYSTEM.md` | **Primary source of truth** for data model, how to add stages/languages/variants, philosophy, folder conventions |
| `DESIGN.md` | Visual direction, color, typography, motion rules |
| `CONTEXT.md` | This file — high-level memory + current status |
| `src/types/stage.ts` | Exact TypeScript types matching the data model |
| `data/stages/L00/ask-for-the-bill.json` | First complete stage (JA polite + casual + FR standard) |

---

## Data model summary (see SYSTEM.md for full detail)

- One JSON file per stage
- `languages` → language code → `variants` → variant id → `{ background, corePhrase, romanization?, characters?, dialogue[] }`
- `dialogue` is always a **flat ordered array** of turns (perfect for `currentStep` index)
- Variants are optional (most stages will have only one)
- Romanization only when useful (Japanese)

---

## Current status (as of 2026-09-19)

- [x] Repo created: https://github.com/Omitofo/language-stages
- [x] Full data model + types
- [x] SYSTEM.md + DESIGN.md + CONTEXT.md
- [x] First stage: L00 / ask-for-the-bill (JA polite, JA casual, FR standard)
- [x] Basic Astro + React + Tailwind scaffold
- [x] Working shell: Sidebar + StageView + Language/Variant switchers + Step controls
- [ ] Real background images (placeholders only)
- [ ] Real character PNGs
- [ ] Polish animations (Framer Motion already in dependencies)
- [ ] More stages (water, toilet, etc.)
- [ ] Production deployment (GitHub Pages / Cloudflare Pages / Vercel)

---

## How to continue in a new chat

1. User says: “continue language-stages” or points to the repo.
2. Read `SYSTEM.md` + this `CONTEXT.md`.
3. Look at current files in `src/` and `data/`.
4. Next natural work items (pick based on user request):
   - Add more stages (from Japanese garden inspiration or pure new)
   - Add French/Japanese backgrounds and character assets
   - Improve visual polish / motion
   - Make the dialogue show previous turns or progress bar
   - Deploy

---

## Creation workflow (LLM)

When user says “add stage X” or “add French to Y”:

1. Follow exact data model in SYSTEM.md
2. Place JSON under the correct `data/stages/L0X/`
3. Update the import list in `src/components/App.tsx` (or later make it automatic)
4. Assets go in `public/assets/backgrounds/{lang}/` and `public/assets/characters/`

Never write back into the Japanese Learning Garden repo.

---

## Design references (user’s knowledge base)

User has a design style knowledge base:
https://github.com/Omitofo/design-style-knowledge-base

Relevant folders already consulted:
- styles/swiss-international
- styles/glassmorphism
- styles/vaporwave-cyberpunk

---

**End of context dump.**  
Any new session that reads SYSTEM.md + CONTEXT.md has full continuity.
