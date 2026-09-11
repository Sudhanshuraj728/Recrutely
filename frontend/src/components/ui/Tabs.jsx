import { useState, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, DURATION } from '../motion/motion.config';

/**
 * Tabs — accessible tablist with keyboard arrow navigation and an animated
 * active indicator (layout-animated).
 */
export function Tabs({ items, defaultIndex = 0, onChange, className }) {
  const [active, setActive] = useState(defaultIndex);
  const id = useId();
  const listRef = useRef(null);
  const reduce = useReducedMotion();

  const setTab = (index) => {
    setActive(index);
    onChange?.(index);
  };

  const onKeyDown = (e, index) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const count = items.length;
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % count;
    if (e.key === 'ArrowLeft') next = (index - 1 + count) % count;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = count - 1;
    setTab(next);
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={id}
        className="relative flex gap-1 border-b border-[var(--color-border)]"
      >
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.key || item.label}
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(index)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                'relative -mb-px px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]',
                selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              )}
            >
              {item.icon && <span className="mr-1.5 inline-flex">{item.icon}</span>}
              {item.label}
              {selected && (
                <motion.span
                  layoutId={`${id}-indicator`}
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)]"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            role="tabpanel"
            id={`${id}-panel-${active}`}
            aria-labelledby={`${id}-tab-${active}`}
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={reduce ? false : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
            className="focus:outline-none"
          >
            {items[active].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
