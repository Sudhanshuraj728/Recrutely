import { cn } from '../../lib/cn';

/**
 * Logo — Recrutely wordmark. Gold mark, cream wordmark (Saffron-inspired).
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
      {/* Professional "R" mark — stylised recruitment/radar motif */}
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary)] shadow-[var(--shadow-subtle)]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Bold R letterform */}
          <path
            d="M4 3h5.5a3.5 3.5 0 0 1 0 7H4V3Z"
            fill="#17191c"
            strokeWidth="0"
          />
          <path
            d="M4 10h4.5L12 15H9L6 10.5V15H4V10Z"
            fill="#17191c"
            strokeWidth="0"
          />
          {/* Small accent dot — top-right, nods to target/hire motif */}
          <circle cx="14.5" cy="3.5" r="1.5" fill="#17191c" opacity="0.55" />
        </svg>
      </span>

      {!hideText && (
        <span
          className={cn(
            'font-semibold tracking-tight',
            dark ? 'text-[var(--color-cream-ink)]' : 'text-[var(--color-text)]',
            textSize
          )}
        >
          Recrutely
        </span>
      )}
    </span>
  );
}