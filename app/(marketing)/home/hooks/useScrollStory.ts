import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollStoryOptions {
  /** Pin the trigger element for the duration. Default: false */
  pin?: boolean;
  /** Scrub amount — true = 1, number = custom lag. Default: 1.2 */
  scrub?: boolean | number;
  /** ScrollTrigger start position. Default: 'top 80%' */
  start?: string;
  /** ScrollTrigger end position. Default: 'bottom 20%' */
  end?: string;
  /** Markers for debugging (dev only) */
  markers?: boolean;
  /** Run once, no reverse. Default: false */
  once?: boolean;
}

type SetupFn<T extends HTMLElement> = (tl: gsap.core.Timeline, el: T) => void;

/**
 * Creates a GSAP timeline pinned to a scroll trigger.
 * Automatically syncs with Lenis via `window.__lenis`.
 *
 * @example
 * const ref = useScrollStory<HTMLDivElement>((tl, el) => {
 *   tl.from(el.querySelectorAll('.item'), { y: 60, opacity: 0, stagger: 0.1 });
 * }, { scrub: 1.5, start: 'top 70%' });
 */
export function useScrollStory<T extends HTMLElement = HTMLDivElement>(
  setup:   SetupFn<T>,
  options: ScrollStoryOptions = {}
): RefObject<T> {
  const ref      = useRef<T>(null);
  const ctxRef   = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sync Lenis with ScrollTrigger
    const lenis = window.__lenis as {
      on: (event: string, cb: () => void) => void;
      off: (event: string, cb: () => void) => void;
    } | undefined;

    const syncST = () => ScrollTrigger.update();
    lenis?.on('scroll', syncST);

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:  el,
          pin:      options.pin     ?? false,
          scrub:    options.scrub   ?? 1.2,
          start:    options.start   ?? 'top 80%',
          end:      options.end     ?? 'bottom 20%',
          markers:  options.markers ?? false,
          once:     options.once    ?? false,
          invalidateOnRefresh: true,
        },
      });
      setup(tl, el);
    }, el);

    return () => {
      lenis?.off('scroll', syncST);
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref as RefObject<T>;
}
