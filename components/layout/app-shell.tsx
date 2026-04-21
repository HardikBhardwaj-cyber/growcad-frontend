'use client';

import { ReactNode, useState, useCallback } from 'react';
import { Sidebar, MobileDrawer } from './sidebar';
import { Topbar } from './topbar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { theme } from '@/styles/theme';
import { RouteTransition } from './RouteTransition';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuthGuard();

  // ✅ hooks must be before condition
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer  = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  if (!isAuthenticated) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: theme.colors.bg }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex" style={{ zIndex: theme.zIndex.content }}>
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />

      {/* Right Side */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={openDrawer} />

        <div
          className="flex-1 overflow-y-auto"
          style={{ zIndex: theme.zIndex.content }}
        >
          <RouteTransition>
            {children}
          </RouteTransition>
        </div>
      </div>
    </div>
  );
}