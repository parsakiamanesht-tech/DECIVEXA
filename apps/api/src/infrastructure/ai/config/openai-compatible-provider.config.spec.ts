import test from "node:test";
import assert from "node:assert/strict";
import { ProviderConfigurationError } from "../errors/ai-provider.errors";
import { resolveOpenAiCompatibleProviderConfig } from "./openai-compatible-provider.config";

test("resolveOpenAiCompatibleProviderConfig rejects a missing endpoint", () => {
  assert.throws(
    () => resolveOpenAiCompatibleProviderConfig({}),
    ProviderConfigurationError,
  );
});

test("resolveOpenAiCompatibleProviderConfig rejects an empty endpoint", () => {
  assert.throws(
    () => resolveOpenAiCompatibleProviderConfig({ AI_PROVIDER_ENDPOINT: "   " }),
    ProviderConfigurationError,
  );
});

test("resolveOpenAiCompatibleProviderConfig rejects a non-numeric timeout", () => {
  assert.throws(
    () =>
      resolveOpenAiCompatibleProviderConfig({
        AI_PROVIDER_ENDPOINT: "http://localhost:8000/v1",
        AI_PROVIDER_TIMEOUT_MS: "not-a-number",
      }),
    ProviderConfigurationError,
  );
});

test("resolveOpenAiCompatibleProviderConfig rejects a non-positive timeout", () => {
  assert.throws(
    () =>
      resolveOpenAiCompatibleProviderConfig({
        AI_PROVIDER_ENDPOINT: "http://localhost:8000/v1",
        AI_PROVIDER_TIMEOUT_MS: "0",
      }),
    ProviderConfigurationError,
  );
});

test("resolveOpenAiCompatibleProviderConfig applies a default timeout when unset", () => {
  const config = resolveOpenAiCompatibleProviderConfig({
    AI_PROVIDER_ENDPOINT: "http://localhost:8000/v1",
  });

  assert.equal(config.endpoint, "http://localhost:8000/v1");
  assert.equal(config.apiKey, null);
  assert.equal(config.timeoutMs, 30_000);
});

test("resolveOpenAiCompatibleProviderConfig does not invent an authentication requirement", () => {
  const config = resolveOpenAiCompatibleProviderConfig({
    AI_PROVIDER_ENDPOINT: "http://localhost:8000/v1",
  });

  assert.equal(config.apiKey, null);
});

test("resolveOpenAiCompatibleProviderConfig reads a fully specified configuration", () => {
  const config = resolveOpenAiCompatibleProviderConfig({
    AI_PROVIDER_ENDPOINT: "http://localhost:8000/v1",
    AI_PROVIDER_API_KEY: "test-fixture-key-not-a-real-secret",
    AI_PROVIDER_TIMEOUT_MS: "5000",
  });

  assert.equal(config.endpoint, "http://localhost:8000/v1");
  assert.equal(config.apiKey, "test-fixture-key-not-a-real-secret");
  assert.equal(config.timeoutMs, 5000);
});
