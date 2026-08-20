'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthState = {
  token: string | null;
  authenticated: boolean;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo(
    () => ({ token, authenticated: Boolean(token), setToken }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
