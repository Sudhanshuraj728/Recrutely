import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Skeleton — loading placeholder using a soft shimmer.
 * Uses background-position animation (cheap) that is disabled for
 * prefers-reduced-motion via the global rule.
 */
export const Skeleton = forwardRef(function Skeleton(
  { className, as: Comp = 'div', ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      aria-hidden="true"
      className={cn(
        'rounded-[var(--radius-2)] bg-[var(--color-bg-inset)] text-transparent select-none',
        'animate-[shimmer_1.4s_linear_infinite]',
        'bg-[linear-gradient(90deg,var(--color-bg-inset)_0%,var(--color-bg-elevated)_40%,var(--color-bg-inset)_80%)] bg-[length:468px_100%] bg-no-repeat',
        className
      )}
      {...props}
    />
  );
});
