'use client';

import { ReactNode } from 'react';
import { useAuth } from './auth-context';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
