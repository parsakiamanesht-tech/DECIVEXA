import test from "node:test";
import assert from "node:assert/strict";
import { MemoryUseCase } from "./memory.use-case";
import type { MemoryRecord, MemoryRecordVersion } from "../../core/memory/memory-record.model";
import type {
  AppendMemoryLifecycleVersionInput,
  CreateMemoryRecordInput,
  MemoryRecordRepository,
} from "../../core/memory/memory-record.repository";
import { createRequestContext } from "../../context/request-context";

class FakeMemoryRecordRepository implements MemoryRecordRepository {
  private readonly records = new Map<string, MemoryRecord>();
  private readonly versions = new Map<string, MemoryRecordVersion[]>();
  public lastCreateInput: CreateMemoryRecordInput | undefined;
  public lastAppendInput: AppendMemoryLifecycleVersionInput | undefined;

  async findByIdForUser(userId: string, id: string): Promise<MemoryRecord | null> {
    const found = this.records.get(id);
    return found && found.userId === userId ? found : null;
  }

  async findVersionForUser(
    userId: string,
    recordId: string,
    version: number,
  ): Promise<MemoryRecordVersion | null> {
    const list = this.versions.get(recordId) ?? [];
    return list.find((v) => v.version === version && v.userId === userId) ?? null;
  }

  async create(input: CreateMemoryRecordInput): Promise<MemoryRecordVersion> {
    this.lastCreateInput = input;
    const record: MemoryRecord = {
      id: input.recordId,
      userId: input.userId,
      createdAt: input.now,
      updatedAt: input.now,
    };
    const version: MemoryRecordVersion = {
      id: input.versionId,
      recordId: input.recordId,
      version: 1,
      userId: input.userId,
      provenance: input.provenance,
      lifecycle: "active",
      observedAt: input.observedAt,
      acceptedAt: input.acceptedAt,
      confidence: input.confidence,
      valueKind: input.valueKind ?? null,
      value: input.value ?? null,
      // Mirrors the real DrizzleMemoryRecordRepository: no confirmation
      // workflow is authorized in this increment, so every created
      // version is unconfirmed by construction.
      userConfirmed: false,
      createdAt: input.now,
    };
    this.records.set(input.recordId, record);
    this.versions.set(input.recordId, [version]);
    return version;
  }

  async appendLifecycleVersion(
    input: AppendMemoryLifecycleVersionInput,
  ): Promise<MemoryRecordVersion | null> {
    this.lastAppendInput = input;
    const list = this.versions.get(input.recordId) ?? [];
    const latest = list[list.length - 1];
    if (!latest || latest.version !== input.expectedVersion || latest.userId !== input.userId) return null;
    const next: MemoryRecordVersion = {
      id: input.versionId,
      recordId: input.recordId,
      version: input.expectedVersion + 1,
      userId: input.userId,
      provenance: latest.provenance,
      lifecycle: input.lifecycle,
      observedAt: latest.observedAt,
      acceptedAt: latest.acceptedAt,
      confidence: latest.confidence,
      // Founder-authorized copy-forward semantics (Interpretation X):
      // the value slot and confirmation state carry forward unchanged on
      // a lifecycle-only transition, mirroring the real repository.
      valueKind: latest.valueKind,
      value: latest.value,
      userConfirmed: latest.userConfirmed,
      createdAt: input.now,
    };
    list.push(next);
    this.versions.set(input.recordId, list);
    return next;
  }
}

test("creating a memory record generates two distinct application-generated IDs", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, true);
  assert.ok(repository.lastCreateInput);
  assert.notEqual(repository.lastCreateInput!.recordId, repository.lastCreateInput!.versionId);
});

test("the authenticated user context is propagated to the repository", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  await useCase.create(
    { provenance: "declared", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-b"),
  );

  assert.equal(repository.lastCreateInput!.userId, "user-b");
});

test("create fails without an authenticated user", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1"),
  );

  assert.equal(result.ok, false);
});

test("get returns only a record owned by the requesting user", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const recordId = repository.lastCreateInput!.recordId;

  const ownFetch = await useCase.get(recordId, createRequestContext("r2", "user-a"));
  assert.equal(ownFetch.ok, true);

  const otherFetch = await useCase.get(recordId, createRequestContext("r3", "user-b"));
  assert.equal(otherFetch.ok, false);
});

test("getVersion returns only a version owned by the requesting user", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: 0.7 },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const recordId = repository.lastCreateInput!.recordId;

  const ownFetch = await useCase.getVersion(recordId, 1, createRequestContext("r2", "user-a"));
  assert.equal(ownFetch.ok, true);

  const otherFetch = await useCase.getVersion(recordId, 1, createRequestContext("r3", "user-b"));
  assert.equal(otherFetch.ok, false);
});

