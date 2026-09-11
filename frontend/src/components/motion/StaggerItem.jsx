import { motion } from 'framer-motion';
import { itemVariants } from './motion.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * StaggerItem — child of Stagger. Adds a small, consistent delay so cards
 * rise in sequence. Not every element should animate — apply selectively.
 */
export function StaggerItem({ children, className, ...props }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}
