import test from "node:test";
import assert from "node:assert/strict";
import { PersonalIntelligenceClaimUseCase } from "./personal-intelligence-claim.use-case";
import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimVersion,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import type {
  AppendClaimCorrectionInput,
  CreateClaimInput,
  PersonalIntelligenceClaimRepository,
} from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import type { EvidenceVersion } from "../../core/evidence/evidence.model";

class FakePersonalIntelligenceClaimRepository implements PersonalIntelligenceClaimRepository {
  public findClaimForUserCalls: Array<[string, string]> = [];
  public findClaimVersionForUserCalls: Array<[string, string, number]> = [];
  public findActiveClaimVersionsForUserCalls: Array<[string, string | undefined]> = [];
  public createCalls: CreateClaimInput[] = [];
  public appendCorrectionCalls: AppendClaimCorrectionInput[] = [];
  public findVersionsForUserCalls: Array<[string, Date | undefined]> = [];
  public findEvidenceVersionForUserCalls: Array<[string, string]> = [];

  public findClaimForUserResult: PersonalIntelligenceClaim | null = null;
  public findClaimVersionForUserResult: PersonalIntelligenceClaimVersion | null = null;
  public findActiveClaimVersionsForUserResult: PersonalIntelligenceClaimVersion[] = [];
  public createResult: PersonalIntelligenceClaimVersion | undefined;
  public appendCorrectionResult: PersonalIntelligenceClaimVersion | null = null;
  public findVersionsForUserResult: PersonalIntelligenceClaimVersion[] = [];
  public findEvidenceVersionForUserResult: EvidenceVersion | null = null;
  // findClaimVersionForUser is called twice by explainModelChange (once per
  // requested version) and once by inspectEvidence - a single shared result
  // field is not expressive enough for those tests, so they queue results
  // here instead; when empty, findClaimVersionForUserResult is used as before.
  public findClaimVersionForUserResultQueue: Array<PersonalIntelligenceClaimVersion | null> = [];

  public createRejection: Error | undefined;
  public appendCorrectionRejection: Error | undefined;
  public findClaimForUserRejection: Error | undefined;
  public findClaimVersionForUserRejection: Error | undefined;
  public findActiveClaimVersionsForUserRejection: Error | undefined;
  public findVersionsForUserRejection: Error | undefined;
  public findEvidenceVersionForUserRejection: Error | undefined;

  async findClaimForUser(userId: string, claimId: string): Promise<PersonalIntelligenceClaim | null> {
    this.findClaimForUserCalls.push([userId, claimId]);
    if (this.findClaimForUserRejection) throw this.findClaimForUserRejection;
    return this.findClaimForUserResult;
  }

  async findClaimVersionForUser(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    this.findClaimVersionForUserCalls.push([userId, claimId, version]);
    if (this.findClaimVersionForUserRejection) throw this.findClaimVersionForUserRejection;
    if (this.findClaimVersionForUserResultQueue.length > 0) {
      return this.findClaimVersionForUserResultQueue.shift() ?? null;
    }
    return this.findClaimVersionForUserResult;
  }

  async findActiveClaimVersionsForUser(
    userId: string,
    claimType?: string,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    this.findActiveClaimVersionsForUserCalls.push([userId, claimType]);
    if (this.findActiveClaimVersionsForUserRejection) throw this.findActiveClaimVersionsForUserRejection;
    return this.findActiveClaimVersionsForUserResult;
  }

  async create(input: CreateClaimInput): Promise<PersonalIntelligenceClaimVersion> {
    this.createCalls.push(input);
    if (this.createRejection) throw this.createRejection;
    if (!this.createResult) throw new Error("createResult not configured");
    return this.createResult;
  }

  async appendCorrection(
    input: AppendClaimCorrectionInput,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    this.appendCorrectionCalls.push(input);
    if (this.appendCorrectionRejection) throw this.appendCorrectionRejection;
    return this.appendCorrectionResult;
  }

  async findVersionsForUser(
    userId: string,
    since?: Date,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    this.findVersionsForUserCalls.push([userId, since]);
    if (this.findVersionsForUserRejection) throw this.findVersionsForUserRejection;
    return this.findVersionsForUserResult;
  }

