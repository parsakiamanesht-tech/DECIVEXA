import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Cross-Claim Matching — Relationship (Implementation Increment Contract
// §19/§20, docs/gates/PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Relationship must remain fully orthogonal to D3 Inference, C3
// Confirmation, Memory, Personal State, and the AI Gateway - no code
// path in this increment may reference any of those mechanisms. This is
// a structural property of the code (what the write path touches), not
// something a live database is required to observe - mirroring the
// established structural-test convention already used elsewhere in this
// codebase (e.g. personal-intelligence-claim-temporal-validity.structural.spec.ts,
// personal-intelligence-claim-context.structural.spec.ts).

async function readRelationshipRepositorySource(): Promise<string> {
  return readFile(
    join(
      process.cwd(),
      "src",
      "infrastructure",
      "persistence",
      "personal-intelligence-relationship.repository.ts",
    ),
    "utf8",
  );
}

async function readRelationshipSchemaSource(): Promise<string> {
  return readFile(
    join(process.cwd(), "src", "persistence", "schema", "personal-intelligence.schema.ts"),
    "utf8",
  );
}

test("the Relationship repository never references D3 Inference lifecycle state (structural: Invariant #11)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes("personalIntelligenceInferenceLifecycleEvents"), false);
  assert.equal(source.includes("deriveEffectiveStatus"), false);
  assert.equal(source.includes("personalIntelligenceInferences"), false);
});

test("the Relationship repository never references the C3 confirmation-event table (structural: Relationship remains separate from C3, Decision 3)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes("personalIntelligenceClaimConfirmationEvents"), false);
});

test("the Relationship repository does not import Memory, Personal State, or the AI Gateway (structural: Invariants #13/#14/#15)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes("personal-state"), false);
  assert.equal(source.includes("memory.schema"), false);
  assert.equal(source.includes("memory-record"), false);
  assert.equal(source.includes("infrastructure/ai"), false);
  assert.equal(source.toLowerCase().includes("ai-gateway"), false);
});

test("the Relationship repository never references Evidence tables at all (structural: Relationship never becomes Evidence, Invariant #4)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes("evidenceVersions"), false);
});

test("the Relationship repository never writes to ClaimVersion or Claim tables (structural: Relationship never mutates a ClaimVersion, Invariants #1/#2/#3)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes(".update(personalIntelligenceClaimVersions"), false);
  assert.equal(source.includes(".delete(personalIntelligenceClaimVersions"), false);
  assert.equal(source.includes(".insert(personalIntelligenceClaimVersions"), false);
  // The only permitted reference to personal_intelligence_claim_versions
  // is a read (via the aliased SELECT used for ownership verification) -
  // confirmed positively below, so this negative check does not trivially
  // pass on an empty/unrelated file.
  assert.equal(source.includes("personalIntelligenceClaimVersions"), true);
});

test("no UPDATE statement exists anywhere in the Relationship repository (structural: full immutability, Contract §13)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes(".update("), false);
  assert.equal(source.includes(".delete("), false);
});

test("the Relationship repository contains no candidate-generation, similarity, ranking, or classification code (structural: Invariant #5, Decision 7 territory excluded)", async () => {
  const source = await readRelationshipRepositorySource();

  for (const forbidden of [
    "candidateGeneration",
    "similarity",
    "matchScore",
    "ranking",
    "classify",
    "classification",
  ]) {
    assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
  }
});

test("create() verifies ownership of BOTH sourceClaimVersionId and targetClaimVersionId against input.userId in the same statement (structural: proof the code shape exists, per Contract §15 - runtime atomicity itself is not verifiable without a live database)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes("sourceClaimVersion.userId"), true);
  assert.equal(source.includes("targetClaimVersion.userId"), true);
  assert.equal(source.includes("input.userId"), true);
});

test("relationshipType/certainty/confirmationState/provenance are always sourced from the caller's input, never a hardcoded default (structural: Invariant #6, Always Explicit)", async () => {
  const source = await readRelationshipRepositorySource();

  assert.equal(source.includes("${input.relationshipType}"), true);
  assert.equal(source.includes("${input.certainty}"), true);
  assert.equal(source.includes("${input.confirmationState}"), true);
  assert.equal(source.includes("${input.provenance}"), true);
});

test("the Relationship schema's check() constraint accepts exactly the five formalized Relationship Type values and none other (structural: Founder's exclusion decision, same_claim/unrelated/same_subject/same_attribute never accepted)", async () => {
  const source = await readRelationshipSchemaSource();

  const checkMatch = source.match(
    /personal_intelligence_relationships_relationship_type_check[\s\S]{0,200}?in \('([^)]+)'\)/,
  );
  assert.ok(checkMatch, "expected to find the relationship_type check constraint");

  const allowedValues = checkMatch![1]!.split("','");
  assert.deepEqual(allowedValues, [
    "successive_state",
    "refinement",
    "contradiction",
    "contextual_variation",
    "related_fact",
  ]);
  assert.equal(allowedValues.includes("same_claim"), false);
  assert.equal(allowedValues.includes("unrelated"), false);
  assert.equal(allowedValues.includes("same_subject"), false);
  assert.equal(allowedValues.includes("same_attribute"), false);
});

// Matching-Hypothesis Confirmation was, at the time this test was
// originally written, a future, separately authorized increment
// (Contract §13/§18 of the Relationship + Relationship Evidence
// Contract). It has since been Founder-authorized and implemented (its
// own Implementation Increment Contract, docs/gates/
// PERSONAL-INTELLIGENCE-MATCHING-HYPOTHESIS-CONFIRMATION-IMPLEMENTATION-INCREMENT-CONTRACT.md) —
// this test is updated accordingly to no longer forbid its presence,
// while the still-unbuilt, generic "Relationship state-event" concept
// (distinct from Confirmation Events) remains correctly prohibited.
test("no generic Relationship state-event table is referenced anywhere in the schema file (structural: distinct from Matching-Hypothesis Confirmation, which is now a separately authorized and implemented increment)", async () => {
  const source = await readRelationshipSchemaSource();

  assert.equal(source.includes("relationship_state_events"), false);
  assert.equal(source.includes("personalIntelligenceRelationshipStateEvents"), false);
});
