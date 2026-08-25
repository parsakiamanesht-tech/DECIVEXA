import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AIRuntimeModule } from "./ai-runtime.module";
import { AIRuntime } from "../ai/runtime/ai-runtime";
import { AIRuntimeController } from "../ai/runtime/ai-runtime.controller";
import { KeyedProviderResolver } from "../ai/runtime/provider-instance-resolver";
import { OpenAiCompatibleProviderAdapter } from "../ai/adapters/openai-compatible-provider.adapter";
import { CapabilityRegistry } from "../ai/capability/capability-registry";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "../ai/capability/personal-state-interpret.capability";
import { ModelRouter } from "../ai/router/model-router";
import { ModelRegistry } from "../ai/registry/model-registry";
import { ProviderRegistry } from "../ai/registry/provider-registry";
import type { ProviderCapabilities, ProviderLimits } from "../ai/provider/ai-provider.types";
import { PERSONAL_STATE_REPOSITORY } from "../../core/personal-state/personal-state.repository.token";
import type { PersonalStateRepository } from "../../core/personal-state/personal-state.repository";
import type { PersonalState } from "../../core/personal-state/personal-state.model";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";
import { createRequestContext } from "../../context/request-context";

// AIRuntimeModule transitively imports AIContextModule, which imports
// EvidenceModule and PersonalStateModule, both of which import
// AuthModule; mirror the same env-var convention already established by
// application/ai-context/ai-context.module.spec.ts and
// foundation/composition-wiring.spec.ts (each node --test file runs in
// its own isolated process).
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

const BASE_CAPABILITIES: ProviderCapabilities = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const BASE_LIMITS: ProviderLimits = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };

const FIXTURE_PERSONAL_STATE: PersonalState = {
  id: "personal-state-1",
  userId: "user-1",
  timezone: "UTC",
  locale: "en-US",
  availability: "available",
  provenance: "declared",
  revision: 1,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

// In-memory PersonalStateRepository fake, scoped to exactly one user -
// only the outermost persistence edge is swapped (mirroring the
// established .overrideProvider(DatabaseService) convention in
// ai-context.module.spec.ts); PersonalStateUseCase, ContextResolutionAdapter,
// AIContextService, AIRuntime, CapabilityRegistry, and ModelRouter all
// remain completely real and are genuinely exercised.
function fakePersonalStateRepository(): PersonalStateRepository {
  return {
    findByUserId: async (userId: string) => (userId === FIXTURE_PERSONAL_STATE.userId ? FIXTURE_PERSONAL_STATE : undefined),
    create: async () => {
      throw new Error("create() must not be called by this read-only increment");
    },
    updateForUser: async () => {
      throw new Error("updateForUser() must not be called by this read-only increment");
    },
    findRevisionsForUser: async () => [],
  };
}

// Only the ModelRouter provider's data source (an empty ModelRegistry/
// ProviderRegistry in production, per ai-runtime.module.ts's own design
// note) is swapped for a seeded one here - ModelRouter.select()'s own
// logic remains completely real and unmocked.
function seededModelRouter(): ModelRouter {
  const modelRegistry = new ModelRegistry();
  const providerRegistry = new ProviderRegistry();
  providerRegistry.register({ providerId: "test-provider", capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS, eligible: true });
  modelRegistry.register({ modelId: "decivexa-infra-validation-placeholder-model", providerId: "test-provider", capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS, eligible: true });
  return new ModelRouter(modelRegistry, providerRegistry);
}

test("AIRuntimeModule registers exactly one capability - personal-state.interpret - retrievable through the real CapabilityRegistry provider", async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AIRuntimeModule] })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const registry = moduleRef.get(CapabilityRegistry);
  const entry = registry.get("personal-state.interpret");

  assert.deepEqual(entry, PERSONAL_STATE_INTERPRET_CAPABILITY);
  assert.deepEqual(entry.requiredContext, ["personal-state"]);

  await moduleRef.close();
});

test("AIRuntimeModule resolves a real AIRuntime and AIRuntimeController through production DI wiring", async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AIRuntimeModule] })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const runtime = moduleRef.get(AIRuntime);
  const controller = moduleRef.get(AIRuntimeController);

  assert.ok(runtime instanceof AIRuntime);
  assert.ok(controller instanceof AIRuntimeController);

  await moduleRef.close();
});

