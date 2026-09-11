import { motion } from 'framer-motion';
import { pageVariants } from './motion.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * PageTransition — default page entrance.
 * opacity 0→1, translateY 14px→0, ~500ms with smooth easing.
 * Respects prefers-reduced-motion by rendering statically.
 */
export function PageTransition({ children }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}