  async findEvidenceVersionForUser(
    userId: string,
    evidenceVersionId: string,
  ): Promise<EvidenceVersion | null> {
    this.findEvidenceVersionForUserCalls.push([userId, evidenceVersionId]);
    if (this.findEvidenceVersionForUserRejection) throw this.findEvidenceVersionForUserRejection;
    return this.findEvidenceVersionForUserResult;
  }
}

function makeCreateInput(): CreateClaimInput {
  return {
    claimId: "claim-1",
    versionId: "version-1",
    userId: "user-a",
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
    observedAt: new Date(),
    acceptedAt: new Date(),
    now: new Date(),
  };
}

function makeAppendCorrectionInput(): AppendClaimCorrectionInput {
  return {
    userId: "user-a",
    claimId: "claim-1",
    versionId: "version-2",
    expectedVersion: 1,
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
    observedAt: new Date(),
    acceptedAt: new Date(),
    now: new Date(),
  };
}

// Asserts that none of the repository's other operations were touched by a
// call that should only ever reach exactly one of them.
function assertOnlyCalled(
  repository: FakePersonalIntelligenceClaimRepository,
  called: "create" | "appendCorrection" | "findClaimForUser" | "findClaimVersionForUser" | "findActiveClaimVersionsForUser",
): void {
  const counts = {
    create: repository.createCalls.length,
    appendCorrection: repository.appendCorrectionCalls.length,
    findClaimForUser: repository.findClaimForUserCalls.length,
    findClaimVersionForUser: repository.findClaimVersionForUserCalls.length,
    findActiveClaimVersionsForUser: repository.findActiveClaimVersionsForUserCalls.length,
  };
  for (const [operation, count] of Object.entries(counts)) {
    if (operation === called) continue;
    assert.equal(count, 0, `expected ${operation} not to be invoked, but it was called ${count} time(s)`);
  }
}

test("create delegates to repository.create exactly once and returns its result unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const expected: PersonalIntelligenceClaimVersion = {
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
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  repository.createResult = expected;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const input = makeCreateInput();
  const result = await useCase.create(input);

  assert.equal(repository.createCalls.length, 1);
  assert.equal(repository.createCalls[0], input);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "create");
});

test("appendCorrection delegates to repository.appendCorrection exactly once and returns its result unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const expected: PersonalIntelligenceClaimVersion = {
    id: "version-2",
    claimId: "claim-1",
    version: 2,
    userId: "user-a",
    valueKind: "text",
    valueText: "likes dark mode, confirmed",
    provenance: "observed",
    confidence: 0.9,
    lifecycle: "active",
    evidenceVersionId: null,
    inferenceId: null,
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  repository.appendCorrectionResult = expected;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const input = makeAppendCorrectionInput();
  const result = await useCase.appendCorrection(input);

  assert.equal(repository.appendCorrectionCalls.length, 1);
  assert.equal(repository.appendCorrectionCalls[0], input);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "appendCorrection");
});

test("findClaimForUser delegates to repository.findClaimForUser exactly once with the same arguments", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const expected: PersonalIntelligenceClaim = {
    id: "claim-1",
    userId: "user-a",
    claimType: "preference",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  repository.findClaimForUserResult = expected;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.findClaimForUser("user-a", "claim-1");

  assert.deepEqual(repository.findClaimForUserCalls, [["user-a", "claim-1"]]);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "findClaimForUser");
});

test("findClaimVersionForUser delegates to repository.findClaimVersionForUser exactly once with the same arguments", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const expected: PersonalIntelligenceClaimVersion = {
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
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  repository.findClaimVersionForUserResult = expected;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.findClaimVersionForUser("user-a", "claim-1", 1);

  assert.deepEqual(repository.findClaimVersionForUserCalls, [["user-a", "claim-1", 1]]);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "findClaimVersionForUser");
});

test("findActiveClaimVersionsForUser delegates to repository.findActiveClaimVersionsForUser exactly once with the same arguments", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const expected: PersonalIntelligenceClaimVersion[] = [];
  repository.findActiveClaimVersionsForUserResult = expected;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.findActiveClaimVersionsForUser("user-a");

  assert.deepEqual(repository.findActiveClaimVersionsForUserCalls, [["user-a", undefined]]);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "findActiveClaimVersionsForUser");
});

