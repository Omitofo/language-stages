import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // we control base in global.css
    }),
  ],
  // Pure static output (SSG)
  output: 'static',
  // Optional: change site when deploying
  // site: 'https://omitofo.github.io',
});
