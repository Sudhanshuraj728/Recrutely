import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/cn';

/**
 * PasswordInput — password control with a visibility toggle.
 * Type-safe with the standard Input contract (id, invalid, etc.) plus a
 * leading key glyph handled at the call site via the standard Input props.
 */
export const PasswordInput = forwardRef(function PasswordInput(
  { className, invalid = false, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        invalid={invalid}
        autoComplete={props.autoComplete || 'current-password'}
        className={cn('pr-11', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-8 w-9 items-center justify-center rounded-[var(--radius-2)] text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
