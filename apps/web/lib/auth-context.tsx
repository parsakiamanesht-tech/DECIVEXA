"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAccessToken, getAccessToken, setAccessToken } from "./api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const storedToken = getAccessToken();
    setTokenState(storedToken);
    setStatus(storedToken ? "authenticated" : "unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      setToken(nextToken) {
        setAccessToken(nextToken);
        setTokenState(nextToken);
        setStatus("authenticated");
      },
      logout() {
        clearAccessToken();
        setTokenState(null);
        setStatus("unauthenticated");
      },
    }),
    [status, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
