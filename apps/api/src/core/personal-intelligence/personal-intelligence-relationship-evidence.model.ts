import type { PersonalIntelligenceRelationshipProvenance } from "./personal-intelligence-relationship.model";

// Cross-Claim Matching — Relationship Evidence (Implementation Increment
// Contract, docs/gates/PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md
// §5/§12). An independent abstraction (Decision 5,
// docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md):
// `Candidate Signal ≠ Evidence`, and Relationship Evidence is distinct
// from evidence for Claim A and evidence for Claim B. Append-only,
// mirroring the C3/D3 event-log convention already used elsewhere in this
// codebase — evidence is added as classification is refined, never
// overwritten. Each row is immutable once inserted.
export type PersonalIntelligenceRelationshipEvidence = Readonly<{
  id: string;
  relationshipId: string;
  userId: string;
  // Append-only ordering within one relationshipId, computed the same
  // current-max-plus-one way as every other sequence column in this
  // schema (Contract §12) — not a Postgres identity/serial column.
  sequence: number;
  // Free-text description of what this evidence asserts and why it
  // grounds the Relationship's classification. No evidenced fixed
  // vocabulary exists (Contract §12) — mirrors the same reasoning already
  // applied to Claim-level Context's situationSetting/timeOfDay.
  description: string;
  // Optional reference to an existing evidence_versions row, when this
  // Relationship Evidence happens to cite one. Null when this evidence is
  // a system-derived deterministic-check result (e.g. "temporal periods
  // do not overlap") with nothing in evidence_versions to point to
  // (Contract §12). Never a repurposing of the existing Evidence schema —
  // a nullable reference only.
  evidenceVersionId: string | null;
  provenance: PersonalIntelligenceRelationshipProvenance;
  createdAt: Date;
}>;
