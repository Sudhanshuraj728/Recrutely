/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';

const IntroContext = createContext({ done: false, finish: () => {} });

/**
 * IntroContext — one-time brand intro state, kept at app level so it plays only
 * on the initial page load. Navigating sections or routes within the SPA never
 * replays it because the flag survives above the router.
 */
export function IntroProvider({ children }) {
  const [done, setDone] = useState(false);
  const finish = useMemo(() => () => setDone(true), []);
  const value = useMemo(() => ({ done, finish }), [done, finish]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}