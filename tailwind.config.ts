import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light premium — J.Berry brand: white, ivory, gold, charcoal
        ivory: '#FAF7F0',
        gold: '#C9A961',
        goldDeep: '#B08D3E',
        charcoal: '#2B2B2B',
        charcoalDeep: '#1D1D1D',
        band: '#0B0B0B',
        ink: '#2B2B2B',
        stone: '#7A7568',
        line: '#E8E2D5',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { eyebrow: '0.22em' },
    },
  },
  plugins: [typography],
};
export default config;
