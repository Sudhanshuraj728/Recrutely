import { AppShell } from './appShell/AppShell';

/**
 * AppLayout — application frame. Delegates to the premium AppShell which
 * composes the collapsible sidebar, header, mobile navigation, command menu,
 * and animated content region. Maintained for routing ergonomics.
 */
export function AppLayout() {
  return <AppShell />;
}
