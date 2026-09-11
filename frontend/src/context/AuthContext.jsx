/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await authService.getCurrentUser();
      setUser(data?.user || null);
      setStatus('ready');
      return data?.user || null;
    } catch (err) {
      setUser(null);
      setStatus('error');
      setError(err);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setStatus('ready');
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
      setUser,
    }),
    [user, status, error, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
}
