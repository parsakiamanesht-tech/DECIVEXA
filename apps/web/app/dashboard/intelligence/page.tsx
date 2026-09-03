'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RequireAuth } from '../../../lib/require-auth';
import {
  getActiveClaims,
  getClaimHistory,
  getClaimVersionDiff,
  getClaimVersionEvidence,
  getClaimVersionConfirmation,
  recordClaimVersionConfirmation,
  recordClaimCorrection,
  type ActiveClaim,
  type ClaimVersionExplanation,
  type EffectiveConfirmationState,
  type EvidenceInspectionResult,
  type PersonalIntelligenceClaimConfirmationAction,
  type PersonalIntelligenceClaimType,
  type PersonalIntelligenceClaimVersion,
  type PersonalIntelligenceEvidenceLinkageState,
  type PersonalIntelligenceLifecycle,
  type PersonalIntelligenceProvenance,
} from '../../../lib/personal-intelligence';
import type { ApiError } from '../../../lib/api';

// Personal Intelligence Claim Visibility - V1 (Founder Implementation
// Authorization). A read-only view of what DECIVEXA currently records
// about the authenticated user: active claims, their current state,
// provenance, temporal validity, evidence linkage, and version history.
// No write action exists anywhere on this page. Every fact shown is
// traced directly to an existing stored field or an existing
// deterministic capability's output (findActiveClaimVersionsForUser,
// findClaimForUser, detectChange, explainModelChange, inspectEvidence) -
// nothing here interprets, scores, or infers beyond what those already
// return.
//
// Claim-Level Context Visibility (Founder Implementation Authorization):
// situationSetting/timeOfDay were already present in every relevant API
// response before this addition - this is presentation-only, exposing
// two already-flowing fields. Each is shown literally, only when
// non-null, never transformed into a sentence or interpretation. Each
// history entry shows its own version's stored value, never the current
// claim's.
//
// C3 Claim Confirm/Unconfirm (Founder Implementation Authorization):
// "Confirm this is accurate" affirms the Current active version's
// content; "Retract your confirmation" retracts a prior confirmation -
// never worded as "wrong," "dispute," "false," or "incorrect," because
// the domain model does not support that meaning. Every valid action is
// a new append-only event; both buttons remain enabled regardless of
// current state, since a redundant action is still a valid, real event
// (never deduplicated client-side). Appears only when the claim's
// Current version is active, never on historical version entries and
// never on a Current-but-non-active version. The backend is the sole
// source of truth for the Current-AND-active invariant - a 409 means the
// version shown is no longer eligible, and the UI only refreshes and
// informs, never guesses or overrides.
//
// C4 Claim Correction (Founder Implementation Authorization,
// docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-IMPLEMENTATION-
// INCREMENT-CONTRACT.md): "Current ClaimVersion" is the version with the
// highest `version` number for a claim - independent of `lifecycle`
// (Option 2). GET /personal-intelligence/claims now returns exactly that
// version per claim, so `claim` below may be non-active. When it is,
// this page shows "No Active Claim" instead of a normal Active
// ClaimCard, withholds the confirmation control, and still offers a
// direct "Correct this claim" action (Current+active and
// Current+non-active are both correction-eligible - D4). Correction
// creates a new ClaimVersion; the previous one is never mutated and
// remains in History. The client sends only valueText/confidence -
// every other field is resolved and preserved server-side from Current.
// A successful correction refreshes both the claims list and history
// from the backend; a 409 means the shown version is no longer Current,
// and the UI only refreshes and informs, never guesses or overrides.

const CLAIM_TYPE_LABELS: Record<PersonalIntelligenceClaimType, string> = {
  identity_attribute: 'Identity attribute',
  value: 'Value',
  preference: 'Preference',
  capability: 'Capability',
  constraint: 'Constraint',
  environment_context: 'Environment context',
  strength: 'Strength',
  weakness: 'Weakness',
  behavior_pattern: 'Behavior pattern',
};

const LIFECYCLE_LABELS: Record<PersonalIntelligenceLifecycle, string> = {
  active: 'Active',
  superseded: 'Superseded',
  corrected: 'Corrected',
  revoked: 'Revoked',
  disputed: 'Disputed',
};

