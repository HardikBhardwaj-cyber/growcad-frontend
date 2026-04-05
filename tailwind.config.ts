import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Colors ────────────────────────────────────────────
      colors: {
        background: '#070709',
        surface:    'rgba(255,255,255,0.028)',
        raise:      '#0c0c10',
      },

      // ── Typography ────────────────────────────────────────
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },

      // ── Letter spacing ─────────────────────────────────────
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.03em',
        tight:    '-0.02em',
        snug:     '-0.01em',
      },

      // ── Border radius ──────────────────────────────────────
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ── Max width ──────────────────────────────────────────
      maxWidth: {
        page:   '1152px',
        narrow: '768px',
        wide:   '1320px',
      },

      // ── Background images ──────────────────────────────────
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #7c3aed, #2563eb)',
        'gradient-brand-soft': 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        'gradient-text':    'linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee)',
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dot':     'radial-gradient(circle, rgba(255,255,255,0.65) 1px, transparent 1px)',
      },

      // ── Box shadows ────────────────────────────────────────
      boxShadow: {
        'glow-violet':       '0 0 50px rgba(139,92,246,0.35)',
        'glow-violet-lg':    '0 0 80px rgba(139,92,246,0.5)',
        'glow-blue':         '0 0 50px rgba(59,130,246,0.3)',
        'card':              '0 40px 120px rgba(0,0,0,0.55)',
        'card-hover':        '0 56px 160px rgba(0,0,0,0.65)',
        'focus-violet':      '0 0 0 3px rgba(139,92,246,0.2)',
        'focus-blue':        '0 0 0 3px rgba(59,130,246,0.18)',
        'inner-shine':       'inset 0 1px 0 rgba(255,255,255,0.06)',
      },

      // ── Transition timing ──────────────────────────────────
      transitionTimingFunction: {
        smooth:    'cubic-bezier(0.22, 1, 0.36, 1)',
        snappy:    'cubic-bezier(0.4, 0, 0.2, 1)',
        spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo':'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // ── Animations ────────────────────────────────────────
      animation: {
        'ping-slow':   'ping-slow 1.4s cubic-bezier(0,0,0.2,1) infinite',
        'float':       'float-y 5s ease-in-out infinite',
        'float-slow':  'float-y 8s ease-in-out infinite',
        'shimmer':     'shimmer-sweep 2.6s infinite',
        'marquee':     'marquee-left 26s linear infinite',
        'marquee-rev': 'marquee-right 30s linear infinite',
        'scan':        'scan-line 12s ease-in-out infinite alternate',
        'grain':       'grain 0.35s steps(1) infinite',
        'glow-pulse':  'glow-pulse 3.5s ease-in-out infinite',
      },

      keyframes: {
        'ping-slow': {
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'shimmer-sweep': {
          '0%':   { transform: 'translateX(-120%) skewX(-14deg)' },
          '100%': { transform: 'translateX(240%)  skewX(-14deg)' },
        },
        'marquee-left': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scan-line': {
          '0%':   { top: '5%' },
          '100%': { top: '95%' },
        },
        'grain': {
          '0%':   { transform: 'translate(0,0)' },
          '20%':  { transform: 'translate(-3%,-5%)' },
          '40%':  { transform: 'translate(5%, 3%)' },
          '60%':  { transform: 'translate(-2%, 7%)' },
          '80%':  { transform: 'translate(4%,-4%)' },
          '100%': { transform: 'translate(0,0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)'    },
          '50%':      { opacity: '1.4', transform: 'scale(1.08)' },
        },
      },
    },
  },

  plugins: [],
};

export default config;
