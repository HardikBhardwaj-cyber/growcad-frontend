'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Splash() {
  const [count, setCount]     = useState(0);
  const [visible, setVisible] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    // Skip on revisit (sessionStorage guard)
    if (sessionStorage.getItem('growcad-splash')) {
      setVisible(false);
      return;
    }
    mounted.current = true;

    let current = 0;
    const steps = [
      { target: 30, ms: 18 },
      { target: 70, ms: 28 },
      { target: 92, ms: 45 },
      { target: 100, ms: 60 },
    ];

    let stepIdx = 0;
    const tick = () => {
      if (!mounted.current) return;
      const { target, ms } = steps[stepIdx];
      if (current < target) {
        current = Math.min(current + 1, target);
        setCount(current);
        setTimeout(tick, ms + Math.random() * 12);
      } else if (stepIdx < steps.length - 1) {
        stepIdx++;
        setTimeout(tick, ms);
      } else {
        setTimeout(() => {
          if (mounted.current) {
            setVisible(false);
            sessionStorage.setItem('growcad-splash', '1');
          }
        }, 380);
      }
    };
    tick();

    return () => { mounted.current = false; };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070709]"
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex items-center gap-3"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-[0_0_24px_rgba(139,92,246,0.5)]">
              <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white tracking-tight">G</div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">Growcad</span>
          </motion.div>

          {/* Counter */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-mono text-[4.5rem] font-bold tabular-nums leading-none text-white/[0.08]"
          >
            {String(count).padStart(3, '0')}
          </motion.span>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-white/[0.04]">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500"
              style={{ width: `${count}%` }}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>

          {/* Subtle grid inside splash */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
