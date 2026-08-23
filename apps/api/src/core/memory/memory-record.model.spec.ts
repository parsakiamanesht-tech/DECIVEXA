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
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(typeof version.version, "number");
    assert.equal(version.version, 1);
  });
});
