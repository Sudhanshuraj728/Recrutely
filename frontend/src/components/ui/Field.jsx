import { useId } from 'react';
import { cn } from '../../lib/cn';

/**
 * Field — label + control + optional description/error.
 * Associates the label, description, and error with the control so that
 * screen readers announce them together (accessible labelling).
 */
export function Field({
  label,
  htmlFor,
  description,
  error,
  required = false,
  className,
  id,
  children,
}) {
  const generatedId = useId();
  const controlId = htmlFor || id || `field-${generatedId}`;
  const descriptionId = `desc-${generatedId}`;
  const errorId = `error-${generatedId}`;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label
          htmlFor={controlId}
          className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]"
        >
          {label}
          {required && <span className="sr-only"> required</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p id={descriptionId} className="text-xs text-[var(--color-text-subtle)]">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
