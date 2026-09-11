import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,border-color,color,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring-color)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]';

const variants = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-subtle)]',
  secondary:
    'bg-[var(--color-bg-elevated)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-primary-sink)] hover:border-[var(--color-primary)]',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:brightness-110 shadow-[var(--shadow-subtle)]',
  outline:
    'bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  success:
    'bg-[var(--color-success)] text-[#062b1f] hover:brightness-110 shadow-[var(--shadow-subtle)]',
};

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-[var(--radius-2)]',
  md: 'h-10 px-4 text-sm rounded-[var(--radius-3)]',
  lg: 'h-12 px-6 text-base rounded-[var(--radius-3)]',
  icon: 'h-10 w-10 rounded-[var(--radius-3)]',
};

/**
 * Button — primary interactive control.
 * States: default, hover (subtle brightness/elevation), active (slight
 * scale reduction), disabled, loading.
 */
export const Button = forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    asChild = false,
    loading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  const Comp = asChild ? 'span' : 'button';
  const isDisabled = disabled || loading;

  return (
    <Comp
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </Comp>
  );
});
