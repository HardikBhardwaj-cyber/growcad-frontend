This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Growcad — Frontend

> Cinematic, high-performance SaaS landing page.  
> Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion · GSAP · Lenis · R3F

---

## Quick start

```bash
# 1. Install the two utility packages needed by lib/utils.ts
pnpm add clsx tailwind-merge

# 2. Ensure your stack is present (already installed per spec)
# next, react, typescript, tailwindcss, framer-motion,
# gsap, lenis, @react-three/fiber, @react-three/drei, lucide-react

# 3. Dev server
pnpm dev
```

---

## Complete file map

```
growcad/
├── app/
│   ├── globals.css                        Design tokens, animations, Lenis, scrollbar
│   ├── layout.tsx                         Root layout — font link, globals import
│   └── (marketing)/home/
│       ├── layout.tsx                     Marketing shell: Splash → Cursor → Grid → Lenis → Navbar/Footer
│       └── page.tsx                       Section orchestrator (7 sections)
│
├── components/home/
│   ├── core/
│   │   ├── Cursor.tsx                     Custom ring+dot cursor (mix-blend-mode: difference)
│   │   ├── PageTransition.tsx             Route fade transition (Framer Motion AnimatePresence)
│   │   ├── ReducedMotionConfig.tsx        Wraps MotionConfig — respects prefers-reduced-motion
│   │   ├── ScrollFix.tsx                  Resets scroll + resumes Lenis on route change
│   │   ├── SmoothScroll.tsx               Lenis provider with GSAP sync + resize + reduced-motion guard
│   │   ├── Splash.tsx                     Animated counter loader (skips on revisit via sessionStorage)
│   │   ├── TransitionOverlay.tsx          Full-page wipe on first entry
│   │   └── WebGLErrorBoundary.tsx         Catches R3F/Three.js errors — falls back to CSS gradient
│   │
│   ├── effects/
│   │   ├── CursorGlow.tsx                 Dual-layer spring-smoothed cursor ambient glow
│   │   ├── GridBackground.tsx             Dot grid + line grid + vignettes + animated scan line
│   │   └── NoiseLayer.tsx                 SVG film-grain overlay (opacity 0.028, mix-blend: overlay)
│   │
│   ├── hooks/                             ← ALL are .ts (no JSX)
│   │   ├── useCountUp.ts                  Animated number with easing, decimals, prefix/suffix
│   │   ├── useMouse.ts                    rAF-throttled raw mouse + normalised (nx, ny)
│   │   ├── useMouseSmooth.ts              Spring-smoothed MotionValues — plug into style={}
│   │   ├── useReveal.ts                   useInView wrapper — returns [ref, inView]
│   │   ├── useScrollStory.ts              GSAP ScrollTrigger timeline + Lenis sync
│   │   ├── useScrollTransform.ts          Scroll → MotionValue with optional spring + string output
│   │   ├── useStagger.ts                  Returns {container, item} Framer Motion variant objects
│   │   └── useTilt.ts                     Spring rotateX/Y + scale from mouse position
│   │
│   ├── motion/
│   │   ├── Magnetic.tsx                   Magnetic hover — pointer-only, configurable strength
│   │   ├── Parallax.tsx                   Scroll parallax on Y or X axis with spring option
│   │   └── Reveal.tsx                     InView reveal: up/down/left/right/none, blur, scale
│   │
│   ├── layout/
│   │   ├── Navbar.tsx                     Floating pill nav — scroll-hide, blur glass, active underline
│   │   └── Footer.tsx                     Full footer — newsletter, 4-col links, status indicator
│   │
│   ├── sections/
│   │   ├── Hero.tsx                       Rotating headline, live dashboard card, WebGL bg, parallax exit
│   │   ├── Value.tsx                      6-feature card grid (AI span-2, 5 regular) with tilt + hover accent
│   │   ├── Trust.tsx                      Animated stats, dual marquee, featured testimonial
│   │   ├── DashboardPreview.tsx           Scroll-driven scale entry, sidebar tabs, chart transitions
│   │   ├── Testimonials.tsx               6-card masonry grid with star ratings
│   │   ├── Pricing.tsx                    3-tier with gradient Pro border, monthly/annual toggle
│   │   └── CTA.tsx                        Scroll-driven scale entry, gradient border card, trust pills
│   │
│   ├── ui/
│   │   ├── Badge.tsx                      Color variants (violet/blue/emerald/amber/rose/cyan) + pulse dot
│   │   ├── Button.tsx                     Primary/Secondary/Ghost with shimmer on primary
│   │   ├── GlassCard.tsx                  Glassmorphism card — optional 3D tilt + custom glow color
│   │   ├── Glow.tsx                       Absolute glow blob — color, size, blur, position, pulse
│   │   ├── Input.tsx                      Floating label, error/hint/success states, char counter
│   │   └── MagneticButton.tsx             Magnetic + shimmer sweep — primary CTA component
│   │
│   ├── webgl/
│   │   ├── BlobCanvas.tsx                 R3F distortion blobs — visibility-pause, delta-time rotation
│   │   ├── BubbleField.tsx                R3F instanced bubbles — single draw call, spring drift
│   │   └── Particles.tsx                  R3F instanced point field — dpr locked to 1, rAF-clean
│   │
│   └── systems/
│       └── design.ts                      Token map: colors, gradients, easing, duration, spring,
│                                          shadow, Variants library, typography scale, Z-index, helpers
│
├── lib/
│   └── utils.ts                           cn() = clsx + tailwind-merge
│
├── next.config.ts                         Security headers, transpilePackages, image optimisation, CSP
├── tailwind.config.ts                     All custom tokens, keyframes, animations synced with globals.css
└── tsconfig.json                          Strict mode, @/* path alias
```

