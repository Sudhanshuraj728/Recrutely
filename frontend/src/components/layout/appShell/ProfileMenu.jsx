import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, CreditCard, ChevronDown } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator } from '../../ui';
import { Avatar } from '../../ui';
import { useAuthContext } from '../../../context/AuthContext';
import { cn } from '../../../lib/cn';
import { useToast } from '../../ui';

/**
 * ProfileMenu — header profile chip + dropdown (account, settings,
 * upgrade, sign out). Falls back to a compact chip when unauthenticated.
 */
export function ProfileMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.name || user?.email || 'Guest';
  const email =
    user?.email || (isAuthenticated ? 'signed in' : 'Sign in to continue');

  async function handleLogout(closeMenu) {
    setLoggingOut(true);
    try {
      await logout();
      closeMenu?.();
      navigate('/', { replace: true });
    } catch (error) {
      setLoggingOut(false);
      toast({ title: 'Unable to sign out', message: error.message, variant: 'error' });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        label="Profile menu"
        trigger={({ open, toggle }) => (
          <button
            type="button"
            onClick={toggle}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex h-9 max-w-[10rem] items-center gap-2 rounded-full border border-[var(--color-border)] py-1 pl-1 pr-2 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
          >
            <Avatar name={displayName} size="sm" />
            <span className="hidden min-w-0 flex-col items-start leading-tight md:flex">
              <span className="max-w-[6rem] truncate text-xs font-semibold text-[var(--color-text)]">
                {displayName}
              </span>
              <span className="max-w-[6rem] truncate text-[0.625rem] text-[var(--color-text-subtle)]">
                {isAuthenticated ? 'Pro · Free' : 'Not signed in'}
              </span>
            </span>
            <ChevronDown
              className={cn(
                'hidden h-3.5 w-3.5 text-[var(--color-text-subtle)] transition-transform duration-[var(--motion-fast)] md:block',
                open && 'rotate-180'
              )}
            />
          </button>
        )}
      >
        {(close) => (
        <>
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              {displayName}
            </p>
            <p className="truncate text-xs text-[var(--color-text-subtle)]">{email}</p>
          </div>
          <DropdownSeparator />
          <DropdownItem
            onSelect={() => {
              close();
              navigate('/profile');
            }}
          >
            <User className="h-4 w-4 text-[var(--color-text-subtle)]" />
            Profile
          </DropdownItem>
          <DropdownItem
            onSelect={() => {
              close();
              navigate('/settings');
            }}
          >
            <Settings className="h-4 w-4 text-[var(--color-text-subtle)]" />
            Settings
          </DropdownItem>
          <DropdownItem
            onSelect={() => {
              close();
              navigate('/upgrade');
            }}
          >
            <CreditCard className="h-4 w-4 text-[var(--color-text-subtle)]" />
            Billing &amp; Upgrade
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            disabled={loggingOut}
            onSelect={() => handleLogout(close)}
          >
            <LogOut className="h-4 w-4 text-[var(--color-text-subtle)]" />
            {loggingOut ? 'Signing out...' : 'Sign out'}
          </DropdownItem>
        </>
      )}
      </Dropdown>
      {isAuthenticated && <button type="button" onClick={() => handleLogout()} disabled={loggingOut} className="hidden items-center gap-1.5 rounded-[var(--radius-2)] border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:opacity-50 sm:inline-flex"><LogOut className="h-3.5 w-3.5" />{loggingOut ? 'Signing out...' : 'Sign out'}</button>}
    </div>
  );
}
