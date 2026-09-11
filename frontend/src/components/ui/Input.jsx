import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

const base =
  'w-full rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] transition-[border-color,box-shadow,background-color] hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50';

const sizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

/**
 * Input — single-line text control with a clear premium focus state.
 * Field container and accessible labelling handled by <Field>.
 */
export const Input = forwardRef(function Input(
  { className, size = 'md', invalid = false, ...props },
  ref
) {
  const id = useId();
  return (
    <input
      id={props.id || id}
      ref={ref}
      className={cn(
        base,
        sizes[size],
        invalid && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-soft)]',
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});
