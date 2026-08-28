import test from "node:test";
import assert from "node:assert/strict";
import { PersonalIntelligenceInferenceUseCase } from "./personal-intelligence-inference.use-case";
import type {
  PersonalIntelligenceInference,
  PersonalIntelligenceInferenceLifecycleEvent,
} from "../../core/personal-intelligence/personal-intelligence-inference.model";
import type {
  CreateInferenceInput,
  PersonalIntelligenceInferenceRepository,
  TransitionInferenceLifecycleInput,
} from "../../core/personal-intelligence/personal-intelligence-inference.repository";

class FakePersonalIntelligenceInferenceRepository implements PersonalIntelligenceInferenceRepository {
  public createCalls: CreateInferenceInput[] = [];
  public findInferenceForUserCalls: Array<[string, string]> = [];
  public findEvidenceReferencesForUserCalls: Array<[string, string]> = [];
  public findClaimContextReferencesForUserCalls: Array<[string, string]> = [];
  public findLifecycleHistoryForUserCalls: Array<[string, string]> = [];
  public transitionLifecycleCalls: TransitionInferenceLifecycleInput[] = [];

  public createResult: PersonalIntelligenceInference | undefined;
  public findInferenceForUserResult: PersonalIntelligenceInference | null = null;
  public findEvidenceReferencesForUserResult: readonly string[] = [];
  public findClaimContextReferencesForUserResult: readonly string[] = [];
  public findLifecycleHistoryForUserResult: PersonalIntelligenceInferenceLifecycleEvent[] = [];
  public transitionLifecycleResult: PersonalIntelligenceInferenceLifecycleEvent | null = null;

  public createRejection: Error | undefined;
  public findInferenceForUserRejection: Error | undefined;
  public findEvidenceReferencesForUserRejection: Error | undefined;
  public findClaimContextReferencesForUserRejection: Error | undefined;
  public findLifecycleHistoryForUserRejection: Error | undefined;
  public transitionLifecycleRejection: Error | undefined;

  async create(input: CreateInferenceInput): Promise<PersonalIntelligenceInference> {
    this.createCalls.push(input);
    if (this.createRejection) throw this.createRejection;
    if (!this.createResult) throw new Error("createResult not configured");
    return this.createResult;
  }

  async findInferenceForUser(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInference | null> {
    this.findInferenceForUserCalls.push([userId, inferenceId]);
    if (this.findInferenceForUserRejection) throw this.findInferenceForUserRejection;
    return this.findInferenceForUserResult;
  }

  async findEvidenceReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]> {
    this.findEvidenceReferencesForUserCalls.push([userId, inferenceId]);
    if (this.findEvidenceReferencesForUserRejection) throw this.findEvidenceReferencesForUserRejection;
    return this.findEvidenceReferencesForUserResult;
  }

