import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const base =
  'rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)] transition-[border-color,box-shadow,transform,background-color]';

const interactive =
  'cursor-pointer hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-elevated)] hover:bg-[var(--color-bg-inset)]';

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

/**
 * Card — reusable elevated surface.
 * Interactive cards respond with subtle elevation + border on hover and a
 * slight scale reduction on active (micro-interaction).
 */
export const Card = forwardRef(function Card(
  { className, as: Comp = 'div', padding = 'md', interactive: isInteractive = false, ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={cn(base, paddings[padding], isInteractive && interactive, className)}
      {...props}
    />
  );
});
