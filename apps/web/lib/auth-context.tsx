"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, clearAccessToken, getAccessToken, setAccessToken } from "./api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthResponse = { userId: string; email: string; accessToken: string };

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const storedToken = getAccessToken();
    if (!storedToken) {
      setStatus("unauthenticated");
      return;
    }

    apiFetch<{ userId: string }>("/auth/me")
      .then(() => {
        setTokenState(storedToken);
        setStatus("authenticated");
      })
      .catch(() => {
        clearAccessToken();
        setTokenState(null);
        setStatus("unauthenticated");
      });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      async login(email, password) {
        const response = await apiFetch<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setAccessToken(response.accessToken);
        setTokenState(response.accessToken);
        setStatus("authenticated");
      },
      async register(email, password) {
        const response = await apiFetch<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setAccessToken(response.accessToken);
        setTokenState(response.accessToken);
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
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
