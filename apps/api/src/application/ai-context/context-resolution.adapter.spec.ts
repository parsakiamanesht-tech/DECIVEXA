import test from "node:test";
import assert from "node:assert/strict";
import { ContextResolutionAdapter } from "./context-resolution.adapter";
import { AIContextService } from "./ai-context.service";
import { createRequestContext } from "../../context/request-context";
import { failure, success } from "../../shared/result/result";
import { MemoryUseCase, MemoryNotFoundError, MemoryValidationError } from "../memory/memory.use-case";
import { EvidenceUseCase } from "../evidence/evidence.use-case";
import { PersonalIntelligenceClaimUseCase } from "../personal-intelligence/personal-intelligence-claim.use-case";
import { PersonalStateUseCase } from "../personal-state/personal-state.use-case";

// In-memory, ownership-scoped fake — mirrors exactly how the real
// repository-backed use-case behaves: a record belongs to exactly one
// user, and a lookup by a different user (or a nonexistent id) returns
// "not found," never a distinct "unauthorized" — the real system never
// leaks a record's existence to a non-owner. Only a missing
// context.userId is a distinct authorization failure.
function fakeMemoryUseCase(store: Record<string, { userId: string; data: unknown }>) {
  const calls: unknown[][] = [];
  const fake = {
    get: async (recordId: string, context: { userId?: string }) => {
      calls.push([recordId, context]);
      if (!context.userId) return failure(new MemoryValidationError("Authenticated user required"));
      const record = store[recordId];
      if (!record || record.userId !== context.userId) return failure(new MemoryNotFoundError("Memory record not found"));
      return success(record.data);
    },
  };
  return { fake: fake as unknown as MemoryUseCase, calls };
}

function unusedEvidenceUseCase() {
  return {
    get: async () => {
      throw new Error("EvidenceUseCase.get should not be called by this test");
    },
  } as unknown as EvidenceUseCase;
}

function unusedPersonalIntelligenceUseCase() {
  return {
    findClaimForUser: async () => {
      throw new Error("findClaimForUser should not be called by this test");
    },
  } as unknown as PersonalIntelligenceClaimUseCase;
}

function fakePersonalStateUseCase(result: ReturnType<typeof success> | ReturnType<typeof failure>) {
  const calls: unknown[][] = [];
  const fake = {
    get: async (context: unknown) => {
      calls.push([context]);
      return result;
    },
  };
  return { fake: fake as unknown as PersonalStateUseCase, calls };
}

function fakePersonalIntelligenceClaimUseCase(result: unknown) {
  const calls: unknown[][] = [];
  const fake = {
    findClaimForUser: async (...args: unknown[]) => {
      calls.push(args);
      return result;
    },
  };
  return { fake: fake as unknown as PersonalIntelligenceClaimUseCase, calls };
}

const OWNER_CONTEXT = createRequestContext("request-1", "owner");
const OTHER_USER_CONTEXT = createRequestContext("request-2", "someone-else");
const UNAUTHENTICATED_CONTEXT = createRequestContext("request-3");

function buildAdapter(overrides: {
  memory?: MemoryUseCase;
  evidence?: EvidenceUseCase;
  personalIntelligence?: PersonalIntelligenceClaimUseCase;
  personalState?: PersonalStateUseCase;
} = {}) {
  const memory = overrides.memory ?? fakeMemoryUseCase({}).fake;
  const evidence = overrides.evidence ?? unusedEvidenceUseCase();
  const personalIntelligence = overrides.personalIntelligence ?? unusedPersonalIntelligenceUseCase();
  const personalState = overrides.personalState ?? fakePersonalStateUseCase(success({ id: "ps1" })).fake;
  const aiContextService = new AIContextService(memory, evidence, personalIntelligence, personalState);
  return new ContextResolutionAdapter(aiContextService);
}

// --- unit: label/selector short-circuits (no AIContextService call needed) ---

test("resolve returns unsupported_label for an unrecognized label, without calling AIContextService", async () => {
  const { fake: memory, calls } = fakeMemoryUseCase({});
  const adapter = buildAdapter({ memory });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "goal-state", selector: "anything" });

  assert.deepEqual(result, { status: "unsupported_label", label: "goal-state" });
  assert.deepEqual(calls, []);
});

test("resolve returns missing_selector for memory/evidence/personal-intelligence when no selector is supplied", async () => {
  const adapter = buildAdapter();

  for (const label of ["memory", "evidence", "personal-intelligence"] as const) {
    const result = await adapter.resolve({ context: OWNER_CONTEXT, label, selector: null });
    assert.deepEqual(result, { status: "missing_selector", label });
  }
});

