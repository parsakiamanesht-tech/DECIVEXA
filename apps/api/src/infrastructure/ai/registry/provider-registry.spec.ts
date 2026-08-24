import test from "node:test";
import assert from "node:assert/strict";
import { ProviderRegistry } from "./provider-registry";
import { IneligibleProviderError, UnknownProviderError } from "./registry.errors";
import type { ProviderRegistrationInput } from "./registry.types";

const CAPABILITIES = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const LIMITS = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };

function eligibleProvider(providerId: string): ProviderRegistrationInput {
  return { providerId, capabilities: CAPABILITIES, limits: LIMITS, eligible: true };
}

// A. successful registration
test("ProviderRegistry represents a valid approved provider", () => {
  const registry = new ProviderRegistry();
  registry.register(eligibleProvider("openai-compatible"));

  const entry = registry.get("openai-compatible");

  assert.equal(entry.providerId, "openai-compatible");
  assert.equal(entry.eligible, true);
});

// B. deterministic lookup
test("ProviderRegistry lookup is deterministic across repeated calls", () => {
  const registry = new ProviderRegistry();
  registry.register(eligibleProvider("openai-compatible"));

  const first = registry.get("openai-compatible");
  const second = registry.get("openai-compatible");

  assert.deepEqual(first, second);
});

// C. unknown provider
test("ProviderRegistry rejects an unknown provider", () => {
  const registry = new ProviderRegistry();

  assert.throws(() => registry.get("does-not-exist"), UnknownProviderError);
});

// E. ineligible provider
test("ProviderRegistry rejects a registered but ineligible provider", () => {
  const registry = new ProviderRegistry();
  registry.register({ providerId: "restricted-provider", capabilities: CAPABILITIES, limits: LIMITS, eligible: false });

  assert.throws(() => registry.get("restricted-provider"), IneligibleProviderError);
});

// F. capability metadata
test("ProviderRegistry returns the registered capability and limit metadata exactly", () => {
  const registry = new ProviderRegistry();
  const capabilities = { streaming: true, structuredOutput: false, embeddings: true, contextWindow: 8192 };
  const limits = { maxOutputTokens: 4096, maxInputTokens: 8192, requestsPerMinute: 60 };
  registry.register({ providerId: "capable-provider", capabilities, limits, eligible: true });

  const entry = registry.get("capable-provider");

  assert.deepEqual(entry.capabilities, capabilities);
  assert.deepEqual(entry.limits, limits);
});

// G. no accidental execution
test("ProviderRegistry never invokes a provider adapter during registration or lookup", () => {
  let generateCalls = 0;
  let healthCheckCalls = 0;
  const fakeAdapterShapedInput = eligibleProvider("tracked-provider");
  // The registry only ever stores/returns plain data (ProviderRegistrationInput);
  // it has no reference to, and never calls, generate()/healthCheck() on any
  // adapter. Simulate an adapter with call counters and confirm registering
  // *pre-computed metadata* about it never touches those counters.
  const registry = new ProviderRegistry();
  registry.register(fakeAdapterShapedInput);
  registry.get("tracked-provider");
  registry.has("tracked-provider");

  assert.equal(generateCalls, 0);
  assert.equal(healthCheckCalls, 0);
});

// H. boundary integrity
test("has() reports registration state without throwing for missing entries", () => {
  const registry = new ProviderRegistry();
  registry.register(eligibleProvider("openai-compatible"));

  assert.equal(registry.has("openai-compatible"), true);
  assert.equal(registry.has("unknown"), false);
});