  async findClaimContextReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]> {
    this.findClaimContextReferencesForUserCalls.push([userId, inferenceId]);
    if (this.findClaimContextReferencesForUserRejection) throw this.findClaimContextReferencesForUserRejection;
    return this.findClaimContextReferencesForUserResult;
  }

  async findLifecycleHistoryForUser(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent[]> {
    this.findLifecycleHistoryForUserCalls.push([userId, inferenceId]);
    if (this.findLifecycleHistoryForUserRejection) throw this.findLifecycleHistoryForUserRejection;
    return this.findLifecycleHistoryForUserResult;
  }

  async transitionLifecycle(
    input: TransitionInferenceLifecycleInput,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent | null> {
    this.transitionLifecycleCalls.push(input);
    if (this.transitionLifecycleRejection) throw this.transitionLifecycleRejection;
    return this.transitionLifecycleResult;
  }
}

function makeInference(overrides: Partial<PersonalIntelligenceInference> = {}): PersonalIntelligenceInference {
  return {
    id: "inference-1",
    userId: "user-a",
    claimType: "preference",
    valueKind: "text",
    valueText: "likely prefers dark mode",
    generatedAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    producerCapabilityId: "personal-intelligence.infer-preference",
    producerCapabilityVersion: "1.0",
    producerProviderId: "test-provider",
    producerModelId: "test-model",
    modelReportedConfidence: 0.7,
    systemAdjustedConfidence: null,
    ...overrides,
  };
}

function makeCreateInput(overrides: Partial<CreateInferenceInput> = {}): CreateInferenceInput {
  return {
    inferenceId: "inference-1",
    userId: "user-a",
    claimType: "preference",
    valueKind: "text",
    valueText: "likely prefers dark mode",
    generatedAt: new Date("2026-01-01T00:00:00Z"),
    producerCapabilityId: "personal-intelligence.infer-preference",
    producerCapabilityVersion: "1.0",
    producerProviderId: "test-provider",
    producerModelId: "test-model",
    modelReportedConfidence: 0.7,
    systemAdjustedConfidence: null,
    evidenceVersionIds: ["evidence-version-1"],
    claimContextIds: [],
    initialLifecycleEventId: "lifecycle-event-1",
    now: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function makeEvent(
  overrides: Partial<PersonalIntelligenceInferenceLifecycleEvent> = {},
): PersonalIntelligenceInferenceLifecycleEvent {
  return {
    id: "event-1",
    inferenceId: "inference-1",
    userId: "user-a",
    sequence: 1,
    fromStatus: null,
    toStatus: "proposed",
    transitionedAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function makeTransitionInput(
  overrides: Partial<TransitionInferenceLifecycleInput> = {},
): TransitionInferenceLifecycleInput {
  return {
    lifecycleEventId: "event-2",
    userId: "user-a",
    inferenceId: "inference-1",
    expectedFromStatus: "proposed",
    toStatus: "confirmed",
    transitionedAt: new Date("2026-01-02T00:00:00Z"),
    now: new Date("2026-01-02T00:00:00Z"),
    ...overrides,
  };
}

function assertOnlyCalled(
  repository: FakePersonalIntelligenceInferenceRepository,
  called:
    | "create"
    | "findInferenceForUser"
    | "findEvidenceReferencesForUser"
    | "findClaimContextReferencesForUser"
    | "findLifecycleHistoryForUser"
    | "transitionLifecycle",
): void {
  const counts = {
    create: repository.createCalls.length,
    findInferenceForUser: repository.findInferenceForUserCalls.length,
    findEvidenceReferencesForUser: repository.findEvidenceReferencesForUserCalls.length,
    findClaimContextReferencesForUser: repository.findClaimContextReferencesForUserCalls.length,
    findLifecycleHistoryForUser: repository.findLifecycleHistoryForUserCalls.length,
    transitionLifecycle: repository.transitionLifecycleCalls.length,
  };
  for (const [operation, count] of Object.entries(counts)) {
    if (operation === called) continue;
    assert.equal(count, 0, `expected ${operation} not to be invoked, but it was called ${count} time(s)`);
  }
}

// --- create ---

test("create delegates to repository.create exactly once with the exact input, and returns its result unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const expected = makeInference();
  repository.createResult = expected;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const input = makeCreateInput();
  const result = await useCase.create(input);

  assert.equal(repository.createCalls.length, 1);
  assert.equal(repository.createCalls[0], input);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "create");
});

test("create forwards multiple EvidenceVersion references unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.createResult = makeInference();
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const input = makeCreateInput({ evidenceVersionIds: ["evidence-version-1", "evidence-version-2"] });
  await useCase.create(input);

  assert.deepEqual(repository.createCalls[0]!.evidenceVersionIds, [
    "evidence-version-1",
    "evidence-version-2",
  ]);
});

test("create forwards optional ClaimVersion contextual references unchanged, without conflating them with evidence", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.createResult = makeInference();
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const input = makeCreateInput({
    evidenceVersionIds: ["evidence-version-1"],
    claimContextIds: ["claim-1", "claim-2"],
  });
  await useCase.create(input);

  assert.deepEqual(repository.createCalls[0]!.claimContextIds, ["claim-1", "claim-2"]);
  assert.deepEqual(repository.createCalls[0]!.evidenceVersionIds, ["evidence-version-1"]);
});

test("create propagates a repository rejection unchanged - covers zero-evidence, invalid-evidence, and cross-user-evidence rejection, all of which are enforced inside the repository (Contract §G)", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error(
    "Cannot create personal intelligence inference: at least one direct EvidenceVersion reference is required (Invariant 4)",
  );
  repository.createRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.create(makeCreateInput({ evidenceVersionIds: [] })), rejection);
});

