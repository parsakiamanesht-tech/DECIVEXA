import test from "node:test";
import assert from "node:assert/strict";
import * as http from "node:http";
import { AddressInfo } from "node:net";
import { createGatewayServer, installGracefulShutdown, readBoundedRequestBody } from "./server";
import type { GatewayRequestHandlerDeps } from "./orchestration/gateway-request-handler";
import { FakeWorkloadAuthenticator } from "./auth/workload-authenticator.testkit";
import { InMemoryWorkloadRateLimiter } from "./rate-limit/workload-rate-limiter.port";
import { WorkloadConcurrencyGuard } from "./concurrency/workload-concurrency-guard";
import { InMemoryGatewayAuditSink } from "./audit/gateway-audit-record";
import { AlwaysFailingGatewayAuditSink } from "./audit/gateway-audit-record.testkit";
import {
  FakeFailingGatewayProvider,
  FakeMalformedGatewayProvider,
  FakeStreamHangingGatewayProvider,
  FakeSuccessfulGatewayProvider,
} from "./provider/gateway-provider.testkit";
import { MAX_REQUEST_BYTES } from "./provider/transport-limits";
import type { GatewayProvider } from "./provider/provider-adapter.interface";
import type { GatewayCapabilityTable } from "./authorization/gateway-policy";

const CAPABILITY = "gate7.controlled-execution";
const WORKLOAD_TOKEN = "fake-token-1";
const WORKLOAD_ID = "workload-a";
const TABLE: GatewayCapabilityTable = { [CAPABILITY]: { providerId: "test-provider", modelId: "test-model" } };
const ALLOWLIST = new Set([WORKLOAD_ID]);

function makeDeps(overrides: Partial<GatewayRequestHandlerDeps> = {}): GatewayRequestHandlerDeps {
  return {
    authenticator: new FakeWorkloadAuthenticator(new Map([[WORKLOAD_TOKEN, WORKLOAD_ID]])),
    allowlist: ALLOWLIST,
    capabilityTable: TABLE,
    rateLimiter: new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 1000, windowMs: 60_000 }),
    concurrencyGuard: new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 10 }),
    provider: new FakeSuccessfulGatewayProvider({ ok: true }),
    auditSink: new InMemoryGatewayAuditSink(),
    ...overrides,
  };
}

function validBody(fields: Record<string, unknown> = {}): string {
  return JSON.stringify({ capability: CAPABILITY, input: { hello: "world" }, correlationId: "corr-1", ...fields });
}

interface HttpResult {
  readonly status: number;
  readonly body: string;
  readonly json: unknown;
}

// Minimal, dependency-free HTTP client helper — node:http against
// 127.0.0.1 only (loopback, in-process; never a real network call).
function request(port: number, body: string, headers: Record<string, string> = {}): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "127.0.0.1", port, method: "POST", path: "/", headers: { "content-type": "application/json", ...headers } },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json: unknown;
          try {
            json = JSON.parse(text);
          } catch {
            json = undefined;
          }
          resolve({ status: res.statusCode ?? 0, body: text, json });
        });
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function withServer<T>(deps: GatewayRequestHandlerDeps, fn: (port: number) => Promise<T>): Promise<T> {
  const server = createGatewayServer(deps);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as AddressInfo).port;
  try {
    return await fn(port);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

// 1. Server binds correctly.
test("createGatewayServer: binds to an ephemeral port on 127.0.0.1", async () => {
  await withServer(makeDeps(), async (port) => {
    assert.ok(port > 0);
  });
});

// 2. Request contract accepted.
test("createGatewayServer: accepts a valid request end-to-end and returns 200 with a normalized success response", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { status: "success", output: { ok: true }, correlationId: "corr-1" });
  });
});

// 3. Malformed JSON rejected.
test("createGatewayServer: rejects invalid JSON as 400 malformed_request", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, "{ not json", { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 400);
    assert.equal((result.json as { errorCode: string }).errorCode, "malformed_request");
  });
});

// 4. Missing required field rejected.
test("createGatewayServer: rejects a body missing a required field as 400", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, JSON.stringify({ capability: CAPABILITY }), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 400);
    assert.equal((result.json as { errorCode: string }).errorCode, "malformed_request");
  });
});

// 5. Unknown capability rejected.
test("createGatewayServer: rejects an unknown capability as 403 unauthorized_capability", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, validBody({ capability: "no-such-capability" }), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 403);
    assert.equal((result.json as { errorCode: string }).errorCode, "unauthorized_capability");
  });
});

