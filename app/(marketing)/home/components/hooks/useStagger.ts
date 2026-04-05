import { useMemo } from 'react';
import { Variants } from 'framer-motion';
import { EASE_SOFT } from '../../systems/design';

interface StaggerOptions {
  staggerChildren?: number;
  delayChildren?:   number;
  duration?:        number;
  y?:               number;
  blur?:            boolean;
}

interface StaggerResult {
  container: Variants;
  item:      Variants;
}

/**
 * Returns Framer Motion variant objects for staggered list reveals.
 * Uses memoisation — safe to call every render.
 *
 * The container stagger uses a natural exponential falloff so earlier
 * items animate faster and later items settle in behind them.
 *
 * @example
 * const { container, item } = useStagger({ staggerChildren: 0.09 });
 * <motion.div variants={container} initial="hidden" animate="visible">
 *   {items.map(i => <motion.div variants={item}>{i}</motion.div>)}
 * </motion.div>
 */
export function useStagger({
  staggerChildren = 0.075,
  delayChildren   = 0.12,
  duration        = 0.65,
  y               = 24,
  blur            = true,
}: StaggerOptions = {}): StaggerResult {
  return useMemo<StaggerResult>(
    () => ({
      container: {
        hidden:  {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      },
      item: {
        hidden: {
          opacity: 0,
          y,
          ...(blur && { filter: 'blur(5px)' }),
        },
        visible: {
          opacity: 1,
          y: 0,
          ...(blur && { filter: 'blur(0px)' }),
          transition: {
            duration,
            ease: EASE_SOFT,
          },
        },
      },
    }),
    [staggerChildren, delayChildren, duration, y, blur]
  );
}
