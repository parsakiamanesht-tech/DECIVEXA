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
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
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
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
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
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
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
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
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
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:01:00.000Z"),
      createdAt: new Date("2026-01-01T00:01:00.000Z"),
    };

    assert.equal(version.evidenceVersionId, null);
  });

  await t.test("Temporal Validity: a bounded interval (effectiveFrom before effectiveTo) is representable", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-3",
      claimId: "claim-3",
      version: 1,
      userId: "user-3",
      valueKind: "text",
      valueText: "worked night shifts",
      provenance: "declared",
      confidence: 0.8,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: new Date("2026-03-01T00:00:00.000Z"),
      effectiveTo: new Date("2026-06-01T00:00:00.000Z"),
      situationSetting: null,
      timeOfDay: null,
      observedAt: new Date("2026-07-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-07-01T00:00:00.000Z"),
      createdAt: new Date("2026-07-01T00:00:00.000Z"),
    };

    assert.ok(version.effectiveFrom !== null && version.effectiveTo !== null);
    assert.ok(version.effectiveFrom < version.effectiveTo);
  });

  await t.test("Temporal Validity: effectiveFrom after effectiveTo is representable and not rejected (validation explicitly OPEN, not implemented)", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-4",
      claimId: "claim-4",
      version: 1,
      userId: "user-4",
      valueKind: "text",
      valueText: "some claim",
      provenance: "declared",
      confidence: 0.5,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: new Date("2026-06-01T00:00:00.000Z"),
      effectiveTo: new Date("2026-03-01T00:00:00.000Z"),
      situationSetting: null,
      timeOfDay: null,
      observedAt: new Date("2026-07-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-07-01T00:00:00.000Z"),
      createdAt: new Date("2026-07-01T00:00:00.000Z"),
    };

    // No validation function is implemented or called here - the point
    // of this test is exactly that constructing this combination does
    // not throw and is not rejected, per Contract §11's explicit
    // "NOT AUTHORIZED / OPEN" determination.
    assert.ok(version.effectiveFrom !== null);
  });

  await t.test("Temporal Validity: effectiveFrom equal to effectiveTo is representable", () => {
    const instant = new Date("2026-03-01T12:00:00.000Z");
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-5",
      claimId: "claim-5",
      version: 1,
      userId: "user-5",
      valueKind: "text",
      valueText: "an instantaneous fact",
      provenance: "observed",
      confidence: 0.9,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: instant,
      effectiveTo: instant,
      situationSetting: null,
      timeOfDay: null,
      observedAt: instant,
      acceptedAt: instant,
      createdAt: instant,
    };

    assert.equal(version.effectiveFrom?.getTime(), version.effectiveTo?.getTime());
  });

  await t.test("Temporal Validity: both null is the honest, first-class 'wholly unknown' state, not a degraded default", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-6",
      claimId: "claim-6",
      version: 1,
      userId: "user-6",
      valueKind: "text",
      valueText: "a claim with no known temporal window",
      provenance: "declared",
      confidence: 0.7,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.effectiveFrom, null);
    assert.equal(version.effectiveTo, null);
  });

  await t.test("Temporal Validity: open-ended interval (only effectiveFrom known) is representable and distinguishable from wholly unknown", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-7",
      claimId: "claim-7",
      version: 1,
      userId: "user-7",
      valueKind: "text",
      valueText: "started a new role",
      provenance: "declared",
      confidence: 0.8,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.notEqual(version.effectiveFrom, null);
    assert.equal(version.effectiveTo, null);
  });

  await t.test("Context: both situationSetting and timeOfDay known is representable", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-8",
      claimId: "claim-8",
      version: 1,
      userId: "user-8",
      valueKind: "text",
      valueText: "prefers quiet music",
      provenance: "declared",
      confidence: 0.8,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: "at work",
      timeOfDay: "morning",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.situationSetting, "at work");
    assert.equal(version.timeOfDay, "morning");
  });

  await t.test("Context: both situationSetting and timeOfDay null is the honest, first-class 'not established' state, not a degraded default", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-9",
      claimId: "claim-9",
      version: 1,
      userId: "user-9",
      valueKind: "text",
      valueText: "a claim with no known Context",
      provenance: "declared",
      confidence: 0.7,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.situationSetting, null);
    assert.equal(version.timeOfDay, null);
  });

  await t.test("Context: situationSetting known while timeOfDay is independently unestablished is representable (dimension independence)", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-10",
      claimId: "claim-10",
      version: 1,
      userId: "user-10",
      valueKind: "text",
      valueText: "gets anxious in meetings",
      provenance: "observed",
      confidence: 0.6,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: "in a meeting",
      timeOfDay: null,
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.notEqual(version.situationSetting, null);
    assert.equal(version.timeOfDay, null);
  });

  await t.test("Context: timeOfDay known while situationSetting is independently unestablished is representable (dimension independence)", () => {
    const version: PersonalIntelligenceClaimVersion = {
      id: "claim-version-11",
      claimId: "claim-11",
      version: 1,
      userId: "user-11",
      valueKind: "text",
      valueText: "sleeps poorly",
      provenance: "declared",
      confidence: 0.9,
      lifecycle: "active",
      evidenceVersionId: null,
      inferenceId: null,
      evidenceLinkageState: "linkage_pending",
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: "night",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.situationSetting, null);
    assert.notEqual(version.timeOfDay, null);
  });
});
