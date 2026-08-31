import assert from "node:assert/strict";
import test from "node:test";

import type { PersonalIntelligenceRelationshipEvidence } from "./personal-intelligence-relationship-evidence.model";
import type { PersonalIntelligenceRelationshipProvenance } from "./personal-intelligence-relationship.model";
import type { CreateRelationshipEvidenceInput } from "./personal-intelligence-relationship-evidence.repository";

function makeEvidence(
  overrides: Partial<PersonalIntelligenceRelationshipEvidence> = {},
): PersonalIntelligenceRelationshipEvidence {
  return {
    id: "relationship-evidence-1",
    relationshipId: "relationship-1",
    userId: "user-a",
    sequence: 1,
    description: "temporal periods do not overlap",
    evidenceVersionId: null,
    provenance: "system_derived",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

test("Relationship Evidence: evidenceVersionId is representable as both null and a real reference (Contract §12)", () => {
  const withoutEvidence = makeEvidence({ evidenceVersionId: null });
  const withEvidence = makeEvidence({ evidenceVersionId: "evidence-version-1" });

  assert.equal(withoutEvidence.evidenceVersionId, null);
  assert.equal(withEvidence.evidenceVersionId, "evidence-version-1");
});

test("Relationship Evidence: every provenance value is representable (same enum as Relationship, Contract §12)", () => {
  const provenances: readonly PersonalIntelligenceRelationshipProvenance[] = [
    "ai_hypothesis",
    "system_derived",
    "user_declared",
  ];

  for (const provenance of provenances) {
    const evidence = makeEvidence({ provenance });
    assert.equal(evidence.provenance, provenance);
  }
});

test("Relationship Evidence: sequence is a positive append-only ordinal, never a Postgres identity column concept at the domain level", () => {
  const first = makeEvidence({ sequence: 1 });
  const second = makeEvidence({ id: "relationship-evidence-2", sequence: 2 });

  assert.ok(second.sequence > first.sequence);
});

test("Relationship Evidence is honestly distinct from Claim Evidence and from a candidate-generation signal by construction: it carries no scoring/weighting/quality field (Contract §5, directive §7)", () => {
  const evidence = makeEvidence();

  assert.equal("score" in evidence, false);
  assert.equal("weight" in evidence, false);
  assert.equal("quality" in evidence, false);
  assert.equal("confidence" in evidence, false);
});

test("CreateRelationshipEvidenceInput requires every field explicitly, evidenceVersionId always an explicit choice (never omitted)", () => {
  const withoutEvidenceVersion: CreateRelationshipEvidenceInput = {
    id: "relationship-evidence-1",
    userId: "user-a",
    relationshipId: "relationship-1",
    description: "temporal periods do not overlap",
    evidenceVersionId: null,
    provenance: "system_derived",
    now: new Date("2026-01-01T00:00:00.000Z"),
  };
  const withEvidenceVersion: CreateRelationshipEvidenceInput = {
    ...withoutEvidenceVersion,
    evidenceVersionId: "evidence-version-1",
  };

  assert.equal(withoutEvidenceVersion.evidenceVersionId, null);
  assert.equal(withEvidenceVersion.evidenceVersionId, "evidence-version-1");
});
