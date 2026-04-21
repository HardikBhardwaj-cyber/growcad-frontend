// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT, EASE_SOFT, fadeIn, slideRight } from '@/lib/motion';
import { theme } from '@/styles/theme';
import { layout } from '@/config/layout';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/auth.store';
import { useTenantStore } from '@/store/tenant.store';
import { getInitials } from '@/lib/utils';

// ─── Nav items ───────────────────────────────────────────────────────────────
type NavItemType = {
  label: string;
  Icon: LucideIcon;
  href: string;
};
const NAV_ITEMS: NavItemType[] = [
  { label: 'Dashboard',     Icon: LayoutDashboard,  href: ROUTES.dashboard     },
  { label: 'Students',      Icon: Users,            href: ROUTES.students      },
  { label: 'Fees',          Icon: CreditCard,       href: ROUTES.fees          },
  { label: 'Attendance',    Icon: ClipboardList,    href: ROUTES.attendance    },
  { label: 'Reports',       Icon: BarChart3,        href: ROUTES.reports       },
  { label: 'Communication', Icon: MessageSquare,    href: ROUTES.communication },
  { label: 'AI Assistant',  Icon: Sparkles,         href: ROUTES.ai            },
];

// ─── Duration from theme ──────────────────────────────────────────────────────

const DUR_STANDARD = theme.duration.standard; // 0.28 — collapse/expand
const DUR_MICRO    = theme.duration.micro;     // 0.18 — label fade

// ─── Label animation — slides left and fades on collapse ─────────────────────
// Using slideRight from lib/motion (x: -16 → 0) in reverse for collapse exit.

const labelVariants: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DUR_MICRO,
      ease: "easeOut", // ✅ FIXED
    },
  },
  hidden: {
    opacity: 0,
    x: -8,
    transition: {
      duration: DUR_MICRO,
      ease: "easeIn", // ✅ FIXED
    },
  },
};

// ─── Single nav item ──────────────────────────────────────────────────────────

interface NavItemProps {
  label: string;
  Icon: LucideIcon; // ✅ FIXED
  href: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

function NavItem({ label, Icon, href, active, collapsed, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 mx-2',
        'text-[13px] font-medium',
        'transition-colors duration-150 outline-none',
        // Active state — float layer bg + violet text
        active
          ? [
              'text-violet-300',
              'border border-violet-500/18',
            ]
          : [
              // Inactive: white/48 → white/80 on hover (spec)
              'text-white/48 hover:text-white/80',
              'hover:bg-white/[0.04]',
            ],
      )}
      style={{
        background: active ? theme.colors.bgFloat : undefined,
      }}
    >
      <Icon
        size={15}
        className={cn(
          'shrink-0 transition-colors duration-150',
          active ? 'text-violet-400' : 'text-current',
        )}
        aria-hidden
      />

      {/* Label — slides + fades, icons always fixed */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            variants={labelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Active indicator line on left edge */}
      {active && (
        <motion.span
          layoutId="nav-active-bar"
          className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-violet-400"
          transition={{ duration: DUR_STANDARD, ease: "easeInOut" }}
        />
      )}
    </Link>
  );
}

// ─── Sidebar core ─────────────────────────────────────────────────────────────

interface SidebarCoreProps {
  collapsed:    boolean;
  onCollapse:   () => void;
  onItemClick?: () => void;
}

