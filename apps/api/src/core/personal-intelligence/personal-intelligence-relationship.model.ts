// Cross-Claim Matching — Relationship (Implementation Increment Contract,
// docs/gates/PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md
// §5/§10/§11). A Relationship is a first-class external artifact linking
// two specific PersonalIntelligenceClaimVersions (Decision 3,
// docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md).
// It is NOT a Claim, NOT a merge, and NEVER mutates either referenced
// ClaimVersion. This row is immutable in full: every field is set exactly
// once at creation and never updated (Contract §13) — there is no
// repository method anywhere in this module capable of updating any of
// these columns after insertion.

// Axis 1 — Relationship Type (Contract §11.1, FORMALIZED BY THE CONTRACT,
// not independently Founder-approved by name before it — only the
// three-axis *structure* is Founder-approved, Decision 4). Exactly the
// five values the Contract formalizes, per explicit Founder decision:
// `same_claim` (trivial/structural identity) and `unrelated` (represented
// by the absence of a Relationship row, never a stored value) are
// deliberately excluded — see the Contract §11.1 for the full rationale.
// `same_subject`/`same_attribute` are structural/pipeline predicates,
// never values of this type, and must never appear here either.
export type PersonalIntelligenceRelationshipType =
  | "successive_state"
  | "refinement"
  | "contradiction"
  | "contextual_variation"
  | "related_fact";

// Axis 2 — Certainty (Contract §11.2, FORMALIZED BY THE CONTRACT). Kept
// orthogonal to Relationship Type by construction: nothing in this module
// derives one from the other.
export type PersonalIntelligenceRelationshipCertainty = "certain" | "uncertain" | "unknown";

// Axis 3 — Confirmation State (Contract §11.3, FORMALIZED BY THE
// CONTRACT). Data only in this increment — no workflow, policy, or
// mechanism anywhere in this module decides which value a Relationship
// receives, or transitions a Relationship from one value to another after
// creation. A future, separate Matching-Hypothesis Confirmation increment
// (not this one) will define the mechanism that changes this axis over
// time (Contract §13, §18).
export type PersonalIntelligenceRelationshipConfirmationState =
  | "not_required"
  | "pending"
  | "confirmed"
  | "rejected";

// Who/what established this Relationship record (Contract §10,
// FORMALIZED BY THE CONTRACT — same enum reused by Relationship Evidence,
// see personal-intelligence-relationship-evidence.model.ts). Mirrors the
// Provenance axis discipline already applied elsewhere in this codebase —
// an AI-hypothesized Relationship must remain structurally distinguishable
// from a system-derived or user-declared one.
export type PersonalIntelligenceRelationshipProvenance =
  | "ai_hypothesis"
  | "system_derived"
  | "user_declared";

export type PersonalIntelligenceRelationship = Readonly<{
  id: string;
  userId: string;
  // A version, not a Claim (Contract §10) — mirrors the C3 Claim
  // Confirmation precedent's own version-vs-claim reasoning: a
  // Relationship about one specific ClaimVersion must never silently
  // apply to a later version created by a correction.
  sourceClaimVersionId: string;
  targetClaimVersionId: string;
  relationshipType: PersonalIntelligenceRelationshipType;
  certainty: PersonalIntelligenceRelationshipCertainty;
  confirmationState: PersonalIntelligenceRelationshipConfirmationState;
  provenance: PersonalIntelligenceRelationshipProvenance;
  createdAt: Date;
}>;
