import test from "node:test";
import assert from "node:assert/strict";
import { Gate7CompositeProviderResolver } from "./gate7-composite-provider-resolver";
import { KeyedProviderResolver } from "../runtime/provider-instance-resolver";
import { LazyGate7ProviderResolver } from "./gate7-lazy-provider-resolver";
import { GATE7_PROVIDER_ID } from "./gate7-identifiers";
import type { AIProvider } from "../provider/ai-provider.interface";

function fakeProvider(): AIProvider {
  return {
    generate: async () => ({ text: "x", finishReason: "stop" }),
    healthCheck: async () => ({ available: true, latencyMs: 0, errorSignal: null }),
    getCapabilities: () => ({ streaming: false, structuredOutput: false, embeddings: false, contextWindow: null }),
    getLimits: () => ({ maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null }),
  };
}

test("Gate7CompositeProviderResolver delegates to the keyed resolver's existing inert entry when present", async () => {
  const inertProvider = fakeProvider();
  const keyed = new KeyedProviderResolver(new Map([["openai-compatible", inertProvider]]));
  const gate7 = new LazyGate7ProviderResolver({});
  const composite = new Gate7CompositeProviderResolver(keyed, gate7);

  const resolved = await composite.resolve("openai-compatible");
  assert.equal(resolved, inertProvider);
});

test("Gate7CompositeProviderResolver delegates to the Gate-7 lazy resolver for GATE7_PROVIDER_ID, without touching the keyed resolver's map", async () => {
  const keyed = new KeyedProviderResolver(new Map()); // deliberately empty - GATE7_PROVIDER_ID is never in the keyed map
  const gate7 = new LazyGate7ProviderResolver({
    AI_PROVIDER_ENDPOINT: "https://trusted.example.com",
    AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS: "https://trusted.example.com",
  });
  const composite = new Gate7CompositeProviderResolver(keyed, gate7);

  const resolved = await composite.resolve(GATE7_PROVIDER_ID);
  assert.ok(resolved, "the Gate-7 lazy resolver must resolve GATE7_PROVIDER_ID");
});

test("Gate7CompositeProviderResolver returns undefined for a providerId known to neither resolver", async () => {
  const keyed = new KeyedProviderResolver(new Map());
  const gate7 = new LazyGate7ProviderResolver({});
  const composite = new Gate7CompositeProviderResolver(keyed, gate7);

  const resolved = await composite.resolve("completely-unknown-provider-id");
  assert.equal(resolved, undefined);
});
