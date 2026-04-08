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
  }
}