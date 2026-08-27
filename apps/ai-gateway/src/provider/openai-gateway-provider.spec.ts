import test from "node:test";
import assert from "node:assert/strict";
import { OpenAiGatewayProvider } from "./openai-gateway-provider";
import { MalformedProviderResponseError, ProviderTransportError } from "../errors/gateway.errors";
import type { CredentialSource } from "./credential-source.port";

const CONFIG = { endpoint: "https://api.openai.example/v1" };
const FAKE_CREDENTIAL = "test-fixture-secret-do-not-leak";

function fixedCredentialSource(value: string | null = FAKE_CREDENTIAL): CredentialSource {
  return { resolve: async () => value };
}

async function collect(chunks: AsyncIterable<Uint8Array>): Promise<unknown> {
  const parts: Uint8Array[] = [];
  for await (const chunk of chunks) parts.push(chunk);
  const total = parts.reduce((n, p) => n + p.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    merged.set(p, offset);
    offset += p.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(merged));
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

const VALID_REQUEST = {
  providerId: "openai",
  modelId: "gpt-4o",
  input: { messages: [{ role: "user" as const, content: "hi" }] },
};

test("generate sends the correct OpenAI chat/completions request shape", async () => {
  let captured: { url: string; init: RequestInit } | undefined;
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async (url, init) => {
    captured = { url, init };
    return jsonResponse({ choices: [{ message: { content: "ok" }, finish_reason: "stop" }] });
  });

  await provider.generate(VALID_REQUEST);

  assert.equal(captured?.url, "https://api.openai.example/v1/chat/completions");
  assert.equal(captured?.init.method, "POST");
  const headers = captured?.init.headers as Record<string, string>;
  assert.equal(headers.authorization, `Bearer ${FAKE_CREDENTIAL}`);
  assert.equal(headers["content-type"], "application/json");
  const body = JSON.parse(captured?.init.body as string);
  assert.equal(body.model, "gpt-4o");
  assert.deepEqual(body.messages, [{ role: "user", content: "hi" }]);
  assert.equal("max_tokens" in body, false);
});

test("generate includes max_tokens/temperature only when explicitly supplied", async () => {
  let captured: RequestInit | undefined;
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async (_url, init) => {
    captured = init;
    return jsonResponse({ choices: [{ message: { content: "ok" }, finish_reason: "stop" }] });
  });

  await provider.generate({
    ...VALID_REQUEST,
    input: { messages: [{ role: "user", content: "hi" }], maxOutputTokens: 128, temperature: 0.2 },
  });

  const body = JSON.parse(captured?.body as string);
  assert.equal(body.max_tokens, 128);
  assert.equal(body.temperature, 0.2);
});

test("generate normalizes a successful response into a DECIVEXA-owned shape, not a raw passthrough", async () => {
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () =>
    jsonResponse({
      choices: [{ message: { content: "hello" }, finish_reason: "stop" }],
      usage: { prompt_tokens: 5, completion_tokens: 2 },
      id: "provider-internal-id-should-not-leak",
      object: "chat.completion",
    }),
  );

  const { chunks } = await provider.generate(VALID_REQUEST);
  const output = await collect(chunks);

  assert.deepEqual(output, { text: "hello", finishReason: "stop", usage: { inputTokens: 5, outputTokens: 2 } });
});

test("generate rejects an input that does not match the expected shape, before any fetch occurs", async () => {
  let fetchCalled = false;
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () => {
    fetchCalled = true;
    return jsonResponse({});
  });

  await assert.rejects(
    provider.generate({ providerId: "openai", modelId: "gpt-4o", input: { not: "the right shape" } }),
    ProviderTransportError,
  );
  assert.equal(fetchCalled, false);
});

test("generate rejects when no credential is available, before any fetch occurs", async () => {
  let fetchCalled = false;
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(null), async () => {
    fetchCalled = true;
    return jsonResponse({});
  });

  await assert.rejects(provider.generate(VALID_REQUEST), ProviderTransportError);
  assert.equal(fetchCalled, false);
});

test("generate normalizes a network failure into ProviderTransportError", async () => {
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () => {
    throw new Error("ECONNREFUSED");
  });

  await assert.rejects(provider.generate(VALID_REQUEST), ProviderTransportError);
});

test("generate normalizes a non-ok HTTP status into ProviderTransportError", async () => {
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () => jsonResponse({ error: "denied" }, 401));

  await assert.rejects(provider.generate(VALID_REQUEST), ProviderTransportError);
});

test("generate normalizes a malformed (non-JSON) response body into MalformedProviderResponseError", async () => {
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () =>
    new Response("not json", { status: 200, headers: { "content-type": "application/json" } }),
  );

  await assert.rejects(provider.generate(VALID_REQUEST), MalformedProviderResponseError);
});

test("generate normalizes a well-formed but shape-invalid response body into MalformedProviderResponseError", async () => {
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () => jsonResponse({ unexpected: true }));

  await assert.rejects(provider.generate(VALID_REQUEST), MalformedProviderResponseError);
});

test("the configured credential never appears in any thrown error message", async () => {
  const provider = new OpenAiGatewayProvider(CONFIG, fixedCredentialSource(), async () => {
    throw new Error(`network error reaching ${CONFIG.endpoint}?key=${FAKE_CREDENTIAL}`);
  });

  await assert.rejects(provider.generate(VALID_REQUEST), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.ok(!error.message.includes(FAKE_CREDENTIAL));
    assert.ok(!JSON.stringify(error).includes(FAKE_CREDENTIAL));
    return true;
  });
});

test("credential is resolved fresh per call and never attached to the returned output", async () => {
  let resolveCalls = 0;
  const credentialSource: CredentialSource = {
    resolve: async () => {
      resolveCalls += 1;
      return FAKE_CREDENTIAL;
    },
  };
  const provider = new OpenAiGatewayProvider(CONFIG, credentialSource, async () =>
    jsonResponse({ choices: [{ message: { content: "ok" }, finish_reason: "stop" }] }),
  );

  const { chunks } = await provider.generate(VALID_REQUEST);
  const output = await collect(chunks);

  assert.equal(resolveCalls, 1);
  assert.equal(JSON.stringify(output).includes(FAKE_CREDENTIAL), false);
});

test("structural: this file never imports anything from apps/api (non-interference)", async () => {
  const fs = require("node:fs");
  const source = fs.readFileSync(require.resolve("./openai-gateway-provider"), "utf8");
  assert.equal(source.includes("apps/api"), false);
});
