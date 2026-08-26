import test from "node:test";
import assert from "node:assert/strict";
import {
  assertHttpsScheme,
  assertNotPrivateOrInternalDestination,
  assertTrustedEndpoint,
  createBoundedFetch,
  type Gate7FetchLike,
} from "./gate7-provider-security";
import {
  Gate7InsecureSchemeError,
  Gate7PrivateDestinationError,
  Gate7RequestTooLargeError,
  Gate7ResponseTooLargeError,
  Gate7UntrustedEndpointError,
} from "./gate7-provider-security.errors";

// --- Control 1: trusted-endpoint allow-list ---

test("assertTrustedEndpoint throws when the allow-list is empty (fail-closed default)", () => {
  assert.throws(() => assertTrustedEndpoint("https://trusted.example.com", new Set()), Gate7UntrustedEndpointError);
});

test("assertTrustedEndpoint throws when the endpoint is not in a non-empty allow-list", () => {
  assert.throws(() => assertTrustedEndpoint("https://untrusted.example.com", new Set(["https://trusted.example.com"])), Gate7UntrustedEndpointError);
});

test("assertTrustedEndpoint does not throw when the endpoint is exactly present in the allow-list", () => {
  assert.doesNotThrow(() => assertTrustedEndpoint("https://trusted.example.com", new Set(["https://trusted.example.com"])));
});

// --- Control 2: HTTPS-only ---

test("assertHttpsScheme throws for an http:// endpoint", () => {
  assert.throws(() => assertHttpsScheme("http://example.com"), Gate7InsecureSchemeError);
});

test("assertHttpsScheme throws for a malformed endpoint", () => {
  assert.throws(() => assertHttpsScheme("not-a-url"), Gate7InsecureSchemeError);
});

test("assertHttpsScheme does not throw for an https:// endpoint", () => {
  assert.doesNotThrow(() => assertHttpsScheme("https://example.com"));
});

// --- Control 3: private/internal destination rejection ---

test("assertNotPrivateOrInternalDestination throws for localhost", () => {
  assert.throws(() => assertNotPrivateOrInternalDestination("https://localhost/v1"), Gate7PrivateDestinationError);
});

test("assertNotPrivateOrInternalDestination throws for loopback, RFC1918, and link-local IPv4 literals", () => {
  for (const host of ["127.0.0.1", "10.0.0.5", "172.16.0.5", "192.168.1.1", "169.254.1.1"]) {
    assert.throws(() => assertNotPrivateOrInternalDestination(`https://${host}/v1`), Gate7PrivateDestinationError, `expected ${host} to be rejected`);
  }
});

test("assertNotPrivateOrInternalDestination throws for IPv6 loopback and link-local literals", () => {
  assert.throws(() => assertNotPrivateOrInternalDestination("https://[::1]/v1"), Gate7PrivateDestinationError);
  assert.throws(() => assertNotPrivateOrInternalDestination("https://[fe80::1]/v1"), Gate7PrivateDestinationError);
});

test("assertNotPrivateOrInternalDestination does not throw for a public-looking hostname", () => {
  assert.doesNotThrow(() => assertNotPrivateOrInternalDestination("https://api.example.com/v1"));
});

test("assertNotPrivateOrInternalDestination does not throw for a public-looking IPv4 literal", () => {
  assert.doesNotThrow(() => assertNotPrivateOrInternalDestination("https://203.0.113.10/v1"));
});

// --- Controls 4 + 5: request/response size limits, via the fetchImpl seam ---

function fakeFetch(body: string, headers: Record<string, string> = {}): Gate7FetchLike {
  return async () => new Response(body, { status: 200, headers: { "content-type": "application/json", ...headers } });
}

test("createBoundedFetch rejects an oversized request body before calling the wrapped fetch", async () => {
  let called = false;
  const inner: Gate7FetchLike = async () => {
    called = true;
    return new Response("{}", { status: 200 });
  };
  const bounded = createBoundedFetch(inner, { maxRequestBytes: 8, maxResponseBytes: 1_000 });

  await assert.rejects(
    () => bounded("https://example.com/v1", { method: "POST", body: "this body is definitely longer than 8 bytes" }),
    Gate7RequestTooLargeError,
  );
  assert.equal(called, false, "the wrapped fetch must never be called once the request size limit is exceeded");
});

test("createBoundedFetch allows a request body within the configured limit", async () => {
  const bounded = createBoundedFetch(fakeFetch('{"ok":true}'), { maxRequestBytes: 1_000, maxResponseBytes: 1_000 });
  const response = await bounded("https://example.com/v1", { method: "POST", body: "short" });
  assert.equal(response.status, 200);
});

test("createBoundedFetch rejects a response whose declared Content-Length exceeds the configured limit", async () => {
  const bounded = createBoundedFetch(fakeFetch("x".repeat(50), { "content-length": "50" }), { maxRequestBytes: 1_000, maxResponseBytes: 10 });
  await assert.rejects(() => bounded("https://example.com/v1", { method: "GET" }), Gate7ResponseTooLargeError);
});

test("createBoundedFetch rejects a streamed response body exceeding the configured limit even without a declared Content-Length", async () => {
  const inner: Gate7FetchLike = async () =>
    new Response(new ReadableStream<Uint8Array>({ start: (controller) => { controller.enqueue(new TextEncoder().encode("x".repeat(100))); controller.close(); } }), {
      status: 200,
    });
  const bounded = createBoundedFetch(inner, { maxRequestBytes: 1_000, maxResponseBytes: 10 });
  await assert.rejects(() => bounded("https://example.com/v1", { method: "GET" }), Gate7ResponseTooLargeError);
});

test("createBoundedFetch returns a usable Response for a small response body, preserving status/body content", async () => {
  const bounded = createBoundedFetch(fakeFetch('{"text":"ok"}'), { maxRequestBytes: 1_000, maxResponseBytes: 1_000 });
  const response = await bounded("https://example.com/v1", { method: "GET" });
  assert.equal(response.status, 200);
  const parsed = await response.json();
  assert.deepEqual(parsed, { text: "ok" });
});
