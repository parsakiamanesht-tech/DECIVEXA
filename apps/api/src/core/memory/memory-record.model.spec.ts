import assert from "node:assert/strict";
import test from "node:test";

import type { MemoryRecord, MemoryRecordVersion } from "./memory-record.model";

test("MemoryRecord domain contract", async (t) => {
  await t.test("keeps logical record identity separate from version identity", () => {
    const record: MemoryRecord = {
      id: "memory-1",
      userId: "user-1",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const version: MemoryRecordVersion = {
      id: "memory-version-1",
      recordId: record.id,
      version: 1,
      userId: record.userId,
      provenance: "observed",
      lifecycle: "active",
      observedAt: new Date("2025-12-31T23:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: null,
      valueKind: null,
      value: null,
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.recordId, record.id);
    assert.notEqual(version.id, record.id);
  });

  await t.test("allows unknown confidence without manufacturing a value", () => {
    const version: MemoryRecordVersion = {
      id: "memory-version-2",
      recordId: "memory-2",
      version: 1,
      userId: "user-2",
      provenance: "declared",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:01:00.000Z"),
      confidence: null,
      valueKind: null,
      value: null,
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:01:00.000Z"),
    };

    assert.equal(version.confidence, null);
  });

  await t.test("distinguishes declared provenance from observed provenance", () => {
    const declared: MemoryRecordVersion = {
      id: "memory-version-3",
      recordId: "memory-3",
      version: 1,
      userId: "user-3",
      provenance: "declared",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: 0.9,
      valueKind: null,
      value: null,
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const observed: MemoryRecordVersion = { ...declared, id: "memory-version-4", provenance: "observed" };

    assert.equal(declared.provenance, "declared");
    assert.equal(observed.provenance, "observed");
    assert.notEqual(declared.provenance, observed.provenance);
  });

  await t.test("supports a minimal lifecycle sufficient for correction and deletion", () => {
    const active: MemoryRecordVersion = {
      id: "memory-version-5",
      recordId: "memory-5",
      version: 1,
      userId: "user-5",
      provenance: "observed",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: null,
      valueKind: null,
      value: null,
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const corrected: MemoryRecordVersion = {
      ...active,
      id: "memory-version-6",
      version: 2,
      lifecycle: "corrected",
    };

    const deleted: MemoryRecordVersion = {
      ...active,
      id: "memory-version-7",
      version: 3,
      lifecycle: "deleted",
    };

    assert.equal(active.lifecycle, "active");
    assert.equal(corrected.lifecycle, "corrected");
    assert.equal(deleted.lifecycle, "deleted");
    assert.notEqual(corrected.id, active.id);
    assert.notEqual(deleted.id, active.id);
  });

  await t.test("carries a numeric version distinct from record/version string identity", () => {
    const version: MemoryRecordVersion = {
      id: "memory-version-8",
      recordId: "memory-8",
      version: 1,
      userId: "user-8",
      provenance: "declared",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: 0.5,
      valueKind: null,
      value: null,
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(typeof version.version, "number");
    assert.equal(version.version, 1);
  });

  await t.test("carries an inline content value discriminated by 'content'", () => {
    const version: MemoryRecordVersion = {
      id: "memory-version-9",
      recordId: "memory-9",
      version: 1,
      userId: "user-9",
      provenance: "declared",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: null,
      valueKind: "content",
      value: "the user prefers morning focus sessions",
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.valueKind, "content");
    assert.equal(version.value, "the user prefers morning focus sessions");
  });

  await t.test("carries a reference value discriminated by 'reference', distinct from content", () => {
    const contentVersion: MemoryRecordVersion = {
      id: "memory-version-10",
      recordId: "memory-10",
      version: 1,
      userId: "user-10",
      provenance: "declared",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: null,
      valueKind: "content",
      value: "inline text",
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const referenceVersion: MemoryRecordVersion = {
      ...contentVersion,
      id: "memory-version-11",
      valueKind: "reference",
      value: "some-referenced-identifier",
    };

    assert.equal(referenceVersion.valueKind, "reference");
    assert.notEqual(referenceVersion.valueKind, contentVersion.valueKind);
  });

  await t.test("keeps userConfirmed independent of provenance, lifecycle, and confidence", () => {
    const observedUnconfirmed: MemoryRecordVersion = {
      id: "memory-version-12",
      recordId: "memory-12",
      version: 1,
      userId: "user-12",
      provenance: "observed",
      lifecycle: "active",
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: 0.95,
      valueKind: null,
      value: null,
      userConfirmed: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    // A high-confidence, system-observed version remains unconfirmed by
    // default - confidence and provenance never imply confirmation.
    assert.equal(observedUnconfirmed.provenance, "observed");
    assert.equal(observedUnconfirmed.confidence, 0.95);
    assert.equal(observedUnconfirmed.userConfirmed, false);

    // A declared, low-confidence version can be explicitly confirmed -
    // confirmation is a distinct dimension, not derived from either field.
    const declaredConfirmed: MemoryRecordVersion = {
      ...observedUnconfirmed,
      id: "memory-version-13",
      provenance: "declared",
      confidence: 0.1,
      userConfirmed: true,
    };

    assert.equal(declaredConfirmed.provenance, "declared");
    assert.equal(declaredConfirmed.confidence, 0.1);
    assert.equal(declaredConfirmed.userConfirmed, true);
  });
});