test("a repository rejection propagates unchanged from the use case, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("evidence version ownership mismatch");
  repository.createRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.create(makeCreateInput()), rejection);
});

test("appendCorrection propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("stale expected version");
  repository.appendCorrectionRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.appendCorrection(makeAppendCorrectionInput()), rejection);
});

test("findClaimForUser propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("connection lost");
  repository.findClaimForUserRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.findClaimForUser("user-a", "claim-1"), rejection);
});

test("findClaimVersionForUser propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("connection lost");
  repository.findClaimVersionForUserRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.findClaimVersionForUser("user-a", "claim-1", 1), rejection);
});

test("findActiveClaimVersionsForUser propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("connection lost");
  repository.findActiveClaimVersionsForUserRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.findActiveClaimVersionsForUser("user-a"), rejection);
});

// ---------------------------------------------------------------------
// IMPLEMENTATION_INCREMENT_PIC-D4-01 — detectChange, explainModelChange,
// inspectEvidence (docs/gates/PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md)
// ---------------------------------------------------------------------

function makeClaimVersion(
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
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date("2026-01-01T00:00:00Z"),
    acceptedAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function makeEvidenceVersion(
  overrides: Partial<EvidenceVersion> = {},
): EvidenceVersion {
  return {
    id: "evidence-version-1",
    evidenceId: "evidence-1",
    version: 1,
    userId: "user-a",
    provenance: "observed",
    lifecycle: "active",
    observedAt: new Date("2026-01-01T00:00:00Z"),
    acceptedAt: new Date("2026-01-01T00:00:00Z"),
    confidence: 0.7,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

// --- detectChange ---

test("detectChange returns an explicit empty result when the user has no claim history", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.findVersionsForUserResult = [];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.detectChange("user-a");

  assert.deepEqual(result, []);
  assert.deepEqual(repository.findVersionsForUserCalls, [["user-a", undefined]]);
});

test("detectChange returns the repository's ordered version history unchanged for a single version", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const only = makeClaimVersion();
  repository.findVersionsForUserResult = [only];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.detectChange("user-a");

  assert.deepEqual(result, [only]);
});

test("detectChange preserves ordering and includes multiple versions spanning every lifecycle state", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const versions = [
    makeClaimVersion({ id: "v1", version: 1, lifecycle: "active" }),
    makeClaimVersion({ id: "v2", version: 2, lifecycle: "superseded" }),
    makeClaimVersion({ id: "v3", version: 3, lifecycle: "corrected" }),
    makeClaimVersion({ id: "v4", version: 4, lifecycle: "revoked" }),
    makeClaimVersion({ id: "v5", version: 5, lifecycle: "disputed" }),
  ];
  repository.findVersionsForUserResult = versions;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.detectChange("user-a");

  assert.deepEqual(result, versions);
  assert.deepEqual(
    result.map((v) => v.lifecycle),
    ["active", "superseded", "corrected", "revoked", "disputed"],
  );
});

test("detectChange forwards an explicit `since` reference point to the repository unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const since = new Date("2026-02-01T00:00:00Z");
  repository.findVersionsForUserResult = [];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.detectChange("user-a", since);

  assert.deepEqual(repository.findVersionsForUserCalls, [["user-a", since]]);
});

test("detectChange only ever queries the repository for the requesting user's own userId", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.findVersionsForUserResult = [];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.detectChange("user-a");
  await useCase.detectChange("user-b");

  assert.deepEqual(repository.findVersionsForUserCalls, [
    ["user-a", undefined],
    ["user-b", undefined],
  ]);
});

test("detectChange propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("connection lost");
  repository.findVersionsForUserRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.detectChange("user-a"), rejection);
});

// --- explainModelChange ---

test("explainModelChange returns a grounded diff for two existing versions of the same claim", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const from = makeClaimVersion({ id: "v1", version: 1, valueText: "old value" });
  const to = makeClaimVersion({ id: "v2", version: 2, valueText: "new value" });
  repository.findClaimVersionForUserResultQueue = [from, to];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.explainModelChange("user-a", "claim-1", 1, 2);

  assert.ok(result);
  assert.equal(result.claimId, "claim-1");
  assert.equal(result.fromVersion, from);
  assert.equal(result.toVersion, to);
  assert.deepEqual(result.changedFields, ["valueText"]);
});

