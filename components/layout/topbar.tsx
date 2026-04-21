// components/layout/Topbar.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth.store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';
import { layout } from '@/config/layout';

// ─────────────────────────────────────────────────────────────────────────────
// Topbar
//
// Fixed header for all dashboard routes.
// Height: layout.topbarH (60px) — from config/layout.ts
// Background: theme.colors.bg at 95% opacity + backdrop-blur-[16px]
// No box-shadow — only a bottom border defines the edge (design spec)
//
// Features:
//   - Search via the Phase 2 Input component
//   - Online/offline indicator via useOnlineStatus
//   - Notification bell with unread badge
//   - User avatar dropdown trigger
//   - Mobile hamburger (< lg) — triggers AppShell's drawer state
// ─────────────────────────────────────────────────────────────────────────────

// Duration pulled from theme — no inline values
const DUR_MICRO = theme.duration.micro;    // 0.18
const DUR_STD   = theme.duration.standard; // 0.28

interface TopbarProps {
  /** Called by AppShell's mobile hamburger — opens the sidebar drawer */
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const user   = useAuthStore(s => s.user);
  const online = useOnlineStatus();
  const [search, setSearch]         = useState('');
  const [notifOpen, setNotifOpen]   = useState(false);

  const toggleNotif = useCallback(() => setNotifOpen(o => !o), []);

  return (
    <header
      className="relative flex shrink-0 items-center gap-3 px-4 lg:px-6"
      style={{
        height:       layout.topbarH,                // 60px from config
        background:   `${theme.colors.bg}f2`,        // #070709 at ~95% opacity
        backdropFilter: 'blur(16px)',                 // spec: backdrop-blur 16px
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${theme.colors.border}`,
        // No box-shadow — spec requires border-only separation
        zIndex: theme.zIndex.nav,                    // 99_999 — always on top
      }}
    >
      {/* ── Mobile hamburger — visible below lg, hidden on desktop ────────── */}
      <motion.button
        className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition-colors hover:text-white/72 lg:hidden"
        style={{ background: theme.colors.surface }}
        onClick={onMenuClick}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: DUR_MICRO, ease: EASE_OUT }}
        aria-label="Open navigation"
      >
        <Menu size={16} aria-hidden />
      </motion.button>

      {/* ── Search — uses Phase 2 Input component ─────────────────────────── */}
      <div className="flex-1 max-w-xs lg:max-w-sm">
        <Input
          placeholder="Search students, fees…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Global search"
        />
      </div>

      {/* ── Right cluster ─────────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2">

        {/* Online / offline pill */}
        <motion.div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: online
              ? `${theme.colors.emerald[400]}18`
              : `${theme.colors.rose[400]}18`,
            color: online
              ? theme.colors.emerald[400]
              : theme.colors.rose[400],
          }}
          // Subtle scale-pulse when status flips
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: DUR_STD, ease: EASE_OUT }}
          key={String(online)}
          aria-live="polite"
          aria-label={online ? 'Connected' : 'Offline'}
        >
          {online
            ? <Wifi size={11} aria-hidden />
            : <WifiOff size={11} aria-hidden />}
          <span className="hidden sm:inline">{online ? 'Live' : 'Offline'}</span>
        </motion.div>

        {/* Notification bell */}
        <div className="relative">
          <motion.button
            className={cn(
              'relative flex h-8 w-8 items-center justify-center rounded-xl',
              'text-white/38 transition-colors hover:text-white/72',
            )}
            style={{
              background: theme.colors.surface,
              border:     `1px solid ${theme.colors.border}`,
            }}
            onClick={toggleNotif}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: DUR_MICRO, ease: EASE_OUT }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell size={14} aria-hidden />
            {/* Unread badge */}
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2"
                style={{
                  background: theme.colors.violet[500],
                  boxShadow: `0 0 0 2px ${theme.colors.bg}`, // ✅ ring replacement
              }}
              aria-hidden
            />
          </motion.button>

          {/* Notification dropdown — placeholder for Phase 4 real-time */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl py-2"
                style={{
                  background: theme.colors.bgFloat,
                  border:     `1px solid ${theme.colors.borderMid}`,
                  boxShadow:  theme.shadows.dashCard,
                  zIndex:     theme.zIndex.float,
                }}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{   opacity: 0, y: -8,  scale: 0.96 }}
                transition={{ duration: DUR_STD, ease: EASE_OUT }}
              >
                {/* Top-edge light — same pattern as Card */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  }}
                />
                <p className="px-4 py-2 text-[11.5px] text-white/28">
                  No new notifications
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar + name */}
        {user && (
          <motion.button
            className="flex items-center gap-2 rounded-xl px-2 py-1 text-left transition-colors hover:bg-white/[0.04]"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: DUR_MICRO, ease: EASE_OUT }}
            aria-label="User menu"
          >
            {/* Avatar */}
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: theme.gradients.brand }}
              aria-hidden
            >
              {getInitials(user.name)}
            </div>
            {/* Name — hidden on mobile */}
            <span className="hidden text-[12.5px] font-medium text-white/72 md:block">
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown
              size={12}
              className="hidden text-white/28 md:block"
              aria-hidden
            />
          </motion.button>
        )}
      </div>
    </header>
  );
}
