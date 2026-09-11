import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

/**
 * ErrorState — communicates an error with an optional retry action.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not complete your request. Please try again.',
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[var(--radius-3)] border border-[var(--color-danger-soft)] bg-[var(--color-danger-soft)] px-6 py-12 text-center',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-3)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
      >
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      )}
      {onRetry && (
        <div className="mt-2">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
