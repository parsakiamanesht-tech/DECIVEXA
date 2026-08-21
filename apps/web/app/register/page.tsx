'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      router.replace('/dashboard');
    } catch (cause) {
      setError(cause && typeof cause === 'object' && 'message' in cause ? String(cause.message) : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
      </form>
    </main>
  );
}
