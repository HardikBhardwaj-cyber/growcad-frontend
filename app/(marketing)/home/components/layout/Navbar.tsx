'use client';

/**
 * Navbar — fixed positioning, always top-most
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses position:fixed (not sticky) for this high-motion environment because:
 *
 *   1. sticky depends on scroll container having overflow:visible on every
 *      ancestor. With Lenis + WebGL + AnimatePresence siblings in the tree,
 *      this is not guaranteed across all browsers and render cycles.
 *
 *   2. fixed is viewport-relative — completely immune to:
 *        - stacking contexts on parent elements
 *        - transform/filter/perspective on ancestors
 *        - overflow on scroll containers
 *        - Lenis scroll interception
 *
 *   3. The only risk with fixed is a parent with `transform` — but layout.tsx
 *      explicitly guarantees no transform on any Navbar ancestor.
 *
 * Height contract:
 *   Navbar renders at ~64px. This value is set as --navbar-h on <html> via
 *   a useEffect, and main uses pt-[var(--navbar-h)] to prevent content hiding
 *   behind the navbar. The layout.tsx <main> has className="pt-[--navbar-h]".
 *
 * No transform on <header>:
 *   The <header> has NO transform, NO scale, NO translateY.
 *   Internal animations (logo hover, link underline) are scoped to children
 *   and do not affect the header's stacking context.
 *
 * Z-index architecture:
 *   z-[99999]  — this Navbar (fixed)
 *   z-[99999]  — Splash (fixed, exits on load)
 *   z-[9998]   — TransitionOverlay (fixed, exits on load)
 *   z-[9999]   — Cursor (fixed, pointer-events-none)
 *   z-[8]      — CursorGlow (fixed, pointer-events-none)
 *   z-[5]      — NoiseLayer (fixed, pointer-events-none)
 *   z-[0]      — GridBackground (fixed, pointer-events-none)
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

// ─── Constants ──────────────────────────────────────────────────────────────
/** Navbar rendered height in px — kept in sync with the padding wrapper below */
export const NAVBAR_HEIGHT = 64;

// ─── Nav link data ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Product',   href: '#',        sectionId: null      },
  { label: 'Pricing',   href: '#pricing', sectionId: 'pricing' },
  { label: 'Docs',      href: '#',        sectionId: null      },
  { label: 'Changelog', href: '#',        sectionId: null      },
] as const;