test("explainModelChange reports no changed fields between two identical versions", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const version = makeClaimVersion();
  repository.findClaimVersionForUserResultQueue = [version, version];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.explainModelChange("user-a", "claim-1", 1, 1);

  assert.ok(result);
  assert.deepEqual(result.changedFields, []);
});

test("explainModelChange looks up both versions scoped to the same claimId, enforcing same-claim comparison by construction", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.findClaimVersionForUserResultQueue = [makeClaimVersion(), makeClaimVersion({ version: 2 })];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.explainModelChange("user-a", "claim-1", 1, 2);

  assert.deepEqual(repository.findClaimVersionForUserCalls, [
    ["user-a", "claim-1", 1],
    ["user-a", "claim-1", 2],
  ]);
});

test("explainModelChange returns null, not a fabricated explanation, when the fromVersion does not exist for this user", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.findClaimVersionForUserResultQueue = [null, makeClaimVersion({ version: 2 })];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.explainModelChange("user-a", "claim-1", 1, 2);

  assert.equal(result, null);
});

test("explainModelChange returns null when the toVersion does not exist for this user (cross-user isolation)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  // Simulates another user's version: the repository itself enforces
  // userId scoping and would return null for a version it does not own.
  repository.findClaimVersionForUserResultQueue = [makeClaimVersion(), null];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.explainModelChange("user-a", "claim-1", 1, 2);

  assert.equal(result, null);
});

test("explainModelChange propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("connection lost");
  repository.findClaimVersionForUserRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.explainModelChange("user-a", "claim-1", 1, 2), rejection);
});

// --- inspectEvidence ---

test("inspectEvidence returns the linked evidence version when evidenceVersionId resolves", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const claimVersion = makeClaimVersion({ evidenceVersionId: "evidence-version-1" });
  const evidence = makeEvidenceVersion();
  repository.findClaimVersionForUserResultQueue = [claimVersion];
  repository.findEvidenceVersionForUserResult = evidence;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.inspectEvidence("user-a", "claim-1", 1);

  assert.deepEqual(result, { status: "linked", evidence });
  assert.deepEqual(repository.findEvidenceVersionForUserCalls, [["user-a", "evidence-version-1"]]);
});

test("inspectEvidence honestly reports not_linked when evidenceVersionId is null, without fabricating evidence", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const claimVersion = makeClaimVersion({ evidenceVersionId: null });
  repository.findClaimVersionForUserResultQueue = [claimVersion];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.inspectEvidence("user-a", "claim-1", 1);

  assert.deepEqual(result, { status: "not_linked" });
  assert.equal(repository.findEvidenceVersionForUserCalls.length, 0);
});

test("inspectEvidence reports evidence_missing for a dangling reference, without repairing or deleting anything", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const claimVersion = makeClaimVersion({ evidenceVersionId: "evidence-version-missing" });
  repository.findClaimVersionForUserResultQueue = [claimVersion];
  repository.findEvidenceVersionForUserResult = null;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.inspectEvidence("user-a", "claim-1", 1);

  assert.deepEqual(result, { status: "evidence_missing" });
  assert.equal(repository.createCalls.length, 0);
  assert.equal(repository.appendCorrectionCalls.length, 0);
});

test("inspectEvidence reports claim_version_not_found when the claim version does not exist for this user", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.findClaimVersionForUserResultQueue = [null];
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.inspectEvidence("user-a", "claim-1", 1);

  assert.deepEqual(result, { status: "claim_version_not_found" });
  assert.equal(repository.findEvidenceVersionForUserCalls.length, 0);
});

test("inspectEvidence resolves evidence using the same userId as the claim lookup (authorization isolation)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const claimVersion = makeClaimVersion({ userId: "user-a", evidenceVersionId: "evidence-version-1" });
  repository.findClaimVersionForUserResultQueue = [claimVersion];
  repository.findEvidenceVersionForUserResult = makeEvidenceVersion();
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.inspectEvidence("user-a", "claim-1", 1);

  assert.deepEqual(repository.findClaimVersionForUserCalls, [["user-a", "claim-1", 1]]);
  assert.deepEqual(repository.findEvidenceVersionForUserCalls, [["user-a", "evidence-version-1"]]);
});

