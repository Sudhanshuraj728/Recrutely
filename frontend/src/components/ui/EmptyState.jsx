import { cn } from '../../lib/cn';

/**
 * EmptyState — communicates absence of data.
 * Data-agnostic; takes explicit title/description/action.
 */
export function EmptyState({
  icon,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[var(--radius-3)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] px-6 py-12 text-center',
        className
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-3)] bg-[var(--color-primary-sink)] text-[var(--color-primary)]"
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
