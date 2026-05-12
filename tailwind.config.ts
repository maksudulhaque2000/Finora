import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-alt': 'hsl(var(--surface-alt))',
        border: 'hsl(var(--border))',
        gold: 'hsl(var(--gold))',
        'gold-light': 'hsl(var(--gold-light))',
        emerald: 'hsl(var(--emerald))',
        crimson: 'hsl(var(--crimson))',
        sky: 'hsl(var(--sky))'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(212,168,83,0.18), 0 24px 80px rgba(0,0,0,0.45)'
      },
      backgroundImage: {
        'mesh-dark':
          'radial-gradient(circle at top left, rgba(212,168,83,0.16), transparent 28%), radial-gradient(circle at top right, rgba(88,166,255,0.12), transparent 22%), radial-gradient(circle at bottom, rgba(46,204,113,0.10), transparent 30%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;