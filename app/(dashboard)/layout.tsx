// app/(dashboard)/layout.tsx
'use client';

import { ReactNode } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { AppShell } from '@/components/layout/app-shell';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  usePageView();
  return <AppShell>{children}</AppShell>;
}