test("a lifecycle correction generates a fresh version ID distinct from the initial version", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: 0.9 },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const initialVersionId = created.ok ? created.value.id : "";
  const recordId = repository.lastCreateInput!.recordId;

  const corrected = await useCase.appendLifecycleVersion(
    { recordId, expectedVersion: 1, lifecycle: "corrected" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(corrected.ok, true);
  assert.notEqual(repository.lastAppendInput!.versionId, initialVersionId);
});

test("deletion uses the lifecycle-version mechanism rather than removing history", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const recordId = repository.lastCreateInput!.recordId;

  const deleted = await useCase.appendLifecycleVersion(
    { recordId, expectedVersion: 1, lifecycle: "deleted" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(deleted.ok, true);
  // The original active version (1) must still be retrievable - the use-case
  // never overwrites or removes it, only appends a new "deleted" version (2).
  const originalStillPresent = await useCase.getVersion(recordId, 1, createRequestContext("r3", "user-a"));
  assert.equal(originalStillPresent.ok, true);
  if (originalStillPresent.ok) {
    assert.equal(originalStillPresent.value.lifecycle, "active");
  }
});

test("expectedVersion is passed through unchanged for the optimistic-concurrency check", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const recordId = repository.lastCreateInput!.recordId;

  await useCase.appendLifecycleVersion(
    { recordId, expectedVersion: 1, lifecycle: "corrected" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(repository.lastAppendInput!.expectedVersion, 1);
});

test("a stale expectedVersion is rejected as a conflict rather than silently applied", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const recordId = repository.lastCreateInput!.recordId;

  const result = await useCase.appendLifecycleVersion(
    { recordId, expectedVersion: 99, lifecycle: "deleted" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(result.ok, false);
});

test("create accepts a 'content' value kind", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    {
      provenance: "declared",
      observedAt: new Date(),
      acceptedAt: new Date(),
      confidence: null,
      valueKind: "content",
      value: "remembered lesson text",
    },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.valueKind, "content");
    assert.equal(result.value.value, "remembered lesson text");
  }
});

test("create accepts a 'reference' value kind", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    {
      provenance: "observed",
      observedAt: new Date(),
      acceptedAt: new Date(),
      confidence: null,
      valueKind: "reference",
      value: "some-referenced-identifier",
    },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.valueKind, "reference");
    assert.equal(result.value.value, "some-referenced-identifier");
  }
});

test("create rejects an unsupported value kind", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    {
      provenance: "declared",
      observedAt: new Date(),
      acceptedAt: new Date(),
      confidence: null,
      // Deliberately not a valid MemoryValueKind - cast to bypass the
      // compile-time union so the runtime guard is what is exercised.
      valueKind: "text" as unknown as "content",
      value: "irrelevant",
    },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, false);
});

test("create without a value leaves valueKind and value both null", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.valueKind, null);
    assert.equal(result.value.value, null);
  }
});

test("newly created memories are unconfirmed by default", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const result = await useCase.create(
    {
      provenance: "declared",
      observedAt: new Date(),
      acceptedAt: new Date(),
      confidence: 0.9,
      valueKind: "content",
      value: "a directly stated fact",
    },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    // High confidence and declared provenance must never imply
    // confirmation - the anti-poisoning invariant this field exists to
    // preserve (TD-06 §13).
    assert.equal(result.value.userConfirmed, false);
  }
});

test("a lifecycle-only transition preserves value kind, value, and confirmation state unchanged", async () => {
  const repository = new FakeMemoryRecordRepository();
  const useCase = new MemoryUseCase(repository);

  const created = await useCase.create(
    {
      provenance: "observed",
      observedAt: new Date(),
      acceptedAt: new Date(),
      confidence: 0.4,
      valueKind: "content",
      value: "a memory to be corrected later",
    },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const recordId = repository.lastCreateInput!.recordId;

  const corrected = await useCase.appendLifecycleVersion(
    { recordId, expectedVersion: 1, lifecycle: "corrected" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(corrected.ok, true);
  if (corrected.ok && created.ok) {
    assert.equal(corrected.value.lifecycle, "corrected");
    assert.equal(corrected.value.valueKind, created.value.valueKind);
    assert.equal(corrected.value.value, created.value.value);
    assert.equal(corrected.value.userConfirmed, created.value.userConfirmed);
  }

  // The original version's own value/confirmation state must remain
  // exactly as it was - appendLifecycleVersion never mutates history.
  const original = await useCase.getVersion(recordId, 1, createRequestContext("r3", "user-a"));
  assert.equal(original.ok, true);
  if (original.ok) {
    assert.equal(original.value.valueKind, "content");
    assert.equal(original.value.value, "a memory to be corrected later");
    assert.equal(original.value.userConfirmed, false);
  }
});
