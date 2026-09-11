import { cn } from '../../lib/cn';

/**
 * SectionHeader — smaller heading block for nested sections/cards.
 */
export function SectionHeader({
  title,
  description,
  as: Comp = 'h2',
  actions,
  className,
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="space-y-1">
        <Comp className="text-h3 text-[var(--color-text)]">{title}</Comp>
        {description && (
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
