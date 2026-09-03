import { apiFetch } from './api';

// Personal Intelligence Claim Visibility - V1 (Founder Implementation
// Authorization). Consumes exactly the five existing, unmodified backend
// read paths authorized for this increment:
//   GET /personal-intelligence/claims
//   GET /personal-intelligence/history
//   GET /personal-intelligence/claims/:claimId/diff
//   GET /personal-intelligence/claims/:claimId/versions/:version/evidence
// These types mirror the existing backend response shapes as-is
// (apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts,
// personal-intelligence-claim-diff.ts, and the InspectEvidenceResult
// union in personal-intelligence-claim.use-case.ts) - nothing is
// invented here. No write function exists in this file.

export type PersonalIntelligenceClaimType =
  | 'identity_attribute'
  | 'value'
  | 'preference'
  | 'capability'
  | 'constraint'
  | 'environment_context'
  | 'strength'
  | 'weakness'
  | 'behavior_pattern';

export type PersonalIntelligenceValueKind = 'text' | 'boolean' | 'enum';
export type PersonalIntelligenceProvenance = 'declared' | 'observed';
export type PersonalIntelligenceLifecycle = 'active' | 'superseded' | 'corrected' | 'revoked' | 'disputed';
export type PersonalIntelligenceEvidenceLinkageState =
  | 'linked'
  | 'self_reported_no_evidence_required'
  | 'linkage_pending';

export type PersonalIntelligenceClaimVersion = {
  id: string;
  claimId: string;
  version: number;
  userId: string;
  valueKind: PersonalIntelligenceValueKind;
  valueText: string;
  provenance: PersonalIntelligenceProvenance;
  confidence: number;
  lifecycle: PersonalIntelligenceLifecycle;
  evidenceVersionId: string | null;
  inferenceId: string | null;
  evidenceLinkageState: PersonalIntelligenceEvidenceLinkageState;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  situationSetting: string | null;
  timeOfDay: string | null;
  observedAt: string;
  acceptedAt: string;
  createdAt: string;
};

// GET /personal-intelligence/claims response shape - the existing
// PersonalIntelligenceClaimVersion fields plus the parent claim's
// existing claimType (findClaimForUser), merged server-side.
export type ActiveClaim = PersonalIntelligenceClaimVersion & {
  claimType: PersonalIntelligenceClaimType | null;
};

export type ClaimVersionExplanation = {
  claimId: string;
  fromVersion: PersonalIntelligenceClaimVersion;
  toVersion: PersonalIntelligenceClaimVersion;
  changedFields: readonly string[];
};

export type EvidenceVersionSummary = {
  id: string;
  evidenceId: string;
  version: number;
  userId: string;
  provenance: 'declared' | 'observed' | 'measured';
  lifecycle: PersonalIntelligenceLifecycle;
  observedAt: string;
  acceptedAt: string;
  confidence: number | null;
  createdAt: string;
};

// Mirrors InspectEvidenceResult exactly, minus "claim_version_not_found"
// - that case is surfaced by the backend as an HTTP 404 (an ApiError),
// not as a 200 body, so it is not part of this success-shape union.
export type EvidenceInspectionResult =
  | { status: 'linked'; evidence: EvidenceVersionSummary }
  | { status: 'not_linked' }
  | { status: 'evidence_missing' };

// C3 Claim Confirm/Unconfirm (Founder Implementation Authorization).
// "confirmed" affirms the referenced version's content is accurate;
// "unconfirmed" retracts a prior confirmation - never represented as
// false/wrong/disputed/corrected/invalid. Mirrors
// PersonalIntelligenceClaimConfirmationAction exactly.
export type PersonalIntelligenceClaimConfirmationAction = 'confirmed' | 'unconfirmed';

export type ClaimConfirmationEvent = {
  id: string;
  claimId: string;
  claimVersionId: string;
  userId: string;
  sequence: number;
  action: PersonalIntelligenceClaimConfirmationAction;
  occurredAt: string;
  createdAt: string;
};

// "not_confirmed" (no event yet) is distinct from "unconfirmed" (an
// explicit retraction is the latest event) - both are honest, valid
// states the UI must be able to show, never collapsed into one.
export type EffectiveConfirmationState = 'not_confirmed' | 'confirmed' | 'unconfirmed';

// GET .../confirmation success shape - minus "claim_version_not_found",
// surfaced as an HTTP 404 (an ApiError), same convention as
// EvidenceInspectionResult above. Mirrors EffectiveConfirmationResult's
// "found" case exactly.
export type EffectiveConfirmation = { status: 'found'; state: EffectiveConfirmationState };

// GET /personal-intelligence/claims - no parameters, no caller-supplied
// user id. The authenticated owner is derived entirely server-side.
export function getActiveClaims(): Promise<ActiveClaim[]> {
  return apiFetch<ActiveClaim[]>('/personal-intelligence/claims');
}

// GET /personal-intelligence/history - every version, for every claim,
// any lifecycle, exactly as the backend's detectChange returns it. This
// file performs no filtering of the result; grouping by claim is left to
// the calling component, presentation-only.
export function getClaimHistory(since?: string): Promise<PersonalIntelligenceClaimVersion[]> {
  const query = since ? `?since=${encodeURIComponent(since)}` : '';
  return apiFetch<PersonalIntelligenceClaimVersion[]>(`/personal-intelligence/history${query}`);
}

// GET /personal-intelligence/claims/:claimId/diff?from=&to=
export function getClaimVersionDiff(claimId: string, from: number, to: number): Promise<ClaimVersionExplanation> {
  return apiFetch<ClaimVersionExplanation>(
    `/personal-intelligence/claims/${encodeURIComponent(claimId)}/diff?from=${from}&to=${to}`,
  );
}

// GET /personal-intelligence/claims/:claimId/versions/:version/evidence
export function getClaimVersionEvidence(claimId: string, version: number): Promise<EvidenceInspectionResult> {
  return apiFetch<EvidenceInspectionResult>(
    `/personal-intelligence/claims/${encodeURIComponent(claimId)}/versions/${version}/evidence`,
  );
}

// GET /personal-intelligence/claims/:claimId/versions/:version/confirmation
export function getClaimVersionConfirmation(claimId: string, version: number): Promise<EffectiveConfirmation> {
  return apiFetch<EffectiveConfirmation>(
    `/personal-intelligence/claims/${encodeURIComponent(claimId)}/versions/${version}/confirmation`,
  );
}

// POST /personal-intelligence/claims/:claimId/versions/:version/confirmation
// Every valid call records a new append-only event - including a
// redundant one (re-confirming an already-confirmed version, or
// re-retracting an already-retracted one). This function never
// deduplicates or suppresses a call; that discipline is the caller's
// responsibility to preserve (never disable the action button based on
// current state).
export function recordClaimVersionConfirmation(
  claimId: string,
  version: number,
  action: PersonalIntelligenceClaimConfirmationAction,
): Promise<ClaimConfirmationEvent> {
  return apiFetch<ClaimConfirmationEvent>(
    `/personal-intelligence/claims/${encodeURIComponent(claimId)}/versions/${version}/confirmation`,
    { method: 'POST', body: JSON.stringify({ action }) },
  );
}
