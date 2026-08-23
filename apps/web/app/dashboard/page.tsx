'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '../../lib/require-auth';
import {
  getPersonalState,
  getPersonalStateHistory,
  type PersonalState,
  type PersonalStateRevision,
} from '../../lib/personal-state';
import type { ApiError } from '../../lib/api';

type StateView =
  | { status: 'loading' }
  | { status: 'not-initialized' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: PersonalState };

type HistoryView =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: PersonalStateRevision[] };

function isApiError(cause: unknown): cause is ApiError {
  return typeof cause === 'object' && cause !== null && 'status' in cause && 'message' in cause;
}

function errorMessage(cause: unknown): string {
  return isApiError(cause) ? cause.message : 'Request failed';
}

// Increment 006 / ADR-002: read-only presentation only. This hook does
// not re-order, filter, aggregate, or interpret the backend response in
// any way - it only tracks loading/error/ready state for display.
function usePersonalState(): StateView {
  const [view, setView] = useState<StateView>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getPersonalState()
      .then((data) => {
        if (!cancelled) setView({ status: 'ready', data });
      })
      .catch((cause) => {
        if (cancelled) return;
        // 404 means the user has not initialized Personal State yet -
        // this is an expected, non-error condition, not a failure.
        if (isApiError(cause) && cause.status === 404) {
          setView({ status: 'not-initialized' });
        } else {
          setView({ status: 'error', message: errorMessage(cause) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return view;
}

function usePersonalStateHistory(): HistoryView {
  const [view, setView] = useState<HistoryView>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getPersonalStateHistory()
      .then((data) => {
        if (!cancelled) setView({ status: 'ready', data });
      })
      .catch((cause) => {
        if (!cancelled) setView({ status: 'error', message: errorMessage(cause) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return view;
}

function PersonalStateSection({ view }: { view: StateView }) {
  return (
    <section aria-labelledby="personal-state-heading">
      <h2 id="personal-state-heading">Personal State</h2>
      {view.status === 'loading' ? <p>Loading…</p> : null}
      {view.status === 'not-initialized' ? <p>No Personal State recorded yet.</p> : null}
      {view.status === 'error' ? <p role="alert">{view.message}</p> : null}
      {view.status === 'ready' ? (
        <dl>
          <dt>Timezone</dt>
          <dd>{view.data.timezone ?? '—'}</dd>
          <dt>Locale</dt>
          <dd>{view.data.locale ?? '—'}</dd>
          <dt>Availability</dt>
          <dd>{view.data.availability ?? '—'}</dd>
          <dt>Provenance</dt>
          <dd>{view.data.provenance}</dd>
          <dt>Revision</dt>
          <dd>{view.data.revision}</dd>
          <dt>Last updated</dt>
          <dd>{view.data.updatedAt}</dd>
        </dl>
      ) : null}
    </section>
  );
}

function PersonalStateHistorySection({ view }: { view: HistoryView }) {
  return (
    <section aria-labelledby="personal-state-history-heading">
      <h2 id="personal-state-history-heading">Personal State History</h2>
      {view.status === 'loading' ? <p>Loading…</p> : null}
      {view.status === 'error' ? <p role="alert">{view.message}</p> : null}
      {view.status === 'ready' && view.data.length === 0 ? <p>No history recorded yet.</p> : null}
      {view.status === 'ready' && view.data.length > 0 ? (
        <ul>
          {/* Rendered in the exact order the backend already returns -
              no client-side sorting or reordering. */}
          {view.data.map((revision) => (
            <li key={revision.id}>
              Revision {revision.revision} — {revision.provenance} — {revision.createdAt}
              {revision.evidenceVersionId ? ` (evidence: ${revision.evidenceVersionId})` : ''}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function DashboardPage() {
  const personalState = usePersonalState();
  const history = usePersonalStateHistory();

  return (
    <RequireAuth>
      <main>
        <h1>Dashboard</h1>
        <p>DECIVEXA Web Foundation</p>
        <PersonalStateSection view={personalState} />
        <PersonalStateHistorySection view={history} />
      </main>
    </RequireAuth>
  );
}
