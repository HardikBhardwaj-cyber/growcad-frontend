import Lenis from 'lenis';

export {};

declare global {
  interface Window {
    /**
     * Global Lenis instance for scroll control
     */
    __lenis?: Lenis;

    /**
     * GSAP ScrollTrigger (optional, loaded at runtime)
     */
    ScrollTrigger?: {
      update?: () => void;
      refresh?: () => void;
    };
  }
}