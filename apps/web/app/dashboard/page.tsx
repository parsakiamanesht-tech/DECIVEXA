import { RequireAuth } from '../../lib/require-auth';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main>
        <h1>Dashboard</h1>
        <p>DECIVEXA Web Foundation</p>
      </main>
    </RequireAuth>
  );
}
