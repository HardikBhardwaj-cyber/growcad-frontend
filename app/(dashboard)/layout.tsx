// app/(dashboard)/layout.tsx
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
