'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '../../lib/auth-context';

export default function LoginPage() {
  const { setToken } = useAuth();
  const [token, setTokenValue] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = token.trim();
    if (value) setToken(value);
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="token">Session token</label>
        <input
          id="token"
          name="token"
          value={token}
          onChange={(event) => setTokenValue(event.target.value)}
          autoComplete="off"
        />
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