const PROVENANCE_LABELS: Record<PersonalIntelligenceProvenance, string> = {
  declared: 'You told DECIVEXA this directly',
  observed: 'DECIVEXA observed this',
};

const EVIDENCE_LINKAGE_LABELS: Record<PersonalIntelligenceEvidenceLinkageState, string> = {
  linked: 'Backed by evidence',
  self_reported_no_evidence_required: 'Self-reported (no evidence expected)',
  linkage_pending: 'Evidence linkage pending',
};

const CONFIRMATION_STATE_LABELS: Record<EffectiveConfirmationState, string> = {
  not_confirmed: 'Not confirmed',
  confirmed: 'Confirmed',
  unconfirmed: 'Unconfirmed',
};

const CHANGED_FIELD_LABELS: Record<string, string> = {
  lifecycle: 'Status',
  provenance: 'Source',
  valueKind: 'Value type',
  valueText: 'Value',
  confidence: 'Stored confidence value',
  evidenceVersionId: 'Linked evidence',
  observedAt: 'Observed time',
  acceptedAt: 'Accepted time',
  createdAt: 'Recorded time',
};

function isApiError(cause: unknown): cause is ApiError {
  return typeof cause === 'object' && cause !== null && 'status' in cause && 'message' in cause;
}

function errorMessage(cause: unknown): string {
  return isApiError(cause) ? cause.message : 'Request failed';
}

type ClaimsView =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: ActiveClaim[] };

type HistoryView =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: PersonalIntelligenceClaimVersion[] };

