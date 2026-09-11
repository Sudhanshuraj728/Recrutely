import { forwardRef, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/cn';

const sizes = {
  xs: 'h-6 w-6 text-[0.6rem]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

/**
 * Avatar — image or generated-initial fallback.
 * Renders an alt/name for accessible identification.
 */
export const Avatar = forwardRef(function Avatar(
  { className, src, name = '', alt, size = 'md', ...props },
  ref
) {
  const [error, setError] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <span
      ref={ref}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-sink)] font-semibold text-[var(--color-primary)]',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span aria-hidden="true">
          {initials || <User className="h-[55%] w-[55%]" />}
        </span>
      )}
      {!src && <span className="sr-only">{name || alt || 'User avatar'}</span>}
    </span>
  );
});
