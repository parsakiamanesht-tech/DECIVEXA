import type {
  PersonalIntelligenceRelationship,
  PersonalIntelligenceRelationshipCertainty,
  PersonalIntelligenceRelationshipConfirmationState,
  PersonalIntelligenceRelationshipProvenance,
  PersonalIntelligenceRelationshipType,
} from "./personal-intelligence-relationship.model";

// Every field required (never optional-undefined) — Always Explicit, the
// same convention already established for effectiveFrom/effectiveTo,
// situationSetting/timeOfDay, and inferenceId elsewhere in this module:
// a caller must always make an explicit choice, never rely on a default.
// A Relationship has no "prior version" concept to inherit from at all
// (it is created once and never corrected), so non-inheritance holds
// trivially here — Always Explicit is applied for convention consistency,
// not because inheritance is otherwise possible.
export type CreateRelationshipInput = Readonly<{
  id: string;
  userId: string;
  sourceClaimVersionId: string;
  targetClaimVersionId: string;
  relationshipType: PersonalIntelligenceRelationshipType;
  certainty: PersonalIntelligenceRelationshipCertainty;
  confirmationState: PersonalIntelligenceRelationshipConfirmationState;
  provenance: PersonalIntelligenceRelationshipProvenance;
  now: Date;
}>;

export interface PersonalIntelligenceRelationshipRepository {
  // Atomically verifies that BOTH sourceClaimVersionId and
  // targetClaimVersionId belong to userId, then inserts exactly one
  // immutable Relationship row. Returns null when either ownership fact
  // does not hold (wrong version, wrong user, nonexistent version) —
  // never throws for that case, mirroring the established null-on-
  // mismatch convention used by appendCorrection and
  // recordConfirmationEvent elsewhere in this module. No UPDATE path
  // exists anywhere in this interface or its implementation — every
  // field on the returned record is immutable from this call onward.
  create(input: CreateRelationshipInput): Promise<PersonalIntelligenceRelationship | null>;
  // Read-only lookup by identity, scoped to the requesting user.
  findRelationshipForUser(
    userId: string,
    relationshipId: string,
  ): Promise<PersonalIntelligenceRelationship | null>;
}
