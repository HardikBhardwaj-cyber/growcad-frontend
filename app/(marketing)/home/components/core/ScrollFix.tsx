'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Resets scroll position on route change and re-initializes
 * Lenis if it was paused by a modal or overlay.
 */
export default function ScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Resume lenis if globally available
    const lenis = (window as unknown as Record<string, unknown>).__lenis as {
      start?: () => void;
    } | undefined;

    if (lenis?.start) {
      lenis.start();
    }
  }, [pathname]);

  return null;
}
