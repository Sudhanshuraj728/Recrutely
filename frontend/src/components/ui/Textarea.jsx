import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

const base =
  'w-full resize-y rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] transition-[border-color,box-shadow,background-color] hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Textarea — multi-line text control with premium focus state.
 */
export const Textarea = forwardRef(function Textarea(
  { className, invalid = false, rows = 4, ...props },
  ref
) {
  const id = useId();
  return (
    <textarea
      id={props.id || id}
      ref={ref}
      rows={rows}
      className={cn(
        base,
        invalid && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-soft)]',
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});
