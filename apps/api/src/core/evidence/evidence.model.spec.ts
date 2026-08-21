import assert from "node:assert/strict";
import test from "node:test";

import type { Evidence, EvidenceVersion } from "./evidence.model";

test("Evidence domain contract", async (t) => {
  await t.test("keeps logical evidence identity separate from version identity", () => {
    const evidence: Evidence = {
      id: "evidence-1",
      userId: "user-1",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    const version: EvidenceVersion = {
      id: "evidence-version-1",
      evidenceId: evidence.id,
      version: 1,
      userId: evidence.userId,
      provenance: "observed",
      lifecycle: "active",
      observedAt: new Date("2025-12-31T23:00:00.000Z"),
      acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      confidence: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(version.evidenceId, evidence.id);
    assert.notEqual(version.id, evidence.id);
  });

  await t.test("allows unknown confidence without manufacturing a value", () => {
    const version: EvidenceVersion = {
      id: "evidence-version-2",
      evidenceId: "evidence-2",
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
});
