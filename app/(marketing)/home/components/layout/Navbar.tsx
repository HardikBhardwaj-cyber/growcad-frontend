'use client';

/**
 * STACKING CONTEXT FIX NOTES
 * ─────────────────────────────────────────────────────────────────────────────
 * Root bug: Navbar was inside <SmoothScroll> → <div className="relative">.
 * That `relative` div creates a stacking context. A `fixed` child of a
 * stacking context is clipped to that context's z-index band, making it
 * invisible above siblings like TransitionOverlay (z-9998).
 *
 * Fix applied in layout.tsx:
 *   1. Navbar is NOW OUTSIDE <SmoothScroll> — it sits at the ReducedMotionConfig
 *      root, completely free of any scroll container stacking context.
 *   2. z-[99999] — above TransitionOverlay (z-9998), Splash (z-99999 ties),
 *      and all overlays.
 *   3. isolation: isolate — prevents parent filters/transforms from creating
 *      a new stacking context that could trap the Navbar.
 *   4. hide-on-scroll REMOVED — Navbar is always visible, always stable.
 *   5. pointer-events-auto is explicit so no parent `pointer-events-none`
 *      can accidentally propagate.
 *
 * Visual architecture:
 *   z-[99999] — Navbar (this file)
 *   z-[99999] — Splash (same tier, renders first and animates out)
 *   z-[9998]  — TransitionOverlay (page wipe, animates out on load)
 *   z-[9999]  — Cursor ring/dot
 *   z-[8]     — CursorGlow (pointer-events-none ✓)
 *   z-[5]     — NoiseLayer  (pointer-events-none ✓)
 *   z-[0]     — GridBackground (pointer-events-none ✓)
 */

import {
  useState, useRef, useEffect,
} from 'react';
import {
  motion, useScroll, useMotionValue, useSpring,
  useTransform, AnimatePresence, useMotionValueEvent,
} from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import { T, DUR, EASE_OUT } from '../../systems/design';

// ─── Nav link data ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Product',   href: '#',        sectionId: null       },
  { label: 'Pricing',   href: '#pricing', sectionId: 'pricing'  },
  { label: 'Docs',      href: '#',        sectionId: null       },
  { label: 'Changelog', href: '#',        sectionId: null       },
] as const;

