import type { PersonalIntelligenceRelationshipConfirmationState } from "./personal-intelligence-relationship.model";

// Cross-Claim Matching — Matching-Hypothesis Confirmation (Implementation
// Increment Contract, docs/gates/
// PERSONAL-INTELLIGENCE-MATCHING-HYPOTHESIS-CONFIRMATION-IMPLEMENTATION-INCREMENT-CONTRACT.md
// §9/§10/§11). An independent confirmation mechanism (Decision 6,
// docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md),
// separate from C3 Claim Confirmation and D3 Inference Confirmation. A
// Matching Hypothesis is not a separate entity (FD-1) — it is simply an
// existing Relationship whose provenance is 'ai_hypothesis'. Confirmation
// applies to any eligible Relationship regardless of provenance (FD-5,
// Contract §10.1), and never mutates relationshipType or certainty
// (FD-2, Contract §8).

// Event action vocabulary (Contract §9) — deliberately not a copy of
// C3's confirmed|unconfirmed, since Relationship confirmation is a
// four-value domain (not_required/pending/confirmed/rejected), not a
// boolean toggle. `not_required` is never a valid event action (Contract
// §9) — it exists only as a possible Relationship-creation-time
// confirmationState value, never something a Confirmation Event asserts.
export type PersonalIntelligenceRelationshipConfirmationAction = "pending" | "confirmed" | "rejected";

// Actor model (Contract §10.2, corrected per Final Founder Review
// finding F-4): this Increment authorizes and models only user-initiated
// Confirmation. No "system" or "ai" value exists in this Increment's
// domain — a future system actor would require its own separate,
// explicit Founder-approved Contract/increment, not silent inclusion
// here.
export type PersonalIntelligenceRelationshipConfirmationActor = "user";

// Written exactly once per event, never mutated or deleted (append-only,
// mirroring C3/D3's event-log architecture). References the owning
// Relationship (relationshipId) only — Confirmation concerns the
// Relationship's confirmation status, never any deeper Claim/ClaimVersion
// identity (Contract §8).
export type PersonalIntelligenceRelationshipConfirmationEvent = Readonly<{
  id: string;
  relationshipId: string;
  userId: string;
  // Append-only ordering within one relationshipId, computed the same
  // current-max-plus-one way as every other sequence column in this
  // schema (Contract §11) — not a Postgres identity/serial column.
  sequence: number;
  action: PersonalIntelligenceRelationshipConfirmationAction;
  actor: PersonalIntelligenceRelationshipConfirmationActor;
  occurredAt: Date;
  createdAt: Date;
}>;

// Pure, deterministic derivation (Contract §10.3), directly analogous to
// deriveEffectiveConfirmation()/deriveEffectiveStatus() elsewhere in this
// codebase. Effective confirmation state is never stored as a mutable
// column anywhere — it is always computed from the append-only event
// history for one specific relationshipId. Callers are responsible for
// supplying events already scoped to the Relationship in question; this
// function performs no filtering of its own. Falls back to the
// Relationship's own (immutable, creation-time) confirmationState when
// no Confirmation Event exists yet — once any event exists, the event
// history becomes the sole source of the effective value (Contract
// §10.3).
export function deriveEffectiveConfirmationState(
  events: readonly PersonalIntelligenceRelationshipConfirmationEvent[],
  relationshipCreationTimeConfirmationState: PersonalIntelligenceRelationshipConfirmationState,
): PersonalIntelligenceRelationshipConfirmationState {
  if (events.length === 0) return relationshipCreationTimeConfirmationState;
  let latest = events[0]!;
  for (const event of events) {
    if (event.sequence > latest.sequence) latest = event;
  }
  return latest.action;
}
