import Lenis from 'lenis';

export {};

declare global {
  interface Window {
    /**
     * Global Lenis instance
     */
    __lenis?: Lenis;

    /**
     * GSAP ScrollTrigger (optional runtime injection)
     */
    ScrollTrigger?: {
      update?: () => void;
      refresh?: () => void;
    };

    /**
     * Tenant ID for multi-tenant SaaS
     */
    gc_tenant?: string;
  }
}