'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RequireAuth } from '../../../lib/require-auth';
import {
  getActiveClaims,
  getClaimHistory,
  getClaimVersionDiff,
  getClaimVersionEvidence,
  type ActiveClaim,
  type ClaimVersionExplanation,
  type EvidenceInspectionResult,
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

function useActiveClaims() {
  const [view, setView] = useState<ClaimsView>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getActiveClaims()
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

function useClaimHistory() {
  const [view, setView] = useState<HistoryView>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getClaimHistory()
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

function ClaimCard({ claim, history }: { claim: ActiveClaim; history: PersonalIntelligenceClaimVersion[] }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const claimTypeLabel = claim.claimType ? CLAIM_TYPE_LABELS[claim.claimType] : 'Unlabeled claim';

  return (
    <article aria-labelledby={`claim-${claim.claimId}-heading`}>
      <h3 id={`claim-${claim.claimId}-heading`}>{claimTypeLabel}</h3>
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
        <dt>Stored confidence value</dt>
        <dd>{claim.confidence}</dd>
      </dl>
      <EvidenceCheck claimId={claim.claimId} version={claim.version} />
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

function PersonalIntelligenceSection({ claimsView, historyView }: { claimsView: ClaimsView; historyView: HistoryView }) {
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
        <ClaimCard key={claim.claimId} claim={claim} history={historyByClaim.get(claim.claimId) ?? [claim]} />
      ))}
    </>
  );
}

export default function PersonalIntelligencePage() {
  const claimsView = useActiveClaims();
  const historyView = useClaimHistory();

  return (
    <RequireAuth>
      <main>
        <h1>Personal Intelligence</h1>
        <p>What DECIVEXA currently understands about you, based only on what has actually been recorded.</p>
        <section aria-labelledby="personal-intelligence-heading">
          <h2 id="personal-intelligence-heading">Your Claims</h2>
          <PersonalIntelligenceSection claimsView={claimsView} historyView={historyView} />
        </section>
      </main>
    </RequireAuth>
  );
}
