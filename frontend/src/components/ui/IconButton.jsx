import { forwardRef, cloneElement } from 'react';
import { cn } from '../../lib/cn';

const base =
  'inline-flex items-center justify-center shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring-color)] disabled:pointer-events-none disabled:opacity-50 active:scale-95';

const sizes = {
  sm: 'h-8 w-8 rounded-[var(--radius-2)]',
  md: 'h-10 w-10 rounded-[var(--radius-3)]',
  lg: 'h-12 w-12 rounded-[var(--radius-3)]',
};

/**
 * IconButton — icon-only button.
 * Always requires an accessible label via `label` (rendered sr-only) or
 * an aria-* prop.
 */
export const IconButton = forwardRef(function IconButton(
  { className, size = 'md', label = null, icon, children, ...props },
  ref
) {
  const glyph = children || icon;
  const child = glyph && typeof glyph.type === 'function'
    ? cloneElement(glyph, { 'aria-hidden': true })
    : glyph;

  return (
    <button
      ref={ref}
      className={cn(base, sizes[size], className)}
      aria-label={label || props['aria-label']}
      {...props}
    >
      {label && <span className="sr-only">{label}</span>}
      {child}
    </button>
  );
});