// 6. Oversized body rejected before unbounded parsing — proves the
// provider is never reached, and proves rejection happens without
// waiting for the full (oversized) body to be buffered.
test("createGatewayServer: rejects an oversized body as 413 before the provider is ever reached", async () => {
  let providerCalled = false;
  const spyProvider: GatewayProvider = {
    async generate(req) {
      providerCalled = true;
      return new FakeSuccessfulGatewayProvider().generate(req);
    },
  };
  const oversizedBody = validBody({ input: { padding: "x".repeat(MAX_REQUEST_BYTES + 4096) } });
  await withServer(makeDeps({ provider: spyProvider }), async (port) => {
    const result = await request(port, oversizedBody, { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 413);
    assert.equal((result.json as { errorCode: string }).errorCode, "request_too_large");
    assert.equal(providerCalled, false, "the provider must never be reached for an oversized request");
  });
});

// 7. Valid correlation propagated.
test("createGatewayServer: propagates the exact correlationId supplied in the request", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, validBody({ correlationId: "trace-xyz" }), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal((result.json as { correlationId: string }).correlationId, "trace-xyz");
  });
});

// 8. Authentication failure.
test("createGatewayServer: rejects a missing/invalid Authorization header as 401 authentication_failed", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, validBody(), { authorization: "Bearer forged-token" });
    assert.equal(result.status, 401);
    assert.equal((result.json as { errorCode: string }).errorCode, "authentication_failed");
  });
});

// 9. Authorization failure.
test("createGatewayServer: rejects a workload not on the invoker allowlist as 403 authorization_denied", async () => {
  await withServer(makeDeps({ allowlist: new Set(["someone-else"]) }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 403);
    assert.equal((result.json as { errorCode: string }).errorCode, "authorization_denied");
  });
});

// 10. Rate-limit behavior.
test("createGatewayServer: rejects once the rate limiter is exhausted as 429 rate_limit_exceeded", async () => {
  const deps = makeDeps({ rateLimiter: new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 0, windowMs: 60_000 }) });
  await withServer(deps, async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 429);
    assert.equal((result.json as { errorCode: string }).errorCode, "rate_limit_exceeded");
  });
});

// 11. Concurrency behavior.
test("createGatewayServer: rejects once the concurrency guard is exhausted as 429 concurrency_exhausted", async () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  guard.tryAcquire(WORKLOAD_ID);
  await withServer(makeDeps({ concurrencyGuard: guard }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 429);
    assert.equal((result.json as { errorCode: string }).errorCode, "concurrency_exhausted");
  });
});

// 12. Provider success — covered by test 2 already; kept as an explicit,
// separately-labeled case per the required scenario list.
test("createGatewayServer: a successful provider execution returns 200 with the normalized output", async () => {
  await withServer(makeDeps({ provider: new FakeSuccessfulGatewayProvider({ value: 7 }) }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 200);
    assert.deepEqual((result.json as { output: unknown }).output, { value: 7 });
  });
});

// 13 + 14. Provider timeout, INCLUDING the exact regression scenario
// (generate resolves, stream hangs) — the critical case per Increment
// 017 §12. Uses the injected providerTimeoutMs test-only override so
// this suite doesn't wait 30 real seconds; production remains 30_000.
test("createGatewayServer: a provider whose generate() resolves but whose stream hangs forever returns 504 within the timeout, not 30s", async () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  const sink = new InMemoryGatewayAuditSink();
  const deps = makeDeps({
    provider: new FakeStreamHangingGatewayProvider(),
    concurrencyGuard: guard,
    auditSink: sink,
    providerTimeoutMs: 25,
  });
  await withServer(deps, async (port) => {
    const started = Date.now();
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    const elapsedMs = Date.now() - started;

    assert.ok(elapsedMs < 5000, `expected the HTTP request to be bounded by the timeout, took ${elapsedMs}ms`);
    assert.equal(result.status, 504);
    assert.equal((result.json as { errorCode: string }).errorCode, "provider_timeout");

    // The request does not hang, and the concurrency permit is released.
    assert.doesNotThrow(() => guard.tryAcquire(WORKLOAD_ID));

    // Audit behavior remains fail-closed-correct: a failure entry was
    // still durably recorded for the timed-out attempt.
    const [entry] = sink.list();
    assert.ok(entry);
    assert.equal(entry.outcome, "failure");
    assert.equal(entry.errorCategory, "provider_timeout");
  });
});

// 15. Provider transport failure.
test("createGatewayServer: normalizes a provider transport failure as 502", async () => {
  await withServer(makeDeps({ provider: new FakeFailingGatewayProvider() }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 502);
    assert.equal((result.json as { errorCode: string }).errorCode, "provider_transport_error");
  });
});

// 16. Malformed provider response.
test("createGatewayServer: normalizes a malformed provider response as 502", async () => {
  await withServer(makeDeps({ provider: new FakeMalformedGatewayProvider() }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 502);
    assert.equal((result.json as { errorCode: string }).errorCode, "malformed_provider_response");
  });
});

// 17. Audit failure with response withheld.
test("createGatewayServer: withholds a successful provider result as 500 audit_persistence_failed when the audit write fails", async () => {
  await withServer(makeDeps({ auditSink: new AlwaysFailingGatewayAuditSink() }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.status, 500);
    assert.equal((result.json as { errorCode: string }).errorCode, "audit_persistence_failed");
  });
});

