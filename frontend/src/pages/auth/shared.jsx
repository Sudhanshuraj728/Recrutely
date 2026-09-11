import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function Divider({ label }) {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="text-xs uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}

export function Banner({ message, tone, onDismiss }) {
  const reduce = useReducedMotion();
  if (!message) return null;
  const isError = tone === 'error';
  return (
    <AnimatePresence>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        role={isError ? 'alert' : 'status'}
        className={cn(
          'flex items-start gap-2.5 rounded-[var(--radius-2)] border px-3.5 py-3 text-sm',
          isError
            ? 'border-[var(--color-danger-soft)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
            : 'border-[var(--color-success-soft)] bg-[var(--color-success-soft)] text-[var(--color-success)]'
        )}
      >
        {isError ? (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1">{message}</span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/** Strength meter for the signup password field. */
export function PasswordStrength({ value }) {
  if (!value) return null;

  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/g.test(value) && /[A-Z]/g.test(value)) score++;
  if (/\d/.test(value)) score++;

  const levels = [
    { label: 'Weak', color: 'var(--color-danger)' },
    { label: 'Fair', color: 'var(--color-warning)' },
    { label: 'Strong', color: 'var(--color-success)' },
  ];
  const level = levels[Math.max(0, score - 1)];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-[var(--motion-base)]"
            style={{
              background: i < score ? level.color : 'var(--color-border)',
            }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="mt-1.5 text-xs text-[var(--color-text-subtle)]">
          Password strength: <span style={{ color: level.color }}>{level.label}</span>
        </p>
      )}
    </div>
  );
}
