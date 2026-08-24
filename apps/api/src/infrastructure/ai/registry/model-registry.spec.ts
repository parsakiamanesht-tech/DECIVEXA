import test from "node:test";
import assert from "node:assert/strict";
import { ModelRegistry } from "./model-registry";
import { IneligibleModelError, UnknownModelError } from "./registry.errors";

// A. successful registration
test("ModelRegistry represents a valid approved model", () => {
  const registry = new ModelRegistry();
  registry.register({ modelId: "local-model-1", providerId: "openai-compatible", eligible: true });

  const entry = registry.get("local-model-1");

  assert.equal(entry.modelId, "local-model-1");
  assert.equal(entry.providerId, "openai-compatible");
  assert.equal(entry.eligible, true);
});

// B. deterministic lookup
test("ModelRegistry lookup is deterministic across repeated calls", () => {
  const registry = new ModelRegistry();
  registry.register({ modelId: "local-model-1", providerId: "openai-compatible", eligible: true });

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
  registry.register({ modelId: "retired-model", providerId: "openai-compatible", eligible: false });

  assert.throws(() => registry.get("retired-model"), IneligibleModelError);
});

// H. boundary integrity — association is plain metadata, no cross-registry validation performed here
test("ModelRegistry stores the provider association as metadata without validating it", () => {
  const registry = new ModelRegistry();
  registry.register({ modelId: "orphan-model", providerId: "provider-not-registered-anywhere", eligible: true });

  const entry = registry.get("orphan-model");

  assert.equal(entry.providerId, "provider-not-registered-anywhere");
});

test("has() reports registration state without throwing for missing entries", () => {
  const registry = new ModelRegistry();
  registry.register({ modelId: "local-model-1", providerId: "openai-compatible", eligible: true });

  assert.equal(registry.has("local-model-1"), true);
  assert.equal(registry.has("unknown"), false);
});
