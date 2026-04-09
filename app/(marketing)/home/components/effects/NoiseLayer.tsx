'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollContext } from '../core/ScrollContext';

export default function NoiseLayer() {
  const { scrollProgress } = useScrollContext();

  // Noise is slightly more visible in middle sections (texture), calms at CTA
  const noiseOpacity = useTransform(
    scrollProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.028, 0.036, 0.042, 0.032, 0.024],
  );

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
        opacity: noiseOpacity,
      }}
      aria-hidden="true"
    />
  );
}
