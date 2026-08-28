export type PersonalIntelligenceClaimType =
  | "identity_attribute"
  | "value"
  | "preference"
  | "capability"
  | "constraint"
  | "environment_context"
  | "strength"
  | "weakness"
  | "behavior_pattern";

export type PersonalIntelligenceValueKind = "text" | "boolean" | "enum";

export type PersonalIntelligenceProvenance = "declared" | "observed";

export type PersonalIntelligenceLifecycle =
  | "active"
  | "superseded"
  | "corrected"
  | "revoked"
  | "disputed";

// PIC Claim Ontology / Taxonomy, Option 2 (Decision Record §8; Implementation
// Increment Contract §3.1, docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-*).
// Distinguishes three previously-conflated cases that a bare, nullable
// evidenceVersionId could not express: evidence actually linked; the claim
// intentionally self-reported and not expected to carry evidence; or
// evidence linkage genuinely pending. Coupled 1:1 with evidenceVersionId
// ("linked" iff evidenceVersionId is non-null) - enforced at the database
// layer, not merely by convention (see the schema's check constraint).
export type PersonalIntelligenceEvidenceLinkageState =
  | "linked"
  | "self_reported_no_evidence_required"
  | "linkage_pending";

// Subject / Attribute / Value (Decision Record §9; Implementation Increment
// Contract §3.2). "Subject" is the ontology's answer to "what person/entity
// is this claim about." No new field is introduced to represent it: under
// the current DECIVEXA product invariant, every PersonalIntelligenceClaim
// is about its owning user with no exception, so `userId` (below, and on
// PersonalIntelligenceClaimVersion) already IS the Subject - Attribute/
// Domain is `claimType`, and Value is `valueText` on the version. This
// mapping is documentation-only, per the Contract: it does not authorize a
// Subject entity, registry, or multi-subject support. If a future
// requirement introduces claims about another person, organization,
// object, relationship, or external subject, that is a separate, later
// Founder decision - not implied or foreclosed here.
export type PersonalIntelligenceClaim = Readonly<{
  id: string;
  userId: string;
  claimType: PersonalIntelligenceClaimType;
  createdAt: Date;
  updatedAt: Date;
}>;

export type PersonalIntelligenceClaimVersion = Readonly<{
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
  // D3 (docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md §F/§N)
  // + D3 Inference -> Claim Promotion Write Path (Implementation Increment
  // Contract, docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-*):
  // set by an explicit, caller-supplied reference to an owned Inference at
  // create()/appendCorrection() time; a provenance/causal-linkage pointer
  // only - never gated by, or itself changing, the Inference's lifecycle
  // status.
  inferenceId: string | null;
  // Additive, PIC Claim Ontology / Taxonomy Option 2 (Implementation
  // Increment Contract §3.1). Set at version-creation time by the write
  // path (never mutated afterward, matching every other field on this
  // immutable row) - "linked" iff evidenceVersionId is non-null.
  evidenceLinkageState: PersonalIntelligenceEvidenceLinkageState;
  // Temporal Validity axis (Implementation Increment Contract,
  // docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md).
  // Answers "when was the underlying fact actually true," distinct from
  // observedAt/acceptedAt/createdAt below (which answer "when did
  // DECIVEXA learn/accept/record this"), from lifecycle (epistemic/
  // workflow state), and from evidence/provenance. `null` means only
  // "not established" - never "always", "forever", "now", or "inherit
  // from the previous version." Always an explicit, caller-supplied
  // value on every create()/appendCorrection() call (Option A - Always
  // Explicit, Founder-approved) - never derived, defaulted, or carried
  // forward from a prior ClaimVersion.
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  observedAt: Date;
  acceptedAt: Date;
  createdAt: Date;
}>;
