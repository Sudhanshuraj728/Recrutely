import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Progress — accessible progress indicator.
 * Determinate: value 0–100 with role="progressbar". Indeterminate: animated
 * shimmer without a value.
 */
export const Progress = forwardRef(function Progress(
  { value, max = 100, size = 'md', label, className, ...props },
  ref
) {
  const isIndeterminate = value == null;
  const pct = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));

  const heights = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  };

  return (
    <div
      ref={ref}
      role={isIndeterminate ? undefined : 'progressbar'}
      aria-valuenow={isIndeterminate ? undefined : pct}
      aria-valuemin={isIndeterminate ? undefined : 0}
      aria-valuemax={max}
      aria-label={label}
      className={cn(
        'w-full overflow-hidden rounded-full bg-[var(--color-bg-inset)]',
        heights[size],
        className
      )}
      {...props}
    >
      {isIndeterminate ? (
        <div
          aria-hidden="true"
          className="h-full w-1/3 rounded-full bg-[var(--color-primary)] animate-[indeterminate_1.2s_var(--ease-in-out)_infinite]"
        />
      ) : (
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-[var(--motion-base)] ease-[var(--ease-out)]"
          style={{ width: `${pct}%` }}
        />
      )}
    </div>
  );
});
