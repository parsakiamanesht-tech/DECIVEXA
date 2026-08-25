import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { AIContextService } from "./ai-context.service";
import { AIContextNotFoundError, AIContextUnauthorizedError, AIContextUnknownSourceError } from "./ai-context.errors";
import type { AIContextRequest, AIContextSource } from "./ai-context.types";
import { failure, success } from "../../shared/result/result";
import { createRequestContext } from "../../context/request-context";
import { MemoryUseCase } from "../memory/memory.use-case";
import { EvidenceUseCase } from "../evidence/evidence.use-case";
import { PersonalIntelligenceClaimUseCase } from "../personal-intelligence/personal-intelligence-claim.use-case";
import { PersonalStateUseCase } from "../personal-state/personal-state.use-case";

class UnexpectedMutationCallError extends Error {}

// Call-counting, mutation-throwing fakes - the same discipline already
// established for provider adapters in infrastructure/ai's own test
// suites (a fake that would fail loudly the moment anything beyond the
// authorized read path is invoked).
function fakeMemoryUseCase(getResult: ReturnType<typeof success> | ReturnType<typeof failure>) {
  const calls: unknown[][] = [];
  const fake = {
    get: async (...args: unknown[]) => {
      calls.push(args);
      return getResult;
    },
    create: () => {
      throw new UnexpectedMutationCallError("MemoryUseCase.create must never be called by AIContextService");
    },
    appendLifecycleVersion: () => {
      throw new UnexpectedMutationCallError("MemoryUseCase.appendLifecycleVersion must never be called by AIContextService");
    },
  };
  return { fake: fake as unknown as MemoryUseCase, calls };
}

function fakeEvidenceUseCase(getResult: ReturnType<typeof success> | ReturnType<typeof failure>) {
  const calls: unknown[][] = [];
  const fake = {
    get: async (...args: unknown[]) => {
      calls.push(args);
      return getResult;
    },
    create: () => {
      throw new UnexpectedMutationCallError("EvidenceUseCase.create must never be called by AIContextService");
    },
    appendLifecycleVersion: () => {
      throw new UnexpectedMutationCallError("EvidenceUseCase.appendLifecycleVersion must never be called by AIContextService");
    },
  };
  return { fake: fake as unknown as EvidenceUseCase, calls };
}

function fakePersonalStateUseCase(getResult: ReturnType<typeof success> | ReturnType<typeof failure>) {
  const calls: unknown[][] = [];
  const fake = {
    get: async (...args: unknown[]) => {
      calls.push(args);
      return getResult;
    },
    getHistory: () => {
      throw new UnexpectedMutationCallError("PersonalStateUseCase.getHistory must never be called by AIContextService");
    },
    initialize: () => {
      throw new UnexpectedMutationCallError("PersonalStateUseCase.initialize must never be called by AIContextService");
    },
    update: () => {
      throw new UnexpectedMutationCallError("PersonalStateUseCase.update must never be called by AIContextService");
    },
  };
  return { fake: fake as unknown as PersonalStateUseCase, calls };
}

function fakePersonalIntelligenceClaimUseCase(findResult: unknown) {
  const calls: unknown[][] = [];
  const fake = {
    findClaimForUser: async (...args: unknown[]) => {
      calls.push(args);
      return findResult;
    },
    findClaimVersionForUser: () => {
      throw new UnexpectedMutationCallError("findClaimVersionForUser must never be called by AIContextService");
    },
    findActiveClaimVersionsForUser: () => {
      throw new UnexpectedMutationCallError("findActiveClaimVersionsForUser must never be called by AIContextService");
    },
    create: () => {
      throw new UnexpectedMutationCallError("PersonalIntelligenceClaimUseCase.create must never be called by AIContextService");
    },
    appendCorrection: () => {
      throw new UnexpectedMutationCallError("PersonalIntelligenceClaimUseCase.appendCorrection must never be called by AIContextService");
    },
  };
  return { fake: fake as unknown as PersonalIntelligenceClaimUseCase, calls };
}

