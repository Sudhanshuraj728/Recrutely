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
          className="text-sm font-medium text-[var(--color-text)]"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-[var(--color-danger)]">
              *
            </span>
          )}
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
