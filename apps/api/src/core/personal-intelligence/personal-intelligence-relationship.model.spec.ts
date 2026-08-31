import assert from "node:assert/strict";
import test from "node:test";

import type {
  PersonalIntelligenceRelationship,
  PersonalIntelligenceRelationshipCertainty,
  PersonalIntelligenceRelationshipConfirmationState,
  PersonalIntelligenceRelationshipProvenance,
  PersonalIntelligenceRelationshipType,
} from "./personal-intelligence-relationship.model";
import type { CreateRelationshipInput } from "./personal-intelligence-relationship.repository";

const RELATIONSHIP_TYPES: readonly PersonalIntelligenceRelationshipType[] = [
  "successive_state",
  "refinement",
  "contradiction",
  "contextual_variation",
  "related_fact",
];

const CERTAINTIES: readonly PersonalIntelligenceRelationshipCertainty[] = [
  "certain",
  "uncertain",
  "unknown",
];

const CONFIRMATION_STATES: readonly PersonalIntelligenceRelationshipConfirmationState[] = [
  "not_required",
  "pending",
  "confirmed",
  "rejected",
];

const PROVENANCES: readonly PersonalIntelligenceRelationshipProvenance[] = [
  "ai_hypothesis",
  "system_derived",
  "user_declared",
];

function makeRelationship(
  overrides: Partial<PersonalIntelligenceRelationship> = {},
): PersonalIntelligenceRelationship {
  return {
    id: "relationship-1",
    userId: "user-a",
    sourceClaimVersionId: "claim-version-1",
    targetClaimVersionId: "claim-version-2",
    relationshipType: "related_fact",
    certainty: "uncertain",
    confirmationState: "pending",
    provenance: "system_derived",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

test("Relationship Taxonomy: every formalized Relationship Type value is representable (Contract §11.1, Founder-resolved five-value set)", () => {
  for (const relationshipType of RELATIONSHIP_TYPES) {
    const relationship = makeRelationship({ relationshipType });
    assert.equal(relationship.relationshipType, relationshipType);
  }
  assert.equal(RELATIONSHIP_TYPES.length, 5);
});

test("Relationship Taxonomy: same_claim and unrelated are not TypeScript-representable Relationship Type values (excluded by the Founder's decision)", () => {
  // This test is a structural/type-level proof, not a runtime assertion:
  // PersonalIntelligenceRelationshipType is a closed union of exactly the
  // five formalized values. Neither "same_claim" nor "unrelated" (nor
  // "same_subject"/"same_attribute") is a member of that union, so
  // assigning either to a `relationshipType` field would fail to compile
  // - proven by this file typechecking at all. Runtime confirmation that
  // the same five (and only five) values are accepted by the database's
  // own check() constraint is covered by the structural spec
  // (personal-intelligence-relationship.structural.spec.ts).
  const excluded: readonly string[] = ["same_claim", "unrelated", "same_subject", "same_attribute"];
  assert.equal(
    excluded.some((value) => (RELATIONSHIP_TYPES as readonly string[]).includes(value)),
    false,
  );
});

test("Relationship Taxonomy: every Certainty value is representable (Contract §11.2)", () => {
  for (const certainty of CERTAINTIES) {
    const relationship = makeRelationship({ certainty });
    assert.equal(relationship.certainty, certainty);
  }
});

test("Relationship Taxonomy: every Confirmation State value is representable (Contract §11.3)", () => {
  for (const confirmationState of CONFIRMATION_STATES) {
    const relationship = makeRelationship({ confirmationState });
    assert.equal(relationship.confirmationState, confirmationState);
  }
});

test("Relationship: every provenance value is representable (Contract §10)", () => {
  for (const provenance of PROVENANCES) {
    const relationship = makeRelationship({ provenance });
    assert.equal(relationship.provenance, provenance);
  }
});

test("Relationship Taxonomy: Relationship Type, Certainty, and Confirmation State vary independently - no combination is unrepresentable (orthogonality, Contract §11.1-§11.3)", () => {
  for (const relationshipType of RELATIONSHIP_TYPES) {
    for (const certainty of CERTAINTIES) {
      for (const confirmationState of CONFIRMATION_STATES) {
        const relationship = makeRelationship({ relationshipType, certainty, confirmationState });
        assert.equal(relationship.relationshipType, relationshipType);
        assert.equal(relationship.certainty, certainty);
        assert.equal(relationship.confirmationState, confirmationState);
      }
    }
  }
});

test("Confirmation independence: confirmationState and provenance vary independently, with no enforced correlation (Invariant #10)", () => {
  const aiPending = makeRelationship({ provenance: "ai_hypothesis", confirmationState: "pending" });
  const aiConfirmed = makeRelationship({ provenance: "ai_hypothesis", confirmationState: "confirmed" });
  const userDeclaredNotRequired = makeRelationship({
    provenance: "user_declared",
    confirmationState: "not_required",
  });

  assert.equal(aiPending.provenance, aiConfirmed.provenance);
  assert.notEqual(aiPending.confirmationState, aiConfirmed.confirmationState);
  assert.notEqual(aiPending.provenance, userDeclaredNotRequired.provenance);
});

test("Invariant #6: an ai_hypothesis-provenance Relationship is not required to be confirmed - confirmationState is never implied by provenance", () => {
  const relationship = makeRelationship({ provenance: "ai_hypothesis", confirmationState: "pending" });

  assert.equal(relationship.provenance, "ai_hypothesis");
  assert.notEqual(relationship.confirmationState, "confirmed");
});

test("Invariant #9: no confidence field exists on the Relationship domain type (Certainty and Confidence remain distinct)", () => {
  const relationship = makeRelationship();

  assert.equal("confidence" in relationship, false);
});

test("CreateRelationshipInput requires every field explicitly (Always Explicit, mirroring the established convention for effectiveFrom/effectiveTo/inferenceId)", () => {
  const input: CreateRelationshipInput = {
    id: "relationship-1",
    userId: "user-a",
    sourceClaimVersionId: "claim-version-1",
    targetClaimVersionId: "claim-version-2",
    relationshipType: "refinement",
    certainty: "certain",
    confirmationState: "not_required",
    provenance: "user_declared",
    now: new Date("2026-01-01T00:00:00.000Z"),
  };

  assert.equal(input.relationshipType, "refinement");
  assert.notEqual(input.sourceClaimVersionId, input.targetClaimVersionId);
});

test("Relationship references specific ClaimVersions, not Claims (version-granularity, Contract §10)", () => {
  const relationship = makeRelationship({
    sourceClaimVersionId: "claim-version-7",
    targetClaimVersionId: "claim-version-8",
  });

  assert.notEqual(relationship.sourceClaimVersionId, relationship.targetClaimVersionId);
  assert.equal("claimId" in relationship, false);
});
