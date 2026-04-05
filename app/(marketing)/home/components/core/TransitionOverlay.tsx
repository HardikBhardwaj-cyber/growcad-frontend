'use client';

import { motion } from 'framer-motion';

export default function TransitionOverlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9998] bg-[#070709]"
      initial={{ scaleY: 1, originY: 'bottom' }}
      animate={{ scaleY: 0, originY: 'top' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
    />
  );
}
