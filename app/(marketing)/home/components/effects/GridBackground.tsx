'use client';

import { motion } from 'framer-motion';

/**
 * 3-layer depth background system:
 *  Layer 0 (deepest) — dot grid, barely visible
 *  Layer 1 (mid)     — large line grid + corner glows
 *  Layer 2 (surface) — vignettes + animated scan line
 *
 * All fixed-position, pointer-events-none, GPU-composited.
 */
export default function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">

      {/* ── LAYER 0: Dot grid (deepest, barely there) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          opacity: 0.025,
        }}
      />

      {/* ── LAYER 0b: Larger grid overlay (macro structure) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '168px 168px',
          opacity: 0.016,
        }}
      />

      {/* ── LAYER 1: Left ambient (violet) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at -8% 45%, rgba(109,40,217,0.07) 0%, transparent 65%)',
        }}
      />

      {/* ── LAYER 1b: Right ambient (blue) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 108% 55%, rgba(37,99,235,0.055) 0%, transparent 65%)',
        }}
      />

      {/* ── LAYER 1c: Bottom center bloom ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 35% at 50% 110%, rgba(109,40,217,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── LAYER 2: Top vignette (dark) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 55% at 50% -5%, transparent 30%, #070709 100%)',
        }}
      />

      {/* ── LAYER 2b: Bottom vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 40% at 50% 108%, transparent 15%, #070709 78%)',
        }}
      />

      {/* ── LAYER 2c: Side vignettes ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #070709 0%, transparent 12%, transparent 88%, #070709 100%)',
        }}
      />

      {/* ── LAYER 3: Animated scan line (very subtle) ── */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.1) 25%, rgba(99,102,241,0.14) 50%, rgba(59,130,246,0.1) 75%, transparent 100%)',
        }}
        animate={{ top: ['4%', '96%'] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* ── LAYER 3b: Second scan line (offset phase) ── */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.07) 30%, rgba(139,92,246,0.1) 50%, rgba(59,130,246,0.07) 70%, transparent 100%)',
          opacity: 0.7,
        }}
        animate={{ top: ['72%', '18%'] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 6,
        }}
      />
    </div>
  );
}