// 18 + 19. Credentials and raw provider errors never exposed.
test("createGatewayServer: a fake secret embedded in a provider error never appears anywhere in the HTTP response", async () => {
  const secret = "sk-fake-http-layer-secret-99999";
  const leakyProvider: GatewayProvider = {
    async generate() {
      throw new Error(`upstream rejected credential ${secret}`);
    },
  };
  await withServer(makeDeps({ provider: leakyProvider }), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.body.includes(secret), false);
    assert.equal(result.body.includes("upstream rejected"), false, "raw provider error text must never cross the HTTP boundary");
  });
});

test("createGatewayServer: the workload's own Authorization header value never appears in the HTTP response body", async () => {
  await withServer(makeDeps(), async (port) => {
    const result = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(result.body.includes(WORKLOAD_TOKEN), false);
  });
});

// 20. Caller cannot select provider/model/endpoint.
for (const field of ["provider", "model", "endpoint", "apiKey", "providerUrl"]) {
  test(`createGatewayServer: rejects a caller-supplied "${field}" field as 400 before the provider is reached`, async () => {
    let providerCalled = false;
    const spyProvider: GatewayProvider = {
      async generate(req) {
        providerCalled = true;
        return new FakeSuccessfulGatewayProvider().generate(req);
      },
    };
    await withServer(makeDeps({ provider: spyProvider }), async (port) => {
      const result = await request(port, validBody({ [field]: "attacker-value" }), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
      assert.equal(result.status, 400);
      assert.equal(providerCalled, false);
    });
  });
}

// 21 + 22. No retry, no fallback — a failing provider is called exactly
// once through the real HTTP path.
test("createGatewayServer: calls a failing provider exactly once through the real HTTP path — no retry, no fallback", async () => {
  let callCount = 0;
  const countingProvider: GatewayProvider = {
    async generate() {
      callCount++;
      throw new Error("simulated failure");
    },
  };
  await withServer(makeDeps({ provider: countingProvider }), async (port) => {
    await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
    assert.equal(callCount, 1);
  });
});

// 23. SIGTERM/shutdown behavior.
test("installGracefulShutdown: SIGTERM stops the server and invokes the completion callback exactly once, without terminating the process", async () => {
  const deps = makeDeps();
  const server = createGatewayServer(deps);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as AddressInfo).port;

  let completions = 0;
  installGracefulShutdown(server, () => {
    completions++;
  });

  // A request made before shutdown still succeeds normally.
  const before = await request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` });
  assert.equal(before.status, 200);

  // Emitting SIGTERM in-process invokes registered listeners (this is
  // NOT a real OS signal) — safe to use here specifically because
  // installGracefulShutdown's completion side effect was overridden
  // above, so the real process.exit() production path is never invoked
  // by this test.
  process.emit("SIGTERM");
  await new Promise((resolve) => setTimeout(resolve, 50));

  assert.equal(completions, 1, "shutdown must complete exactly once");

  // The server no longer accepts new connections after close().
  await assert.rejects(() => request(port, validBody(), { authorization: `Bearer ${WORKLOAD_TOKEN}` }));
});

// 24. No raw body/header logging (structural — inspects only the
// relevant function bodies, not the whole file, and explains exactly
// what regression it catches).
test("structural: no console/logging call exists inside the request-handling path (readBoundedRequestBody, handleHttpRequest, createGatewayServer's request callback)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "server.ts"), "utf8");

  // Isolate everything from the first request-handling export up to
  // (but excluding) the guarded bootstrap block at the end of the file
  // — the bootstrap's own two startup-failure stderr messages are
  // legitimate (they never reference req/res/rawBody/headers) and are
  // deliberately excluded from this check so this test cannot produce a
  // false positive against them.
  const sectionStart = source.indexOf("export function readBoundedRequestBody");
  const sectionEnd = source.indexOf("// --- Guarded production bootstrap ---");
  assert.ok(sectionStart >= 0 && sectionEnd > sectionStart, "could not locate the request-handling section to inspect");

  const requestHandlingSource = source.slice(sectionStart, sectionEnd);
  assert.equal(/console\./.test(requestHandlingSource), false, "no console.* call may exist in the request-handling path — this would risk logging raw request/header/body data (Increment 017 §5/§8)");
});

// Direct unit coverage of the bounded-reader against a synthetic stream,
// independent of the full HTTP round trip above — proves the streaming
// cancellation itself, not just its externally-observable HTTP effect.
test("readBoundedRequestBody: rejects and stops reading as soon as the byte cap is crossed, without waiting for the full stream", async () => {
  const { Readable } = await import("node:stream");
  let yielded = 0;
  const oversized = new Readable({
    read() {
      yielded++;
      if (yielded > 1000) {
        this.push(null);
        return;
      }
      this.push(Buffer.alloc(4096, 1));
    },
  }) as unknown as import("node:http").IncomingMessage;

  await assert.rejects(() => readBoundedRequestBody(oversized, 16 * 1024));
  assert.ok(yielded < 1000, "must stop reading well before the synthetic stream's full 1000-chunk length");
});
