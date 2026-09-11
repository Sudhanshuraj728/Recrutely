/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

/**
 * AppShellUI — lightweight shared UI state for the application shell.
 * Holds the sidebar collapsed state so Sidebar and Header stay in sync
 * without prop drilling. No business logic lives here.
 */
export function UIProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed: () => setCollapsed((v) => !v),
      mobileOpen,
      setMobileOpen,
      toggleMobile: () => setMobileOpen((v) => !v),
    }),
    [collapsed, mobileOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUI must be used inside UIProvider');
  }
  return ctx;
}