test("inspectEvidence performs no write operations - purely read-only", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const claimVersion = makeClaimVersion({ evidenceVersionId: "evidence-version-1" });
  repository.findClaimVersionForUserResultQueue = [claimVersion];
  repository.findEvidenceVersionForUserResult = makeEvidenceVersion();
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.inspectEvidence("user-a", "claim-1", 1);

  assert.equal(repository.createCalls.length, 0);
  assert.equal(repository.appendCorrectionCalls.length, 0);
});

test("inspectEvidence propagates a repository rejection unchanged, without being swallowed or replaced", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const rejection = new Error("connection lost");
  repository.findClaimVersionForUserRejection = rejection;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await assert.rejects(() => useCase.inspectEvidence("user-a", "claim-1", 1), rejection);
});

// ---------------------------------------------------------------------
// D3 Inference -> Claim Promotion Write Path
// (docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-IMPLEMENTATION-INCREMENT-CONTRACT.md)
//
// Ownership/concurrency enforcement itself lives in the Drizzle repository
// (untestable without a live PostgreSQL instance, unavailable in this
// environment - see that Contract's §13 Runtime Verification Plan). What
// is testable here, at the use-case delegation layer, is that `inferenceId`
// is passed through to the repository exactly as supplied - never
// defaulted, never inherited from a prior version, never mutating any
// other field on the same call.
// ---------------------------------------------------------------------

test("create passes a caller-supplied inferenceId through to repository.create unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const expected: PersonalIntelligenceClaimVersion = {
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
    inferenceId: "inference-1",
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  repository.createResult = expected;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const input = { ...makeCreateInput(), inferenceId: "inference-1" };
  const result = await useCase.create(input);

  assert.equal(repository.createCalls.length, 1);
  assert.equal(repository.createCalls[0]?.inferenceId, "inference-1");
  assert.equal(result, expected);
});

test("create passes a null inferenceId through to repository.create unchanged (no Inference reference)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = {
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
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create(makeCreateInput());

  assert.equal(repository.createCalls[0]?.inferenceId, null);
});

test("appendCorrection passes a caller-supplied inferenceId through to repository.appendCorrection unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = {
    id: "version-2",
    claimId: "claim-1",
    version: 2,
    userId: "user-a",
    valueKind: "text",
    valueText: "likes dark mode, confirmed",
    provenance: "observed",
    confidence: 0.9,
    lifecycle: "active",
    evidenceVersionId: null,
    inferenceId: "inference-1",
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const input = { ...makeAppendCorrectionInput(), inferenceId: "inference-1" };
  await useCase.appendCorrection(input);

  assert.equal(repository.appendCorrectionCalls[0]?.inferenceId, "inference-1");
});

test("appendCorrection passes a null inferenceId through even when the caller omits it - no implicit carry-forward from any prior version, because the use case never reads prior-version state at all", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = null;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  // makeAppendCorrectionInput() already supplies inferenceId: null - the
  // point of this test is that the use case forwards exactly that,
  // regardless of whatever inferenceId a "prior version" might carry; the
  // use case has no prior-version lookup in its create/appendCorrection
  // path at all, so carry-forward is structurally impossible here, not
  // merely untriggered by this test's fixture.
  await useCase.appendCorrection(makeAppendCorrectionInput());

  assert.equal(repository.appendCorrectionCalls[0]?.inferenceId, null);
});

test("linking a Claim to an Inference via inferenceId leaves every other field of the call unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = undefined as unknown as PersonalIntelligenceClaimVersion;
  repository.createResult = {
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
    inferenceId: "inference-1",
    evidenceLinkageState: "linkage_pending",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
  };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const withoutInference = makeCreateInput();
  const withInference = { ...makeCreateInput(), inferenceId: "inference-1" };
  await useCase.create(withoutInference);
  await useCase.create(withInference);

  const [callWithout, callWith] = repository.createCalls;
  assert.equal(callWithout?.provenance, callWith?.provenance);
  assert.equal(callWithout?.confidence, callWith?.confidence);
  assert.equal(callWithout?.evidenceLinkageState, callWith?.evidenceLinkageState);
  assert.notEqual(callWithout?.inferenceId, callWith?.inferenceId);
});

