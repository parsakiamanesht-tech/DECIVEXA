import test from "node:test";
import assert from "node:assert/strict";
import { toProviderRegistrationInput } from "./register-provider-adapter";
import { ProviderRegistry } from "./provider-registry";
import { OpenAiCompatibleProviderAdapter } from "../adapters/openai-compatible-provider.adapter";
import type { OpenAiCompatibleProviderConfig } from "../config/openai-compatible-provider.config";

const TEST_CONFIG: OpenAiCompatibleProviderConfig = {
  endpoint: "http://localhost:8000/v1",
  apiKey: null,
  timeoutMs: 1000,
};

// Confirms the existing AI Provider Adapter Foundation can be represented
// in the registry without a second provider being added, and without the
// snapshot ever performing a network call.
test("the existing OpenAiCompatibleProviderAdapter can be registered via a metadata snapshot", () => {
  let fetchCalls = 0;
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => {
    fetchCalls += 1;
    throw new Error("should never be called by registration");
  });

  const input = toProviderRegistrationInput("openai-compatible", adapter, true);

  const registry = new ProviderRegistry();
  registry.register(input);
  const entry = registry.get("openai-compatible");

  assert.equal(entry.providerId, "openai-compatible");
  assert.deepEqual(entry.capabilities, adapter.getCapabilities());
  assert.deepEqual(entry.limits, adapter.getLimits());
  assert.equal(fetchCalls, 0);
});