test("create propagates a cross-user or nonexistent evidence-reference rejection unchanged, without repairing or dropping the bad reference", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error(
    "Cannot create personal intelligence inference: one or more EvidenceVersion references do not exist or do not belong to the authenticated user",
  );
  repository.createRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.create(makeCreateInput()), rejection);
});

// --- findInferenceForUser ---

test("findInferenceForUser delegates exactly once with the same userId and inferenceId", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const expected = makeInference();
  repository.findInferenceForUserResult = expected;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.findInferenceForUser("user-a", "inference-1");

  assert.deepEqual(repository.findInferenceForUserCalls, [["user-a", "inference-1"]]);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "findInferenceForUser");
});

test("findInferenceForUser never substitutes or omits the requesting userId across two different users", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await useCase.findInferenceForUser("user-a", "inference-1");
  await useCase.findInferenceForUser("user-b", "inference-1");

  assert.deepEqual(repository.findInferenceForUserCalls, [
    ["user-a", "inference-1"],
    ["user-b", "inference-1"],
  ]);
});

test("findInferenceForUser propagates a repository rejection unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error("connection lost");
  repository.findInferenceForUserRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.findInferenceForUser("user-a", "inference-1"), rejection);
});

// --- findEvidenceReferencesForUser / findClaimContextReferencesForUser ---

test("findEvidenceReferencesForUser delegates exactly once and returns every reference unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findEvidenceReferencesForUserResult = ["evidence-version-1", "evidence-version-2"];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.findEvidenceReferencesForUser("user-a", "inference-1");

  assert.deepEqual(repository.findEvidenceReferencesForUserCalls, [["user-a", "inference-1"]]);
  assert.deepEqual(result, ["evidence-version-1", "evidence-version-2"]);
  assertOnlyCalled(repository, "findEvidenceReferencesForUser");
});

test("findClaimContextReferencesForUser delegates exactly once and returns an explicit empty result when no contextual grounding exists, without fabricating one", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findClaimContextReferencesForUserResult = [];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.findClaimContextReferencesForUser("user-a", "inference-1");

  assert.deepEqual(repository.findClaimContextReferencesForUserCalls, [["user-a", "inference-1"]]);
  assert.deepEqual(result, []);
  assertOnlyCalled(repository, "findClaimContextReferencesForUser");
});

test("findEvidenceReferencesForUser propagates a repository rejection unchanged (cross-user access path)", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error("connection lost");
  repository.findEvidenceReferencesForUserRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.findEvidenceReferencesForUser("user-a", "inference-1"), rejection);
});

// --- findLifecycleHistoryForUser ---

test("findLifecycleHistoryForUser delegates exactly once and returns the ordered history unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const events = [
    makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" }),
    makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: "confirmed" }),
  ];
  repository.findLifecycleHistoryForUserResult = events;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.findLifecycleHistoryForUser("user-a", "inference-1");

  assert.deepEqual(repository.findLifecycleHistoryForUserCalls, [["user-a", "inference-1"]]);
  assert.equal(result, events);
  assertOnlyCalled(repository, "findLifecycleHistoryForUser");
});

test("findLifecycleHistoryForUser propagates a repository rejection unchanged (cross-user lifecycle-history access)", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error("connection lost");
  repository.findLifecycleHistoryForUserRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.findLifecycleHistoryForUser("user-a", "inference-1"), rejection);
});

// --- getEffectiveStatus ---

test("getEffectiveStatus fetches lifecycle history for the requesting user and derives 'proposed' for a fresh inference", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findLifecycleHistoryForUserResult = [makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" })];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.getEffectiveStatus("user-a", "inference-1");

  assert.equal(result, "proposed");
  assert.deepEqual(repository.findLifecycleHistoryForUserCalls, [["user-a", "inference-1"]]);
});

