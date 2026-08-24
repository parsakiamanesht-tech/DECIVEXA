import test from "node:test";
import assert from "node:assert/strict";
import { ModelRouter } from "./model-router";
import { ModelRegistry } from "../registry/model-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { NoEligibleCandidateError } from "./router.errors";
import { OpenAiCompatibleProviderAdapter } from "../adapters/openai-compatible-provider.adapter";
import type { OpenAiCompatibleProviderConfig } from "../config/openai-compatible-provider.config";
import type { ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";

const BASE_CAPABILITIES: ProviderCapabilities = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const BASE_LIMITS: ProviderLimits = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };

function setUp() {
  const modelRegistry = new ModelRegistry();
  const providerRegistry = new ProviderRegistry();
  providerRegistry.register({
    providerId: "openai-compatible",
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
    eligible: true,
  });
  const router = new ModelRouter(modelRegistry, providerRegistry);
  return { modelRegistry, providerRegistry, router };
}

// A. deterministic selection
test("select returns the same result for the same candidates and requirements", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "model-a",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  const first = router.select(["model-a"]);
  const second = router.select(["model-a"]);

  assert.deepEqual(first, second);
});

// B. eligible candidate
test("select returns an eligible, compatible candidate", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "model-a",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  const result = router.select(["model-a"]);

  assert.equal(result.modelId, "model-a");
  assert.equal(result.providerId, "openai-compatible");
});

// C. ineligible rejection (model-level)
test("select never returns an ineligible model", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "retired-model",
    providerId: "openai-compatible",
    eligible: false,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  assert.throws(() => router.select(["retired-model"]), NoEligibleCandidateError);
});

// C. ineligible rejection (provider-level)
test("select never returns a model whose provider is ineligible", () => {
  const { modelRegistry, providerRegistry, router } = setUp();
  providerRegistry.register({
    providerId: "restricted-provider",
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
    eligible: false,
  });
  modelRegistry.register({
    modelId: "model-with-restricted-provider",
    providerId: "restricted-provider",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  assert.throws(() => router.select(["model-with-restricted-provider"]), NoEligibleCandidateError);
});

// D. unknown handling
test("select excludes an unknown model id rather than treating it as a failure", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "model-a",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  // "unknown-model" is not registered at all; it must simply be excluded,
  // allowing the still-eligible "model-a" to be selected.
  const result = router.select(["unknown-model", "model-a"]);

  assert.equal(result.modelId, "model-a");
});

test("select throws NoEligibleCandidateError when every candidate is unknown", () => {
  const { router } = setUp();

  assert.throws(() => router.select(["unknown-1", "unknown-2"]), NoEligibleCandidateError);
});

// E. capability matching
test("select excludes a candidate missing a required capability", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "non-streaming-model",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: { ...BASE_CAPABILITIES, streaming: false },
    limits: BASE_LIMITS,
  });

  assert.throws(
    () => router.select(["non-streaming-model"], { requiredCapabilities: { streaming: true } }),
    NoEligibleCandidateError,
  );
});

test("select includes a candidate that satisfies a required capability", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "streaming-model",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: { ...BASE_CAPABILITIES, streaming: true },
    limits: BASE_LIMITS,
  });

  const result = router.select(["streaming-model"], { requiredCapabilities: { streaming: true } });

  assert.equal(result.modelId, "streaming-model");
});

// F. limit matching
test("select excludes a candidate whose context window is insufficient", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "small-context-model",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: { ...BASE_CAPABILITIES, contextWindow: 2048 },
    limits: BASE_LIMITS,
  });

  assert.throws(() => router.select(["small-context-model"], { minContextWindow: 8192 }), NoEligibleCandidateError);
});

test("select excludes a candidate whose max output tokens is insufficient", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "small-output-model",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: { ...BASE_LIMITS, maxOutputTokens: 256 },
  });

  assert.throws(() => router.select(["small-output-model"], { minMaxOutputTokens: 1024 }), NoEligibleCandidateError);
});

// G. deterministic tie-breaking
test("select picks a stable, deterministic winner among multiple compatible candidates", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "model-zeta",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });
  modelRegistry.register({
    modelId: "model-alpha",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  // Candidate array order is deliberately the reverse of alphabetical to
  // prove the winner is chosen by stable metadata (modelId), not by the
  // order candidates were supplied.
  const result = router.select(["model-zeta", "model-alpha"]);

  assert.equal(result.modelId, "model-alpha");
});

// H. no provider execution / I. no health polling
test("select never invokes any provider adapter method, including healthCheck", () => {
  let generateCalls = 0;
  let healthCheckCalls = 0;
  const config: OpenAiCompatibleProviderConfig = { endpoint: "http://localhost:8000/v1", apiKey: null, timeoutMs: 1000 };
  const adapter = new OpenAiCompatibleProviderAdapter(config, async () => {
    generateCalls += 1;
    healthCheckCalls += 1; // shared fetch stub; either call would increment this
    throw new Error("should never be called by routing selection");
  });

  const { modelRegistry, providerRegistry, router } = setUp();
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

  router.select(["tracked-model"]);

  assert.equal(generateCalls, 0);
  assert.equal(healthCheckCalls, 0);
});

// J. no domain/Memory access — static/structural: this file, and
// model-router.ts, import only from ../registry/**, ../provider/**,
// ../adapters/**, and ./router.types|errors — never from core/ or
// application/. Verified independently via repo-wide grep during the
// implementation report (see boundary inspection), not re-asserted here
// as a runtime test since there is nothing to invoke.

// K. no authorization — structural: RoutingResult carries only
// modelId/providerId/capabilities/limits; it has no field that could be
// mistaken for an execution permission or approval token.
test("RoutingResult carries only selection metadata, never an authorization/approval field", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "model-a",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  const result = router.select(["model-a"]);

  assert.deepEqual(Object.keys(result).sort(), ["capabilities", "limits", "modelId", "providerId"]);
});

// L. no Runtime coupling — structural: model-router.ts imports nothing
// from an AIRuntime module (none exists in the repository yet); verified
// via the boundary inspection grep, not a runtime-executable assertion.

// M. no fake scoring — RoutingRequirements/RoutingResult never carry any
// of quality/reliability/privacy_fit/region_eligibility/availability/
// latency_penalty/cost_penalty/risk_penalty.
test("routing types never include any not-yet-available scoring field", () => {
  const { modelRegistry, router } = setUp();
  modelRegistry.register({
    modelId: "model-a",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
  });

  const result = router.select(["model-a"]);
  const forbiddenKeys = [
    "quality",
    "reliability",
    "privacyFit",
    "regionEligibility",
    "availability",
    "latencyPenalty",
    "costPenalty",
    "riskPenalty",
    "score",
  ];

  for (const key of forbiddenKeys) {
    assert.equal(key in result, false);
  }
});
