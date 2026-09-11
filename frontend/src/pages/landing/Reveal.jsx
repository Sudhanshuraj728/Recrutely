import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../../components/motion/motion.config';

/**
 * Reveal — scroll-triggered fade + rise for landing sections.
 * Respects prefers-reduced-motion by rendering statically at full opacity.
 * `delay` and `y` allow light variation without over-animating.
 */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }) {
  const reduce = useReducedMotion();
  const Comp = as;

  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp className={className}>
      <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay, ease: EASE.out }}
      >
        {children}
      </motion.div>
    </Comp>
  );
}

/**
 * Stagger container + item for group entrances on scroll. Pair Stagger with
 * StaggerChild to sequence children. Respects reduced motion.
 */
export function Stagger({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE.out },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