// ---------------------------------------------------------------------
// Temporal Validity axis
// (docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md,
// Option A - Always Explicit, Founder-approved). Ownership/concurrency
// enforcement itself lives in the Drizzle repository (untestable without
// a live PostgreSQL instance, unavailable in this environment - see the
// Contract's §18 Runtime Verification Plan). What is testable here, at
// the use-case delegation layer, is that effectiveFrom/effectiveTo are
// passed through to the repository exactly as supplied - never
// defaulted, never inherited from a prior version, never mutating any
// other field on the same call.
// ---------------------------------------------------------------------

test("create passes explicit bounded effectiveFrom/effectiveTo values through to repository.create unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const effectiveFrom = new Date("2026-03-01T00:00:00Z");
  const effectiveTo = new Date("2026-06-01T00:00:00Z");
  repository.createResult = { ...makeClaimVersion(), effectiveFrom, effectiveTo };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create({ ...makeCreateInput(), effectiveFrom, effectiveTo });

  assert.equal(repository.createCalls[0]?.effectiveFrom, effectiveFrom);
  assert.equal(repository.createCalls[0]?.effectiveTo, effectiveTo);
});

test("create passes both effectiveFrom and effectiveTo as null through unchanged (wholly unknown temporal validity)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = makeClaimVersion();
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create(makeCreateInput());

  assert.equal(repository.createCalls[0]?.effectiveFrom, null);
  assert.equal(repository.createCalls[0]?.effectiveTo, null);
});

test("create passes only effectiveFrom set through unchanged (open-ended interval)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const effectiveFrom = new Date("2026-03-01T00:00:00Z");
  repository.createResult = { ...makeClaimVersion(), effectiveFrom };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create({ ...makeCreateInput(), effectiveFrom, effectiveTo: null });

  assert.equal(repository.createCalls[0]?.effectiveFrom, effectiveFrom);
  assert.equal(repository.createCalls[0]?.effectiveTo, null);
});

test("create passes only effectiveTo set through unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const effectiveTo = new Date("2026-06-01T00:00:00Z");
  repository.createResult = { ...makeClaimVersion(), effectiveTo };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create({ ...makeCreateInput(), effectiveFrom: null, effectiveTo });

  assert.equal(repository.createCalls[0]?.effectiveFrom, null);
  assert.equal(repository.createCalls[0]?.effectiveTo, effectiveTo);
});

test("appendCorrection passes explicit effectiveFrom/effectiveTo through to repository.appendCorrection unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);
  const effectiveFrom = new Date("2026-03-01T00:00:00Z");
  const effectiveTo = new Date("2026-06-01T00:00:00Z");

  await useCase.appendCorrection({ ...makeAppendCorrectionInput(), effectiveFrom, effectiveTo });

  assert.equal(repository.appendCorrectionCalls[0]?.effectiveFrom, effectiveFrom);
  assert.equal(repository.appendCorrectionCalls[0]?.effectiveTo, effectiveTo);
});

test("appendCorrection with explicit null/null does not inherit the prior version's known effectiveFrom/effectiveTo", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  // A "prior version" the caller happens to know about, with known
  // temporal bounds - the use case never reads this, and this test
  // proves the correction input alone determines the outcome.
  const priorVersion = makeClaimVersion({
    effectiveFrom: new Date("2025-01-01T00:00:00Z"),
    effectiveTo: new Date("2025-06-01T00:00:00Z"),
  });
  repository.findClaimVersionForUserResult = priorVersion;
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.appendCorrection({ ...makeAppendCorrectionInput(), effectiveFrom: null, effectiveTo: null });

  assert.equal(repository.appendCorrectionCalls[0]?.effectiveFrom, null);
  assert.equal(repository.appendCorrectionCalls[0]?.effectiveTo, null);
});

