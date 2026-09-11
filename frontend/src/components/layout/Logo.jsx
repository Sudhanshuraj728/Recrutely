import { cn } from '../../lib/cn';

/**
 * Logo — CareerCraft wordmark. Gold mark, cream wordmark (Saffron-inspired).
 * Pairs light/dark surfaces through inherited color variables.
 */
export function Logo({ className, size = 'md', hideText = false, dark = false }) {
  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 select-none',
        hideText && 'justify-center',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary)] text-sm font-bold text-[var(--color-text-inverse)] shadow-[var(--shadow-subtle)]"
      >
        CC
      </span>
      {!hideText && (
        <span
          className={cn(
            'font-semibold tracking-tight',
            dark ? 'text-[var(--color-cream-ink)]' : 'text-[var(--color-text)]',
            textSize
          )}
        >
          Career<span className="text-[var(--color-primary)]">Craft</span>
        </span>
      )}
    </span>
  );
}