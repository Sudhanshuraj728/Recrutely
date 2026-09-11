import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const base =
  'inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] font-medium leading-none whitespace-nowrap';

const variants = {
  neutral:
    'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
  primary:
    'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
  secondary:
    'bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]',
  success:
    'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  warning:
    'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  danger:
    'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  info:
    'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  outline:
    'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border-strong)]',
};

const sizes = {
  sm: 'h-5 px-2 text-[0.6875rem]',
  md: 'h-6 px-2.5 text-xs',
};

export const Badge = forwardRef(function Badge(
  { className, variant = 'neutral', size = 'md', dot = false, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
        />
      )}
      {children}
    </span>
  );
});