function setUp(overrides: {
  memoryResult?: ReturnType<typeof success> | ReturnType<typeof failure>;
  evidenceResult?: ReturnType<typeof success> | ReturnType<typeof failure>;
  personalStateResult?: ReturnType<typeof success> | ReturnType<typeof failure>;
  personalIntelligenceResult?: unknown;
} = {}) {
  const memory = fakeMemoryUseCase(overrides.memoryResult ?? success({ id: "m1" }));
  const evidence = fakeEvidenceUseCase(overrides.evidenceResult ?? success({ id: "e1" }));
  const personalState = fakePersonalStateUseCase(overrides.personalStateResult ?? success({ id: "ps1" }));
  // `??` cannot be used here: an explicit `null` override (simulating
  // "claim not found") must be preserved as-is, not treated as "not
  // provided" and replaced by the default.
  const personalIntelligence = fakePersonalIntelligenceClaimUseCase(
    "personalIntelligenceResult" in overrides ? overrides.personalIntelligenceResult : { id: "pi1" },
  );
  const service = new AIContextService(memory.fake, evidence.fake, personalIntelligence.fake, personalState.fake);
  return { service, memory, evidence, personalState, personalIntelligence };
}

const CONTEXT = createRequestContext("request-1", "user-1");

// --- Memory / Evidence / Personal State: successful passthrough for each source ---

test("request dispatches 'memory' to MemoryUseCase.get and wraps its Result value in AIContextResponse", async () => {
  const { service, memory } = setUp({ memoryResult: success({ id: "m1", data: "x" }) });
  const request: AIContextRequest = { context: CONTEXT, source: "memory", recordId: "record-1" };

  const result = await service.request(request);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, { source: "memory", recordId: "record-1", data: { id: "m1", data: "x" } });
  }
  assert.deepEqual(memory.calls, [["record-1", CONTEXT]]);
});

test("request dispatches 'evidence' to EvidenceUseCase.get and wraps its Result value in AIContextResponse", async () => {
  const { service, evidence } = setUp({ evidenceResult: success({ id: "e1" }) });
  const request: AIContextRequest = { context: CONTEXT, source: "evidence", recordId: "record-2" };

  const result = await service.request(request);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, { source: "evidence", recordId: "record-2", data: { id: "e1" } });
  }
  assert.deepEqual(evidence.calls, [["record-2", CONTEXT]]);
});

test("request dispatches 'personal-state' to PersonalStateUseCase.get (context only, recordId unused) and wraps its Result value", async () => {
  const { service, personalState } = setUp({ personalStateResult: success({ id: "ps1" }) });
  const request: AIContextRequest = { context: CONTEXT, source: "personal-state", recordId: "ignored" };

  const result = await service.request(request);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, { source: "personal-state", recordId: "ignored", data: { id: "ps1" } });
  }
  assert.deepEqual(personalState.calls, [[CONTEXT]]);
});

// --- B. RequestContext forwarded unchanged ---

test("RequestContext is forwarded to the underlying use-case unchanged (same reference)", async () => {
  const { service, memory } = setUp();
  const request: AIContextRequest = { context: CONTEXT, source: "memory", recordId: "record-1" };

  await service.request(request);

  assert.strictEqual(memory.calls[0]?.[1], CONTEXT);
});

// --- D. underlying typed failures remain failures, never wrapped ---

test("an underlying Result failure is preserved unchanged, never wrapped in a new error", async () => {
  const originalError = new Error("Memory record not found");
  const { service } = setUp({ memoryResult: failure(originalError) });
  const request: AIContextRequest = { context: CONTEXT, source: "memory", recordId: "missing" };

  const result = await service.request(request);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.strictEqual(result.error, originalError);
  }
});

// --- C/D. Personal Intelligence: missing context.userId -> typed failure, use-case never called ---

test("personal-intelligence: missing context.userId returns AIContextUnauthorizedError and never calls findClaimForUser", async () => {
  const { service, personalIntelligence } = setUp();
  const unauthenticatedContext = createRequestContext("request-2");
  const request: AIContextRequest = { context: unauthenticatedContext, source: "personal-intelligence", recordId: "claim-1" };

  const result = await service.request(request);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.error instanceof AIContextUnauthorizedError);
  }
  assert.deepEqual(personalIntelligence.calls, []);
});

// --- E. valid userId -> existing use-case receives exactly that userId ---

test("personal-intelligence: a valid context.userId is forwarded exactly to findClaimForUser", async () => {
  const { service, personalIntelligence } = setUp({ personalIntelligenceResult: { id: "claim-1" } });
  const request: AIContextRequest = { context: CONTEXT, source: "personal-intelligence", recordId: "claim-1" };

  await service.request(request);

  assert.deepEqual(personalIntelligence.calls, [["user-1", "claim-1"]]);
});

