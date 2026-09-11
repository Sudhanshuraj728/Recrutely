import { Bell, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '../../../lib/cn';
import { EASE } from '../../motion/motion.config';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Resume score improved',
    body: 'Your resume jumped from 72 to 88 — great work.',
    time: '2m ago',
    tone: 'success',
  },
  {
    id: 2,
    title: 'New job match',
    body: '3 new roles matched your profile this week.',
    time: '1h ago',
    tone: 'primary',
  },
];

/**
 * Notifications — header bell with a refined dropdown panel.
 * Currently presents sample/unread state only (no business API wiring —
 * structured so real data can be dropped in later without UI changes).
 */
export function Notifications() {
  const [open, setOpen] = useState(false);
  const [items] = useState(SAMPLE_NOTIFICATIONS);
  const [read, setRead] = useState(() => new Set());
  const rootRef = useRef(null);
  const reduce = useReducedMotion();

  const unread = items.length - read.size;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const markAllRead = () => setRead(new Set(items.map((i) => i.id)));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-2)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-bg)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Notifications"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: EASE.out }}
            className="absolute right-0 z-[var(--z-dropdown)] mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-floating)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--color-text)]">Notifications</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[22rem] overflow-y-auto py-1">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--color-text-subtle)]">
                  You&apos;re all caught up.
                </p>
              ) : (
                items.map((n) => {
                  const isRead = read.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      role="menuitem"
                      onClick={() => setRead((s) => new Set(s).add(n.id))}
                      className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-inset)] focus:bg-[var(--color-bg-inset)] focus:outline-none"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          isRead
                            ? 'bg-[var(--color-border-strong)]'
                            : 'bg-[var(--color-primary)]'
                        )}
                      />
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium text-[var(--color-text)]">
                            {n.title}
                          </span>
                          <span className="shrink-0 text-[0.625rem] text-[var(--color-text-subtle)]">
                            {n.time}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">
                          {n.body}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
