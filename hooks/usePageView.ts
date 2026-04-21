// hooks/usePageView.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// usePageView — automatic page_view tracking on route changes.
//
// Mount in a shared layout to track all dashboard page views without
// adding per-page boilerplate.
//
// Usage in app/(dashboard)/layout.tsx:
//   export default function Layout({ children }) {
//     usePageView();              // ← single line
//     return <AppShell>...</AppShell>;
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function usePageView(): void {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const prevPath     = useRef<string>('');

  useEffect(() => {
    const fullPath = searchParams?.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Don't fire if pathname hasn't changed (StrictMode double-invoke guard)
    if (fullPath === prevPath.current) return;
    prevPath.current = fullPath;

    analytics.page(fullPath, {
      // Strip query strings from path label for cleaner reporting
      path_label: pathname,
      referrer:   typeof document !== 'undefined' ? document.referrer : undefined,
    });
  }, [pathname, searchParams]);
}
