import { motion } from 'framer-motion';
import { pageVariants } from './motion.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Stagger — container that co-ordinates child StaggerItem entrances.
 * Cards should use small stagger delays; do not animate every element.
 */
export function Stagger({ children, className, ...props }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
