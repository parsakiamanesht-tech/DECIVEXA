import assert from "node:assert/strict";
import test from "node:test";
import { diffClaimVersions } from "./personal-intelligence-claim-diff";
import type { PersonalIntelligenceClaimVersion } from "./personal-intelligence-claim.model";

function makeVersion(
  overrides: Partial<PersonalIntelligenceClaimVersion> = {},
): PersonalIntelligenceClaimVersion {
  return {
    id: "version-1",
    claimId: "claim-1",
    version: 1,
    userId: "user-a",
    valueKind: "text",
    valueText: "likes dark mode",
    provenance: "declared",
    confidence: 0.8,
    lifecycle: "active",
    evidenceVersionId: null,
    inferenceId: null,
    observedAt: new Date("2026-01-01T00:00:00Z"),
    acceptedAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

test("diffClaimVersions reports no changed fields between two identical versions", () => {
  const from = makeVersion();
  const to = makeVersion();

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, []);
  assert.equal(result.claimId, to.claimId);
  assert.equal(result.fromVersion, from);
  assert.equal(result.toVersion, to);
});

test("diffClaimVersions detects a changed valueText and nothing else", () => {
  const from = makeVersion({ valueText: "likes dark mode" });
  const to = makeVersion({ id: "version-2", version: 2, valueText: "likes light mode" });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["valueText"]);
});

test("diffClaimVersions detects a changed lifecycle", () => {
  const from = makeVersion({ lifecycle: "active" });
  const to = makeVersion({ id: "version-2", version: 2, lifecycle: "corrected" });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["lifecycle"]);
});

test("diffClaimVersions detects a changed confidence", () => {
  const from = makeVersion({ confidence: 0.5 });
  const to = makeVersion({ id: "version-2", version: 2, confidence: 0.9 });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["confidence"]);
});

test("diffClaimVersions detects a changed provenance", () => {
  const from = makeVersion({ provenance: "declared" });
  const to = makeVersion({ id: "version-2", version: 2, provenance: "observed" });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["provenance"]);
});

test("diffClaimVersions detects a changed evidenceVersionId, including null to non-null", () => {
  const from = makeVersion({ evidenceVersionId: null });
  const to = makeVersion({ id: "version-2", version: 2, evidenceVersionId: "evidence-version-1" });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["evidenceVersionId"]);
});

test("diffClaimVersions detects temporal field changes by value, not by object identity", () => {
  const from = makeVersion({
    observedAt: new Date("2026-01-01T00:00:00Z"),
    acceptedAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
  });
  const to = makeVersion({
    id: "version-2",
    version: 2,
    observedAt: new Date("2026-01-02T00:00:00Z"),
    acceptedAt: new Date("2026-01-02T00:00:00Z"),
    createdAt: new Date("2026-01-02T00:00:00Z"),
  });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["observedAt", "acceptedAt", "createdAt"]);
});

test("diffClaimVersions treats two Date instances holding the same instant as unchanged", () => {
  const from = makeVersion({ observedAt: new Date("2026-01-01T00:00:00Z") });
  const to = makeVersion({ observedAt: new Date("2026-01-01T00:00:00Z") });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, []);
});

test("diffClaimVersions never reports a field that was not actually different (no fabrication)", () => {
  const from = makeVersion({ valueText: "same value", confidence: 0.7 });
  const to = makeVersion({ id: "version-2", version: 2, valueText: "same value", confidence: 0.7, lifecycle: "corrected" });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["lifecycle"]);
  assert.equal(result.changedFields.includes("valueText"), false);
  assert.equal(result.changedFields.includes("confidence"), false);
});

test("diffClaimVersions detects multiple simultaneous field changes", () => {
  const from = makeVersion({ lifecycle: "active", valueText: "A", confidence: 0.5 });
  const to = makeVersion({
    id: "version-2",
    version: 2,
    lifecycle: "superseded",
    valueText: "B",
    confidence: 0.6,
  });

  const result = diffClaimVersions(from, to);

  assert.deepEqual(result.changedFields, ["lifecycle", "valueText", "confidence"]);
});
