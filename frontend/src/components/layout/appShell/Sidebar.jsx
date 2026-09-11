import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, Zap } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { Logo } from '../Logo';
import { NAV_SECTIONS } from './navigation';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useUI } from './uiStore';
import { Tooltip } from '../../ui';

/**
 * Sidebar — collapsible desktop navigation rail.
 * Expands to a full grouped menu; collapses to an icon-only rail with
 * tooltips. Sticky, full-height, subtle active pill, honors reduced motion.
 */
export function Sidebar() {
  const { collapsed, toggleCollapsed } = useUI();
  const reduce = useReducedMotion();

  return (
    <aside
      aria-label="Primary"
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 backdrop-blur-md transition-[width] duration-[var(--motion-base)] ease-out lg:flex',
        collapsed ? 'w-[68px]' : 'w-[248px]'
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-[var(--color-border)] transition-[padding]',
          collapsed ? 'justify-center px-2' : 'px-5'
        )}
      >
        {collapsed ? (
          <Logo className="justify-center" hideText />
        ) : (
          <motion.div
            initial={false}
            animate={{ opacity: reduce ? 1 : 1 }}
            className="min-w-0"
          >
            <Logo />
          </motion.div>
        )}
      </div>

      <nav
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden py-4',
          collapsed ? 'px-3' : 'px-3'
        )}
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            {!collapsed && section.label && (
              <p className="mb-2 px-3 text-label text-[var(--color-text-subtle)]">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                  reduce={reduce}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <CollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />
    </aside>
  );
}

function SidebarItem({ item, collapsed, reduce }) {
  const Icon = item.icon;
  const inner = (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'group relative flex w-full items-center gap-3 rounded-[var(--radius-2)] px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--motion-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]',
          collapsed && 'justify-center px-0',
          isActive
            ? 'text-[var(--color-text)]'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)]'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 500, damping: 40 }
              }
              className="absolute inset-0 rounded-[var(--radius-2)] bg-[var(--color-primary-sink)] ring-1 ring-inset ring-[var(--color-primary-soft)]"
            />
          )}
          <Icon
            aria-hidden="true"
            className={cn(
              'relative z-10 h-[18px] w-[18px] shrink-0 transition-colors duration-[var(--motion-fast)]',
              isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)]'
            )}
          />
          {!collapsed && (
            <span className="relative z-10 min-w-0 truncate">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span className="relative z-10 ml-auto flex items-center gap-1 rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-primary)]">
              {item.badge === 'PRO' && <Zap className="h-2.5 w-2.5" />}
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip label={item.label} side="right">
          {inner}
        </Tooltip>
      </li>
    );
  }

  return <li>{inner}</li>;
}

function CollapseToggle({ collapsed, onToggle }) {
  const Icon = collapsed ? ChevronsRight : ChevronsLeft;
  return (
    <div className="shrink-0 border-t border-[var(--color-border)] p-3">
      <button
        type="button"
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'flex w-full items-center gap-3 rounded-[var(--radius-2)] px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]',
          collapsed && 'justify-center px-0'
        )}
      >
        <Icon className="h-[18px] w-[18px] text-[var(--color-text-subtle)]" />
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );
}
