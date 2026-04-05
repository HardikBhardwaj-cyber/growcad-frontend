'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import { T } from '../../systems/design';

const NAV = [
  { label: 'Product',   href: '#' },
  { label: 'Pricing',   href: '#pricing' },
  { label: 'Docs',      href: '#' },
  { label: 'Changelog', href: '#' },
];

/**
 * Performance fix: `lastY` is stored in a ref, not state.
 * The previous version called setState on every scroll event, causing
 * a full component re-render 60× per second while scrolling.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);            // ← ref, not state — no re-render
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = lastYRef.current;
    setScrolled(y > 20);
    // Only hide after scrolling down 100px, reveal immediately on scroll up
    if (y > prev && y > 100) setHidden(true);
    else if (y < prev - 10)  setHidden(false);
    lastYRef.current = y;
  });

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[200] flex justify-center px-4 pt-4"
      animate={{ y: hidden ? '-130%' : '0%' }}
      transition={T.normal}
    >
      <nav
        className={[
          'flex w-full max-w-[1100px] items-center justify-between rounded-2xl px-5 py-3',
          'transition-[background,border,box-shadow] duration-500',
          scrolled
            ? 'border border-white/[0.09] bg-[#070709]/85 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl'
            : 'border border-transparent bg-transparent',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Growcad home">
          <motion.div
            className="relative h-7 w-7 overflow-hidden rounded-[9px] bg-gradient-to-br from-violet-500 to-blue-600 shadow-[0_0_16px_rgba(139,92,246,0.4)]"
            whileHover={{ scale: 1.12, rotate: -5 }}
            transition={T.fast}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">G</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </motion.div>
          <span className="text-[13.5px] font-semibold tracking-[-0.015em] text-white">Growcad</span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden items-center md:flex" role="list">
          {NAV.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group relative block px-4 py-2 text-[13px] text-white/48 transition-colors duration-200 hover:text-white/92"
              >
                {link.label}
                {/* Underline indicator */}
                <span className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet-500/60 to-blue-500/60 transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop CTAs ── */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="rounded-xl px-4 py-2 text-[13px] text-white/42 transition-colors duration-200 hover:text-white/80">
            Sign in
          </button>
          <MagneticButton variant="primary" className="!px-5 !py-2.5 !text-[12.5px] !font-semibold">
            Get started →
          </MagneticButton>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="flex items-center justify-center rounded-xl p-2 text-white/50 hover:text-white transition-colors duration-150 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute inset-x-4 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#070709]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y:   0, scale: 1    }}
            exit={{   opacity: 0, y: -12, scale: 0.97  }}
            transition={T.fast}
          >
            <div className="flex flex-col p-4 gap-1">
              {NAV.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-[14px] text-white/55 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-white/[0.07] pt-3 flex flex-col gap-2">
                <button className="rounded-xl px-4 py-3 text-[14px] text-white/55 text-left hover:bg-white/[0.05] transition-colors duration-150">Sign in</button>
                <MagneticButton variant="primary" className="justify-center !w-full">
                  Get started free
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
