import { cn } from '../../lib/cn';

/**
 * PageHeader — top-of-page heading block with title, description, optional
 * eyebrow label, and actions. Establishes consistent page-level hierarchy.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}) {
  return (
    <header className={cn('flex flex-col gap-3', className)}>
      {eyebrow && <p className="text-label text-[var(--color-primary)]">{eyebrow}</p>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-h1 text-[var(--color-text)]">{title}</h1>
          {description && (
            <p className="text-body text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>
    </header>
  );
}