function SidebarCore({ collapsed, onCollapse, onItemClick }: SidebarCoreProps) {
  const pathname = usePathname();
  const user     = useAuthStore(s => s.user);
  const logout   = useAuthStore(s => s.logout);
  const tenant   = useTenantStore(s => s.tenant);
  const prefersReducedMotion = useReducedMotion();

  // Width from config/layout.ts — never hardcoded
  const sidebarWidth = collapsed ? layout.sidebarCollapsedW : layout.sidebarW;

  return (
    <motion.aside
      className="relative flex h-full flex-col shrink-0"
      style={{
        background:    theme.colors.bg,          // #070709 — same as page
        borderRight:   `1px solid rgba(255,255,255,0.06)`,
        zIndex:        theme.zIndex.content,
        // No box-shadow — depth defined only by border-right (spec)
      }}
      animate={{ width: sidebarWidth }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: DUR_STANDARD, ease: "easeOut" }
      }
    >
      {/* Top-edge glow line — matches Card top-edge reflection pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)',
        }}
      />

      {/* ── Logo / brand row ────────────────────────────────────────────── */}
      <div
        className="flex shrink-0 items-center gap-3 px-4"
        style={{ height: layout.topbarH, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-7 w-7 shrink-0 rounded-[9px]"
          style={{
            background: theme.gradients.brand,
            boxShadow:  '0 0 14px rgba(139,92,246,0.35)',
          }}
        />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="brand"
              variants={labelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-white"
            >
              {tenant?.name ?? 'Growcad'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden py-3"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ label, Icon, href }) => {
          const active =
            pathname === href ||
            (href !== ROUTES.dashboard && pathname.startsWith(href + '/'));
          return (
            <NavItem
              key={href}
              label={label}
              Icon={Icon}
              href={href}
              active={active}
              collapsed={collapsed}
              onClick={onItemClick}
            />
          );
        })}
      </nav>

      {/* ── Bottom: settings + logout + user ────────────────────────────── */}
      <div
        className="flex flex-col gap-0.5 px-2 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-white/36 transition-colors duration-150 hover:bg-white/[0.04] hover:text-white/70"
          onClick={onItemClick}
        >
          <Settings size={15} className="shrink-0" aria-hidden />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span key="settings-label" variants={labelVariants} initial="hidden" animate="visible" exit="hidden">
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={logout}
          title={collapsed ? 'Log out' : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-white/36 transition-colors duration-150 hover:bg-rose-500/[0.08] hover:text-rose-400"
        >
          <LogOut size={15} className="shrink-0" aria-hidden />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span key="logout-label" variants={labelVariants} initial="hidden" animate="visible" exit="hidden">
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User row */}
        {user && (
          <div className={cn('flex items-center gap-2.5 px-3 py-2', collapsed && 'justify-center')}>
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-violet-300"
              style={{ background: 'rgba(139,92,246,0.22)' }}
            >
              {getInitials(user.name)}
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="user-info"
                  variants={labelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="min-w-0"
                >
                  <p className="truncate text-[12px] font-medium text-white/72">{user.name}</p>
                  <p className="truncate text-[10.5px] text-white/28">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Collapse toggle — floats outside right edge ──────────────────── */}
      <motion.button
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/80"
        style={{
          background:  theme.colors.bgRaise,
          border:      `1px solid rgba(255,255,255,0.10)`,
          boxShadow:   '0 2px 8px rgba(0,0,0,0.4)',
          zIndex:      theme.zIndex.float,
        }}
        onClick={onCollapse}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: DUR_MICRO, ease: "easeOut" }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={12} aria-hidden />
          : <ChevronLeft  size={12} aria-hidden />}
      </motion.button>
    </motion.aside>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open:    boolean;
  onClose: () => void;
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { onClose(); }, [pathname, onClose]);

  // Trap focus and close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: theme.zIndex.float }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR_STANDARD, ease: "easeOut" }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel — slides in from left */}
          <motion.div
            key="drawer-panel"
            className="fixed left-0 top-0 h-full"
            style={{
              width:   layout.sidebarW,
              zIndex:  theme.zIndex.float + 1,
            }}
            initial={{ x: -layout.sidebarW }}
            animate={{ x: 0 }}
            exit={{ x: -layout.sidebarW }}
            transition={{ duration: DUR_STANDARD, ease: "easeOut" }}
          >
            <SidebarCore
              collapsed={false}
              onCollapse={onClose}
              onItemClick={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export function Sidebar() {
  // Desktop: persistent collapsible
  const [collapsed, setCollapsed] = useState(false);
  // Mobile: drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      {/* ── Desktop sidebar (lg+): always visible ───────────────────────── */}
      <div className="hidden lg:flex">
        <SidebarCore
          collapsed={collapsed}
          onCollapse={() => setCollapsed(c => !c)}
        />
      </div>

      {/* ── Mobile hamburger (< lg) ──────────────────────────────────────── */}
      {/* Rendered by Topbar via MobileMenuButton — Topbar imports and calls setDrawerOpen */}
      {/* Drawer is controlled here and exposed via context/prop */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}

// Export for Topbar to trigger mobile drawer open
export { MobileDrawer };
