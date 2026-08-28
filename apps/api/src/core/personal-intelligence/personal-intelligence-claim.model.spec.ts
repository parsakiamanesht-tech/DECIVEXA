import assert from "node:assert/strict";
import test from "node:test";

import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimVersion,
} from "./personal-intelligence-claim.model";
import type {
  AppendClaimCorrectionInput,
  CreateClaimInput,
} from "./personal-intelligence-claim.repository";

test("PersonalIntelligenceClaim domain contract", async (t) => {
  await t.test("keeps logical claim identity separate from version identity", () => {
    const claim: PersonalIntelligenceClaim = {
      id: "claim-1",
      userId: "user-1",
      claimType: "preference",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-1",
      claimId: claim.id,
      version: 1,
      userId: claim.userId,
      valueKind: "text",
      valueText: "likes dark mode",
      provenance: "declared",
      confidence: 0.8,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      observedAt: new Date("2025-12-31T23:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.claimId, claim.id);
    assert.notEqual(version.id, claim.id);
  });

  await t.test("requires distinct application-generated identities for initial creation", () => {
    const input: CreateClaimInput = {
      claimId: "claim-1",
      versionId: "claim-version-1",
      userId: "user-1",
      claimType: "preference",
      valueKind: "text",
      valueText: "likes dark mode",
      provenance: "declared",
      confidence: 0.8,
      evidenceVersionId: null,
      evidenceLinkageState: "linkage_pending",
      inferenceId: null,
      observedAt: new Date("2025-12-31T23:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      now: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.notEqual(input.claimId, input.versionId);
  });

  await t.test("requires a fresh version identity for a correction", () => {
    const priorVersion: PersonalIntelligenceClaimVersion = {
      id: "claim-version-1",
      claimId: "claim-1",
      version: 1,
      userId: "user-1",
      valueKind: "text",
      valueText: "likes dark mode",
      provenance: "declared",
      confidence: 0.8,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      observedAt: new Date("2025-12-31T23:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const input: AppendClaimCorrectionInput = {
      userId: "user-1",
      claimId: "claim-1",
      versionId: "claim-version-2",
      expectedVersion: priorVersion.version,
      valueKind: "text",
      valueText: "likes dark mode, confirmed",
      provenance: "observed",
      confidence: 0.9,
      lifecycle: "active",
      evidenceVersionId: null,
      evidenceLinkageState: "linkage_pending",
      inferenceId: null,
      observedAt: new Date("2026-01-02T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-02T00:00:00.000Z"),
      now: new Date("2026-01-02T00:00:00.000Z"),
    };

    assert.equal(input.expectedVersion, 1);
    assert.notEqual(input.versionId, priorVersion.id);
  });

  await t.test("allows a missing EvidenceVersion reference without manufacturing a value", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-2",
      claimId: "claim-2",
      version: 1,
      userId: "user-2",
      valueKind: "boolean",
      valueText: "true",
      provenance: "observed",
      confidence: 0.6,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:01:00.000Z"),
      createdAt: new Date("2026-01-01T00:01:00.000Z"),
    };

    assert.equal(version.evidenceVersionId, null);
  });
});
