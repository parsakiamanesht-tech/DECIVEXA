import assert from "node:assert/strict";
import test from "node:test";

import type { PersonalStateAvailability, PersonalStateProvenance } from "./personal-state.model";
import type { PersonalStateRevision } from "./personal-state-revision.model";

test("PersonalStateRevision domain contract", async (t) => {
  await t.test("keeps the revision row's own identity separate from the owning user's identity", () => {
    const revision: PersonalStateRevision = {
      id: "revision-1",
      userId: "user-1",
      revision: 1,
      timezone: "Europe/Paris",
      locale: "fr-FR",
      availability: "available",
      provenance: "declared",
      evidenceVersionId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.notEqual(revision.id, revision.userId);
    assert.equal(revision.userId, "user-1");
  });

  await t.test("allows a missing EvidenceVersion reference without manufacturing a value", () => {
    const revision: PersonalStateRevision = {
      id: "revision-2",
      userId: "user-2",
      revision: 1,
      timezone: null,
      locale: null,
      availability: null,
      provenance: "declared",
      evidenceVersionId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };

    assert.equal(revision.evidenceVersionId, null);
  });

  await t.test("preserves an explicit EvidenceVersion reference when one is supplied", () => {
    const revision: PersonalStateRevision = {
      id: "revision-3",
      userId: "user-3",
      revision: 2,
      timezone: "UTC",
      locale: null,
      availability: "limited",
      provenance: "observed",
      evidenceVersionId: "evidence-version-9",
      createdAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    assert.equal(revision.evidenceVersionId, "evidence-version-9");
  });

  await t.test("accepts every nullable snapshot field as null while still requiring a provenance", () => {
    const revision: PersonalStateRevision = {
      id: "revision-4",
      userId: "user-4",
      revision: 3,
      timezone: null,
      locale: null,
      availability: null,
      provenance: "observed",
      evidenceVersionId: null,
      createdAt: new Date("2026-01-03T00:00:00.000Z"),
    };

    assert.equal(revision.timezone, null);
    assert.equal(revision.locale, null);
    assert.equal(revision.availability, null);
    assert.notEqual(revision.provenance, null);
  });

  await t.test("reuses the exact PersonalState availability and provenance value sets, not a redefined enum", () => {
    const availability: PersonalStateAvailability = "unavailable";
    const provenance: PersonalStateProvenance = "declared";

    const revision: PersonalStateRevision = {
      id: "revision-5",
      userId: "user-5",
      revision: 1,
      timezone: null,
      locale: null,
      availability,
      provenance,
      evidenceVersionId: null,
      createdAt: new Date("2026-01-04T00:00:00.000Z"),
    };

    assert.equal(revision.availability, "unavailable");
    assert.equal(revision.provenance, "declared");
  });
});
