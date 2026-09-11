import {
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../motion/motion.config';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const ICON_COLOR = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  warning: 'text-[var(--color-warning)]',
  info: 'text-[var(--color-info)]',
};

export function ToastProvider({ children, position = 'bottom-right' }) {
  const [toasts, setToasts] = useState([]);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    ({ title, message, variant = 'info', duration = 4000, action }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, title, message, variant, action }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const toast = useCallback(
    (messageOrOpts, opts) => {
      if (typeof messageOrOpts === 'string') {
        return push({ message: messageOrOpts, ...opts });
      }
      return push(messageOrOpts);
    },
    [push]
  );

  const positionClass = {
    'bottom-right': 'bottom-6 right-6 items-end',
    'bottom-left': 'bottom-6 left-6 items-start',
    'top-right': 'top-6 right-6 items-end',
    'top-left': 'top-6 left-6 items-start',
  }[position];

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        role="region"
        aria-label="Notifications"
        className={cn('pointer-events-none fixed z-[var(--z-toast)] flex flex-col gap-3', positionClass)}
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.variant] || Info;
            return (
              <motion.div
                key={t.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE.out }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-elevated)]"
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_COLOR[t.variant])} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  {t.title && (
                    <p className="text-sm font-semibold text-[var(--color-text)]">{t.title}</p>
                  )}
                  {t.message && (
                    <p className="text-sm text-[var(--color-text-muted)]">{t.message}</p>
                  )}
                </div>
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action.onClick?.();
                      dismiss(t.id);
                    }}
                    className="shrink-0 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                  >
                    {t.action.label}
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}