---

## Motion architecture

```
Scroll enters viewport
       │
       ├─ useReveal (Framer) ──── Reveal.tsx ──── fade+blur+slide each section header
       │
       ├─ whileInView ─────────── Value cards, Testimonials, Pricing cards (staggered delay)
       │
       ├─ useScroll + useTransform ── Hero exit parallax, DashboardPreview scale-in, CTA scale-in
       │
       ├─ GSAP useScrollStory ─── Advanced scroll-pinned timelines (wire in to any section)
       │
       └─ Lenis (global)
              ├─ raf() loop → smooth scroll
              ├─ ScrollTrigger.update() on every scroll event
              └─ resize() on window resize
```

---

## Lenis + GSAP wiring

```ts
// Already handled in SmoothScroll.tsx and useScrollStory.ts
// But if you need manual GSAP ScrollTrigger in a one-off component:

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useScrollStory } from '@/components/home/hooks/useScrollStory';

gsap.registerPlugin(ScrollTrigger);

const ref = useScrollStory<HTMLDivElement>((tl, el) => {
  tl.from(el.querySelectorAll('.word'), {
    y: 60, opacity: 0, stagger: 0.06, duration: 0.8,
  });
}, { scrub: 1.5, start: 'top 70%', end: 'bottom 40%' });
```

---

## WebGL performance rules

| Rule | Implementation |
|---|---|
| `antialias: false` on all canvases | Blobs are soft — no jagged edges visible |
| `dpr={[1, 1.5]}` for blobs | Caps resolution on high-DPI screens |
| `dpr={[1, 1]}` for particles | Hard 1× for 90 instances |
| Delta-time rotation | `mesh.rotation.x += delta * speed` — frame-rate independent |
| Visibility pause | BlobCanvas pauses RAF when tab is hidden |
| Lazy load | `const BlobCanvas = lazy(() => import(...))` + `<Suspense>` |
| Desktop only | `className="hidden lg:block"` wraps all Canvas containers |
| Error boundary | `WebGLErrorBoundary` falls back to CSS gradient silently |

---

## Responsive breakpoints

| Breakpoint | Width | Hero | Features | Dashboard |
|---|---|---|---|---|
| Mobile | < 640px | Stacked, centered copy | 1 col | Hidden |
| Tablet | 640–1024px | Stacked | 2 col | Hidden |
| Laptop | 1024–1280px | Split 2-col | 3 col | Full |
| Desktop | 1280–1536px | Split 2-col wide | 3 col | Full |
| Ultra-wide | > 1536px | Centered max 1320px | 3 col | Full |

---

## Typography scale (CSS clamp)

```ts
display: 'clamp(3rem,   6vw, 5rem)'    // Hero display
h1:      'clamp(2.6rem, 5vw, 4.2rem)' // Hero h1
h2:      'clamp(2rem,   4vw, 3.1rem)' // Section headers
h3:      'clamp(1.4rem, 2vw, 1.8rem)' // Card headers
body:    'clamp(0.9rem, 1.1vw, 1.05rem)'
```

---

## Accessibility

- `cursor: none` disabled on `@media (hover: none)` — mobile/touch unaffected
- Lenis skips init on `prefers-reduced-motion: reduce`
- `ReducedMotionConfig` sets all Framer Motion durations to `0.001s`
- All interactive elements retain `:focus-visible` ring (violet, 3px, 6px offset)
- WebGL elements use `aria-hidden="true"` — pure decoration
- Inputs have `forwardRef` support for form libraries

---

## Performance targets

| Metric | Target | How |
|---|---|---|
| LCP | < 1.8s | Geist from Google Fonts (preconnect), no render-blocking JS |
| CLS | < 0.05 | Fixed height containers, no layout shift from fonts |
| INP | < 80ms | All animations GPU-composited (transform/opacity only) |
| FPS | 60fps | delta-time R3F, instanced mesh, visibility pause |
| JS bundle | < 300KB gzip | Tree-shaking Framer/Lucide, lazy WebGL |
| TTFB | < 200ms | Static export or ISR — no per-request server work |

---

## Troubleshooting

**`Module not found: Can't resolve 'lenis'`**  
→ Already installed per spec. If missing: `pnpm add lenis`

**`Cannot read properties of undefined (reading 'raf')`**  
→ Ensure `SmoothScroll` is a Client Component (`'use client'` at top). ✓ Already set.

**Three.js shader errors on build**  
→ `transpilePackages: ['three', '@react-three/fiber', '@react-three/drei']` in `next.config.ts` ✓

**`clsx` / `tailwind-merge` not found**  
→ `pnpm add clsx tailwind-merge` — the only two packages to install.

**Cursor invisible**  
→ Custom cursor only activates on `hover: hover` devices. On touch, native cursor is restored.

**Animations not playing**  
→ Check `prefers-reduced-motion` — `ReducedMotionConfig` will skip them. Disable in OS settings for testing.

---

## Environment variables (optional)

```env
# .env.local
NEXT_PUBLIC_APP_URL=https://growcad.io
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

*Built with precision. Ship it.*