// ─── Magnetic nav link ───────────────────────────────────────────────────────
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
  const ref   = useRef<HTMLAnchorElement>(null);
  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const x     = useSpring(rawX, { damping: 20, stiffness: 220, mass: 0.4 });
  const y     = useSpring(rawY, { damping: 20, stiffness: 220, mass: 0.4 });

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
        color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.54)',
        transition: 'color 0.18s ease',
      }}
      whileHover={{ color: 'rgba(255,255,255,0.96)' }}
    >
      {/* Hover background glow */}
      <span
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.1), transparent)',
        }}
      />
      {children}

      {/* Active underline — slides in from left */}
      <span
        className="absolute bottom-[5px] left-4 right-4 h-px rounded-full"
        style={{
          background:      'linear-gradient(90deg, #8b5cf6, #3b82f6)',
          transformOrigin: 'left',
          transform:       isActive ? 'scaleX(1)' : 'scaleX(0)',
          opacity:         isActive ? 0.85 : 0,
          transition:      'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
        }}
      />

      {/* Hover underline */}
      <span
        className="absolute bottom-[5px] left-4 right-4 h-px origin-left scale-x-0 rounded-full transition-transform duration-250 group-hover:scale-x-100"
        style={{
          background: 'linear-gradient(90deg, rgba(139,92,246,0.5), rgba(59,130,246,0.4))',
          opacity:    isActive ? 0 : 1,
        }}
      />
    </motion.a>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  // Set --navbar-h CSS variable on <html> so main can use it for padding-top
  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-h', `${NAVBAR_HEIGHT}px`);
  }, []);

  // ── Scroll-driven glass morph — all MotionValues, zero re-renders ────────
  const { scrollY } = useScroll();
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, { damping: 30, stiffness: 180 });

  // At top: slight background so navbar is always readable against dark hero
  // On scroll: full glass
  const smoothBlur     = useTransform(smoothProgress, [0, 1], [6,  28]);
  const smoothBgOp     = useTransform(smoothProgress, [0, 1], [0.22, 0.80]);
  const smoothBorderOp = useTransform(smoothProgress, [0, 1], [0.04, 0.12]);
  const smoothPy       = useTransform(smoothProgress, [0, 1], [14, 9]);
  const smoothShadow   = useTransform(smoothProgress, [0, 1], [0,  1]);

  // Map numeric values to CSS strings (must be top-level, not inline)
  const bgColor      = useTransform(smoothBgOp,    (v) => `rgba(7,7,9,${v})`);
  const blurFilter   = useTransform(smoothBlur,    (v) => `blur(${v}px) saturate(180%)`);
  const borderClr    = useTransform(smoothBorderOp,(v) => `rgba(255,255,255,${v})`);
  const boxShadowVal = useTransform(smoothShadow,
    (v) => `0 10px 40px rgba(0,0,0,${v * 0.4}), 0 1px 0 rgba(255,255,255,${v * 0.04}) inset`
  );

  useMotionValueEvent(scrollY, 'change', (y) => {
    scrollProgress.set(Math.min(y / 40, 1));
  });

  // ── Active section tracking ───────────────────────────────────────────────
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

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    /*
     * <header> — position:fixed, z-[99999], no transform, isolation:isolate
     *
     * RULES (do not violate):
     *   ✓ position: fixed      — viewport-relative, immune to ancestor contexts
     *   ✓ z-index: 99999       — above all overlays
     *   ✓ isolation: isolate   — self-contained stacking context
     *   ✓ pointerEvents: auto  — explicit, not inherited
     *   ✗ NO transform         — would create stacking context, causing z-index issues
     *   ✗ NO scale             — same issue as transform
     *   ✗ NO translateY        — same issue as transform
     *   ✗ NO filter/backdrop   — on the header itself (fine on children)
     *   ✗ NO will-change       — on the header itself
     */
    <header
      className="fixed top-0 left-0 w-full z-[99999]"
      style={{
        isolation:     'isolate',
        pointerEvents: 'auto',
        // No transform property here — ever
      }}
    >
      {/* Pill wrapper — provides viewport-edge padding */}
      <div className="flex justify-center px-4 pt-3 pb-1">

        {/*
         * <nav> — motion only for padding transition.
         * NO transform, NO scale, NO opacity animation on this element.
         * Only paddingTop/paddingBottom change — these are layout props
         * but do not create stacking contexts.
         */}
        <motion.nav
          style={{
            paddingTop:    smoothPy,
            paddingBottom: smoothPy,
          }}
          className="relative flex w-full max-w-[1240px] items-center justify-between rounded-2xl px-5"
          aria-label="Main navigation"
        >
          {/*
           * Glass background layer — this element has backdropFilter.
           * backdrop-filter creates a stacking context, but only on THIS
           * child element, not on <header>. This is intentional and safe.
           */}
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

          {/* Inner top-edge reflection */}
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
            {/*
             * Logo mark — whileHover scale is on this small child element only.
             * This is safe: the stacking context created by this transform is
             * scoped to the 28px logo box and does not affect <header>.
             */}
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
            <motion.button
              className="rounded-xl px-4 py-2 text-[13px] font-medium text-white/40 transition-colors duration-200 hover:text-white/82"
              whileTap={{ scale: 0.97 }}
              transition={T.micro}
            >
              Sign in
            </motion.button>

            <MagneticButton
              variant="primary"
              className="!px-5 !py-2.5 !text-[12.5px] !font-semibold"
            >
              Start free →
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
            className="absolute inset-x-4 top-[calc(100%-4px)] z-50 overflow-hidden rounded-2xl border border-white/[0.09] backdrop-blur-2xl"
            style={{
              background:    'rgba(7,7,9,0.96)',
              boxShadow:     '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
              pointerEvents: 'auto',
            }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y:   0 }}
            exit={{   opacity: 0, y: -10 }}
            transition={{ duration: DUR.FAST, ease: EASE_OUT }}
          >
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
                  Start free →
                </MagneticButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
