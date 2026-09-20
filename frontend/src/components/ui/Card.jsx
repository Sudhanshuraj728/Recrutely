import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const base =
  'rounded-2xl border border-white/5 bg-white/[0.02] text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-[border-color,box-shadow,transform,background-color]';

const interactive =
  'cursor-pointer hover:-translate-y-0.5 hover:border-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_60px_rgba(0,0,0,0.24)] hover:bg-white/[0.03]';

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
