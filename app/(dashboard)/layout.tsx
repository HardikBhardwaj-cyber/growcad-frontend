// app/(dashboard)/layout.tsx

export const dynamic = "force-dynamic"; // 🔥 THIS FIXES ALL SSR ISSUES

import { ReactNode, Suspense } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import PageViewTracker from './PageViewTracker';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>

      {children}
    </AppShell>
  );
}