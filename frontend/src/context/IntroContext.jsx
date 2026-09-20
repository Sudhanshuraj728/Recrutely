/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';

const IntroContext = createContext({ done: false, cleared: false, finish: () => {}, clear: () => {} });

/**
 * IntroContext — one-time brand intro state, kept at app level so it plays only
 * on the initial page load. Navigating sections or routes within the SPA never
 * replays it because the flag survives above the router.
 */
export function IntroProvider({ children }) {
  const [done, setDone] = useState(false);
  const [cleared, setCleared] = useState(false);
  const finish = useMemo(() => () => setDone(true), []);
  const clear = useMemo(() => () => setCleared(true), []);
  const value = useMemo(() => ({ done, cleared, finish, clear }), [done, cleared, finish, clear]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}