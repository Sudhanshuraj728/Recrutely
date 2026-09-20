import { Menu, Search } from 'lucide-react';
import { useUI } from './uiStore';
import { useCommandMenu } from './CommandMenu';
import { Notifications } from './Notifications';
import { ProfileMenu } from './ProfileMenu';
import { IconButton } from '../../ui';

/**
 * Header — sticky top bar shared across the app shell.
 * Left: mobile menu toggle + command search trigger.
 * Right: notifications + profile menu.
 */
export function Header() {
  const { toggleMobile } = useUI();
  const { setOpen } = useCommandMenu();

  const openCommand = () => {
    setOpen(true);
  };

  return (
    <header className="sticky top-0 z-[var(--z-header)] h-16 shrink-0 border-b border-white/10 bg-[var(--color-bg)]/65 backdrop-blur-2xl">
      <div className="flex h-full items-center gap-2 px-4 sm:px-6">
        {/* Mobile menu toggle */}
        <IconButton
          aria-label="Open navigation"
          className="lg:hidden"
          onClick={toggleMobile}
        >
          <Menu className="h-5 w-5" />
        </IconButton>

        {/* Command search trigger */}
        <button
          type="button"
          onClick={openCommand}
          onKeyDown={(e) => {
            if (e.key === 'Enter') openCommand();
          }}
          aria-label="Search and run commands"
          className="group inline-flex h-10 max-w-md flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 text-sm text-[var(--color-text-subtle)] transition-colors hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)] sm:max-w-sm"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden flex-1 text-left sm:block">
            Search or jump to&hellip;
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-1 rounded-[var(--radius-1)] border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[0.65rem] text-[var(--color-text-subtle)] transition-colors group-hover:border-[var(--color-border-strong)]">
            <span className="hidden sm:inline">Ctrl K</span>
            <span className="sm:hidden">K</span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Notifications />
          <div className="mx-1 hidden h-6 w-px bg-[var(--color-border)] sm:block" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
