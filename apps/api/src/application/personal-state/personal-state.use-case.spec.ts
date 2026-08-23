import test from "node:test";
import assert from "node:assert/strict";
import { PersonalStateUseCase } from "./personal-state.use-case";
import type { PersonalState, PersonalStateAvailability } from "../../core/personal-state/personal-state.model";
import type { PersonalStateRevision } from "../../core/personal-state/personal-state-revision.model";
import type { PersonalStatePatch, PersonalStateRepository } from "../../core/personal-state/personal-state.repository";
import { createRequestContext } from "../../context/request-context";

class FakePersonalStateRepository implements PersonalStateRepository {
  private states = new Map<string, PersonalState>();
  private revisions = new Map<string, PersonalStateRevision[]>();
  public lastUserId = "";
  public lastRevisionsUserId = "";

  async findByUserId(userId: string) { this.lastUserId = userId; return this.states.get(userId); }
  async create(input: { id: string; userId: string; timezone: string | null; locale: string | null; availability: PersonalStateAvailability | null; provenance: "declared" | "observed"; now: Date }) {
    const state: PersonalState = { ...input, revision: 1, createdAt: input.now, updatedAt: input.now };
    this.states.set(input.userId, state);
    return state;
  }
  async updateForUser(userId: string, expectedRevision: number, patch: PersonalStatePatch, now: Date) {
    this.lastUserId = userId;
    const current = this.states.get(userId);
    if (!current || current.revision !== expectedRevision) return undefined;
    const next = { ...current, ...patch, revision: current.revision + 1, updatedAt: now };
    this.states.set(userId, next);
    return next;
  }
  async findRevisionsForUser(userId: string) {
    this.lastRevisionsUserId = userId;
    return this.revisions.get(userId) ?? [];
  }
  // Test-only seam - not part of the PersonalStateRepository contract.
  seedRevisions(userId: string, revisions: PersonalStateRevision[]) {
    this.revisions.set(userId, revisions);
  }
}

function revision(overrides: Partial<PersonalStateRevision> & { id: string; revision: number }): PersonalStateRevision {
  return {
    userId: "user-a",
    timezone: null,
    locale: null,
    availability: null,
    provenance: "declared",
    evidenceVersionId: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

test("personal state is always resolved from authenticated user context", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);
  await useCase.initialize({ timezone: "Europe/Paris", locale: "fr-FR" }, createRequestContext("r1", "user-a"));
  await useCase.get(createRequestContext("r2", "user-a"));
  assert.equal(repository.lastUserId, "user-a");
});

test("revision mismatch prevents silent overwrite", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);
  await useCase.initialize({ timezone: "Europe/Paris" }, createRequestContext("r1", "user-a"));
  const result = await useCase.update({ timezone: "UTC", revision: 99 }, createRequestContext("r2", "user-a"));
  assert.equal(result.ok, false);
});

test("invalid locale is rejected deterministically", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);
  const result = await useCase.initialize({ locale: "x" }, createRequestContext("r1", "user-a"));
  assert.equal(result.ok, false);
  assert.match(result.ok ? "" : result.error.message, /Invalid locale/);
});

test("a second initialization is idempotent and does not overwrite state", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);
  const context = createRequestContext("r1", "user-a");
  const first = await useCase.initialize({ timezone: "Europe/Paris" }, context);
  const second = await useCase.initialize({ timezone: "UTC" }, context);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(second.ok ? second.value.timezone : null, "Europe/Paris");
});

test("getHistory returns the calling user's revision history in the repository's own order, unmodified", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);
  const expected = [
    revision({ id: "revision-1", revision: 1, timezone: "Europe/Paris" }),
    revision({ id: "revision-2", revision: 2, timezone: "UTC" }),
  ];
  repository.seedRevisions("user-a", expected);

  const result = await useCase.getHistory(createRequestContext("r1", "user-a"));

  assert.equal(result.ok, true);
  assert.deepEqual(result.ok ? result.value : null, expected);
});

test("getHistory scopes retrieval to exactly the authenticated user's id, never an arbitrary one", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);
  repository.seedRevisions("user-a", [revision({ id: "revision-1", revision: 1, userId: "user-a" })]);

  await useCase.getHistory(createRequestContext("r1", "user-a"));

  assert.equal(repository.lastRevisionsUserId, "user-a");
});

test("getHistory returns an empty array, not an error, for a user with no revisions", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);

  const result = await useCase.getHistory(createRequestContext("r1", "user-a"));

  assert.equal(result.ok, true);
  assert.deepEqual(result.ok ? result.value : null, []);
});

test("getHistory rejects a request without an authenticated user", async () => {
  const repository = new FakePersonalStateRepository();
  const useCase = new PersonalStateUseCase(repository);

  const result = await useCase.getHistory(createRequestContext("r1"));

  assert.equal(result.ok, false);
  assert.match(result.ok ? "" : result.error.message, /Authenticated user required/);
});