test("appendCorrection proves no inheritance generally - the correction input alone determines the call, independent of any prior-version concept", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  // makeAppendCorrectionInput() already supplies effectiveFrom: null,
  // effectiveTo: null - the point of this test is that the use case's
  // create/appendCorrection methods never look up, read, or reference a
  // "prior version" at all when forwarding the call, so carry-forward is
  // structurally impossible here, not merely untriggered by this test's
  // fixture (mirrors the equivalent inferenceId no-carry-forward test
  // above).
  await useCase.appendCorrection(makeAppendCorrectionInput());

  assert.equal(repository.findClaimVersionForUserCalls.length, 0);
  assert.equal(repository.appendCorrectionCalls[0]?.effectiveFrom, null);
  assert.equal(repository.appendCorrectionCalls[0]?.effectiveTo, null);
});

test("appendCorrection changing only effectiveTo still requires effectiveFrom to be explicitly restated", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);
  const effectiveFrom = new Date("2026-03-01T00:00:00Z");
  const newEffectiveTo = new Date("2026-07-01T00:00:00Z");

  await useCase.appendCorrection({
    ...makeAppendCorrectionInput(),
    effectiveFrom,
    effectiveTo: newEffectiveTo,
  });

  assert.equal(repository.appendCorrectionCalls[0]?.effectiveFrom, effectiveFrom);
  assert.equal(repository.appendCorrectionCalls[0]?.effectiveTo, newEffectiveTo);
});

test("linking a Claim to a temporal validity window leaves every other field of the call unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = makeClaimVersion();
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const withoutTemporal = makeCreateInput();
  const withTemporal = {
    ...makeCreateInput(),
    effectiveFrom: new Date("2026-03-01T00:00:00Z"),
    effectiveTo: new Date("2026-06-01T00:00:00Z"),
  };
  await useCase.create(withoutTemporal);
  await useCase.create(withTemporal);

  const [callWithout, callWith] = repository.createCalls;
  assert.equal(callWithout?.provenance, callWith?.provenance);
  assert.equal(callWithout?.confidence, callWith?.confidence);
  assert.equal(callWithout?.evidenceLinkageState, callWith?.evidenceLinkageState);
  assert.equal(callWithout?.inferenceId, callWith?.inferenceId);
  assert.notEqual(callWithout?.effectiveFrom, callWith?.effectiveFrom);
});

test("a read-back ClaimVersion honestly reports null/null when temporal validity was never established, never a fabricated value", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const version = makeClaimVersion({ effectiveFrom: null, effectiveTo: null });
  repository.findClaimVersionForUserResult = version;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.findClaimVersionForUser("user-a", "claim-1", 1);

  assert.equal(result?.effectiveFrom, null);
  assert.equal(result?.effectiveTo, null);
});

// ---------------------------------------------------------------------
// Claim-Level Context axis
// (docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md,
// §5/§6/§7/§12/§18, Always Explicit, no new sovereignty field,
// Founder-approved). What is testable here, at the use-case delegation
// layer, is that situationSetting/timeOfDay are passed through to the
// repository exactly as supplied - never defaulted, never inherited
// from a prior version, never mutating any other field on the same
// call - mirroring the equivalent Temporal Validity test set above.
// ---------------------------------------------------------------------

test("create passes both situationSetting and timeOfDay through to repository.create unchanged (fully known Context)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = { ...makeClaimVersion(), situationSetting: "at work", timeOfDay: "morning" };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create({ ...makeCreateInput(), situationSetting: "at work", timeOfDay: "morning" });

  assert.equal(repository.createCalls[0]?.situationSetting, "at work");
  assert.equal(repository.createCalls[0]?.timeOfDay, "morning");
});

test("create passes both situationSetting and timeOfDay as null through unchanged (wholly unestablished Context)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = makeClaimVersion();
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create(makeCreateInput());

  assert.equal(repository.createCalls[0]?.situationSetting, null);
  assert.equal(repository.createCalls[0]?.timeOfDay, null);
});

test("create passes only situationSetting set through unchanged (timeOfDay independently unestablished)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = { ...makeClaimVersion(), situationSetting: "at home" };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create({ ...makeCreateInput(), situationSetting: "at home", timeOfDay: null });

  assert.equal(repository.createCalls[0]?.situationSetting, "at home");
  assert.equal(repository.createCalls[0]?.timeOfDay, null);
});

test("create passes only timeOfDay set through unchanged (situationSetting independently unestablished)", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = { ...makeClaimVersion(), timeOfDay: "evening" };
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.create({ ...makeCreateInput(), situationSetting: null, timeOfDay: "evening" });

  assert.equal(repository.createCalls[0]?.situationSetting, null);
  assert.equal(repository.createCalls[0]?.timeOfDay, "evening");
});

