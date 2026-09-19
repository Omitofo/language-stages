# language-stages

Visual practice app for learning languages through real communicative situations.

Each **stage** is a situation (ask for the bill, ask for water…).  
You step through the dialogue and can instantly switch languages (and optional politeness registers) while keeping the same situation.

**Live philosophy**

- Situation is primary. Language is a skin.
- Data over code. New stages = new JSON + images.
- Low asset weight.
- Pure study tool — no quizzes, no typing, no scoring.

---

## Stack

- **Astro 5** (SSG) + **React 19** islands
- **TypeScript**
- **Tailwind CSS**
- Static JSON data

## Quick start

```bash
npm install
npm run dev
```

## Project memory for LLMs / new chats

If you are continuing this project in a new conversation:

1. Read **`SYSTEM.md`** (data model + how to extend)
2. Read **`CONTEXT.md`** (full status + locked decisions)
3. Look at `src/types/stage.ts` and `data/stages/`

That is enough to pick up exactly where we left off.

## Structure

```
data/stages/L00/ask-for-the-bill.json   ← first real stage
src/components/                         ← Sidebar + StageView + switchers
src/types/stage.ts                      ← TypeScript model
SYSTEM.md                               ← LLM source of truth
DESIGN.md                               ← visual direction
CONTEXT.md                              ← full project memory
```

## Status

Foundation + working shell is in place.  
Next: real assets, more stages, motion polish, deployment.

Repo: https://github.com/Omitofo/language-stages
