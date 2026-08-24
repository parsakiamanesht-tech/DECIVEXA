'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { RequireAuth } from '../../lib/require-auth';
import {
  getPersonalState,
  getPersonalStateHistory,
  initializePersonalState,
  updatePersonalState,
  type PersonalState,
  type PersonalStateAvailability,
  type PersonalStateRevision,
  type PersonalStateWriteInput,
} from '../../lib/personal-state';
import type { ApiError } from '../../lib/api';

const AVAILABILITY_OPTIONS: readonly PersonalStateAvailability[] = ['available', 'limited', 'unavailable'];

type StateView =
  | { status: 'loading' }
  | { status: 'not-initialized' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: PersonalState };

type HistoryView =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: PersonalStateRevision[] };

// Increment 007 / ADR-003: local, presentation-only submission state for
// the initialize/update forms. Not persisted, not domain data - purely
// tracks what the form is currently doing.
type MutationState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }
  | { status: 'conflict'; message: string };

function isApiError(cause: unknown): cause is ApiError {
  return typeof cause === 'object' && cause !== null && 'status' in cause && 'message' in cause;
}

function errorMessage(cause: unknown): string {
  return isApiError(cause) ? cause.message : 'Request failed';
}

function usePersonalState() {
  const [view, setView] = useState<StateView>({ status: 'loading' });

  const refresh = useCallback(async () => {
    try {
      const data = await getPersonalState();
      setView({ status: 'ready', data });
    } catch (cause) {
      if (isApiError(cause) && cause.status === 404) {
        setView({ status: 'not-initialized' });
      } else {
        setView({ status: 'error', message: errorMessage(cause) });
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { view, refresh };
}

function usePersonalStateHistory() {
  const [view, setView] = useState<HistoryView>({ status: 'loading' });

  const refresh = useCallback(async () => {
    try {
      const data = await getPersonalStateHistory();
      setView({ status: 'ready', data });
    } catch (cause) {
      setView({ status: 'error', message: errorMessage(cause) });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { view, refresh };
}

function readFormInput(form: HTMLFormElement): PersonalStateWriteInput {
  const data = new FormData(form);
  const timezone = String(data.get('timezone') ?? '').trim();
  const locale = String(data.get('locale') ?? '').trim();
  const availability = String(data.get('availability') ?? '');
  return {
    timezone: timezone.length > 0 ? timezone : null,
    locale: locale.length > 0 ? locale : null,
    availability: availability.length > 0 ? (availability as PersonalStateAvailability) : null,
  };
}

// Increment 007 / ADR-003: creates the authenticated user's own Personal
// State via the existing, unmodified POST /personal-state. Only shown
// when none exists yet (StateView "not-initialized").
function InitializeForm({ onSaved }: { onSaved: () => void }) {
  const [mutation, setMutation] = useState<MutationState>({ status: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMutation({ status: 'submitting' });
    try {
      await initializePersonalState(readFormInput(event.currentTarget));
      setMutation({ status: 'idle' });
      onSaved();
    } catch (cause) {
      setMutation({ status: 'error', message: errorMessage(cause) });
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Initialize Personal State">
      <label htmlFor="init-timezone">Timezone</label>
      <input id="init-timezone" name="timezone" type="text" />
      <label htmlFor="init-locale">Locale</label>
      <input id="init-locale" name="locale" type="text" />
      <label htmlFor="init-availability">Availability</label>
      <select id="init-availability" name="availability" defaultValue="">
        <option value="">—</option>
        {AVAILABILITY_OPTIONS.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {mutation.status === 'error' ? <p role="alert">{mutation.message}</p> : null}
      <button type="submit" disabled={mutation.status === 'submitting'}>
        {mutation.status === 'submitting' ? 'Saving…' : 'Initialize Personal State'}
      </button>
    </form>
  );
}

// Increment 007 / ADR-003: updates the authenticated user's own Personal
// State via the existing, unmodified PATCH /personal-state. The current
// revision is read from the already-displayed state and submitted
// exactly as the backend's optimistic-concurrency contract requires - it
// is never editable by the user. On a 409 conflict, this Contract does
// not invent a resolution: it surfaces the conflict and refreshes the
// authoritative state/history (via onConflict) so the user sees the
// current revision before retrying.
function UpdateForm({
  current,
  onSaved,
  onConflict,
}: {
  current: PersonalState;
  onSaved: () => void;
  onConflict: () => void;
}) {
  const [mutation, setMutation] = useState<MutationState>({ status: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMutation({ status: 'submitting' });
    try {
      await updatePersonalState({ ...readFormInput(event.currentTarget), revision: current.revision });
      setMutation({ status: 'idle' });
      onSaved();
    } catch (cause) {
      if (isApiError(cause) && cause.status === 409) {
        setMutation({ status: 'conflict', message: 'This Personal State changed elsewhere. Refreshing the current values.' });
        onConflict();
      } else {
        setMutation({ status: 'error', message: errorMessage(cause) });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Update Personal State">
      <label htmlFor="update-timezone">Timezone</label>
      <input id="update-timezone" name="timezone" type="text" defaultValue={current.timezone ?? ''} />
      <label htmlFor="update-locale">Locale</label>
      <input id="update-locale" name="locale" type="text" defaultValue={current.locale ?? ''} />
      <label htmlFor="update-availability">Availability</label>
      <select id="update-availability" name="availability" defaultValue={current.availability ?? ''}>
        <option value="">—</option>
        {AVAILABILITY_OPTIONS.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {mutation.status === 'error' ? <p role="alert">{mutation.message}</p> : null}
      {mutation.status === 'conflict' ? <p role="alert">{mutation.message}</p> : null}
      <button type="submit" disabled={mutation.status === 'submitting'}>
        {mutation.status === 'submitting' ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}

function PersonalStateSection({
  view,
  onSaved,
  onConflict,
}: {
  view: StateView;
  onSaved: () => void;
  onConflict: () => void;
}) {
  return (
    <section aria-labelledby="personal-state-heading">
      <h2 id="personal-state-heading">Personal State</h2>
      {view.status === 'loading' ? <p>Loading…</p> : null}
      {view.status === 'error' ? <p role="alert">{view.message}</p> : null}
      {view.status === 'not-initialized' ? (
        <>
          <p>No Personal State recorded yet.</p>
          <InitializeForm onSaved={onSaved} />
        </>
      ) : null}
      {view.status === 'ready' ? (
        <>
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
          <UpdateForm current={view.data} onSaved={onSaved} onConflict={onConflict} />
        </>
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

  const handleSaved = useCallback(() => {
    void personalState.refresh();
    void history.refresh();
  }, [personalState.refresh, history.refresh]);

  const handleConflict = useCallback(() => {
    void personalState.refresh();
    void history.refresh();
  }, [personalState.refresh, history.refresh]);

  return (
    <RequireAuth>
      <main>
        <h1>Dashboard</h1>
        <p>DECIVEXA Web Foundation</p>
        <PersonalStateSection view={personalState.view} onSaved={handleSaved} onConflict={handleConflict} />
        <PersonalStateHistorySection view={history.view} />
      </main>
    </RequireAuth>
  );
}
