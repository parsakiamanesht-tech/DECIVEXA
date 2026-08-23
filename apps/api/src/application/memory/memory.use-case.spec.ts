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
