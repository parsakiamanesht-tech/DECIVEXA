import test from "node:test";
import assert from "node:assert/strict";
import { OpenAiCompatibleProviderAdapter } from "./openai-compatible-provider.adapter";
import {
  AuthenticationFailedError,
  InvalidRequestError,
  InvalidResponseError,
  ProviderError,
  ProviderUnavailableError,
  RateLimitedError,
  TimeoutError,
} from "../errors/ai-provider.errors";
import type { OpenAiCompatibleProviderConfig } from "../config/openai-compatible-provider.config";

// All tests use deterministic, local fetch fakes. No real network call is
// made and no real provider credential is used anywhere in this file.
const TEST_CONFIG: OpenAiCompatibleProviderConfig = {
  endpoint: "http://localhost:8000/v1",
  apiKey: "test-fixture-secret-do-not-leak",
  timeoutMs: 25,
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// 1. successful generation normalization
test("generate normalizes a successful OpenAI-compatible response", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () =>
    jsonResponse({
      choices: [{ message: { content: "hello from the adapter" }, finish_reason: "stop" }],
      usage: { prompt_tokens: 10, completion_tokens: 4 },
    }),
  );

  const result = await adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] });

  assert.equal(result.text, "hello from the adapter");
  assert.equal(result.finishReason, "stop");
  assert.deepEqual(result.usage, { inputTokens: 10, outputTokens: 4 });
});

// 2. capability normalization
test("getCapabilities returns only capabilities this adapter actually supports", () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({}));

  assert.deepEqual(adapter.getCapabilities(), {
    streaming: false,
    structuredOutput: false,
    embeddings: false,
    contextWindow: null,
  });
});

// 3. limits normalization
test("getLimits returns conservative defaults rather than fabricated values", () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({}));

  assert.deepEqual(adapter.getLimits(), {
    maxOutputTokens: null,
    maxInputTokens: null,
    requestsPerMinute: null,
  });
});

// 4. health-check normalization (available path)
test("healthCheck normalizes a successful probe", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ data: [] }));

  const health = await adapter.healthCheck();

  assert.equal(health.available, true);
  assert.equal(health.errorSignal, null);
  assert.equal(typeof health.latencyMs, "number");
});

// health-check normalization (unavailable path)
test("healthCheck normalizes a failed probe without throwing", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => {
    throw new Error("connection refused");
  });

  const health = await adapter.healthCheck();

  assert.equal(health.available, false);
  assert.equal(health.errorSignal, ProviderUnavailableError.name);
});

// 5. timeout normalization
test("generate normalizes an abort/timeout into TimeoutError", async () => {
  const neverResolves = (_input: string, init: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => {
        const abortError = new Error("The operation was aborted");
        abortError.name = "AbortError";
        reject(abortError);
      });
    });
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, neverResolves);

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    TimeoutError,
  );
});

// 6. provider-unavailable normalization
test("generate normalizes a network failure into ProviderUnavailableError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => {
    throw new Error("ECONNREFUSED");
  });

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    ProviderUnavailableError,
  );
});

test("generate normalizes a 5xx status into ProviderUnavailableError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "boom" }, 503));

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    ProviderUnavailableError,
  );
});

// 7. authentication-failure normalization
test("generate normalizes a 401 status into AuthenticationFailedError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "unauthorized" }, 401));

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    AuthenticationFailedError,
  );
});

// 8. rate-limit normalization
test("generate normalizes a 429 status into RateLimitedError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "slow down" }, 429));

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    RateLimitedError,
  );
});

// 9. invalid-response normalization
test("generate normalizes a malformed body into InvalidResponseError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(
    TEST_CONFIG,
    async () => new Response("not json", { status: 200, headers: { "content-type": "application/json" } }),
  );

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    InvalidResponseError,
  );
});

test("generate normalizes a well-formed but shape-invalid body into InvalidResponseError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ unexpected: true }));

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    InvalidResponseError,
  );
});

// 10. invalid-request normalization
test("generate normalizes a 400 status into InvalidRequestError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "bad request" }, 400));

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    InvalidRequestError,
  );
});

// 11. generic provider-error normalization
test("generate normalizes an unmapped non-ok status into ProviderError", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "teapot" }, 418));

  await assert.rejects(
    adapter.generate({ model: "test-model", messages: [{ role: "user", content: "hi" }] }),
    ProviderError,
  );
});

// 12. secret non-leakage
test("no thrown error message ever contains the configured API key", async () => {
  const scenarios: Array<() => Promise<unknown>> = [
    () =>
      new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => {
        throw new Error(`network error reaching ${TEST_CONFIG.endpoint}?key=${TEST_CONFIG.apiKey}`);
      }).generate({ model: "m", messages: [{ role: "user", content: "hi" }] }),
    () =>
      new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "denied" }, 401)).generate({
        model: "m",
        messages: [{ role: "user", content: "hi" }],
      }),
    () =>
      new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "rate" }, 429)).generate({
        model: "m",
        messages: [{ role: "user", content: "hi" }],
      }),
  ];

  for (const run of scenarios) {
    await assert.rejects(run(), (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.ok(!error.message.includes(TEST_CONFIG.apiKey as string));
      assert.ok(!JSON.stringify(error).includes(TEST_CONFIG.apiKey as string));
      return true;
    });
  }
});

// 13. provider-specific type containment
test("thrown errors are plain normalized instances with no leaked provider payload", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () => jsonResponse({ error: "denied" }, 401));

  await assert.rejects(
    adapter.generate({ model: "m", messages: [{ role: "user", content: "hi" }] }),
    (error: unknown) => {
      assert.ok(error instanceof AuthenticationFailedError);
      assert.ok(error instanceof ProviderError);
      // Only the standard Error surface is present — no raw provider
      // response object attached to the normalized error.
      assert.deepEqual(Object.keys(error as object).sort(), []);
      return true;
    },
  );
});

test("a successful result never exposes a raw provider response object", async () => {
  const adapter = new OpenAiCompatibleProviderAdapter(TEST_CONFIG, async () =>
    jsonResponse({
      choices: [{ message: { content: "ok" }, finish_reason: "stop" }],
      id: "provider-internal-id-should-not-leak",
      object: "chat.completion",
    }),
  );

  const result = await adapter.generate({ model: "m", messages: [{ role: "user", content: "hi" }] });

  assert.deepEqual(Object.keys(result).sort(), ["finishReason", "text"]);
});
