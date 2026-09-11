import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';

/**
 * NavLink — navigation link with a subtle animated active indicator.
 * Active state uses an underline/pill that transitions in.
 */
export function NavLinkItem({ to, label, icon, end = false, className }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex items-center gap-2 rounded-[var(--radius-2)] px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]',
          isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]',
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          {icon && <span aria-hidden="true" className={cn('transition-colors', isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-subtle)]')}>{icon}</span>}
          {label}
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute inset-x-2 -bottom-[3px] h-0.5 rounded-full bg-[var(--color-primary)]"
            />
          )}
        </>
      )}
    </NavLink>
  );
}
