/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Controlled cyberpunk / vaporwave accents
        neon: {
          cyan: '#22d3ee',
          magenta: '#e879f9',
          blue: '#38bdf8',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.65)',
          dark: 'rgba(15, 23, 42, 0.65)',
        },
      },
      fontFamily: {
        // Will be refined once we pick exact fonts
        display: ['Satoshi', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        neon: '0 0 20px rgba(34, 211, 238, 0.35)',
      },
    },
  },
  plugins: [],
};
