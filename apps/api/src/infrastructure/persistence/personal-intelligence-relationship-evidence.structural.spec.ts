import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Cross-Claim Matching — Relationship Evidence (Implementation Increment
// Contract §19/§20, docs/gates/PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Mirrors the sibling personal-intelligence-relationship.structural.spec.ts
// exactly, scoped to the Relationship Evidence repository - an
// independent abstraction (Decision 5) that must never be repurposed
// from, or merged into, the existing Evidence/EvidenceVersion schema, and
// must remain equally orthogonal to D3, C3, Memory, Personal State, and
// the AI Gateway.

async function readRelationshipEvidenceRepositorySource(): Promise<string> {
  return readFile(
    join(
      process.cwd(),
      "src",
      "infrastructure",
      "persistence",
      "personal-intelligence-relationship-evidence.repository.ts",
    ),
    "utf8",
  );
}

test("the Relationship Evidence repository never references D3 Inference lifecycle state (structural: Invariant #11)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes("personalIntelligenceInferenceLifecycleEvents"), false);
  assert.equal(source.includes("deriveEffectiveStatus"), false);
  assert.equal(source.includes("personalIntelligenceInferences"), false);
});

test("the Relationship Evidence repository never references the C3 confirmation-event table (structural: remains independent from C3)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes("personalIntelligenceClaimConfirmationEvents"), false);
});

test("the Relationship Evidence repository does not import Memory, Personal State, or the AI Gateway (structural: Invariants #13/#14/#15)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes("personal-state"), false);
  assert.equal(source.includes("memory.schema"), false);
  assert.equal(source.includes("memory-record"), false);
  assert.equal(source.includes("infrastructure/ai"), false);
  assert.equal(source.toLowerCase().includes("ai-gateway"), false);
});

test("the Relationship Evidence repository never writes to the existing Evidence/EvidenceVersion schema - only a read-only, nullable reference is permitted (structural: Candidate Signal ≠ Evidence, Decision 5, Contract §12)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes(".insert(evidenceVersions"), false);
  assert.equal(source.includes(".update(evidenceVersions"), false);
  assert.equal(source.includes(".delete(evidenceVersions"), false);
  // The only permitted reference is a read-only EXISTS ownership check -
  // confirmed positively so this negative check does not trivially pass.
  assert.equal(source.includes("evidenceVersions"), true);
});

test("the Relationship Evidence repository never writes to ClaimVersion or Claim tables (structural: Relationship Evidence never mutates a ClaimVersion)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes("personalIntelligenceClaimVersions"), false);
  assert.equal(source.includes("personalIntelligenceClaims"), false);
});

test("no UPDATE statement exists anywhere in the Relationship Evidence repository (structural: full append-only immutability, Contract §13)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes(".update("), false);
  assert.equal(source.includes(".delete("), false);
});

test("the Relationship Evidence repository contains no candidate-generation, similarity, ranking, or scoring code (structural: Invariant #5, Candidate Signal ≠ Evidence)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  for (const forbidden of ["candidateGeneration", "similarity", "matchScore", "ranking", "scoring"]) {
    assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
  }
});

test("create() verifies relationshipId ownership against input.userId, and evidenceVersionId ownership when supplied (structural: proof the code shape exists, Contract §15)", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes("personalIntelligenceRelationships.userId"), true);
  assert.equal(source.includes("input.userId"), true);
  assert.equal(source.includes("input.evidenceVersionId"), true);
});

test("description/provenance/evidenceVersionId are always sourced from the caller's input, never a hardcoded default", async () => {
  const source = await readRelationshipEvidenceRepositorySource();

  assert.equal(source.includes("${input.description}"), true);
  assert.equal(source.includes("${input.provenance}"), true);
  assert.equal(source.includes("${input.evidenceVersionId}"), true);
});
