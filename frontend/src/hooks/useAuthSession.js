import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

export function useAuthSession({ autoLoad = true } = {}) {
  const auth = useAuthContext();

  useEffect(() => {
    if (!autoLoad) return;
    auth.refreshUser();
  }, [autoLoad, auth]);

  return auth;
}
