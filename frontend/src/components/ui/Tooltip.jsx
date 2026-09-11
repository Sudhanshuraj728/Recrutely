import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Tooltip — small label revealed on hover and keyboard focus.
 * The trigger element keeps a descriptive accessible name; the tooltip is
 * decorative text positioned with pure CSS (no layout animation).
 */
export const Tooltip = forwardRef(function Tooltip(
  { label, side = 'top', children, className, ...props },
  ref
) {
  const placement = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }[side];

  return (
    <span
      ref={ref}
      tabIndex={-1}
      className={cn(
        'group/tip relative inline-flex',
        className
      )}
      {...props}
    >
      {children}
      <span
        role="tooltip"
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute z-[var(--z-tooltip)] w-max max-w-56 whitespace-normal rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-1.5 text-xs text-[var(--color-text)] opacity-0 shadow-[var(--shadow-elevated)] transition-opacity duration-[var(--motion-fast)] group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
          placement
        )}
      >
        {label}
      </span>
    </span>
  );
});
