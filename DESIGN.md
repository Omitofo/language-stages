# DESIGN.md — Visual Direction

## Synthesis (locked)

| Layer              | Style                  | How it is applied                                      |
|--------------------|------------------------|--------------------------------------------------------|
| Structure          | Swiss International    | Clean grid, strong hierarchy, generous whitespace, high legibility |
| Surfaces           | Glassmorphism          | Speech bubbles, control panels, open sidebar use frosted glass |
| Accents & energy   | Controlled Cyberpunk / Vaporwave | Neon cyan + magenta glows, soft gradients, subtle focus energy |

Result: a clean, professional interface with modern depth and a touch of contemporary character. Never chaotic.

## Typography

- **Display / headings**: Satoshi or Cabinet Grotesk (or closest available with personality)
- **UI / body**: Inter or Geist (highly legible)
- Fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

## Color direction

### Light mode
- Background: near-white / cool gray
- Surfaces: white with subtle transparency
- Text: near-black
- Accent: cyan / electric blue + soft magenta for active states

### Dark mode
- Background: deep charcoal / near-black
- Surfaces: glass with stronger blur
- Text: off-white
- Accent: brighter neon cyan + magenta glows (this is where the cyberpunk energy shines)

## Motion

Personality is welcome, but always purposeful:

- Stage change: soft cross-fade or slight scale
- Dialogue turn appear: fade + subtle upward slide
- Language / variant switch: quick content swap with light transition
- Buttons & hover: micro scale or glow
- Always respect `prefers-reduced-motion`

## Layout principles

- Mobile-first
- Desktop: fixed collapsible sidebar (file-tree style) + large stage area
- Mobile: sidebar becomes a drawer / sheet
- Background image lives inside a defined, well-proportioned container
- Characters sit on top of the background; speech bubbles are glass tooltips attached to them
- Controls (language, variant, prev/next) stay clear and touch-friendly

## Character assets

- Transparent PNGs
- Shared pool in `/public/assets/characters/`
- Can be language- or stage-specific later if needed
- Positioned via percentage coordinates in the stage JSON

## What to avoid

- Busy, overloaded interfaces
- Pure vaporwave/cyberpunk excess (glitch overload, low contrast, meme density)
- Decorative elements that do not serve the study of the dialogue
- Heavy 3D or video assets