test("real production wiring: Controller -> AIRuntime -> CapabilityRegistry -> ContextResolutionPort -> ContextResolutionAdapter -> PersonalStateUseCase -> ModelRouter resolves Personal State without a selector and returns a real routing result", async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AIRuntimeModule] })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .overrideProvider(PERSONAL_STATE_REPOSITORY)
    .useValue(fakePersonalStateRepository())
    .overrideProvider(ModelRouter)
    .useFactory({ factory: () => seededModelRouter() })
    .compile();

  const controller = moduleRef.get(AIRuntimeController);
  const authenticatedRequest = { context: createRequestContext("request-1", FIXTURE_PERSONAL_STATE.userId) };

  const result = await controller.routeInterpret(authenticatedRequest);

  assert.equal(result.capabilityId, "personal-state.interpret");
  assert.equal(result.stage, "routed");
  assert.equal(result.routing.modelId, "decivexa-infra-validation-placeholder-model");
  assert.equal(result.routing.providerId, "test-provider");
  assert.match(result.note, /no ai output was generated/i);

  await moduleRef.close();
});

// Gate 4 (Founder Implementation Authorization: "GATE 4 — PROVIDER
// INSTANCE CONSTRUCTION + RESOLVER MAP POPULATION"): proves, through
// real production DI (no override), that KeyedProviderResolver now
// resolves a real AIProvider-shaped instance for "openai-compatible".
// This test deliberately never calls .generate()/.healthCheck() on the
// resolved instance - it only checks that those methods exist as
// functions (the AIProvider interface shape), which proves resolution
// without crossing the execution/network boundary. resolve() itself is
// a pure Map.get() (KeyedProviderResolver, unmodified since Gate 1), so
// no network call or credential read is possible from this test either.
test("AIRuntimeModule resolves KeyedProviderResolver with a real, credential-free AIProvider instance for \"openai-compatible\", without invoking generate()/healthCheck() - Gate 4", async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AIRuntimeModule] })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const resolver = moduleRef.get(KeyedProviderResolver);
  assert.ok(resolver instanceof KeyedProviderResolver);

  const resolved = await resolver.resolve("openai-compatible");
  assert.ok(resolved, 'resolver.resolve("openai-compatible") must return a defined AIProvider instance');
  assert.ok(resolved instanceof OpenAiCompatibleProviderAdapter, "the resolved instance must be a real OpenAiCompatibleProviderAdapter");
  assert.equal(typeof resolved!.generate, "function", "the resolved instance must expose the AIProvider interface's generate()");
  assert.equal(typeof resolved!.healthCheck, "function", "the resolved instance must expose the AIProvider interface's healthCheck()");
  assert.equal(typeof resolved!.getCapabilities, "function", "the resolved instance must expose the AIProvider interface's getCapabilities()");
  assert.equal(typeof resolved!.getLimits, "function", "the resolved instance must expose the AIProvider interface's getLimits()");

  const resolvedMissing = await resolver.resolve("some-other-provider-id");
  assert.equal(resolvedMissing, undefined, "an unmapped providerId must still return undefined");

  await moduleRef.close();
});

// Gate 3 (Founder Implementation Authorization: "GATE 3 — METADATA
// REGISTRATION ONLY") superseded this test's original premise
// (production ModelRouter was unseeded, so routing always, correctly,
// failed with a 503). Production ModelRouter is now seeded with exactly
// one real provider/model metadata entry (ai-runtime.module.ts), so this
// same, unmodified request now correctly returns a real RoutingResult
// instead. This test deliberately does NOT override ModelRouter (unlike
// the test above it) - the point is to prove the real, unmodified
// production DI wiring itself now resolves real metadata end-to-end.
// This is routing-metadata verification only: route() is called, never
// execute(); no AIProvider.generate()/healthCheck() is invoked; no
// network call occurs.
test("production wiring, now seeded with Gate 3 provider/model metadata, correctly returns a real RoutingResult without any ModelRouter override - the expected, documented behavior of this gate's real AppModule configuration", async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AIRuntimeModule] })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .overrideProvider(PERSONAL_STATE_REPOSITORY)
    .useValue(fakePersonalStateRepository())
    .compile();

  const controller = moduleRef.get(AIRuntimeController);
  const authenticatedRequest = { context: createRequestContext("request-1", FIXTURE_PERSONAL_STATE.userId) };

  const result = await controller.routeInterpret(authenticatedRequest);

  assert.equal(result.capabilityId, "personal-state.interpret");
  assert.equal(result.stage, "routed");
  assert.equal(result.routing.modelId, "decivexa-infra-validation-placeholder-model");
  assert.equal(result.routing.providerId, "openai-compatible");
  assert.match(result.note, /no ai output was generated/i);

  await moduleRef.close();
});
