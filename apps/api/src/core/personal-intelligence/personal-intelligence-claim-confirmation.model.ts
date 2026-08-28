// PIC Claim Ontology / Taxonomy, Option 2 — Claim User Confirmation, C3
// (Implementation Increment Contract §3.3/§3.3.2, docs/gates/
// PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-*). C1 (a mutable
// boolean on the immutable ClaimVersion row) was explicitly rejected by
// Founder decision.
export type PersonalIntelligenceClaimConfirmationAction = "confirmed" | "unconfirmed";

// Written exactly once per event, never mutated or deleted (append-only,
// mirroring D3 §21's lifecycle-event architecture). References the
// specific ClaimVersion that was confirmed/unconfirmed (`claimVersionId`),
// not only the logical Claim identity (`claimId`, retained for
// cross-version audit queries) - see Contract §3.3.1: a confirmation of one
// ClaimVersion must never silently carry forward to a later version
// created by a correction or supersession.
export type PersonalIntelligenceClaimConfirmationEvent = Readonly<{
  id: string;
  claimId: string;
  claimVersionId: string;
  userId: string;
  sequence: number;
  action: PersonalIntelligenceClaimConfirmationAction;
  occurredAt: Date;
  createdAt: Date;
}>;

// Pure, deterministic derivation (Contract §3.3.2), directly analogous to
// deriveEffectiveStatus() in personal-intelligence-inference.model.ts.
// Effective confirmation state is never stored as a mutable column
// anywhere - it is always computed from the append-only event history for
// one specific claimVersionId. Callers are responsible for supplying
// events already scoped to the ClaimVersion in question (exactly as
// deriveEffectiveStatus expects events already scoped to one inferenceId);
// this function performs no filtering of its own. Returns `false` (never
// confirmed by default) when no events exist, matching Memory's existing
// `userConfirmed` default.
export function deriveEffectiveConfirmation(
  events: readonly PersonalIntelligenceClaimConfirmationEvent[],
): boolean {
  if (events.length === 0) return false;
  let latest = events[0]!;
  for (const event of events) {
    if (event.sequence > latest.sequence) latest = event;
  }
  return latest.action === "confirmed";
}
