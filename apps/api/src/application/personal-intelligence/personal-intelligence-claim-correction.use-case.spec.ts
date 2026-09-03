import test from "node:test";
import assert from "node:assert/strict";
import { PersonalIntelligenceClaimCorrectionUseCase } from "./personal-intelligence-claim-correction.use-case";
import type { PersonalIntelligenceClaimRepository } from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import type {
  PersonalIntelligenceClaimVersion,
  PersonalIntelligenceLifecycle,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";

// C4 Claim Correction (Founder Implementation Authorization, reconciling
// docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-IMPLEMENTATION-
// INCREMENT-CONTRACT.md). Exercises PersonalIntelligenceClaimCorrectionUseCase
// against a fake repository only - the underlying repository methods
// (findClaimVersionForUser, findCurrentClaimVersionForUser,
// appendCorrection) are not re-tested here; that coverage already exists
// (personal-intelligence-claim.repository.runtime.spec.ts,
// .unique-violation.spec.ts).

function claimVersion(overrides: Partial<PersonalIntelligenceClaimVersion> = {}): PersonalIntelligenceClaimVersion {
  return {
    id: "version-row-1",
    claimId: "claim-1",
    version: 1,
    userId: "user-1",
    valueKind: "text",
    valueText: "Europe/Paris",
    provenance: "observed",
    confidence: 0.6,
    lifecycle: "active",
    evidenceVersionId: "evidence-version-1",
    inferenceId: "inference-1",
    evidenceLinkageState: "linked",
    effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
    effectiveTo: new Date("2026-06-01T00:00:00.000Z"),
    situationSetting: "work",
    timeOfDay: "morning",
    observedAt: new Date("2026-01-01T00:00:00.000Z"),
    acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function fakeClaims(overrides: Partial<PersonalIntelligenceClaimRepository> = {}) {
  const calls: Record<string, unknown[]> = {};
  const record = (name: string, args: unknown[]) => {
    calls[name] = calls[name] ?? [];
    calls[name].push(args);
  };

  const fake = {
    findClaimVersionForUser: async (...args: unknown[]) => {
      record("findClaimVersionForUser", args);
      return claimVersion();
    },
    findCurrentClaimVersionForUser: async (...args: unknown[]) => {
      record("findCurrentClaimVersionForUser", args);
      return claimVersion();
    },
    appendCorrection: async (...args: unknown[]) => {
      record("appendCorrection", args);
      return claimVersion({ id: "version-row-2", version: 2, lifecycle: "active" });
    },
    ...overrides,
  };

  return { fake: fake as unknown as PersonalIntelligenceClaimRepository, calls };
}

test("correct() against the Current active version succeeds, creating a new version with lifecycle 'active'", async () => {
  const current = claimVersion({ version: 1, lifecycle: "active" });
  const { fake: claims, calls } = fakeClaims({
    findClaimVersionForUser: async () => current,
    findCurrentClaimVersionForUser: async () => current,
    appendCorrection: async (...args: unknown[]) => {
      calls.appendCorrection = [args];
      return claimVersion({ id: "version-row-2", version: 2, lifecycle: "active", valueText: "Berlin" });
    },
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  const result = await useCase.correct("user-1", "claim-1", 1, { valueText: "Berlin", confidence: 0.9 });

  assert.equal(result.status, "created");
  const input = (calls.appendCorrection[0] as [unknown])[0] as Record<string, unknown>;
  assert.equal(input.lifecycle, "active");
  assert.equal(input.valueText, "Berlin");
  assert.equal(input.confidence, 0.9);
});

// D4: correction is permitted against the Current version regardless of
// lifecycle, and every C4 correction produces "active" uniformly - no
// special-casing among revoked/disputed/corrected/superseded targets
// (Contract §2.5/§2.6, FD-C4-1, and the Founder's explicit reconciliation
// that FD-C4-3 is not reopened as a separate decision).
for (const lifecycle of ["active", "revoked", "disputed", "corrected", "superseded"] as const satisfies readonly PersonalIntelligenceLifecycle[]) {
  test(`correct() against a Current '${lifecycle}' version succeeds and produces lifecycle 'active' uniformly`, async () => {
    const current = claimVersion({ version: 5, lifecycle });
    const { fake: claims, calls } = fakeClaims({
      findClaimVersionForUser: async () => current,
      findCurrentClaimVersionForUser: async () => current,
      appendCorrection: async (...args: unknown[]) => {
        calls.appendCorrection = [args];
        return claimVersion({ id: "version-row-6", version: 6, lifecycle: "active" });
      },
    });
    const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

    const result = await useCase.correct("user-1", "claim-1", 5, { valueText: "new value", confidence: 0.5 });

    assert.equal(result.status, "created");
    const input = (calls.appendCorrection[0] as [unknown])[0] as Record<string, unknown>;
    assert.equal(input.lifecycle, "active");
    assert.equal(input.expectedVersion, 5);
  });
}

// Contract §6.2: every substantive field the client did not supply is
// read from Current and re-supplied explicitly, verbatim - never
// silently inherited by the repository, never defaulted to null.
test("correct() preserves valueKind, provenance, evidence linkage, inference linkage, temporal validity, and context exactly from Current", async () => {
  const current = claimVersion({
    version: 1,
    valueKind: "enum",
    provenance: "observed",
    evidenceVersionId: "evidence-version-9",
    evidenceLinkageState: "linked",
    inferenceId: "inference-9",
    effectiveFrom: new Date("2025-01-01T00:00:00.000Z"),
    effectiveTo: new Date("2025-12-31T00:00:00.000Z"),
    situationSetting: "commute",
    timeOfDay: "evening",
  });
  const { fake: claims, calls } = fakeClaims({
    findClaimVersionForUser: async () => current,
    findCurrentClaimVersionForUser: async () => current,
    appendCorrection: async (...args: unknown[]) => {
      calls.appendCorrection = [args];
      return claimVersion({ id: "version-row-2", version: 2 });
    },
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  await useCase.correct("user-1", "claim-1", 1, { valueText: "updated", confidence: 0.7 });

  const input = (calls.appendCorrection[0] as [unknown])[0] as Record<string, unknown>;
  assert.equal(input.valueKind, "enum");
  assert.equal(input.provenance, "observed");
  assert.equal(input.evidenceVersionId, "evidence-version-9");
  assert.equal(input.evidenceLinkageState, "linked");
  assert.equal(input.inferenceId, "inference-9");
  assert.equal((input.effectiveFrom as Date).toISOString(), "2025-01-01T00:00:00.000Z");
  assert.equal((input.effectiveTo as Date).toISOString(), "2025-12-31T00:00:00.000Z");
  assert.equal(input.situationSetting, "commute");
  assert.equal(input.timeOfDay, "evening");
});

// Contract §2.7: observedAt/acceptedAt/now represent the correction
// write event itself and default to the current write time - never
// preserved/copied from Current.
test("correct() sets observedAt/acceptedAt/now to the correction write event's own time, never Current's stored values", async () => {
  const current = claimVersion({
    version: 1,
    observedAt: new Date("2020-01-01T00:00:00.000Z"),
    acceptedAt: new Date("2020-01-01T00:00:00.000Z"),
  });
  const { fake: claims, calls } = fakeClaims({
    findClaimVersionForUser: async () => current,
    findCurrentClaimVersionForUser: async () => current,
    appendCorrection: async (...args: unknown[]) => {
      calls.appendCorrection = [args];
      return claimVersion({ id: "version-row-2", version: 2 });
    },
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  const before = Date.now();
  await useCase.correct("user-1", "claim-1", 1, { valueText: "updated", confidence: 0.7 });
  const after = Date.now();

  const input = (calls.appendCorrection[0] as [unknown])[0] as Record<string, unknown>;
  const observedAt = input.observedAt as Date;
  const acceptedAt = input.acceptedAt as Date;
  const now = input.now as Date;
  assert.ok(observedAt.getTime() >= before && observedAt.getTime() <= after);
  assert.ok(acceptedAt.getTime() >= before && acceptedAt.getTime() <= after);
  assert.ok(now.getTime() >= before && now.getTime() <= after);
});

// Contract §5: a historical (non-Current) target is rejected - the
// use case must never call appendCorrection with a stale expectedVersion.
test("correct() against a historical (non-Current) version returns 'stale' and never calls appendCorrection", async () => {
  const target = claimVersion({ version: 1, lifecycle: "active" });
  const current = claimVersion({ version: 2, lifecycle: "active" });
  const { fake: claims, calls } = fakeClaims({
    findClaimVersionForUser: async () => target,
    findCurrentClaimVersionForUser: async () => current,
    appendCorrection: async (...args: unknown[]) => {
      calls.appendCorrection = [args];
      throw new Error("must not be called");
    },
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  const result = await useCase.correct("user-1", "claim-1", 1, { valueText: "x", confidence: 0.5 });

  assert.deepEqual(result, { status: "stale" });
  assert.equal(calls.appendCorrection, undefined);
});

// Contract §3/§19: ownership/existence is checked before currentness -
// a nonexistent or unowned claim/version returns claim_version_not_found,
// never calling appendCorrection, and never distinguishing "not owned"
// from "does not exist".
test("correct() against a nonexistent/unowned claim version returns 'claim_version_not_found' and never calls appendCorrection or resolves Current", async () => {
  const { fake: claims, calls } = fakeClaims({
    findClaimVersionForUser: async () => null,
    findCurrentClaimVersionForUser: async (...args: unknown[]) => {
      calls.findCurrentClaimVersionForUser = [args];
      throw new Error("must not be called");
    },
    appendCorrection: async (...args: unknown[]) => {
      calls.appendCorrection = [args];
      throw new Error("must not be called");
    },
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  const result = await useCase.correct("user-1", "claim-1", 99, { valueText: "x", confidence: 0.5 });

  assert.deepEqual(result, { status: "claim_version_not_found" });
  assert.equal(calls.appendCorrection, undefined);
  assert.equal(calls.findCurrentClaimVersionForUser, undefined);
});

// Contract §20: the concurrency race - appendCorrection itself can still
// return null (a concurrent correction won between our currentness check
// and this write) even though both prior checks passed. Reported
// identically to "stale", never thrown.
test("correct() reports a concurrent-race loss (appendCorrection returns null despite passing checks) as 'stale'", async () => {
  const current = claimVersion({ version: 1, lifecycle: "active" });
  const { fake: claims } = fakeClaims({
    findClaimVersionForUser: async () => current,
    findCurrentClaimVersionForUser: async () => current,
    appendCorrection: async () => null,
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  const result = await useCase.correct("user-1", "claim-1", 1, { valueText: "x", confidence: 0.5 });

  assert.deepEqual(result, { status: "stale" });
});

// Every correction must generate a fresh versionId, distinct from the
// prior row's id - mirrors the same expectation already proven for
// Evidence's appendLifecycleVersion.
test("correct() generates a fresh versionId on every call, distinct from the Current row's own id", async () => {
  const current = claimVersion({ id: "version-row-1", version: 1 });
  const { fake: claims, calls } = fakeClaims({
    findClaimVersionForUser: async () => current,
    findCurrentClaimVersionForUser: async () => current,
    appendCorrection: async (...args: unknown[]) => {
      calls.appendCorrection = calls.appendCorrection ?? [];
      calls.appendCorrection.push(args);
      return claimVersion({ id: "version-row-2", version: 2 });
    },
  });
  const useCase = new PersonalIntelligenceClaimCorrectionUseCase(claims);

  await useCase.correct("user-1", "claim-1", 1, { valueText: "x", confidence: 0.5 });

  const input = (calls.appendCorrection[0] as [unknown])[0] as Record<string, unknown>;
  assert.notEqual(input.versionId, current.id);
  assert.equal(typeof input.versionId, "string");
  assert.ok((input.versionId as string).length > 0);
});
