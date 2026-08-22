import test from "node:test";
import assert from "node:assert/strict";
import { EvidenceUseCase } from "./evidence.use-case";
import type { Evidence, EvidenceVersion } from "../../core/evidence/evidence.model";
import type {
  AppendLifecycleVersionInput,
  CreateEvidenceInput,
  EvidenceRepository,
} from "../../core/evidence/evidence.repository";
import { createRequestContext } from "../../context/request-context";

class FakeEvidenceRepository implements EvidenceRepository {
  private readonly evidence = new Map<string, Evidence>();
  private readonly versions = new Map<string, EvidenceVersion[]>();
  public lastCreateInput: CreateEvidenceInput | undefined;
  public lastAppendInput: AppendLifecycleVersionInput | undefined;

  async findByIdForUser(userId: string, id: string): Promise<Evidence | null> {
    const found = this.evidence.get(id);
    return found && found.userId === userId ? found : null;
  }

  async findVersionForUser(userId: string, evidenceId: string, version: number): Promise<EvidenceVersion | null> {
    const list = this.versions.get(evidenceId) ?? [];
    return list.find((v) => v.version === version && v.userId === userId) ?? null;
  }

  async create(input: CreateEvidenceInput): Promise<EvidenceVersion> {
    this.lastCreateInput = input;
    const evidence: Evidence = {
      id: input.evidenceId,
      userId: input.userId,
      createdAt: input.now,
      updatedAt: input.now,
    };
    const version: EvidenceVersion = {
      id: input.versionId,
      evidenceId: input.evidenceId,
      version: 1,
      userId: input.userId,
      provenance: input.provenance,
      lifecycle: "active",
      observedAt: input.observedAt,
      acceptedAt: input.acceptedAt,
      confidence: input.confidence,
      createdAt: input.now,
    };
    this.evidence.set(input.evidenceId, evidence);
    this.versions.set(input.evidenceId, [version]);
    return version;
  }

  async appendLifecycleVersion(input: AppendLifecycleVersionInput): Promise<EvidenceVersion | null> {
    this.lastAppendInput = input;
    const list = this.versions.get(input.evidenceId) ?? [];
    const latest = list[list.length - 1];
    if (!latest || latest.version !== input.expectedVersion || latest.userId !== input.userId) return null;
    const next: EvidenceVersion = {
      id: input.versionId,
      evidenceId: input.evidenceId,
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
    this.versions.set(input.evidenceId, list);
    return next;
  }
}

test("creating evidence generates two distinct application-generated IDs", async () => {
  const repository = new FakeEvidenceRepository();
  const useCase = new EvidenceUseCase(repository);

  const result = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );

  assert.equal(result.ok, true);
  assert.ok(repository.lastCreateInput);
  assert.notEqual(repository.lastCreateInput!.evidenceId, repository.lastCreateInput!.versionId);
});

test("the authenticated user context is propagated to the repository", async () => {
  const repository = new FakeEvidenceRepository();
  const useCase = new EvidenceUseCase(repository);

  await useCase.create(
    { provenance: "declared", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-b"),
  );

  assert.equal(repository.lastCreateInput!.userId, "user-b");
});

test("a lifecycle transition generates a fresh version ID distinct from the initial version", async () => {
  const repository = new FakeEvidenceRepository();
  const useCase = new EvidenceUseCase(repository);

  const created = await useCase.create(
    { provenance: "measured", observedAt: new Date(), acceptedAt: new Date(), confidence: 0.9 },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const initialVersionId = created.ok ? created.value.id : "";
  const evidenceId = repository.lastCreateInput!.evidenceId;

  const appended = await useCase.appendLifecycleVersion(
    { evidenceId, expectedVersion: 1, lifecycle: "corrected" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(appended.ok, true);
  assert.notEqual(repository.lastAppendInput!.versionId, initialVersionId);
});

test("expectedVersion is passed through unchanged for the optimistic-concurrency check", async () => {
  const repository = new FakeEvidenceRepository();
  const useCase = new EvidenceUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const evidenceId = repository.lastCreateInput!.evidenceId;

  await useCase.appendLifecycleVersion(
    { evidenceId, expectedVersion: 1, lifecycle: "superseded" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(repository.lastAppendInput!.expectedVersion, 1);
});

test("a stale expectedVersion is rejected as a conflict rather than silently applied", async () => {
  const repository = new FakeEvidenceRepository();
  const useCase = new EvidenceUseCase(repository);

  const created = await useCase.create(
    { provenance: "observed", observedAt: new Date(), acceptedAt: new Date(), confidence: null },
    createRequestContext("r1", "user-a"),
  );
  assert.equal(created.ok, true);
  const evidenceId = repository.lastCreateInput!.evidenceId;

  const result = await useCase.appendLifecycleVersion(
    { evidenceId, expectedVersion: 99, lifecycle: "revoked" },
    createRequestContext("r2", "user-a"),
  );

  assert.equal(result.ok, false);
});
