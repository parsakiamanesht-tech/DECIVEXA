import test from "node:test";
import assert from "node:assert/strict";
import { PersonalStateUseCase } from "./personal-state.use-case";
import type { PersonalState, PersonalStateAvailability } from "../../core/personal-state/personal-state.model";
import type { PersonalStatePatch, PersonalStateRepository } from "../../core/personal-state/personal-state.repository";
import { createRequestContext } from "../../context/request-context";

class FakePersonalStateRepository implements PersonalStateRepository {
  private states = new Map<string, PersonalState>();
  public lastUserId = "";

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
