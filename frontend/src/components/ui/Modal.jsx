import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, DURATION } from '../motion/motion.config';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE.standard } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
  exit: { opacity: 0, y: 8, scale: 0.99, transition: { duration: 0.15 } },
};

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

function useFocusTrap(ref, open) {
  useEffect(() => {
    if (!open || !ref.current) return;

    const node = ref.current;
    const previous = document.activeElement;
    const focusable = node.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // handled by caller via onClose
        return;
      }
      if (e.key !== 'Tab' || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [open, ref]);
}

/**
 * Modal — accessible dialog with focus trap, ESC-to-close, scrim click,
 * aria-modal semantics, and keyboard focus restoration.
 */
export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  className,
  hideClose = false,
}) {
  const panelRef = useRef(null);
  const reduce = useReducedMotion();
  useFocusTrap(panelRef, open);

  const onScrimClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-overlay)] flex items-end sm:items-center justify-center overflow-y-auto bg-black/60 p-0 sm:p-6"
          onClick={onScrimClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={reduce ? { visible: {}, hidden: {}, exit: {} } : backdropVariants}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? `${title}` : undefined}
            aria-label={title ? undefined : 'Dialog'}
            className={cn(
              'relative w-full rounded-t-[var(--radius-4)] sm:rounded-[var(--radius-4)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-floating)]',
              sizes[size],
              'outline-none',
              className
            )}
            variants={reduce ? { visible: {}, hidden: {}, exit: {} } : panelVariants}
          >
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-2)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-inset)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Helper header block for dialogs. */
export function ModalHeader({ title, description }) {
  return (
    <header className="border-b border-[var(--color-border)] px-6 py-5 pr-14">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
      )}
    </header>
  );
}

export function ModalFooter({ children, align = 'end' }) {
  return (
    <footer
      className={cn(
        'flex flex-col-reverse sm:flex-row gap-3 border-t border-[var(--color-border)] px-6 py-4',
        align === 'end'
          ? 'sm:justify-end'
          : align === 'between'
            ? 'sm:justify-between'
            : 'sm:justify-start'
      )}
    >
      {children}
    </footer>
  );
}
