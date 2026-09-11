import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import { Logo } from '../Logo';
import { NAV_SECTIONS } from './navigation';
import { useUI } from './uiStore';
import { Avatar } from '../../ui';
import { useAuthContext } from '../../../context/AuthContext';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { EASE } from '../../motion/motion.config';

/**
 * MobileNav — slide-in drawer for small screens. Full grouped navigation
 * plus a user footer. Overlay covers the app; menu animates from the left.
 */
export function MobileNav() {
  const { mobileOpen, toggleMobile } = useUI();
  const { user } = useAuthContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const name = user?.name || user?.email || 'Guest';

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={toggleMobile}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-y-0 left-0 z-[var(--z-modal)] flex w-[min(20rem,85vw)] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] lg:hidden"
            initial={reduce ? { x: 0 } : { x: '-100%' }}
            animate={{ x: 0 }}
            exit={reduce ? { x: 0 } : { x: '-100%' }}
            transition={{ duration: reduce ? 0 : 0.28, ease: EASE.out }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5">
              <Logo />
              <button
                type="button"
                aria-label="Close navigation"
                onClick={toggleMobile}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-2)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label} className="mb-5">
                  <p className="mb-2 px-3 text-label text-[var(--color-text-subtle)]">
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={toggleMobile}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center gap-3 rounded-[var(--radius-2)] px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--motion-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]',
                                isActive
                                  ? 'bg-[var(--color-primary-sink)] text-[var(--color-text)] ring-1 ring-inset ring-[var(--color-primary-soft)]'
                                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)]'
                              )
                            }
                          >
                            <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--color-text-subtle)]" />
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="shrink-0 border-t border-[var(--color-border)] p-4">
              <a
                href="/profile"
                onClick={toggleMobile}
                className="flex items-center gap-3 rounded-[var(--radius-3)] p-2 transition-colors hover:bg-[var(--color-bg-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
              >
                <Avatar name={name} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--color-text)]">
                    {name}
                  </span>
                  <span className="block truncate text-xs text-[var(--color-text-subtle)]">
                    View profile &amp; settings
                  </span>
                </span>
              </a>
              {user && <button type="button" onClick={async () => { await logout(); toggleMobile(); navigate('/', { replace: true }); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-2)] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"><LogOut className="h-4 w-4" />Sign out</button>}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
