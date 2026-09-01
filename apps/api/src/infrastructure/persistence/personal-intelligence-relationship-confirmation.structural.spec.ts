import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Cross-Claim Matching — Matching-Hypothesis Confirmation (Implementation
// Increment Contract §19, docs/gates/
// PERSONAL-INTELLIGENCE-MATCHING-HYPOTHESIS-CONFIRMATION-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Mirrors personal-intelligence-relationship-evidence.structural.spec.ts
// exactly, scoped to the Confirmation repository - an independent
// mechanism (Decision 6) that must never mutate Relationship
// classification, never create Evidence, and must remain equally
// orthogonal to Claim, ClaimVersion, D3, Memory, Personal State, and the
// AI Gateway.

async function readConfirmationRepositorySource(): Promise<string> {
  return readFile(
    join(
      process.cwd(),
      "src",
      "infrastructure",
      "persistence",
      "personal-intelligence-relationship-confirmation.repository.ts",
    ),
    "utf8",
  );
}

test("the Confirmation repository never mutates relationshipType or certainty (structural: Contract §8/FD-2)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes(".update("), false);
  assert.equal(source.includes("relationshipType"), false);
  assert.equal(source.includes("certainty"), false);
});

test("no UPDATE or DELETE statement exists anywhere in the Confirmation repository (structural: full append-only immutability, Contract §13)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes(".update("), false);
  assert.equal(source.includes(".delete("), false);
});

test("the Confirmation repository never references Claim or ClaimVersion write paths (structural: Contract §8/§18)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("personalIntelligenceClaimVersions"), false);
  assert.equal(source.includes("personalIntelligenceClaims"), false);
});

test("the Confirmation repository never references Evidence tables (structural: Confirmation never creates Evidence, Contract §8/§18)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("personalIntelligenceRelationshipEvidence"), false);
  assert.equal(source.includes("evidenceVersions"), false);
});

test("the Confirmation repository never references D3 Inference lifecycle state (structural: Contract §18)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("personalIntelligenceInferenceLifecycleEvents"), false);
  assert.equal(source.includes("deriveEffectiveStatus"), false);
  assert.equal(source.includes("personalIntelligenceInferences"), false);
});

test("the Confirmation repository never references the C3 confirmation-event table (structural: remains independent from C3)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("personalIntelligenceClaimConfirmationEvents"), false);
});

test("the Confirmation repository does not import Memory, Personal State, or the AI Gateway (structural: Contract §17/§18)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("personal-state"), false);
  assert.equal(source.includes("memory.schema"), false);
  assert.equal(source.includes("memory-record"), false);
  assert.equal(source.includes("infrastructure/ai"), false);
  assert.equal(source.toLowerCase().includes("ai-gateway"), false);
  assert.equal(source.includes("AiGatewayService"), false);
  assert.equal(source.includes("AIRuntime"), false);
});

test("the Confirmation repository contains no candidate-generation, similarity, ranking, or matching-score code (structural: Decision-7 territory excluded, Contract §18)", async () => {
  const source = await readConfirmationRepositorySource();

  for (const forbidden of ["candidateGeneration", "similarity", "matchScore", "ranking", "scoring"]) {
    assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
  }
});

test("create() verifies relationshipId ownership against input.userId, and Relationship eligibility, in the same statement (structural: proof the code shape exists, Contract §12)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("personalIntelligenceRelationships.userId"), true);
  assert.equal(source.includes("input.userId"), true);
  assert.equal(source.includes("not_required"), true);
});

test("action and actor are always sourced from the caller's input, never a hardcoded default (structural: Always Explicit)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes("${input.action}"), true);
  assert.equal(source.includes("${input.actor}"), true);
});

test("the Confirmation repository's isUniqueViolation recognizes both error.code and error.cause.code (structural: Contract §14, must not copy C3's defective shape)", async () => {
  const source = await readConfirmationRepositorySource();

  assert.equal(source.includes('"code" in value'), true);
  assert.equal(source.includes('"cause" in error'), true);
});