test("appendCorrection passes explicit situationSetting/timeOfDay through to repository.appendCorrection unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.appendCorrection({
    ...makeAppendCorrectionInput(),
    situationSetting: "commuting",
    timeOfDay: "morning",
  });

  assert.equal(repository.appendCorrectionCalls[0]?.situationSetting, "commuting");
  assert.equal(repository.appendCorrectionCalls[0]?.timeOfDay, "morning");
});

test("appendCorrection with explicit null/null does not inherit the prior version's known Context", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  // A "prior version" the caller happens to know about, with known
  // Context - the use case never reads this, and this test proves the
  // correction input alone determines the outcome.
  const priorVersion = makeClaimVersion({
    situationSetting: "at work",
    timeOfDay: "afternoon",
  });
  repository.findClaimVersionForUserResult = priorVersion;
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.appendCorrection({
    ...makeAppendCorrectionInput(),
    situationSetting: null,
    timeOfDay: null,
  });

  assert.equal(repository.appendCorrectionCalls[0]?.situationSetting, null);
  assert.equal(repository.appendCorrectionCalls[0]?.timeOfDay, null);
});

test("appendCorrection proves no Context inheritance generally - the correction input alone determines the call, independent of any prior-version concept", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  // makeAppendCorrectionInput() already supplies situationSetting: null,
  // timeOfDay: null - the point of this test is that the use case's
  // create/appendCorrection methods never look up, read, or reference a
  // "prior version" at all when forwarding the call, so carry-forward is
  // structurally impossible here, not merely untriggered by this test's
  // fixture (mirrors the equivalent effectiveFrom/effectiveTo and
  // inferenceId no-carry-forward tests above).
  await useCase.appendCorrection(makeAppendCorrectionInput());

  assert.equal(repository.findClaimVersionForUserCalls.length, 0);
  assert.equal(repository.appendCorrectionCalls[0]?.situationSetting, null);
  assert.equal(repository.appendCorrectionCalls[0]?.timeOfDay, null);
});

test("appendCorrection changing only timeOfDay still requires situationSetting to be explicitly restated", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.appendCorrectionResult = makeClaimVersion({ version: 2 });
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  await useCase.appendCorrection({
    ...makeAppendCorrectionInput(),
    situationSetting: "at work",
    timeOfDay: "evening",
  });

  assert.equal(repository.appendCorrectionCalls[0]?.situationSetting, "at work");
  assert.equal(repository.appendCorrectionCalls[0]?.timeOfDay, "evening");
});

test("linking a Claim to a Context leaves every other field of the call unchanged", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  repository.createResult = makeClaimVersion();
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const withoutContext = makeCreateInput();
  const withContext = {
    ...makeCreateInput(),
    situationSetting: "at work",
    timeOfDay: "morning",
  };
  await useCase.create(withoutContext);
  await useCase.create(withContext);

  const [callWithout, callWith] = repository.createCalls;
  assert.equal(callWithout?.provenance, callWith?.provenance);
  assert.equal(callWithout?.confidence, callWith?.confidence);
  assert.equal(callWithout?.evidenceLinkageState, callWith?.evidenceLinkageState);
  assert.equal(callWithout?.inferenceId, callWith?.inferenceId);
  assert.equal(callWithout?.effectiveFrom, callWith?.effectiveFrom);
  assert.equal(callWithout?.effectiveTo, callWith?.effectiveTo);
  assert.notEqual(callWithout?.situationSetting, callWith?.situationSetting);
});

test("a read-back ClaimVersion honestly reports null/null when Context was never established, never a fabricated value", async () => {
  const repository = new FakePersonalIntelligenceClaimRepository();
  const version = makeClaimVersion({ situationSetting: null, timeOfDay: null });
  repository.findClaimVersionForUserResult = version;
  const useCase = new PersonalIntelligenceClaimUseCase(repository);

  const result = await useCase.findClaimVersionForUser("user-a", "claim-1", 1);

  assert.equal(result?.situationSetting, null);
  assert.equal(result?.timeOfDay, null);
});
