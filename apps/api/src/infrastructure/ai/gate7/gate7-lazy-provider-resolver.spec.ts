import test from "node:test";
import assert from "node:assert/strict";
import { LazyGate7ProviderResolver } from "./gate7-lazy-provider-resolver";
import { GATE7_PROVIDER_ID } from "./gate7-identifiers";
import { OpenAiCompatibleProviderAdapter } from "../adapters/openai-compatible-provider.adapter";
import { ProviderConfigurationError } from "../errors/ai-provider.errors";

test("LazyGate7ProviderResolver.resolve() returns undefined for any providerId other than GATE7_PROVIDER_ID, without reading any env var", () => {
  let envRead = false;
  const trackedEnv = new Proxy(
    {},
    {
      get: () => {
        envRead = true;
        return undefined;
      },
    },
  ) as NodeJS.ProcessEnv;

  const resolver = new LazyGate7ProviderResolver(trackedEnv);
  return resolver.resolve("some-other-provider-id").then((result) => {
    assert.equal(result, undefined);
    assert.equal(envRead, false, "resolving an unrelated providerId must never read any environment variable");
  });
});

test("constructing LazyGate7ProviderResolver performs zero configuration reads (lazy per FD-3(B))", () => {
  let envRead = false;
  const trackedEnv = new Proxy(
    {},
    {
      get: () => {
        envRead = true;
        return undefined;
      },
    },
  ) as NodeJS.ProcessEnv;

  new LazyGate7ProviderResolver(trackedEnv);
  assert.equal(envRead, false, "the constructor itself must never read any environment variable");
});

test("LazyGate7ProviderResolver.resolve(GATE7_PROVIDER_ID) throws a typed ProviderConfigurationError when AI_PROVIDER_ENDPOINT is absent, only at resolve() time", async () => {
  const resolver = new LazyGate7ProviderResolver({});
  await assert.rejects(() => resolver.resolve(GATE7_PROVIDER_ID), ProviderConfigurationError);
});

test("LazyGate7ProviderResolver.resolve(GATE7_PROVIDER_ID) succeeds and returns a real, structurally complete AIProvider instance when every check passes (fake env, no network call performed)", async () => {
  const fakeEnv: NodeJS.ProcessEnv = {
    AI_PROVIDER_ENDPOINT: "https://trusted.example.com",
    AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS: "https://trusted.example.com",
  };
  const resolver = new LazyGate7ProviderResolver(fakeEnv, async () => {
    throw new Error("no network call must occur while merely resolving/constructing a provider instance");
  });

  const resolved = await resolver.resolve(GATE7_PROVIDER_ID);
  assert.ok(resolved instanceof OpenAiCompatibleProviderAdapter);
  assert.equal(typeof resolved!.generate, "function");
  assert.equal(typeof resolved!.healthCheck, "function");
});