// C4 Claim Correction: both hooks below now expose a `refresh` callback
// alongside their view - a successful correction changes which version
// is Current, so the claims list and history must be re-fetched from
// the backend afterward (never assumed or computed client-side; the
// backend remains the sole source of truth, matching the module-level
// C3/C4 comments above).
function useActiveClaims() {
  const [view, setView] = useState<ClaimsView>({ status: 'loading' });

  const refresh = useCallback(() => {
    setView({ status: 'loading' });
    getActiveClaims()
      .then((data) => setView({ status: 'ready', data }))
      .catch((cause) => setView({ status: 'error', message: errorMessage(cause) }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { view, refresh };
}

function useClaimHistory() {
  const [view, setView] = useState<HistoryView>({ status: 'loading' });

  const refresh = useCallback(() => {
    setView({ status: 'loading' });
    getClaimHistory()
      .then((data) => setView({ status: 'ready', data }))
      .catch((cause) => setView({ status: 'error', message: errorMessage(cause) }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { view, refresh };
}

// Evidence linkage for one claim version, fetched only when the user
// asks ("Check evidence") - never fetched speculatively for every
// version up front.
function EvidenceCheck({ claimId, version }: { claimId: string; version: number }) {
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; result: EvidenceInspectionResult }
  >({ status: 'idle' });

  const check = useCallback(() => {
    setState({ status: 'loading' });
    getClaimVersionEvidence(claimId, version)
      .then((result) => setState({ status: 'ready', result }))
      .catch((cause) => setState({ status: 'error', message: errorMessage(cause) }));
  }, [claimId, version]);

  if (state.status === 'idle') {
    return (
      <button type="button" onClick={check}>
        Check evidence
      </button>
    );
  }

  if (state.status === 'loading') return <span>Checking…</span>;
  if (state.status === 'error') return <span role="alert">{state.message}</span>;

  const { result } = state;
  if (result.status === 'linked') {
    return (
      <span>
        Linked to evidence recorded {result.evidence.observedAt} ({result.evidence.provenance}).
      </span>
    );
  }
  if (result.status === 'not_linked') {
    return <span>Not linked to any evidence.</span>;
  }
  // 'evidence_missing': the claim references evidence that could not be
  // found. Never softened or hidden - reported exactly as the backend
  // distinguishes it.
  return <span role="alert">This claim references evidence that could not be found.</span>;
}

// C3 Claim Confirm/Unconfirm - current claim card only, never rendered
// for historical entries. Fetches effective state automatically (it is
// core current-state information, same category as lifecycle/provenance
// above, not an on-demand lookup like EvidenceCheck/VersionDiff).
function ConfirmationControl({ claimId, version }: { claimId: string; version: number }) {
  const [stateView, setStateView] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; state: EffectiveConfirmationState }
  >({ status: 'loading' });

  const refresh = useCallback(() => {
    setStateView({ status: 'loading' });
    getClaimVersionConfirmation(claimId, version)
      .then((result) => setStateView({ status: 'ready', state: result.state }))
      .catch((cause) => setStateView({ status: 'error', message: errorMessage(cause) }));
  }, [claimId, version]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const [actionState, setActionState] = useState<
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'conflict'; message: string }
    | { status: 'error'; message: string }
  >({ status: 'idle' });

  // Both buttons call this identically regardless of the current
  // effective state - a redundant action is still a real, valid,
  // append-only event and must never be suppressed or disabled here.
  const act = useCallback(
    (action: PersonalIntelligenceClaimConfirmationAction) => {
      setActionState({ status: 'submitting' });
      recordClaimVersionConfirmation(claimId, version, action)
        .then(() => {
          setActionState({ status: 'idle' });
          refresh();
        })
        .catch((cause) => {
          if (isApiError(cause) && cause.status === 409) {
            setActionState({
              status: 'conflict',
              message: 'This claim version is no longer current. Refreshing the current state.',
            });
            refresh();
          } else {
            setActionState({ status: 'error', message: errorMessage(cause) });
          }
        });
    },
    [claimId, version, refresh],
  );

  const submitting = actionState.status === 'submitting';

  return (
    <div>
      {stateView.status === 'loading' ? <p>Loading confirmation state…</p> : null}
      {stateView.status === 'error' ? <p role="alert">{stateView.message}</p> : null}
      {stateView.status === 'ready' ? <p>{CONFIRMATION_STATE_LABELS[stateView.state]}</p> : null}
      <button type="button" onClick={() => act('confirmed')} disabled={submitting}>
        Confirm this is accurate
      </button>{' '}
      <button type="button" onClick={() => act('unconfirmed')} disabled={submitting}>
        Retract your confirmation
      </button>
      {actionState.status === 'conflict' ? <p role="alert">{actionState.message}</p> : null}
      {actionState.status === 'error' ? <p role="alert">{actionState.message}</p> : null}
    </div>
  );
}

// C4 Claim Correction - appears on the Current claim card only (both
// Current+active and Current+non-active), never on historical entries.
// Directly visible as a "Correct this claim" action (not behind History
// or any other expansion); clicking it reveals the minimal input form
// inline, mirroring the EvidenceCheck/VersionDiff click-to-reveal
// pattern already established on this page. Sends only valueText and
// confidence - every other field is resolved and preserved server-side
// from Current (Contract §6). A 409 means the version shown is no
// longer Current; the control never guesses or overrides, only informs
// and triggers a refresh via onCorrected.
function CorrectionControl({
  claimId,
  version,
  currentValueText,
  currentConfidence,
  onCorrected,
}: {
  claimId: string;
  version: number;
  currentValueText: string;
  currentConfidence: number;
  onCorrected: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [valueText, setValueText] = useState(currentValueText);
  const [confidence, setConfidence] = useState(currentConfidence);
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'conflict'; message: string }
    | { status: 'error'; message: string }
  >({ status: 'idle' });

  const submit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      setState({ status: 'submitting' });
      recordClaimCorrection(claimId, version, { valueText, confidence })
        .then(() => {
          setState({ status: 'idle' });
          setOpen(false);
          onCorrected();
        })
        .catch((cause) => {
          if (isApiError(cause) && cause.status === 409) {
            setState({
              status: 'conflict',
              message: 'This claim has changed since you loaded it. Refreshing the current state.',
            });
            onCorrected();
          } else {
            setState({ status: 'error', message: errorMessage(cause) });
          }
        });
    },
    [claimId, version, valueText, confidence, onCorrected],
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        Correct this claim
      </button>
    );
  }

  const submitting = state.status === 'submitting';

  return (
    <form onSubmit={submit}>
      <p>
        Correcting this claim creates a new version. The version shown above is never changed - it stays exactly as
        recorded and remains available in History.
      </p>
      <label>
        New value
        <input
          type="text"
          value={valueText}
          onChange={(event) => setValueText(event.target.value)}
          required
        />
      </label>{' '}
      <label>
        Confidence
        <input
          type="number"
          min={0}
          max={1}
          step="any"
          value={confidence}
          onChange={(event) => setConfidence(Number(event.target.value))}
          required
        />
      </label>{' '}
      <button type="submit" disabled={submitting}>
        Submit correction
      </button>{' '}
      <button type="button" onClick={() => setOpen(false)} disabled={submitting}>
        Cancel
      </button>
      {state.status === 'conflict' ? <p role="alert">{state.message}</p> : null}
      {state.status === 'error' ? <p role="alert">{state.message}</p> : null}
    </form>
  );
}

// Comparison between one history entry and the version immediately
// before it, fetched only on request ("What changed").
function VersionDiff({ claimId, from, to }: { claimId: string; from: number; to: number }) {
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; explanation: ClaimVersionExplanation }
  >({ status: 'idle' });

  const load = useCallback(() => {
    setState({ status: 'loading' });
    getClaimVersionDiff(claimId, from, to)
      .then((explanation) => setState({ status: 'ready', explanation }))
      .catch((cause) => setState({ status: 'error', message: errorMessage(cause) }));
  }, [claimId, from, to]);

  if (state.status === 'idle') {
    return (
      <button type="button" onClick={load}>
        What changed since version {from}?
      </button>
    );
  }
  if (state.status === 'loading') return <span>Comparing…</span>;
  if (state.status === 'error') return <span role="alert">{state.message}</span>;

  if (state.explanation.changedFields.length === 0) {
    return <span>No stored fields differ between version {from} and version {to}.</span>;
  }

  return (
    <ul>
      {state.explanation.changedFields.map((field) => (
        <li key={field}>{CHANGED_FIELD_LABELS[field] ?? field} changed.</li>
      ))}
    </ul>
  );
}

function ClaimHistoryList({ claimId, versions }: { claimId: string; versions: PersonalIntelligenceClaimVersion[] }) {
  const ordered = useMemo(() => [...versions].sort((a, b) => a.version - b.version), [versions]);

  return (
    <ul>
      {ordered.map((entry, index) => (
        <li key={entry.id}>
          Version {entry.version} — {LIFECYCLE_LABELS[entry.lifecycle]} — {PROVENANCE_LABELS[entry.provenance]} — recorded {entry.createdAt}
          {/* Each version's own stored context, never the current claim's -
              entry is this specific historical version's own object. */}
          {entry.situationSetting ? <> — Situation: {entry.situationSetting}</> : null}
          {entry.timeOfDay ? <> — Time of day: {entry.timeOfDay}</> : null}
          <br />
          <EvidenceCheck claimId={claimId} version={entry.version} />
          {index > 0 ? (
            <>
              {' '}
              <VersionDiff claimId={claimId} from={ordered[index - 1].version} to={entry.version} />
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

// C4 Claim Correction: `claim` is now the claim's Current ClaimVersion,
// which may be non-active (Option 2/D3 - Current and active are
// independent). When it is, this renders the "No Active Claim" state
// instead of a normal Active ClaimCard: the Current version's content is
// still shown (never an older active version substituted in its place),
// the confirmation control is withheld, and a direct correction action
// remains available (D4 - Current+non-active is correction-eligible).
function ClaimCard({
  claim,
  history,
  onCorrected,
}: {
  claim: ActiveClaim;
  history: PersonalIntelligenceClaimVersion[];
  onCorrected: () => void;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const claimTypeLabel = claim.claimType ? CLAIM_TYPE_LABELS[claim.claimType] : 'Unlabeled claim';
  const isActive = claim.lifecycle === 'active';

  return (
    <article aria-labelledby={`claim-${claim.claimId}-heading`}>
      <h3 id={`claim-${claim.claimId}-heading`}>{claimTypeLabel}</h3>
      {!isActive ? (
        <p role="status">
          No Active Claim — the current record for this claim is {LIFECYCLE_LABELS[claim.lifecycle].toLowerCase()},
          shown below.
        </p>
      ) : null}
      <dl>
        <dt>Current value</dt>
        <dd>{claim.valueText}</dd>
        <dt>Status</dt>
        <dd>{LIFECYCLE_LABELS[claim.lifecycle]}</dd>
        <dt>Source</dt>
        <dd>{PROVENANCE_LABELS[claim.provenance]}</dd>
        <dt>Evidence linkage</dt>
        <dd>{EVIDENCE_LINKAGE_LABELS[claim.evidenceLinkageState]}</dd>
        {claim.effectiveFrom || claim.effectiveTo ? (
          <>
            <dt>Valid from</dt>
            <dd>{claim.effectiveFrom ?? '—'}</dd>
            <dt>Valid until</dt>
            <dd>{claim.effectiveTo ?? '—'}</dd>
          </>
        ) : null}
        {claim.situationSetting ? (
          <>
            <dt>Situation</dt>
            <dd>{claim.situationSetting}</dd>
          </>
        ) : null}
        {claim.timeOfDay ? (
          <>
            <dt>Time of day</dt>
            <dd>{claim.timeOfDay}</dd>
          </>
        ) : null}
        <dt>Stored confidence value</dt>
        <dd>{claim.confidence}</dd>
      </dl>
      <EvidenceCheck claimId={claim.claimId} version={claim.version} />
      {isActive ? <ConfirmationControl claimId={claim.claimId} version={claim.version} /> : null}
      <CorrectionControl
        claimId={claim.claimId}
        version={claim.version}
        currentValueText={claim.valueText}
        currentConfidence={claim.confidence}
        onCorrected={onCorrected}
      />
      {history.length > 1 ? (
        <>
          <button type="button" onClick={() => setHistoryOpen((open) => !open)}>
            {historyOpen ? 'Hide history' : `View history (${history.length} versions)`}
          </button>
          {historyOpen ? <ClaimHistoryList claimId={claim.claimId} versions={history} /> : null}
        </>
      ) : (
        <p>No prior versions recorded.</p>
      )}
    </article>
  );
}

function PersonalIntelligenceSection({
  claimsView,
  historyView,
  onCorrected,
}: {
  claimsView: ClaimsView;
  historyView: HistoryView;
  onCorrected: () => void;
}) {
  const historyByClaim = useMemo(() => {
    const map = new Map<string, PersonalIntelligenceClaimVersion[]>();
    if (historyView.status !== 'ready') return map;
    for (const entry of historyView.data) {
      const existing = map.get(entry.claimId) ?? [];
      existing.push(entry);
      map.set(entry.claimId, existing);
    }
    return map;
  }, [historyView]);

  if (claimsView.status === 'loading') return <p>Loading…</p>;
  if (claimsView.status === 'error') return <p role="alert">{claimsView.message}</p>;

  if (claimsView.data.length === 0) {
    return <p>DECIVEXA has not recorded any claims about you yet.</p>;
  }

  return (
    <>
      {claimsView.data.map((claim) => (
        <ClaimCard
          key={claim.claimId}
          claim={claim}
          history={historyByClaim.get(claim.claimId) ?? [claim]}
          onCorrected={onCorrected}
        />
      ))}
    </>
  );
}

export default function PersonalIntelligencePage() {
  const { view: claimsView, refresh: refreshClaims } = useActiveClaims();
  const { view: historyView, refresh: refreshHistory } = useClaimHistory();

  // C4 Claim Correction: a successful correction changes which version
  // is Current for its claim - both the claims list and history are
  // re-fetched from the backend afterward, never assumed client-side.
  const onCorrected = useCallback(() => {
    refreshClaims();
    refreshHistory();
  }, [refreshClaims, refreshHistory]);

  return (
    <RequireAuth>
      <main>
        <h1>Personal Intelligence</h1>
        <p>What DECIVEXA currently understands about you, based only on what has actually been recorded.</p>
        <section aria-labelledby="personal-intelligence-heading">
          <h2 id="personal-intelligence-heading">Your Claims</h2>
          <PersonalIntelligenceSection claimsView={claimsView} historyView={historyView} onCorrected={onCorrected} />
        </section>
      </main>
    </RequireAuth>
  );
}
