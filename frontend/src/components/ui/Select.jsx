import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

const base =
  'w-full appearance-none rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3.5 pr-9 text-sm text-[var(--color-text)] transition-[border-color,box-shadow,background-color] hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50';

const sizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

/**
 * Select — native dropdown styled with the Recrutely design system.
 * Native <select> preserves keyboard and screen-reader semantics.
 */
export const Select = forwardRef(function Select(
  { className, size = 'md', invalid = false, children, ...props },
  ref
) {
  const id = useId();
  return (
    <span className={cn('relative block', className)}>
      <select
        id={props.id || id}
        ref={ref}
        className={cn(
          base,
          sizes[size],
          invalid && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-soft)]'
        )}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
      />
    </span>
  );
});