// --- F. null result -> explicit Context failure, never fabricated success ---

test("personal-intelligence: a null result becomes AIContextNotFoundError, never a fabricated success", async () => {
  const { service } = setUp({ personalIntelligenceResult: null });
  const request: AIContextRequest = { context: CONTEXT, source: "personal-intelligence", recordId: "claim-1" };

  const result = await service.request(request);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.error instanceof AIContextNotFoundError);
  }
});

// --- G. valid result -> successful Context response ---

test("personal-intelligence: a found claim becomes a successful AIContextResponse carrying the claim unchanged", async () => {
  const claim = { id: "claim-1", userId: "user-1" };
  const { service } = setUp({ personalIntelligenceResult: claim });
  const request: AIContextRequest = { context: CONTEXT, source: "personal-intelligence", recordId: "claim-1" };

  const result = await service.request(request);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, { source: "personal-intelligence", recordId: "claim-1", data: claim });
  }
});

// unknown source is rejected explicitly, never silently ignored
test("an unrecognized source is rejected with AIContextUnknownSourceError", async () => {
  const { service } = setUp();
  const request = { context: CONTEXT, source: "not-a-real-source" as AIContextSource, recordId: "x" };

  const result = await service.request(request);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.error instanceof AIContextUnknownSourceError);
  }
});

// no mutation method is ever called across any successful or failing
// dispatch - proven by the fakes above throwing UnexpectedMutationCallError
// if invoked; this test simply confirms none of the prior tests threw it.
test("no dispatch path ever invokes a mutation-shaped method on any use-case", async () => {
  const { service } = setUp();
  const sources: AIContextSource[] = ["memory", "evidence", "personal-state", "personal-intelligence"];

  for (const source of sources) {
    await service.request({ context: CONTEXT, source, recordId: "x" });
  }
  // If any fake's mutation method had been called, it would have thrown
  // synchronously inside service.request() above and failed this test.
  assert.ok(true);
});

// --- H/I/J/K: structural isolation checks over the module's own source (non-spec) files ---

const aiContextRoot = join(process.cwd(), "src", "application", "ai-context");

async function collectSourceFiles(): Promise<string[]> {
  const entries = await readdir(aiContextRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".spec.ts"))
    .map((entry) => join(aiContextRoot, entry.name));
}

async function collectImportSpecifiers(file: string): Promise<string[]> {
  const source = await readFile(file, "utf8");
  const specifiers: string[] = [];
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

// Runtime Context Resolution increment (Founder-approved Decision 4):
// application/ai-context is the sanctioned *implementer* of
// infrastructure/ai/runtime's ContextResolutionPort — the one
// dependency-inversion exception to the otherwise-absolute
// "no infrastructure/ai import" rule below. Only this exact specifier is
// exempted; every other infrastructure/ai import remains forbidden, and
// the exemption does not apply to the frozen AIContextService/types/
// errors files (which do not, and must not, import it).
const SANCTIONED_PORT_IMPORT = "infrastructure/ai/runtime/context-resolution.port";

test("ai-context source files never import core/, infrastructure/persistence, domain/, or infrastructure/ai directly (except the sanctioned ContextResolutionPort import)", async () => {
  const files = await collectSourceFiles();
  const forbidden = ["core/", "infrastructure/persistence", "domain/", "infrastructure/ai", "drizzle-orm"];

  for (const file of files) {
    const specifiers = await collectImportSpecifiers(file);
    for (const specifier of specifiers) {
      if (specifier.includes(SANCTIONED_PORT_IMPORT)) continue;
      for (const dependency of forbidden) {
        assert.equal(
          specifier.includes(dependency),
          false,
          `${file} must not import from a specifier containing "${dependency}" (found "${specifier}")`,
        );
      }
    }
  }
});

test("ai-context source files never reference provider/network execution primitives", async () => {
  const files = await collectSourceFiles();
  const forbidden = ["fetch(", "generate(", "structuredOutput(", "embed(", "healthCheck(", "http.", "https."];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const symbol of forbidden) {
      assert.equal(source.includes(symbol), false, `${file} must not reference ${symbol}`);
    }
  }
});
