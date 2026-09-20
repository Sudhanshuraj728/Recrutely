import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UIProvider } from './uiStore';
import { CommandMenuProvider } from './CommandMenu';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { EASE, DURATION } from '../../motion/motion.config';

/**
 * AppShell — the premium application frame.
 * Composes the collapsible sidebar, sticky header, mobile navigation,
 * command menu, and animated content region. The content view is keyed by
 * location so route changes cross-fade/translate smoothly.
 *
 * This is purely presentational — no route logic or data fetching.
 */
function ShellContent() {
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [location.pathname, reduce]);

  return (
    <div className="relative flex min-h-dvh overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-5 [background-image:radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(249,168,38,0.07),transparent_68%)] blur-[120px]" />
      <Sidebar />
      <MobileNav />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{
                duration: reduce ? 0 : DURATION.enter,
                ease: EASE.out,
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export function AppShell() {
  return (
    <UIProvider>
      <CommandMenuProvider>
        <ShellContent />
      </CommandMenuProvider>
    </UIProvider>
  );
}
