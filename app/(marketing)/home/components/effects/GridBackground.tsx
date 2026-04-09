'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollContext } from '../core/ScrollContext';

export default function GridBackground() {
  const { scrollProgress, velocity } = useScrollContext();

  // Global violet intensity: full at hero (0), dips at mid-page (0.45), rises at CTA (0.85)
  const glowOpacity = useTransform(
    scrollProgress,
    [0, 0.15, 0.45, 0.72, 0.85, 1],
    [1,  0.55,  0.38, 0.55, 0.82, 1],
  );

  // Subtle vertical drift based on scroll velocity — particles feel alive
  const gridDriftY = useTransform(velocity, [-20, 0, 20], ['-4px', '0px', '4px']);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          opacity: 0.025,
        }}
      />

      {/* Line grid */}
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

      {/* Left ambient violet — scroll-reactive intensity */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at -8% 45%, rgba(109,40,217,0.08) 0%, transparent 65%)',
          opacity: glowOpacity,
          y: gridDriftY,
        }}
      />

      {/* Right ambient blue */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 108% 55%, rgba(37,99,235,0.06) 0%, transparent 65%)',
          opacity: glowOpacity,
        }}
      />

      {/* Bottom center bloom — rises toward CTA */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 35% at 50% 110%, rgba(109,40,217,0.07) 0%, transparent 60%)',
          opacity: useTransform(scrollProgress, [0.7, 1], [0.4, 1]),
        }}
      />

      {/* Top vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 55% at 50% -5%, transparent 30%, #070709 100%)',
        }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 40% at 50% 108%, transparent 15%, #070709 78%)',
        }}
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, #070709 0%, transparent 12%, transparent 88%, #070709 100%)',
        }}
      />

      {/* Scan line A */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.10) 25%, rgba(99,102,241,0.14) 50%, rgba(59,130,246,0.10) 75%, transparent 100%)',
        }}
        animate={{ top: ['4%', '96%'] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      {/* Scan line B */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.07) 30%, rgba(139,92,246,0.10) 50%, rgba(59,130,246,0.07) 70%, transparent 100%)',
          opacity: 0.7,
        }}
        animate={{ top: ['72%', '18%'] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 6 }}
      />
    </div>
  );
}