test("getEffectiveStatus derives the toStatus of the latest transition after confirmation", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findLifecycleHistoryForUserResult = [
    makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" }),
    makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: "confirmed" }),
  ];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.getEffectiveStatus("user-a", "inference-1");

  assert.equal(result, "confirmed");
});

test("getEffectiveStatus returns null (a data-integrity signal, never a fabricated status) for an inference with no lifecycle history", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findLifecycleHistoryForUserResult = [];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.getEffectiveStatus("user-a", "inference-1");

  assert.equal(result, null);
});

test("getEffectiveStatus never writes - it only reads lifecycle history, never calls create or transitionLifecycle", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findLifecycleHistoryForUserResult = [makeEvent()];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await useCase.getEffectiveStatus("user-a", "inference-1");

  assert.equal(repository.createCalls.length, 0);
  assert.equal(repository.transitionLifecycleCalls.length, 0);
});

test("getEffectiveStatus propagates a repository rejection unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error("connection lost");
  repository.findLifecycleHistoryForUserRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.getEffectiveStatus("user-a", "inference-1"), rejection);
});

// --- transitionLifecycle ---

test("transitionLifecycle delegates to repository.transitionLifecycle exactly once with the exact input, and returns its result unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const expected = makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: "confirmed" });
  repository.transitionLifecycleResult = expected;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const input = makeTransitionInput();
  const result = await useCase.transitionLifecycle(input);

  assert.equal(repository.transitionLifecycleCalls.length, 1);
  assert.equal(repository.transitionLifecycleCalls[0], input);
  assert.equal(result, expected);
  assertOnlyCalled(repository, "transitionLifecycle");
});

test("transitionLifecycle returns null unchanged when the repository reports the transition could not be applied (stale expectedFromStatus, concurrent transition, unauthorized, or invalid transition), never fabricating a lifecycle event", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.transitionLifecycleResult = null;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  const result = await useCase.transitionLifecycle(makeTransitionInput());

  assert.equal(result, null);
});

for (const toStatus of ["confirmed", "rejected", "disputed", "stale"] as const) {
  test(`transitionLifecycle forwards a proposed -> ${toStatus} request unchanged, without deciding it itself`, async () => {
    const repository = new FakePersonalIntelligenceInferenceRepository();
    repository.transitionLifecycleResult = makeEvent({
      id: "event-2",
      sequence: 2,
      fromStatus: "proposed",
      toStatus,
    });
    const useCase = new PersonalIntelligenceInferenceUseCase(repository);

    await useCase.transitionLifecycle(makeTransitionInput({ toStatus }));

    assert.equal(repository.transitionLifecycleCalls[0]!.toStatus, toStatus);
  });
}

test("transitionLifecycle propagates a repository rejection unchanged", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  const rejection = new Error("connection lost");
  repository.transitionLifecycleRejection = rejection;
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await assert.rejects(() => useCase.transitionLifecycle(makeTransitionInput()), rejection);
});

// --- cross-cutting: no hidden automatic promotion anywhere in the use case ---

test("create never itself calls transitionLifecycle - no code path automatically promotes or transitions an inference", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.createResult = makeInference();
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await useCase.create(makeCreateInput());

  assert.equal(repository.transitionLifecycleCalls.length, 0);
});

test("findInferenceForUser and findLifecycleHistoryForUser never write - purely read-only", async () => {
  const repository = new FakePersonalIntelligenceInferenceRepository();
  repository.findInferenceForUserResult = makeInference();
  repository.findLifecycleHistoryForUserResult = [makeEvent()];
  const useCase = new PersonalIntelligenceInferenceUseCase(repository);

  await useCase.findInferenceForUser("user-a", "inference-1");
  await useCase.findLifecycleHistoryForUser("user-a", "inference-1");

  assert.equal(repository.createCalls.length, 0);
  assert.equal(repository.transitionLifecycleCalls.length, 0);
});
