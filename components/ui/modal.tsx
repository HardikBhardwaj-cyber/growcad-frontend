// components/ui/Modal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { fadeIn, scaleIn, EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   ReactNode;
  /** Panel width — hard-capped at 560px per design spec */
  size?:      'sm' | 'md' | 'lg';
  className?: string;
}

// ─── Size map — max-w-[560px] is the hard upper limit per spec ────────────────

const SIZE = {
  sm: 'max-w-sm',             // 384px
  md: 'max-w-md',             // 448px — default
  lg: 'max-w-[560px]',        // 560px — spec maximum, never exceed
} as const;

// ─── Duration and easing from theme ──────────────────────────────────────────

const DUR_STANDARD  = theme.duration.standard;  // 0.28 — entry
const DUR_EXIT      = 0.20;                     // exits are faster per design spec
const EASE_IN       = theme.ease.in as [number, number, number, number];  // [0.4,0,1,1] — exits only
const EASE_ENTRY    = EASE_OUT;

// ─── Panel animation ─────────────────────────────────────────────────────────
// Entry: scaleIn (0.94 → 1) + y (16 → 0) + opacity (0 → 1) — Out Expo
// Exit:  scale (1 → 0.94) + y (0 → 8) + opacity (1 → 0) — In easing (accelerates away)

const panelVariants = {
  hidden: {
    opacity: 0,
    scale:   0.94,   // scaleIn from lib/motion
    y:       16,
    filter:  'blur(4px)',
  },
  visible: {
    opacity: 1,
    scale:   1,
    y:       0,
    filter:  'blur(0px)',
    transition: {
      duration: DUR_STANDARD,
      ease:     EASE_ENTRY,
    },
  },
  exit: {
    opacity: 0,
    scale:   0.94,
    y:       8,
    filter:  'blur(4px)',
    transition: {
      duration: DUR_EXIT,
      ease:     EASE_IN,  // In easing — accelerates away from user
    },
  },
};

// Backdrop variant — uses fadeIn from lib/motion
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR_STANDARD, ease: EASE_ENTRY } },
  exit:    { opacity: 0, transition: { duration: DUR_EXIT,     ease: EASE_IN    } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  size      = 'md',
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Lock body scroll while modal is open ────────────────────────────────────
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top      = `-${scrollY}px`;
      document.body.style.width    = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
    };
  }, [open]);

  // ── Keyboard close — Escape ──────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    },
    [open, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Click outside — only on backdrop, not panel ──────────────────────────────
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ──────────────────────────────────────────────────── */}
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-[4px]"
            style={{ zIndex: theme.zIndex.float }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-hidden
            onClick={handleBackdropClick}
          />

          {/* ── Positioner ────────────────────────────────────────────────── */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: theme.zIndex.float + 1 }}
            role="dialog"
            aria-modal
            aria-labelledby={title ? 'modal-title' : undefined}
            onClick={handleBackdropClick}
          >
            {/* ── Panel ─────────────────────────────────────────────────── */}
            <motion.div
              ref={panelRef}
              key="modal-panel"
              className={cn(
                'relative w-full overflow-hidden rounded-2xl',
                SIZE[size],        // hard-capped at 560px (lg)
                'p-6',
                className,
              )}
              style={{
                background: theme.colors.bgRaise,  // #0c0c10
                border:     `1px solid ${theme.colors.borderMid}`,
                boxShadow:  theme.shadows.dashCard,
              }}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // prevent positioner close
            >
              {/* Top-edge light reflection — same pattern as Card */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                }}
              />

              {/* ── Header ─────────────────────────────────────────────── */}
              <div className="mb-5 flex items-center justify-between gap-4">
                {title ? (
                  <h3
                    id="modal-title"
                    className="text-[15px] font-semibold tracking-[-0.02em] text-white"
                  >
                    {title}
                  </h3>
                ) : (
                  <span />
                )}

                <motion.button
                  onClick={onClose}
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                    'text-white/30 transition-colors duration-150',
                    'hover:bg-white/[0.06] hover:text-white/72',
                  )}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: theme.duration.micro, ease: EASE_ENTRY }}
                  aria-label="Close modal"
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* ── Body ───────────────────────────────────────────────── */}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
