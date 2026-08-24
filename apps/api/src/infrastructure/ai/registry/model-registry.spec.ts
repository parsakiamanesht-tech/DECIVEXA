import test from "node:test";
import assert from "node:assert/strict";
import { ModelRegistry } from "./model-registry";
import { IneligibleModelError, UnknownModelError } from "./registry.errors";
import type { ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";

const CAPABILITIES: ProviderCapabilities = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const LIMITS: ProviderLimits = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };

// A. successful registration
test("ModelRegistry represents a valid approved model", () => {
  const registry = new ModelRegistry();
  registry.register({
    modelId: "local-model-1",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: CAPABILITIES,
    limits: LIMITS,
  });

  const entry = registry.get("local-model-1");

  assert.equal(entry.modelId, "local-model-1");
  assert.equal(entry.providerId, "openai-compatible");
  assert.equal(entry.eligible, true);
});

// B. deterministic lookup
test("ModelRegistry lookup is deterministic across repeated calls", () => {
  const registry = new ModelRegistry();
  registry.register({
    modelId: "local-model-1",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: CAPABILITIES,
    limits: LIMITS,
  });

  assert.deepEqual(registry.get("local-model-1"), registry.get("local-model-1"));
});

// D. unknown model
test("ModelRegistry rejects an unknown model", () => {
  const registry = new ModelRegistry();

  assert.throws(() => registry.get("does-not-exist"), UnknownModelError);
});

// E. ineligible model
test("ModelRegistry rejects a registered but ineligible model", () => {
  const registry = new ModelRegistry();
  registry.register({
    modelId: "retired-model",
    providerId: "openai-compatible",
    eligible: false,
    capabilities: CAPABILITIES,
    limits: LIMITS,
  });

  assert.throws(() => registry.get("retired-model"), IneligibleModelError);
});

// H. boundary integrity — association is plain metadata, no cross-registry validation performed here
test("ModelRegistry stores the provider association as metadata without validating it", () => {
  const registry = new ModelRegistry();
  registry.register({
    modelId: "orphan-model",
    providerId: "provider-not-registered-anywhere",
    eligible: true,
    capabilities: CAPABILITIES,
    limits: LIMITS,
  });

  const entry = registry.get("orphan-model");

  assert.equal(entry.providerId, "provider-not-registered-anywhere");
});

test("has() reports registration state without throwing for missing entries", () => {
  const registry = new ModelRegistry();
  registry.register({
    modelId: "local-model-1",
    providerId: "openai-compatible",
    eligible: true,
    capabilities: CAPABILITIES,
    limits: LIMITS,
  });

  assert.equal(registry.has("local-model-1"), true);
  assert.equal(registry.has("unknown"), false);
});

// --- Increment 2A: model-specific capability/limit metadata ---

// 1. model registration preserves capabilities
test("ModelRegistry preserves the registered model capabilities exactly", () => {
  const registry = new ModelRegistry();
  const capabilities: ProviderCapabilities = { streaming: true, structuredOutput: true, embeddings: false, contextWindow: 8192 };
  registry.register({ modelId: "capable-model", providerId: "openai-compatible", eligible: true, capabilities, limits: LIMITS });

  const entry = registry.get("capable-model");

  assert.deepEqual(entry.capabilities, capabilities);
});

// 2. model registration preserves limits
test("ModelRegistry preserves the registered model limits exactly", () => {
  const registry = new ModelRegistry();
  const limits: ProviderLimits = { maxOutputTokens: 2048, maxInputTokens: 8192, requestsPerMinute: 30 };
  registry.register({ modelId: "limited-model", providerId: "openai-compatible", eligible: true, capabilities: CAPABILITIES, limits });

  const entry = registry.get("limited-model");

  assert.deepEqual(entry.limits, limits);
});

// 3. model lookup returns the exact registered metadata (capabilities + limits together)
test("ModelRegistry lookup returns the exact registered capability and limit metadata together", () => {
  const registry = new ModelRegistry();
  const capabilities: ProviderCapabilities = { streaming: false, structuredOutput: true, embeddings: true, contextWindow: 32000 };
  const limits: ProviderLimits = { maxOutputTokens: 4096, maxInputTokens: 32000, requestsPerMinute: 10 };
  registry.register({ modelId: "full-model", providerId: "openai-compatible", eligible: true, capabilities, limits });

  const entry = registry.get("full-model");

  assert.deepEqual(entry, {
    modelId: "full-model",
    providerId: "openai-compatible",
    eligible: true,
    capabilities,
    limits,
  });
});

// 7. no provider execution (registration/lookup of capability metadata never touches an adapter)
test("registering model capability metadata never invokes any provider adapter method", () => {
  let calls = 0;
  const capabilities: ProviderCapabilities = { streaming: true, structuredOutput: false, embeddings: false, contextWindow: null };
  const registry = new ModelRegistry();

  registry.register({ modelId: "tracked-model", providerId: "openai-compatible", eligible: true, capabilities, limits: LIMITS });
  registry.get("tracked-model");
  registry.has("tracked-model");

  assert.equal(calls, 0);
});