// ─── Magnetic nav link ─────────────────────────────────────────────────────────
function MagneticLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) {
  const ref     = useRef<HTMLAnchorElement>(null);
  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const x       = useSpring(rawX, { damping: 20, stiffness: 220, mass: 0.4 });
  const y       = useSpring(rawY, { damping: 20, stiffness: 220, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width  / 2)) * 0.28);
    rawY.set((e.clientY - (rect.top  + rect.height / 2)) * 0.28);
  };

  const onMouseLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative block px-4 py-2 text-[13px] font-medium select-none"
      style={{
        x,
        y,
        color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.46)',
        transition: 'color 0.2s ease',
      }}
      whileHover={{ color: 'rgba(255,255,255,0.95)' }}
    >
      {children}

      {/* Animated underline — slides in from left */}
      <span
        className="absolute bottom-[5px] left-4 right-4 h-px rounded-full"
        style={{
          background:  'linear-gradient(90deg, #8b5cf6, #3b82f6)',
          transformOrigin: isActive ? 'left' : 'left',
          transform:   isActive ? 'scaleX(1)' : 'scaleX(0)',
          opacity:     isActive ? 0.8 : 0,
          transition:  'transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
        }}
      />

      {/* Hover underline (separate from active, so both can coexist) */}
      <span
        className="absolute bottom-[5px] left-4 right-4 h-px origin-left scale-x-0 rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-x-100"
        style={{ opacity: isActive ? 0 : 1 }}
      />
    </motion.a>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  // ── Scroll state — no useState, all MotionValues (zero re-renders) ──────
  const lastYRef    = useRef(0);
  const { scrollY } = useScroll();

  // Motion values for scroll-driven CSS transitions (GPU-composited)
  const scrollProgress  = useMotionValue(0); // 0 at top → 1 after threshold

  // Smooth the progress value so transitions feel organic, not jumpy
  const smoothProgress  = useSpring(scrollProgress, { damping: 30, stiffness: 180 });
  const smoothBlur      = useTransform(smoothProgress, [0, 1], [0, 24]);
  const smoothBgOp      = useTransform(smoothProgress, [0, 1], [0, 0.72]);
  const smoothBorderOp  = useTransform(smoothProgress, [0, 1], [0, 0.09]);
  const smoothScale     = useTransform(smoothProgress, [0, 1], [1, 0.985]);
  const smoothPy        = useTransform(smoothProgress, [0, 1], [12, 8]);
  const smoothShadow    = useTransform(smoothProgress, [0, 1], [0, 1]);

  // ── Update scroll progress — no setState ────────────────────────────────
  useMotionValueEvent(scrollY, 'change', (y) => {
    // Threshold: 0–40px → 0–1 progress
    const progress = Math.min(y / 40, 1);
    scrollProgress.set(progress);
    lastYRef.current = y;
  });

  // ── Active section tracking via IntersectionObserver ────────────────────
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sections = NAV_LINKS
      .filter((l) => l.sectionId)
      .map((l) => document.getElementById(l.sectionId!))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Mobile drawer ────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── String-mapped MotionValues for CSS properties ───────────────────────
  // These MUST be declared at component top level (Rules of Hooks).
  // They map the numeric 0–1 smoothProgress into CSS string values.
  const bgColor     = useTransform(smoothBgOp,     (v) => `rgba(7,7,9,${v})`);
  const blurFilter  = useTransform(smoothBlur,      (v) => `blur(${v}px) saturate(180%)`);
  const borderClr   = useTransform(smoothBorderOp,  (v) => `rgba(255,255,255,${v})`);
  const boxShadowVal = useTransform(smoothShadow,
    (v) => `0 10px 40px rgba(0,0,0,${v * 0.4}), 0 1px 0 rgba(255,255,255,${v * 0.04}) inset`
  );

  return (
    /**
     * CRITICAL: position:sticky (not fixed) + top-0 + z-[99999]
     *
     * Why sticky instead of fixed?
     * The Navbar is now OUTSIDE SmoothScroll — it lives in the normal document
     * flow above the scroll container. `sticky` keeps it at the top of the
     * viewport without needing to fight stacking contexts. This is more robust
     * than `fixed` when sibling elements have transforms.
     *
     * isolation: isolate prevents any ancestor filter/transform (WebGL canvas
     * parents, blur effects) from creating a new stacking context that could
     * trap this navbar below its z-index.
     */
    <header
      className="sticky top-0 z-[99999] w-full"
      style={{ isolation: 'isolate', pointerEvents: 'auto' }}
    >
      {/* ── Glass pill container — scroll-morphing ── */}
      <div className="flex justify-center px-4 pt-3 pb-1">
        <motion.nav
          style={{
            scale:     smoothScale,
            paddingTop:    smoothPy,
            paddingBottom: smoothPy,
          }}
          className="relative flex w-full max-w-[1240px] items-center justify-between rounded-2xl px-5 transition-[border-radius] duration-500"
          aria-label="Main navigation"
        >
          {/* Glass background — driven by MotionValues, GPU-composited */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              backgroundColor:      bgColor,
              backdropFilter:       blurFilter,
              WebkitBackdropFilter: blurFilter,
              borderColor:          borderClr,
              borderWidth:          '1px',
              borderStyle:          'solid',
              boxShadow:            boxShadowVal,
            }}
          />

          {/* Top-edge inner reflection (appears as glass brightens) */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
              opacity: smoothBgOp,
            }}
          />

          {/* ── Logo ── */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2.5 select-none"
            aria-label="Growcad home"
          >
            <motion.div
              className="relative h-7 w-7 overflow-hidden rounded-[9px] bg-gradient-to-br from-violet-500 to-blue-600"
              style={{ boxShadow: '0 0 16px rgba(139,92,246,0.45)' }}
              whileHover={{ scale: 1.12, rotate: -5 }}
              transition={T.fast}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">
                G
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </motion.div>
            <span className="text-[13.5px] font-semibold tracking-[-0.015em] text-white">
              Growcad
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <ul className="relative z-10 hidden items-center md:flex" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = link.sectionId === activeSection;
              return (
                <li key={link.label}>
                  <MagneticLink href={link.href} isActive={isActive}>
                    {link.label}
                  </MagneticLink>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTAs ── */}
          <div className="relative z-10 hidden items-center gap-2 md:flex">
            {/* Secondary — ghost */}
            <motion.button
              className="rounded-xl px-4 py-2 text-[13px] font-medium text-white/40 transition-colors duration-200 hover:text-white/82"
              whileHover={{ scale: 1.02 }}
              whileTap={{  scale: 0.97 }}
              transition={T.micro}
            >
              Sign in
            </motion.button>

            {/* Primary CTA — magnetic + glow */}
            <MagneticButton
              variant="primary"
              className="!px-5 !py-2.5 !text-[12.5px] !font-semibold"
            >
              Get started →
            </MagneticButton>
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button
            className="relative z-10 flex items-center justify-center rounded-xl p-2 text-white/50 hover:text-white transition-colors duration-150 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            whileTap={{ scale: 0.92 }}
            transition={T.micro}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate:   0, opacity: 1 }}
                  exit={{   rotate:  45, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate:  0, opacity: 1 }}
                  exit={{   rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute inset-x-4 top-[calc(100%-4px)] z-[99999] overflow-hidden rounded-2xl border border-white/[0.09] backdrop-blur-2xl"
            style={{
              background:  'rgba(7,7,9,0.96)',
              boxShadow:   '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
              pointerEvents: 'auto',
            }}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y:   0, scale: 1   }}
            exit={{   opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: DUR.FAST, ease: EASE_OUT }}
          >
            {/* Inner top-edge shine */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

            <nav className="flex flex-col p-3 gap-0.5" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-[14px] font-medium text-white/55 transition-colors duration-150 hover:bg-white/[0.055] hover:text-white/92 active:bg-white/[0.08]"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-white/[0.07] pt-2.5 pb-0.5 flex flex-col gap-2">
                <button
                  className="rounded-xl px-4 py-3.5 text-[14px] font-medium text-white/55 text-left hover:bg-white/[0.055] hover:text-white/92 transition-colors duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </button>
                <MagneticButton
                  variant="primary"
                  className="justify-center !w-full !py-3.5 !text-[14px]"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started free →
                </MagneticButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
