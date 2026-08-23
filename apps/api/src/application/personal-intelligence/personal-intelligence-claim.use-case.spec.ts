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

class FakePersonalIntelligenceClaimRepository implements PersonalIntelligenceClaimRepository {
  public findClaimForUserCalls: Array<[string, string]> = [];
  public findClaimVersionForUserCalls: Array<[string, string, number]> = [];
  public findActiveClaimVersionsForUserCalls: Array<[string, string | undefined]> = [];
  public createCalls: CreateClaimInput[] = [];
  public appendCorrectionCalls: AppendClaimCorrectionInput[] = [];

  public findClaimForUserResult: PersonalIntelligenceClaim | null = null;
  public findClaimVersionForUserResult: PersonalIntelligenceClaimVersion | null = null;
  public findActiveClaimVersionsForUserResult: PersonalIntelligenceClaimVersion[] = [];
  public createResult: PersonalIntelligenceClaimVersion | undefined;
  public appendCorrectionResult: PersonalIntelligenceClaimVersion | null = null;

  public createRejection: Error | undefined;
  public appendCorrectionRejection: Error | undefined;
  public findClaimForUserRejection: Error | undefined;
  public findClaimVersionForUserRejection: Error | undefined;
  public findActiveClaimVersionsForUserRejection: Error | undefined;

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
