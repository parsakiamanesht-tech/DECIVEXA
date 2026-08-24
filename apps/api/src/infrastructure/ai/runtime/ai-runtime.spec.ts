import test from "node:test";
import assert from "node:assert/strict";
import { AIRuntime } from "./ai-runtime";
import { AIRuntimeExecutionNotAvailableError, InvalidAITaskRequestError } from "./runtime.errors";
import { CapabilityRegistry } from "../capability/capability-registry";
import { UnknownCapabilityError, IneligibleCapabilityError } from "../capability/capability.errors";
import type { AICapabilityRegistrationInput } from "../capability/capability.types";
import { ModelRegistry } from "../registry/model-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { ModelRouter } from "../router/model-router";
import { NoEligibleCandidateError } from "../router/router.errors";
import { OpenAiCompatibleProviderAdapter } from "../adapters/openai-compatible-provider.adapter";
import type { OpenAiCompatibleProviderConfig } from "../config/openai-compatible-provider.config";
import type { ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";

const BASE_CAPABILITIES: ProviderCapabilities = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const BASE_LIMITS: ProviderLimits = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };

function eligibleCapability(
  capabilityId: string,
  overrides: Partial<AICapabilityRegistrationInput> = {},
): AICapabilityRegistrationInput {
  return {
    capabilityId,
    version: "v1",
    purpose: "test capability",
    inputSchema: null,
    outputSchema: null,
    requiredContext: [],
    privacyClassification: "standard",
    riskClassification: "informational-read-only",
    minimumQualityThreshold: null,
    latencyTargetMs: null,
    costTarget: null,
    allowedExecutionTiers: [],
    validationRequirements: [],
    humanApprovalRequired: false,
    eligible: true,
    ...overrides,
  };
}

function setUp() {
  const capabilityRegistry = new CapabilityRegistry();
  const modelRegistry = new ModelRegistry();
  const providerRegistry = new ProviderRegistry();
  providerRegistry.register({
    providerId: "openai-compatible",
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
    eligible: true,
  });
  const modelRouter = new ModelRouter(modelRegistry, providerRegistry);
  const runtime = new AIRuntime(capabilityRegistry, modelRouter);
  return { capabilityRegistry, modelRegistry, providerRegistry, modelRouter, runtime };
}

// A. deterministic routing result
test("route returns the same result for the same request", () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("goal-clarification"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const first = runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["model-a"] });
  const second = runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["model-a"] });

  assert.deepEqual(first, second);
});

// B. capability resolution occurs (an ineligible capability blocks
// routing even though a fully eligible model exists — proving the
// Runtime actually consults the CapabilityRegistry rather than skipping
// straight to model selection)
test("route rejects a registered but ineligible capability before consulting the Router", () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("retired-capability", { eligible: false }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  assert.throws(
    () => runtime.route({ capabilityId: "retired-capability", candidateModelIds: ["model-a"] }),
    IneligibleCapabilityError,
  );
});

// C. unknown capability produces a dedicated typed error
test("route throws UnknownCapabilityError for an unregistered capability", () => {
  const { modelRegistry, runtime } = setUp();
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  assert.throws(
    () => runtime.route({ capabilityId: "does-not-exist", candidateModelIds: ["model-a"] }),
    UnknownCapabilityError,
  );
});

// structural: malformed request shape produces a dedicated typed error
test("route throws InvalidAITaskRequestError for a structurally invalid request", () => {
  const { runtime } = setUp();

  assert.throws(
    () => runtime.route({ capabilityId: "", candidateModelIds: ["model-a"] }),
    InvalidAITaskRequestError,
  );
  assert.throws(
    () => runtime.route({ capabilityId: "goal-clarification", candidateModelIds: [] }),
    InvalidAITaskRequestError,
  );
});