test("resolve does not require a selector for personal-state", async () => {
  const { fake: personalState } = fakePersonalStateUseCase(success({ id: "ps1", timezone: "UTC" }));
  const adapter = buildAdapter({ personalState });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "personal-state", selector: null });

  assert.deepEqual(result, { status: "resolved", context: { label: "personal-state", data: { id: "ps1", timezone: "UTC" } } });
});

// --- security: same-user resolves, other-user fails, nonexistent fails, missing selector fails ---

test("resolve: same-user record resolves, with provenance-bearing data passed through unmodified", async () => {
  const record = { id: "memory-record-1", provenance: "declared", value: "hello" };
  const { fake: memory } = fakeMemoryUseCase({ "memory-record-1": { userId: "owner", data: record } });
  const adapter = buildAdapter({ memory });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "memory", selector: "memory-record-1" });

  assert.deepEqual(result, { status: "resolved", context: { label: "memory", data: record } });
});

test("resolve: another user's record fails as not_found, demonstrating the existing user-scoped path is the real enforcement mechanism", async () => {
  const { fake: memory, calls } = fakeMemoryUseCase({ "memory-record-1": { userId: "owner", data: { id: "memory-record-1" } } });
  const adapter = buildAdapter({ memory });

  const result = await adapter.resolve({ context: OTHER_USER_CONTEXT, label: "memory", selector: "memory-record-1" });

  assert.deepEqual(result, { status: "not_found" });
  // The adapter forwarded the real (other) user's context unchanged — it
  // never substituted, escalated, or stripped identity to make the
  // lookup succeed.
  assert.deepEqual(calls, [["memory-record-1", OTHER_USER_CONTEXT]]);
});

test("resolve: a nonexistent record fails as not_found", async () => {
  const { fake: memory } = fakeMemoryUseCase({});
  const adapter = buildAdapter({ memory });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "memory", selector: "does-not-exist" });

  assert.deepEqual(result, { status: "not_found" });
});

test("resolve: a missing selector fails deterministically without ever calling the underlying use-case", async () => {
  const { fake: memory, calls } = fakeMemoryUseCase({ "memory-record-1": { userId: "owner", data: {} } });
  const adapter = buildAdapter({ memory });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "memory", selector: null });

  assert.deepEqual(result, { status: "missing_selector", label: "memory" });
  assert.deepEqual(calls, []);
});

test("resolve: an unauthenticated context (missing userId) fails as unauthorized, never as a fabricated success", async () => {
  const { fake: memory, calls } = fakeMemoryUseCase({ "memory-record-1": { userId: "owner", data: {} } });
  const adapter = buildAdapter({ memory });

  const result = await adapter.resolve({ context: UNAUTHENTICATED_CONTEXT, label: "memory", selector: "memory-record-1" });

  assert.deepEqual(result, { status: "unauthorized" });
  assert.deepEqual(calls, [["memory-record-1", UNAUTHENTICATED_CONTEXT]]);
});

// --- Personal Intelligence: distinct AIContextUnauthorizedError/AIContextNotFoundError path ---

test("resolve: personal-intelligence missing userId fails as unauthorized without calling findClaimForUser", async () => {
  const { fake: personalIntelligence, calls } = fakePersonalIntelligenceClaimUseCase({ id: "claim-1" });
  const adapter = buildAdapter({ personalIntelligence });

  const result = await adapter.resolve({ context: UNAUTHENTICATED_CONTEXT, label: "personal-intelligence", selector: "claim-1" });

  assert.deepEqual(result, { status: "unauthorized" });
  assert.deepEqual(calls, []);
});

test("resolve: personal-intelligence null claim fails as not_found", async () => {
  const { fake: personalIntelligence } = fakePersonalIntelligenceClaimUseCase(null);
  const adapter = buildAdapter({ personalIntelligence });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "personal-intelligence", selector: "claim-1" });

  assert.deepEqual(result, { status: "not_found" });
});

test("resolve: personal-intelligence found claim resolves with data unchanged", async () => {
  const claim = { id: "claim-1", userId: "owner" };
  const { fake: personalIntelligence } = fakePersonalIntelligenceClaimUseCase(claim);
  const adapter = buildAdapter({ personalIntelligence });

  const result = await adapter.resolve({ context: OWNER_CONTEXT, label: "personal-intelligence", selector: "claim-1" });

  assert.deepEqual(result, { status: "resolved", context: { label: "personal-intelligence", data: claim } });
});

// --- deterministic result shape / no repository access ---

test("resolve never accesses a repository or persistence symbol directly (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(
    join(process.cwd(), "src", "application", "ai-context", "context-resolution.adapter.ts"),
    "utf8",
  );
  const forbidden = ["Repository", "drizzle-orm", "infrastructure/persistence", "core/"];
  for (const symbol of forbidden) {
    assert.equal(source.includes(symbol), false, `context-resolution.adapter.ts must not reference ${symbol}`);
  }
});
