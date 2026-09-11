import {
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, DURATION } from '../motion/motion.config';

const menuVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.12 } },
};

/**
 * Dropdown — accessible menu with keyboard navigation (arrow keys,
 * home/end, escape), ARIA menubar/menu semantics, and outside-click close.
 * `trigger` is a render function receiving { open, toggle, ref }.
 */
export function Dropdown({
  trigger,
  children,
  align = 'end',
  className,
  label,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onItemKeyDown = (e) => {
    const items = Array.from(
      listRef.current?.querySelectorAll('[role="menuitem"]') || []
    );
    const index = items.indexOf(e.target);
    if (index === -1) return;

    const focus = (next) => items[next]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focus((index + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focus((index - 1 + items.length) % items.length);
        break;
      case 'Home':
        e.preventDefault();
        focus(0);
        break;
      case 'End':
        e.preventDefault();
        focus(items.length - 1);
        break;
      default:
        break;
    }
  };

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      {trigger({ open, setOpen, close })}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            role="menu"
            aria-label={label}
            className={cn(
              'absolute z-[var(--z-dropdown)] mt-2 min-w-44 rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1 shadow-[var(--shadow-elevated)] focus:outline-none',
              align === 'end' ? 'right-0' : 'left-0'
            )}
            variants={reduce ? { hidden: {}, visible: {}, exit: {} } : menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={onItemKeyDown}
          >
            {children(close)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DropdownItem = forwardRef(function DropdownItem(
  { className, onSelect, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      data-internal-menuitem=""
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[var(--radius-2)] px-3 py-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary-sink)] focus:bg-[var(--color-primary-sink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-soft)]',
        className
      )}
      onClick={(e) => {
        onSelect?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});

export const DropdownSeparator = () => (
  <div role="separator" className="my-1 h-px bg-[var(--color-border)]" />
);
