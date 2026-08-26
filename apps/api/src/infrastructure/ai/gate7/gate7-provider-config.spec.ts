import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveGate7ProviderConfig,
  resolveGate7RequestSizeLimitBytes,
  resolveGate7ResponseSizeLimitBytes,
  resolveGate7TrustedEndpoints,
} from "./gate7-provider-config";
import { Gate7InsecureSchemeError, Gate7PrivateDestinationError, Gate7UntrustedEndpointError } from "./gate7-provider-security.errors";
import { ProviderConfigurationError } from "../errors/ai-provider.errors";

// No real environment variable is ever read or mutated by this file — a
// fresh, isolated fake env object is supplied to every resolver call.

test("resolveGate7TrustedEndpoints returns an empty set when the env var is absent (fail-closed default)", () => {
  assert.deepEqual(resolveGate7TrustedEndpoints({}), new Set());
});

test("resolveGate7TrustedEndpoints parses a comma-separated allow-list, trimming whitespace and dropping empty entries", () => {
  const result = resolveGate7TrustedEndpoints({ AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS: " https://a.example.com , https://b.example.com ,," });
  assert.deepEqual(result, new Set(["https://a.example.com", "https://b.example.com"]));
});

test("resolveGate7RequestSizeLimitBytes/ResponseSizeLimitBytes fall back to their defaults when unset or invalid", () => {
  assert.equal(resolveGate7RequestSizeLimitBytes({}), 16_384);
  assert.equal(resolveGate7ResponseSizeLimitBytes({}), 65_536);
  assert.equal(resolveGate7RequestSizeLimitBytes({ AI_PROVIDER_GATE7_MAX_REQUEST_BYTES: "not-a-number" }), 16_384);
  assert.equal(resolveGate7RequestSizeLimitBytes({ AI_PROVIDER_GATE7_MAX_REQUEST_BYTES: "-5" }), 16_384);
});

test("resolveGate7RequestSizeLimitBytes/ResponseSizeLimitBytes honor a valid explicit override", () => {
  assert.equal(resolveGate7RequestSizeLimitBytes({ AI_PROVIDER_GATE7_MAX_REQUEST_BYTES: "2048" }), 2048);
  assert.equal(resolveGate7ResponseSizeLimitBytes({ AI_PROVIDER_GATE7_MAX_RESPONSE_BYTES: "4096" }), 4096);
});

test("resolveGate7ProviderConfig throws the base ProviderConfigurationError when AI_PROVIDER_ENDPOINT is absent", () => {
  assert.throws(() => resolveGate7ProviderConfig({}), ProviderConfigurationError);
});

test("resolveGate7ProviderConfig throws Gate7InsecureSchemeError for a non-HTTPS endpoint, before the trusted-endpoint check", () => {
  assert.throws(
    () => resolveGate7ProviderConfig({ AI_PROVIDER_ENDPOINT: "http://trusted.example.com" }),
    Gate7InsecureSchemeError,
  );
});

test("resolveGate7ProviderConfig throws Gate7PrivateDestinationError for a private-looking endpoint", () => {
  assert.throws(
    () => resolveGate7ProviderConfig({ AI_PROVIDER_ENDPOINT: "https://127.0.0.1" }),
    Gate7PrivateDestinationError,
  );
});

test("resolveGate7ProviderConfig throws Gate7UntrustedEndpointError when the allow-list does not contain the (otherwise valid) endpoint", () => {
  assert.throws(
    () => resolveGate7ProviderConfig({ AI_PROVIDER_ENDPOINT: "https://trusted.example.com" }),
    Gate7UntrustedEndpointError,
  );
});

test("resolveGate7ProviderConfig succeeds and returns base + limits when every check passes (fake env only)", () => {
  const config = resolveGate7ProviderConfig({
    AI_PROVIDER_ENDPOINT: "https://trusted.example.com",
    AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS: "https://trusted.example.com",
    AI_PROVIDER_API_KEY: "test-fixture-secret-do-not-leak",
    AI_PROVIDER_TIMEOUT_MS: "5000",
  });

  assert.equal(config.base.endpoint, "https://trusted.example.com");
  assert.equal(config.base.timeoutMs, 5000);
  assert.equal(config.limits.maxRequestBytes, 16_384);
  assert.equal(config.limits.maxResponseBytes, 65_536);
});

test("resolveGate7ProviderConfig never includes the resolved apiKey value in any thrown error message", () => {
  try {
    resolveGate7ProviderConfig({ AI_PROVIDER_ENDPOINT: "http://trusted.example.com", AI_PROVIDER_API_KEY: "test-fixture-secret-do-not-leak" });
    assert.fail("expected resolveGate7ProviderConfig to throw for a non-HTTPS endpoint");
  } catch (error) {
    assert.ok(error instanceof Error);
    assert.equal(error.message.includes("test-fixture-secret-do-not-leak"), false);
  }
});