// D. RoutingRequirements are derived from capability metadata only, and
// honestly: no field of AICapabilityRegistrationInput currently maps to
// a technical routing constraint, so a capability with strict-looking
// declarative metadata (high quality threshold, tight latency/cost
// targets) must not silently exclude a model that a fabricated mapping
// would have rejected.
test("routing requirements derived from a capability never fabricate a technical constraint", () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(
    eligibleCapability("decision-support", {
      minimumQualityThreshold: 0.99,
      latencyTargetMs: 1,
      costTarget: 0,
    }),
  );
  // A minimally-capable model (no streaming/structured output/embeddings,
  // no declared context window or output-token limit) must still be
  // selectable — proving the strict-looking capability metadata above
  // was not turned into an invented RoutingRequirements constraint.
  modelRegistry.register({ modelId: "minimal-model", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const result = runtime.route({ capabilityId: "decision-support", candidateModelIds: ["minimal-model"] });

  assert.equal(result.modelId, "minimal-model");
});

// E. ModelRouter.select() is invoked exactly once per Runtime invocation
test("route invokes ModelRouter.select exactly once", () => {
  const { capabilityRegistry, modelRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("goal-clarification"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  let selectCalls = 0;
  const originalSelect = modelRouter.select.bind(modelRouter);
  modelRouter.select = (...args: Parameters<typeof originalSelect>) => {
    selectCalls += 1;
    return originalSelect(...args);
  };

  runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["model-a"] });

  assert.equal(selectCalls, 1);
});

// F. Runtime returns the Router selection without rewriting Router
// behavior (including propagating the Router's own NoEligibleCandidateError)
test("route returns exactly what ModelRouter.select would return for the same candidates", () => {
  const { capabilityRegistry, modelRegistry, providerRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("goal-clarification"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const directResult = new ModelRouter(modelRegistry, providerRegistry).select(["model-a"]);
  const runtimeResult = runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["model-a"] });

  assert.deepEqual(runtimeResult, directResult);
});

test("route propagates ModelRouter's NoEligibleCandidateError unchanged", () => {
  const { capabilityRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("goal-clarification"));

  assert.throws(
    () => runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["unknown-model"] }),
    NoEligibleCandidateError,
  );
});

// G-L, R. no provider execution (generate/stream/structuredOutput/embed/
// healthCheck) and no network I/O anywhere in the routing pipeline
test("route never invokes any provider adapter method, including healthCheck", () => {
  let calls = 0;
  const config: OpenAiCompatibleProviderConfig = { endpoint: "http://localhost:8000/v1", apiKey: null, timeoutMs: 1000 };
  const adapter = new OpenAiCompatibleProviderAdapter(config, async () => {
    calls += 1;
    throw new Error("should never be called by AIRuntime routing");
  });

  const { capabilityRegistry, modelRegistry, providerRegistry, runtime } = setUp();
  providerRegistry.register({
    providerId: "tracked-provider",
    capabilities: adapter.getCapabilities(),
    limits: adapter.getLimits(),
    eligible: true,
  });
  modelRegistry.register({
    modelId: "tracked-model",
    providerId: "tracked-provider",
    eligible: true,
    capabilities: adapter.getCapabilities(),
    limits: adapter.getLimits(),
  });
  capabilityRegistry.register(eligibleCapability("goal-clarification"));

  runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["tracked-model"] });

  assert.equal(calls, 0);
});

// M. no authorization/approval field exists in the Runtime result
test("route's result carries only routing-selection metadata, never an authorization/approval field", () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("goal-clarification"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const result = runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["model-a"] });

  assert.deepEqual(Object.keys(result).sort(), ["capabilities", "limits", "modelId", "providerId"]);
});

// N. Runtime performs no policy decision
// O. Runtime performs no risk decision
// P. Runtime performs no Memory/domain/application access
// S. no HTTP/API exposure
// T. ModelRouter's public contract remains unchanged
//
// Structural: this file and ai-runtime.ts import only from
// ../capability/**, ../registry/**, ../router/**, ../provider/**,
// ../adapters/**, ../config/**, and ./runtime.types|errors — never from
// core/, application/, or domain/, and never from a PolicyEngine/
// RiskEngine module (neither exists in the repository). No controller or
// route is created anywhere in this increment. ModelRouter is
// constructed and called here with its existing, unmodified
// constructor/select signature (see the "F" tests above, which cross-
// check AIRuntime's result against a direct, separately-constructed
// ModelRouter instance) — model-router.ts, router.types.ts, and
// router.errors.ts are not modified by this increment, and
// ../router/model-router.spec.ts's own suite remains the regression
// authority for Router behavior. Verified via the boundary/security
// audit in the implementation report, not re-asserted here as further
// runtime tests since there is nothing else to invoke.

// Q. the execution/future boundary produces a dedicated,
// not-yet-available error rather than silently continuing
test("execute throws AIRuntimeExecutionNotAvailableError and never completes execution", () => {
  const { runtime } = setUp();

  assert.throws(() => runtime.execute(), AIRuntimeExecutionNotAvailableError);
});
