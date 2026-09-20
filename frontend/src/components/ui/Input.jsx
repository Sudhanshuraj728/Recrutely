import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

const base =
  'w-full rounded-xl border border-white/10 bg-[#111111] px-3.5 text-sm text-white placeholder:text-white/35 transition-[border-color,box-shadow,background-color] hover:border-white/20 focus:border-[#F9A826] focus:bg-[#151515] focus:outline-none focus:ring-1 focus:ring-[#F9A826]/50 disabled:cursor-not-allowed disabled:opacity-50';

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
