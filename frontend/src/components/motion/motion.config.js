/**
 * Central motion configuration for CareerCraft.
 * Subtle, smooth, purposeful. Animations favour transform & opacity only.
 */

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  standard: [0.4, 0, 0.2, 1],
};

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.42,
  enter: 0.5,
};

/** Default page entrance: opacity 0→1, translateY 8–16px → 0, ~350–600ms. */
export const pageVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.enter,
      ease: EASE.out,
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.2,
      ease: EASE.standard,
    },
  },
};

/** Consistent card entrance (used with Stagger). */
export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASE.out,
    },
  },
};

/** Fade-only variant for state changes that should not shift layout. */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASE.standard },
  },
};
