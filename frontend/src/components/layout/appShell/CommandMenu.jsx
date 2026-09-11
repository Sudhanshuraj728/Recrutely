/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { CMD_GROUPS } from './navigation';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { EASE } from '../../motion/motion.config';

const CommandContext = createContext(null);

export function CommandMenuProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const reduce = useReducedMotion();

  const toggle = useCallback(() => setOpen((v) => !v), []);

  const flatItems = useMemo(
    () => CMD_GROUPS.flatMap((g) => g.items),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flatItems.map((g) => ({ key: g.id || g.to, item: g }));
    return flatItems
      .filter((item) => {
        const label = item.label.toLowerCase();
        const nav = (item.to || '').toLowerCase();
        return label.includes(q) || nav.includes(q);
      })
      .map((item) => ({ key: item.id || item.to, item }));
  }, [flatItems, query]);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, query]);

  useEffect(() => setIndex(0), [filtered.length]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  const run = (item) => {
    setOpen(false);
    setQuery('');
    if (item.to) {
      navigate(item.to);
    } else if (item.id === 'new-resume') {
      navigate('/resume');
    } else if (item.id === 'new-job') {
      navigate('/jobs');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex(
        (i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[index];
      if (selected) run(selected.item);
    }
  };

  const value = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle]
  );

  return (
    <CommandContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.15 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="fixed inset-x-0 top-[12vh] z-[var(--z-modal)] mx-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-[var(--radius-4)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-floating)]"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE.out }}
            >
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
                <Search
                  className={cn(
                    'h-4 w-4 shrink-0',
                    reduce ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-muted)]'
                  )}
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type a command or search..."
                  aria-label="Search commands"
                  className="h-14 w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
                />
                <kbd className="hidden shrink-0 rounded-[var(--radius-1)] border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[0.65rem] text-[var(--color-text-subtle)] sm:block">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[var(--color-text-subtle)]">
                    No results for{' '}
                    <span className="font-medium text-[var(--color-text)]">{query}</span>
                  </div>
                ) : (
                  CMD_GROUPS.map((group) => {
                    const groupItems = filtered.filter((f) =>
                      group.items.some((gi) => (gi.id || gi.to) === f.key)
                    );
                    if (groupItems.length === 0) return null;
                    return (
                      <div key={group.label} className="mb-1">
                        <p className="px-3 pb-1 pt-2 text-caption font-semibold tracking-wider text-[var(--color-text-subtle)]">
                          {group.label}
                        </p>
                        {groupItems.map(({ key, item }) => {
                          const Icon = item.icon;
                          const active = filtered[index]?.key === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onMouseEnter={() =>
                                setIndex(filtered.findIndex((f) => f.key === key))
                              }
                              onClick={() => run(item)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-[var(--radius-2)] px-3 py-2.5 text-left text-sm transition-colors',
                                active
                                  ? 'bg-[var(--color-primary-sink)] text-[var(--color-text)]'
                                  : 'text-[var(--color-text-muted)]'
                              )}
                            >
                              <Icon
                                className={cn(
                                  'h-4 w-4 shrink-0',
                                  active
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-subtle)]'
                                )}
                              />
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.hint && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-[var(--radius-1)] border border-[var(--color-border)] font-mono text-[0.6rem] font-medium text-[var(--color-text-subtle)]">
                                  {item.hint}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-2 text-[0.65rem] text-[var(--color-text-subtle)]">
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" /> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" /> select
                  </span>
                </span>
                {!reduce && (
                  <span className="flex items-center gap-1">
                    <Command className="h-3 w-3" /> K
                  </span>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CommandContext.Provider>
  );
}

export function useCommandMenu() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error('useCommandMenu must be used inside CommandMenuProvider');
  return ctx;
}
